<?php
ob_start();

/**
 * BussySport – Gestionnaire du formulaire d'adhésion
 * ====================================================
 * Déposez ce fichier à côté de index.html sur votre serveur FTP.
 * PHP 7.4+ recommandé. Gère l'upload de l'autorisation parentale (16–17 ans).
 */

const BS_ADH_MAX_NAME_LEN      = 80;
const BS_ADH_MAX_ADDR_LEN      = 200;
const BS_ADH_MAX_CITY_LEN      = 100;
const BS_ADH_MAX_ZIP_LEN       = 10;
const BS_ADH_MAX_PHONE_LEN     = 30;
const BS_ADH_MAX_EMAIL_LEN     = 200;
const BS_ADH_MAX_AVS_LEN       = 20;
const BS_ADH_MAX_INSURANCE_LEN = 120;
const BS_ADH_MAX_REMARKS_LEN   = 2000;
const BS_ADH_MAX_FILE_SIZE     = 5_242_880; // 5 Mo
const BS_ADH_MIN_AGE           = 16;
const BS_ADH_RATE_LIMIT_MAX    = 1;
const BS_ADH_RATE_LIMIT_WIN     = 10;
const BS_TRUST_PROXY           = false;

// Cloudflare Turnstile — clé secrète (vérification côté serveur).
// Le secret NE doit PAS être committé : il est chargé depuis adhesion-config.php
// (hors dépôt git — cf. adhesion-config.sample.php), ou à défaut depuis la
// variable d'environnement BS_TURNSTILE_SECRET. Vide = vérification désactivée
// (fail-open : le formulaire marche mais sans captcha serveur, déconseillé en prod).
// Doit correspondre à BUSSYSPORT_TURNSTILE_SITE_KEY dans contact-config.js.
$bsAdhConfig = is_file(__DIR__ . '/adhesion-config.php')
    ? (array) (require __DIR__ . '/adhesion-config.php')
    : [];
$bsTurnstileSecret = (string) ($bsAdhConfig['turnstile_secret'] ?? '');
if ($bsTurnstileSecret === '') {
    $envSecret = getenv('BS_TURNSTILE_SECRET');
    if ($envSecret !== false) {
        $bsTurnstileSecret = (string) $envSecret;
    }
}
define('BS_TURNSTILE_SECRET_KEY', trim($bsTurnstileSecret));
unset($bsAdhConfig, $bsTurnstileSecret, $envSecret);

const BS_ADH_ALLOWED_ACTIVITIES = [
    'courses-a-pied',
    'cross-training',
    'street-workout',
    'tournois',
];

const BS_ADH_ACTIVITY_LABELS = [
    'courses-a-pied' => 'Courses à pied',
    'cross-training' => 'Cross-Training',
    'street-workout' => 'Street Workout',
    'tournois'       => 'Tournois de jeux',
];

const BS_ADH_GENDER_LABELS = [
    'femme' => 'Femme',
    'homme' => 'Homme',
    'autre' => 'Autre / Ne souhaite pas préciser',
];

// Doit rester aligné avec EMERGENCY_RELATIONS dans src/composables/useAdhesionForm.js.
const BS_ADH_EMERGENCY_RELATION_LABELS = [
    'parent'      => 'Parent',
    'frere-soeur' => 'Frère / Sœur',
    'conjoint'    => 'Conjoint·e / Partenaire',
    'autre'       => 'Autre',
];

const BS_ADH_ALLOWED_MIMES = [
    'application/pdf' => 'pdf',
    'image/jpeg'      => 'jpg',
    'image/png'       => 'png',
];

/**
 * @param array<string, mixed> $payload
 */
function bs_adh_json(array $payload, int $status = 200): void
{
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store, max-age=0');
    echo json_encode($payload);
    exit;
}

function bs_adh_strip_header_chars(string $value): string
{
    return preg_replace('/[\r\n\0]+/', ' ', $value) ?? '';
}

