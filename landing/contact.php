<?php
/**
 * BussySport – Gestionnaire de formulaire de contact
 * ====================================================
 * Déposez ce fichier à côté de index.html sur votre serveur FTP.
 * Assurez-vous que PHP est activé (PHP 7.4+ recommandé).
 *
 * Pour utiliser SMTP avec authentification :
 * Décommentez la section PHPMailer et remplissez les identifiants SMTP
 * fournis par votre hébergeur.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('X-Content-Type-Options: nosniff');

// Refuser les requêtes non-POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// ── Récupération et nettoyage des champs ──────────────────────────────────────
$name    = trim(htmlspecialchars(strip_tags($_POST['name']    ?? ''), ENT_QUOTES, 'UTF-8'));
$email   = trim(filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL));
$subject = trim(htmlspecialchars(strip_tags($_POST['subject'] ?? ''), ENT_QUOTES, 'UTF-8'));
$message = trim(htmlspecialchars(strip_tags($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8'));

// ── Validation ────────────────────────────────────────────────────────────────
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Tous les champs sont obligatoires.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Adresse email invalide.']);
    exit;
}

if (strlen($message) > 5000) {
    echo json_encode(['success' => false, 'message' => 'Le message est trop long (max 5000 caractères).']);
    exit;
}

// ── Destinataire ──────────────────────────────────────────────────────────────
$to         = 'info@bussysport.ch';
$mailSubject = '[BussySport] ' . $subject . ' — ' . $name;

// ── Corps HTML de l'email ────────────────────────────────────────────────────
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
                  <span style="font-size:15px;color:#1A202C;font-weight:600;">' . $name . '</span>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                  <span style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#999;">Email</span><br/>
                  <a href="mailto:' . $email . '" style="font-size:15px;color:#1565C0;">' . $email . '</a>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                  <span style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#999;">Sujet</span><br/>
                  <span style="font-size:15px;color:#1A202C;">' . $subject . '</span>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 0;">
                  <span style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#999;">Message</span><br/>
                  <p style="font-size:15px;color:#4A5568;line-height:1.7;margin:8px 0 0;">' . nl2br($message) . '</p>
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

// ── En-têtes de l'email ───────────────────────────────────────────────────────
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
$headers .= 'From: BussySport <noreply@bussysport.ch>' . "\r\n";
$headers .= 'Reply-To: ' . $name . ' <' . $email . '>' . "\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion() . "\r\n";

// ── Envoi ─────────────────────────────────────────────────────────────────────
//
// Option 1 : mail() native (utilise le SMTP configuré sur votre hébergement)
//            Fonctionne sur la majorité des hébergements mutualisés.
//
$sent = mail($to, $mailSubject, $htmlBody, $headers);

//
// Option 2 : PHPMailer (recommandé pour SMTP authentifié)
//            Téléchargez PHPMailer et décommentez le bloc ci-dessous :
//
// use PHPMailer\PHPMailer\PHPMailer;
// require 'phpmailer/src/PHPMailer.php';
// require 'phpmailer/src/SMTP.php';
// require 'phpmailer/src/Exception.php';
//
// $mailer = new PHPMailer(true);
// try {
//     $mailer->isSMTP();
//     $mailer->Host       = 'smtp.votrehebergeur.ch';  // SMTP de votre hébergeur
//     $mailer->SMTPAuth   = true;
//     $mailer->Username   = 'info@bussysport.ch';      // Votre identifiant SMTP
//     $mailer->Password   = 'VOTRE_MOT_DE_PASSE';      // Votre mot de passe SMTP
//     $mailer->SMTPSecure = 'tls';
//     $mailer->Port       = 587;
//     $mailer->CharSet    = 'UTF-8';
//     $mailer->setFrom('info@bussysport.ch', 'BussySport');
//     $mailer->addAddress('info@bussysport.ch', 'BussySport');
//     $mailer->addReplyTo($email, $name);
//     $mailer->isHTML(true);
//     $mailer->Subject = $mailSubject;
//     $mailer->Body    = $htmlBody;
//     $sent = $mailer->send();
// } catch (Exception $e) {
//     $sent = false;
// }
//

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais !'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Une erreur est survenue lors de l\'envoi. Veuillez nous contacter directement à info@bussysport.ch'
    ]);
}
