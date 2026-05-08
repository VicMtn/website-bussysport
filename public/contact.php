<?php
ob_start();

/**
 * BussySport – Gestionnaire de formulaire de contact
 * ====================================================
 * Déposez ce fichier à côté de index.html sur votre serveur FTP.
 * PHP 7.4+ recommandé.
 *
 * Pour passer en SMTP authentifié (recommandé en production) :
 * voir le bloc PHPMailer en bas de ce fichier.
 */

// ── Limites ──────────────────────────────────────────────────────────────────
const BS_MAX_NAME_LEN     = 120;
const BS_MAX_EMAIL_LEN    = 200;
const BS_MAX_SUBJECT_LEN  = 80;
const BS_MAX_MESSAGE_LEN  = 5000;
const BS_RATE_LIMIT_MAX   = 5;       // requêtes par fenêtre
const BS_RATE_LIMIT_WIN   = 600;     // 10 minutes (en secondes)

// Faire confiance aux en-têtes de proxy pour identifier l'IP cliente.
// - false (défaut) : utilise REMOTE_ADDR. Sécurisé en accès direct.
// - true           : préfère CF-Connecting-IP, X-Real-IP puis le premier
//   segment de X-Forwarded-For. À n'activer QUE si le site est servi
//   derrière un reverse-proxy / CDN de confiance (Cloudflare, etc.) ;
//   sinon un client peut spoofer son IP en envoyant ces en-têtes.
const BS_TRUST_PROXY      = false;

// Sujets autorisés (doivent matcher la liste dans le formulaire Vue).
const BS_ALLOWED_SUBJECTS = [
    'adhesion'      => "Adhésion à l'association",
    'running'       => 'Courses à pied',
    'crosstraining' => 'Cross-Training',
    'streetworkout' => 'Street Workout',
    'tournoi'       => 'Tournois de jeux',
    'partenariat'   => 'Partenariat / Sponsor',
    'autre'         => 'Autre demande',
];

/**
 * @param array<string, mixed> $payload
 */
function bs_contact_json(array $payload, int $status = 200): void
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

/**
 * Strip CR/LF and NUL — anything that could split or inject extra mail headers.
 */
function bs_strip_header_chars(string $value): string
{
    return preg_replace('/[\r\n\0]+/', ' ', $value) ?? '';
}

/**
 * Resolve the client IP. CF-Connecting-IP is the only header Cloudflare
 * lets pass through to the origin (and overwrites if a client tries to
 * spoof it), so it's safe to read when present. Generic proxy headers
 * (X-Real-IP, X-Forwarded-For) are only consulted if BS_TRUST_PROXY is
 * explicitly enabled — otherwise a direct client could spoof them.
 */
function bs_client_ip(): string
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
 * File-based rate limiter. Keeps a JSON file under sys_get_temp_dir() with one
 * entry per IP — simple, no DB, safe on shared hosting.
 *
 * Returns ['allowed' => bool, 'retry_after' => int]:
 *   - allowed     : false when the IP exceeded the limit in the rolling window
 *   - retry_after : seconds until the bucket resets (>=1 when blocked)
 */