function bs_adh_client_ip(): string
{
    $cfIp = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '';
    if ($cfIp !== '' && filter_var($cfIp, FILTER_VALIDATE_IP) !== false) {
        return $cfIp;
    }

    if (BS_TRUST_PROXY) {
        $realIp = $_SERVER['HTTP_X_REAL_IP'] ?? '';
        if ($realIp !== '' && filter_var($realIp, FILTER_VALIDATE_IP) !== false) {
            return $realIp;
        }
        $xff = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
        if ($xff !== '') {
            $first = trim(explode(',', $xff)[0] ?? '');
            if ($first !== '' && filter_var($first, FILTER_VALIDATE_IP) !== false) {
                return $first;
            }
        }
    }

    return $_SERVER['REMOTE_ADDR'] ?? '';
}

/**
 * @return array{allowed: bool, retry_after: int}
 */
function bs_adh_rate_limit_check(string $ip): array
{
    if ($ip === '') {
        return ['allowed' => true, 'retry_after' => 0];
    }
    $path = sys_get_temp_dir() . '/bussysport-adhesion-rate.json';
    $now  = time();
    $data = [];

    $fh = @fopen($path, 'c+');
    if ($fh === false) {
        return ['allowed' => true, 'retry_after' => 0];
    }
    if (!flock($fh, LOCK_EX)) {
        fclose($fh);
        return ['allowed' => true, 'retry_after' => 0];
    }

    $raw = stream_get_contents($fh);
    if ($raw !== false && $raw !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $data = $decoded;
        }
    }

    foreach ($data as $key => $bucket) {
        if (!is_array($bucket) || ($bucket['ts'] ?? 0) < $now - BS_ADH_RATE_LIMIT_WIN) {
            unset($data[$key]);
        }
    }

    $bucket = $data[$ip] ?? ['count' => 0, 'ts' => $now];
    if ($bucket['ts'] < $now - BS_ADH_RATE_LIMIT_WIN) {
        $bucket = ['count' => 0, 'ts' => $now];
    }
    $bucket['count']++;
    $data[$ip] = $bucket;

    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($data));
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);

    if ($bucket['count'] <= BS_ADH_RATE_LIMIT_MAX) {
        return ['allowed' => true, 'retry_after' => 0];
    }
    $retryAfter = max(1, ($bucket['ts'] + BS_ADH_RATE_LIMIT_WIN) - $now);
    return ['allowed' => false, 'retry_after' => $retryAfter];
}

function bs_adh_age_from_birthdate(string $birthdate): ?int
{
    // « ! » force l'heure à 00:00:00 : sans lui, createFromFormat utilise
    // l'heure courante et le calcul d'âge serait décalé d'un an le jour
    // anniversaire (un·e adhérent·e fêtant ses 16 ans serait compté·e à 15).
    $dt = DateTime::createFromFormat('!Y-m-d', $birthdate);
    if ($dt === false) {
        return null;
    }
    $errors = DateTime::getLastErrors();
    if ($errors !== false && ($errors['warning_count'] > 0 || $errors['error_count'] > 0)) {
        return null;
    }
    $today = new DateTime('today');
    if ($dt > $today) {
        return null;
    }
    return (int) $dt->diff($today)->y;
}

function bs_adh_requires_parent_auth(int $age): bool
{
    return $age >= 16 && $age < 18;
}

/**
 * Message visiteur pour un échec Turnstile (sans détail technique).
 *
 * @param list<string> $errorCodes
 */
