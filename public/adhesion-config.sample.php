<?php

/**
 * Modèle de configuration pour public/adhesion.php.
 * ================================================================
 * 1. Copiez ce fichier en « adhesion-config.php » (gardé hors du dépôt git,
 *    voir .gitignore — le secret ne doit jamais être committé).
 * 2. Renseignez la clé secrète Turnstile (dashboard Cloudflare → Turnstile).
 *    Elle doit correspondre à la clé de SITE dans public/contact-config.js.
 * 3. Déposez « adhesion-config.php » à côté d'adhesion.php sur votre
 *    hébergement FTP.
 *
 * Alternative : définir la variable d'environnement BS_TURNSTILE_SECRET
 * côté hébergeur. Sans secret (fichier absent ou valeur vide), la
 * vérification Turnstile côté serveur est désactivée (fail-open) : le
 * formulaire fonctionne mais n'est plus protégé par le captcha serveur —
 * déconseillé en production.
 */

return [
    'turnstile_secret' => '',
];