function bs_rate_limit_check(string $ip): array
{
    if ($ip === '') {
        // No IP → can't track. Fail open so a misconfigured proxy doesn't
        // lock the form for everyone.
        return ['allowed' => true, 'retry_after' => 0];
    }
    $path = sys_get_temp_dir() . '/bussysport-rate.json';
    $now  = time();
    $data = [];

    $fh = @fopen($path, 'c+');
    if ($fh === false) {
        return ['allowed' => true, 'retry_after' => 0]; // I/O issue → fail open
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

    // Drop entries outside the rolling window.
    foreach ($data as $key => $bucket) {
        if (!is_array($bucket) || ($bucket['ts'] ?? 0) < $now - BS_RATE_LIMIT_WIN) {
            unset($data[$key]);
        }
    }

    $bucket = $data[$ip] ?? ['count' => 0, 'ts' => $now];
    if ($bucket['ts'] < $now - BS_RATE_LIMIT_WIN) {
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

    if ($bucket['count'] <= BS_RATE_LIMIT_MAX) {
        return ['allowed' => true, 'retry_after' => 0];
    }
    $retryAfter = max(1, ($bucket['ts'] + BS_RATE_LIMIT_WIN) - $now);
    return ['allowed' => false, 'retry_after' => $retryAfter];
}

// ── Refuser les requêtes non-POST ────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    bs_contact_json(['success' => false, 'message' => 'Méthode non autorisée.'], 405);
}

// ── Rejeter les POST cross-origin ────────────────────────────────────────────
$host   = $_SERVER['HTTP_HOST']   ?? '';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && $host !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    if (!empty($originHost)) {
        $norm = static function ($h) {
            return strtolower(preg_replace('/^www\./i', '', $h));
        };
        if ($norm($originHost) !== $norm($host)) {
            bs_contact_json(['success' => false, 'message' => 'Requête non autorisée.'], 403);
        }
    }
}

// ── Rate limit ───────────────────────────────────────────────────────────────
$clientIp  = bs_client_ip();
$rateCheck = bs_rate_limit_check($clientIp);
if (!$rateCheck['allowed']) {
    // Standard HTTP signal so well-behaved clients (and the browser-side
    // throttle in useSubmissionThrottle.js) can back off correctly.
    header('Retry-After: ' . $rateCheck['retry_after']);
    bs_contact_json([
        'success'     => false,
        'message'     => 'Trop de tentatives. Merci de réessayer dans quelques minutes.',
        'retry_after' => $rateCheck['retry_after'],
    ], 429);
}