function bs_adh_turnstile_user_message(array $errorCodes): string
{
    $expired = ['timeout-or-duplicate', 'invalid-input-response'];
    $required = ['missing-input-response'];
    $unavailable = [
        'missing-input-secret', 'invalid-input-secret', 'bad-request', 'internal-error',
    ];

    foreach ($errorCodes as $code) {
        if (in_array($code, $required, true)) {
            return 'Merci de valider le contrôle de sécurité ci-dessous.';
        }
    }
    foreach ($errorCodes as $code) {
        if (in_array($code, $expired, true)) {
            return 'Le contrôle de sécurité a expiré. Validez-le à nouveau, puis renvoyez votre demande.';
        }
    }
    foreach ($errorCodes as $code) {
        if (in_array($code, $unavailable, true)) {
            return 'Le contrôle de sécurité est momentanément indisponible. Rechargez la page et réessayez.';
        }
    }

    return 'Nous n\'avons pas pu vérifier le contrôle de sécurité. Réessayez dans un instant.';
}

/**
 * @param list<string> $errorCodes
 */
function bs_adh_log_turnstile_failure(array $errorCodes): void
{
    if ($errorCodes === []) {
        return;
    }
    error_log('BussySport Turnstile — codes : ' . implode(', ', $errorCodes));
}

/**
 * POST application/x-www-form-urlencoded vers $url, avec le corps de réponse en
 * retour (ou false en cas d'échec). Utilise cURL s'il est disponible — le cas le
 * plus courant en hébergement mutualisé — sinon file_get_contents (qui nécessite
 * allow_url_fopen). Couvre ainsi les deux configurations PHP classiques.
 *
 * @param array<string, string> $fields
 * @return string|false
 */
function bs_adh_http_post(string $url, array $fields, int $timeout = 10)
{
    $payload = http_build_query($fields);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        if ($ch !== false) {
            curl_setopt_array($ch, [
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $payload,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => $timeout,
                CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
            ]);
            $raw = curl_exec($ch);
            curl_close($ch);
            return $raw === false ? false : (string) $raw;
        }
    }

    $ctx = stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $payload,
            'timeout' => $timeout,
        ],
    ]);

    return @file_get_contents($url, false, $ctx);
}

/**
 * @return array{success: bool, message: string, error-codes: list<string>}
 */
function bs_adh_verify_turnstile(string $token, string $ip): array
{
    if (BS_TURNSTILE_SECRET_KEY === '') {
        return ['success' => true, 'message' => '', 'error-codes' => []];
    }

    if ($token === '') {
        $codes = ['missing-input-response'];
        return [
            'success'     => false,
            'message'     => bs_adh_turnstile_user_message($codes),
            'error-codes' => $codes,
        ];
    }

    if (mb_strlen($token) > 2048) {
        $codes = ['invalid-input-response'];
        return [
            'success'     => false,
            'message'     => bs_adh_turnstile_user_message($codes),
            'error-codes' => $codes,
        ];
    }

    $raw = bs_adh_http_post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        [
            'secret'   => BS_TURNSTILE_SECRET_KEY,
            'response' => $token,
            'remoteip' => $ip,
        ]
    );

    if ($raw === false) {
        $codes = ['internal-error'];
        return [
            'success'     => false,
            'message'     => bs_adh_turnstile_user_message($codes),
            'error-codes' => $codes,
        ];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        $codes = ['bad-request'];
        return [
            'success'     => false,
            'message'     => bs_adh_turnstile_user_message($codes),
            'error-codes' => $codes,
        ];
    }

    if (!empty($data['success'])) {
        return ['success' => true, 'message' => '', 'error-codes' => []];
    }

    $codes = $data['error-codes'] ?? ['internal-error'];
    if (!is_array($codes)) {
        $codes = ['internal-error'];
    }

    return [
        'success'     => false,
        'message'     => bs_adh_turnstile_user_message($codes),
        'error-codes' => $codes,
    ];
}

function bs_adh_row(string $label, string $value, callable $esc): string
{
    if ($value === '') {
        return '';
    }
    return '<tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
          <span style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#999;">'
        . $esc($label) . '</span><br/>
          <span style="font-size:15px;color:#1A202C;">' . $esc($value) . '</span>
        </td>
      </tr>';
}

// ── Méthode ──────────────────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    bs_adh_json(['success' => false, 'message' => 'Méthode non autorisée.'], 405);
}

// ── Origin ───────────────────────────────────────────────────────────────────
$host   = $_SERVER['HTTP_HOST']   ?? '';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && $host !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    // HTTP_HOST peut porter un port que parse_url() retire déjà de l'Origin :
    // on compare hôte à hôte, sans port, des deux côtés.
    $hostOnly = parse_url('http://' . $host, PHP_URL_HOST) ?: $host;
    if (!empty($originHost)) {
        $norm = static function ($h) {
            return strtolower(preg_replace('/^www\./i', '', $h));
        };
        if ($norm($originHost) !== $norm($hostOnly)) {
            bs_adh_json(['success' => false, 'message' => 'Envoi impossible. Réessayez dans un instant.'], 403);
        }
    }
}

// ── Rate limit ───────────────────────────────────────────────────────────────
$clientIp  = bs_adh_client_ip();
$rateCheck = bs_adh_rate_limit_check($clientIp);
if (!$rateCheck['allowed']) {
    header('Retry-After: ' . $rateCheck['retry_after']);
    bs_adh_json([
        'success'     => false,
        'message'     => 'Trop de tentatives. Merci de réessayer dans quelques minutes.',
        'retry_after' => $rateCheck['retry_after'],
    ], 429);
}

// ── Captcha Turnstile ────────────────────────────────────────────────────────
$turnstileToken = trim((string) ($_POST['cf-turnstile-response'] ?? ''));
if (BS_TURNSTILE_SECRET_KEY !== '') {
    $turnstileCheck = bs_adh_verify_turnstile($turnstileToken, $clientIp);
    if (!$turnstileCheck['success']) {
        bs_adh_log_turnstile_failure($turnstileCheck['error-codes']);
        bs_adh_json([
            'success' => false,
            'message' => $turnstileCheck['message'],
        ], 400);
    }
}

// ── Champs ───────────────────────────────────────────────────────────────────
$firstName      = trim((string) ($_POST['firstName']      ?? ''));
$lastName       = trim((string) ($_POST['lastName']       ?? ''));
$birthdate      = trim((string) ($_POST['birthdate']      ?? ''));
$gender         = trim((string) ($_POST['gender']         ?? ''));
$nationality    = trim((string) ($_POST['nationality']    ?? ''));
$address        = trim((string) ($_POST['address']        ?? ''));
$zip            = trim((string) ($_POST['zip']            ?? ''));
$city           = trim((string) ($_POST['city']           ?? ''));
$phone          = trim((string) ($_POST['phone']          ?? ''));
$email          = trim((string) ($_POST['email']          ?? ''));
$avs            = trim((string) ($_POST['avs']            ?? ''));
$hasInsurance   = trim((string) ($_POST['hasInsurance']   ?? ''));
$insuranceName  = trim((string) ($_POST['insuranceName']  ?? ''));
$activitiesRaw  = trim((string) ($_POST['activities']     ?? ''));
$emergencyRelation = trim((string) ($_POST['emergencyRelation'] ?? ''));
$emergencyName     = trim((string) ($_POST['emergencyName']     ?? ''));
$emergencyPhone    = trim((string) ($_POST['emergencyPhone']    ?? ''));
$remarks        = trim((string) ($_POST['remarks']        ?? ''));
$acceptTerms    = trim((string) ($_POST['acceptTerms']    ?? ''));
$website        = trim((string) ($_POST['website']        ?? ''));

// Honeypot
if ($website !== '') {
    bs_adh_json([
        'success' => true,
        'message' => 'Votre demande d\'adhésion a bien été envoyée. Nous vous contacterons prochainement !',
    ]);
}