// ── Récupération et nettoyage des champs ─────────────────────────────────────
$name    = trim((string) ($_POST['name']    ?? ''));
$email   = trim((string) ($_POST['email']   ?? ''));
$subject = trim((string) ($_POST['subject'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$website = trim((string) ($_POST['website'] ?? ''));

// ── Validation ───────────────────────────────────────────────────────────────
if ($name === '' || $email === '' || $subject === '' || $message === '') {
    bs_contact_json(['success' => false, 'message' => 'Tous les champs sont obligatoires.'], 400);
}

// Honeypot anti-spam — silently fake success.
if ($website !== '') {
    bs_contact_json(['success' => true, 'message' => 'Votre message a bien été envoyé.']);
}

if (mb_strlen($name) > BS_MAX_NAME_LEN) {
    bs_contact_json(['success' => false, 'message' => 'Le nom est trop long.'], 400);
}
if (mb_strlen($email) > BS_MAX_EMAIL_LEN || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    bs_contact_json(['success' => false, 'message' => 'Adresse email invalide.'], 400);
}
if (!array_key_exists($subject, BS_ALLOWED_SUBJECTS)) {
    bs_contact_json(['success' => false, 'message' => 'Sujet invalide.'], 400);
}
if (mb_strlen($message) > BS_MAX_MESSAGE_LEN) {
    bs_contact_json(['success' => false, 'message' => 'Le message est trop long (max 5000 caractères).'], 400);
}

// ── Préparation des champs ───────────────────────────────────────────────────
$subjectLabel = BS_ALLOWED_SUBJECTS[$subject];
// Header-bound fields must never contain CR/LF or NUL — header injection guard.
$nameForHeader  = bs_strip_header_chars($name);
$emailForHeader = bs_strip_header_chars($email);

// ── Destinataire et sujet ────────────────────────────────────────────────────
$to          = 'info@bussysport.ch';
$mailSubject = '[BussySport] ' . $subjectLabel . ' — ' . $nameForHeader;
$mailSubject = bs_strip_header_chars($mailSubject);

// ── Corps HTML — escape only at render time ──────────────────────────────────
$esc = static function (string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
};

$htmlBody = '<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>BussySport – Nouveau message</title></head>
<body style="font-family:Arial,sans-serif;margin:0;padding:0;background:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:600px;">
        <tr>
          <td style="background:linear-gradient(135deg,#0D2137,#1565C0);padding:30px 40px;text-align:center;">
            <h1 style="color:#fff;font-size:22px;margin:0;font-family:Arial,sans-serif;">BussySport</h1>
            <p style="color:rgba(255,255,255,.7);font-size:13px;margin:6px 0 0;">Bussigny · 1030 Vaud · Suisse</p>
          </td>
        </tr>
        <tr>
          <td style="padding:35px 40px;">
            <h2 style="color:#1565C0;font-size:18px;margin:0 0 24px;">Nouveau message de contact</h2>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                  <span style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#999;">De</span><br/>
                  <span style="font-size:15px;color:#1A202C;font-weight:600;">' . $esc($name) . '</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                  <span style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#999;">Email</span><br/>
                  <a href="mailto:' . $esc($email) . '" style="font-size:15px;color:#1565C0;">' . $esc($email) . '</a>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                  <span style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#999;">Sujet</span><br/>
                  <span style="font-size:15px;color:#1A202C;">' . $esc($subjectLabel) . '</span>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 0;">
                  <span style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#999;">Message</span><br/>
                  <p style="font-size:15px;color:#4A5568;line-height:1.7;margin:8px 0 0;">' . nl2br($esc($message)) . '</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#f8f8f8;padding:16px 40px;text-align:center;border-top:1px solid #eee;">
            <p style="font-size:11px;color:#999;margin:0;">Message envoyé depuis bussysport.ch</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>';

// ── En-têtes de l'email ──────────────────────────────────────────────────────
// CR/LF stripped above so user input can't inject extra headers (BCC, etc.).
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
$headers .= 'From: BussySport <info@bussysport.ch>' . "\r\n";
$headers .= 'Reply-To: ' . $nameForHeader . ' <' . $emailForHeader . '>' . "\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion() . "\r\n";

// ── Envoi ────────────────────────────────────────────────────────────────────
//
// Option 1 : mail() native (utilise le SMTP configuré sur votre hébergement)
//            Fonctionne sur la majorité des hébergements mutualisés.
//            Délivrabilité variable — pensez à SPF/DKIM côté DNS.
//
$sent = mail($to, $mailSubject, $htmlBody, $headers);

//
// Option 2 : PHPMailer + SMTP authentifié (RECOMMANDÉ en production)
//            Téléchargez PHPMailer (un seul vendor/) et configurez les
//            identifiants d'un service transactionnel (Brevo, Resend,
//            Mailtrap, ou le SMTP de votre hébergeur). Décommentez :
//
// use PHPMailer\PHPMailer\PHPMailer;
// require __DIR__ . '/phpmailer/src/PHPMailer.php';
// require __DIR__ . '/phpmailer/src/SMTP.php';
// require __DIR__ . '/phpmailer/src/Exception.php';
//
// $mailer = new PHPMailer(true);
// try {
//     $mailer->isSMTP();
//     $mailer->Host       = 'smtp-relay.brevo.com';
//     $mailer->SMTPAuth   = true;
//     $mailer->Username   = 'votre-identifiant-smtp';
//     $mailer->Password   = 'votre-cle-api-smtp';
//     $mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
//     $mailer->Port       = 587;
//     $mailer->CharSet    = 'UTF-8';
//     $mailer->setFrom('info@bussysport.ch', 'BussySport');
//     $mailer->addAddress('info@bussysport.ch', 'BussySport');
//     $mailer->addReplyTo($email, $nameForHeader);
//     $mailer->isHTML(true);
//     $mailer->Subject = $mailSubject;
//     $mailer->Body    = $htmlBody;
//     $sent = $mailer->send();
// } catch (Exception $e) {
//     $sent = false;
// }

if ($sent) {
    bs_contact_json([
        'success' => true,
        'message' => 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais !',
    ]);
}

bs_contact_json([
    'success' => false,
    'message' => "Une erreur est survenue lors de l'envoi. Veuillez nous contacter directement à info@bussysport.ch",
], 500);