// ── Validation ───────────────────────────────────────────────────────────────
$required = [
    $firstName, $lastName, $birthdate, $address, $zip, $city,
    $phone, $email, $emergencyRelation, $emergencyName, $emergencyPhone,
];
foreach ($required as $field) {
    if ($field === '') {
        bs_adh_json(['success' => false, 'message' => 'Tous les champs obligatoires doivent être remplis.'], 400);
    }
}

if ($acceptTerms !== '1') {
    bs_adh_json(['success' => false, 'message' => 'Vous devez accepter les conditions d\'adhésion.'], 400);
}

if (mb_strlen($firstName) > BS_ADH_MAX_NAME_LEN || mb_strlen($lastName) > BS_ADH_MAX_NAME_LEN) {
    bs_adh_json(['success' => false, 'message' => 'Le nom ou le prénom est trop long.'], 400);
}
if (mb_strlen($address) > BS_ADH_MAX_ADDR_LEN || mb_strlen($city) > BS_ADH_MAX_CITY_LEN) {
    bs_adh_json(['success' => false, 'message' => 'L\'adresse est trop longue.'], 400);
}
if (mb_strlen($zip) > BS_ADH_MAX_ZIP_LEN) {
    bs_adh_json(['success' => false, 'message' => 'NPA invalide.'], 400);
}
if (mb_strlen($phone) > BS_ADH_MAX_PHONE_LEN || mb_strlen($emergencyPhone) > BS_ADH_MAX_PHONE_LEN) {
    bs_adh_json(['success' => false, 'message' => 'Numéro de téléphone trop long.'], 400);
}
if (mb_strlen($email) > BS_ADH_MAX_EMAIL_LEN || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    bs_adh_json(['success' => false, 'message' => 'Adresse email invalide.'], 400);
}
if ($avs !== '' && mb_strlen($avs) > BS_ADH_MAX_AVS_LEN) {
    bs_adh_json(['success' => false, 'message' => 'Numéro AVS invalide.'], 400);
}
if (!in_array($hasInsurance, ['oui', 'non'], true)) {
    bs_adh_json(['success' => false, 'message' => 'Veuillez indiquer si vous disposez d\'une assurance accident.'], 400);
}
if ($hasInsurance === 'oui' && ($insuranceName === '' || mb_strlen($insuranceName) > BS_ADH_MAX_INSURANCE_LEN)) {
    bs_adh_json(['success' => false, 'message' => 'Veuillez indiquer le nom de votre assureur.'], 400);
}
if (mb_strlen($remarks) > BS_ADH_MAX_REMARKS_LEN) {
    bs_adh_json(['success' => false, 'message' => 'Les remarques sont trop longues.'], 400);
}

if ($gender !== '' && !array_key_exists($gender, BS_ADH_GENDER_LABELS)) {
    bs_adh_json(['success' => false, 'message' => 'Valeur de sexe invalide.'], 400);
}
if (!array_key_exists($emergencyRelation, BS_ADH_EMERGENCY_RELATION_LABELS)) {
    bs_adh_json(['success' => false, 'message' => 'Lien avec le contact d\'urgence invalide.'], 400);
}

$age = bs_adh_age_from_birthdate($birthdate);
if ($age === null) {
    bs_adh_json(['success' => false, 'message' => 'Date de naissance invalide.'], 400);
}
if ($age < BS_ADH_MIN_AGE) {
    bs_adh_json([
        'success' => false,
        'message' => 'L\'adhésion est ouverte à partir de ' . BS_ADH_MIN_AGE . ' ans révolus.',
    ], 400);
}

$activities = json_decode($activitiesRaw, true);
if (!is_array($activities) || count($activities) === 0) {
    bs_adh_json(['success' => false, 'message' => 'Veuillez sélectionner au moins une activité.'], 400);
}
$activityLabels = [];
foreach ($activities as $slug) {
    if (!is_string($slug) || !in_array($slug, BS_ADH_ALLOWED_ACTIVITIES, true)) {
        bs_adh_json(['success' => false, 'message' => 'Activité non reconnue. Veuillez en sélectionner une dans la liste.'], 400);
    }
    $activityLabels[] = BS_ADH_ACTIVITY_LABELS[$slug];
}

$needsParentAuth = bs_adh_requires_parent_auth($age);
$attachment      = null;
$attachmentName  = '';
$attachmentMime  = '';

if ($needsParentAuth) {
    if (
        !isset($_FILES['parentAuth'])
        || !is_array($_FILES['parentAuth'])
        || ($_FILES['parentAuth']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK
    ) {
        bs_adh_json([
            'success' => false,
            'message' => 'L\'autorisation parentale signée est obligatoire pour les adhérent·e·s de 16 à 18 ans non révolus.',
        ], 400);
    }

    $file = $_FILES['parentAuth'];
    // Défense en profondeur : s'assurer que le chemin pointe bien vers un
    // fichier réellement téléversé via HTTP (et non un chemin serveur injecté).
    if (!is_uploaded_file((string) ($file['tmp_name'] ?? ''))) {
        bs_adh_json(['success' => false, 'message' => 'Le document joint n\'a pas pu être traité. Réessayez.'], 400);
    }
    if (($file['size'] ?? 0) > BS_ADH_MAX_FILE_SIZE) {
        bs_adh_json(['success' => false, 'message' => 'Le fichier est trop volumineux (maximum 5 Mo).'], 400);
    }

    $finfo    = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);
    if ($mimeType === false || !array_key_exists($mimeType, BS_ADH_ALLOWED_MIMES)) {
        bs_adh_json(['success' => false, 'message' => 'Format de fichier non accepté (PDF, JPG ou PNG uniquement).'], 400);
    }

    $originalName = basename((string) ($file['name'] ?? 'autorisation'));
    $originalName = preg_replace('/[^\w.\-]+/u', '_', $originalName) ?? 'autorisation';
    $ext          = BS_ADH_ALLOWED_MIMES[$mimeType];
    $attachmentName = 'autorisation-parentale-' . preg_replace('/[^\w\-]+/u', '-', $lastName) . '.' . $ext;
    $attachmentMime = $mimeType;
    $attachment     = (string) file_get_contents($file['tmp_name']);
    if ($attachment === '') {
        bs_adh_json(['success' => false, 'message' => 'Le document joint n\'a pas pu être envoyé. Réessayez avec un autre fichier.'], 400);
    }
}

// ── Email ────────────────────────────────────────────────────────────────────
$fullName       = $firstName . ' ' . $lastName;
$nameForHeader  = bs_adh_strip_header_chars($fullName);
$emailForHeader = bs_adh_strip_header_chars($email);
$to             = 'info@bussysport.ch';
$mailSubject    = '[BussySport] Nouvelle demande d\'adhésion — ' . $nameForHeader;
$mailSubject    = bs_adh_strip_header_chars($mailSubject);

$genderLabel    = $gender !== '' ? BS_ADH_GENDER_LABELS[$gender] : '—';
$insuranceLabel = $hasInsurance === 'oui'
    ? 'Oui — ' . $insuranceName
    : 'Non';
$birthdateFr    = DateTime::createFromFormat('Y-m-d', $birthdate);
$birthdateLabel = $birthdateFr !== false ? $birthdateFr->format('d.m.Y') : $birthdate;

$esc = static function (string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
};

$rows = '';
$rows .= bs_adh_row('Prénom', $firstName, $esc);
$rows .= bs_adh_row('Nom', $lastName, $esc);
$rows .= bs_adh_row('Date de naissance', $birthdateLabel . ' (' . $age . ' ans)', $esc);
$rows .= bs_adh_row('Sexe', $genderLabel, $esc);
$rows .= bs_adh_row('Nationalité', $nationality !== '' ? $nationality : '—', $esc);
$rows .= bs_adh_row('Adresse', $address, $esc);
$rows .= bs_adh_row('NPA / Localité', $zip . ' ' . $city, $esc);
$rows .= bs_adh_row('Téléphone', $phone, $esc);
$rows .= bs_adh_row('Email', $email, $esc);
$rows .= bs_adh_row('N° AVS', $avs !== '' ? $avs : '—', $esc);
$rows .= bs_adh_row('Assurance accident', $insuranceLabel, $esc);
$rows .= bs_adh_row('Activités', implode(', ', $activityLabels), $esc);
$rows .= bs_adh_row(
    'Contact d\'urgence',
    BS_ADH_EMERGENCY_RELATION_LABELS[$emergencyRelation] . ' — ' . $emergencyName,
    $esc
);
$rows .= bs_adh_row('Tél. urgence', $emergencyPhone, $esc);
$rows .= bs_adh_row(
    'Autorisation parentale',
    $needsParentAuth ? 'Requise — jointe à cet email' : 'Non requise',
    $esc
);

$htmlBody = '<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>BussySport – Demande d\'adhésion</title></head>
<body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:600px;">
        <tr>
          <td style="background:linear-gradient(135deg,#0D2137,#1565C0);padding:30px 40px;text-align:center;">
            <h1 style="color:#fff;font-size:22px;margin:0;">BussySport</h1>
            <p style="color:rgba(255,255,255,.7);font-size:13px;margin:6px 0 0;">Nouvelle demande d\'adhésion</p>
          </td>
        </tr>
        <tr>
          <td style="padding:35px 40px;">
            <h2 style="color:#1565C0;font-size:18px;margin:0 0 24px;">' . $esc($fullName) . '</h2>
            <table width="100%" cellpadding="0" cellspacing="0">' . $rows . '</table>';

if ($remarks !== '') {
    $htmlBody .= '
            <div style="padding:16px 0;">
              <span style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#999;">Remarques</span>
              <p style="font-size:15px;color:#4A5568;line-height:1.7;margin:8px 0 0;">' . nl2br($esc($remarks)) . '</p>
            </div>';
}

$htmlBody .= '
          </td>
        </tr>
        <tr>
          <td style="background:#f8f8f8;padding:16px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="font-size:11px;color:#999;margin:0;">Demande envoyée depuis bussysport.ch/adhesion</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>';

$boundary = 'bs_' . md5((string) microtime(true));

$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'From: BussySport <info@bussysport.ch>' . "\r\n";
$headers .= 'Reply-To: ' . $nameForHeader . ' <' . $emailForHeader . '>' . "\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion() . "\r\n";

if ($attachment !== null) {
    $headers .= 'Content-Type: multipart/mixed; boundary="' . $boundary . '"' . "\r\n";

    $mailBody  = '--' . $boundary . "\r\n";
    $mailBody .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
    $mailBody .= 'Content-Transfer-Encoding: 8bit' . "\r\n\r\n";
    $mailBody .= $htmlBody . "\r\n";
    $mailBody .= '--' . $boundary . "\r\n";
    $mailBody .= 'Content-Type: ' . $attachmentMime . '; name="' . $attachmentName . '"' . "\r\n";
    $mailBody .= 'Content-Transfer-Encoding: base64' . "\r\n";
    $mailBody .= 'Content-Disposition: attachment; filename="' . $attachmentName . '"' . "\r\n\r\n";
    $mailBody .= chunk_split(base64_encode($attachment)) . "\r\n";
    $mailBody .= '--' . $boundary . '--';
} else {
    $headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
    $mailBody = $htmlBody;
}

$sent = mail($to, $mailSubject, $mailBody, $headers);

if ($sent) {
    bs_adh_json([
        'success' => true,
        'message' => 'Votre demande d\'adhésion a bien été envoyée. Nous vous contacterons prochainement !',
    ]);
}

bs_adh_json([
    'success' => false,
    'message' => 'Une erreur est survenue lors de l\'envoi. Réessayez dans un instant ou contactez-nous à info@bussysport.ch',
], 500);
