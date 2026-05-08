# BussySport – Landing Page

## Informations du Projet
- **Nom** : BussySport
- **Type** : Landing page statique (HTML/CSS/Tailwind CDN)
- **Localisation** : Bussigny-près-Lausanne, 1030 Vaud, Suisse
- **Email** : info@bussysport.ch
- **Déploiement cible** : FTP server
- **URL preview** : https://6a4e283b-ddd7-4957-9d2e-6fde25cfced5.preview.emergentagent.com

## Architecture
- **Frontend** : HTML5 pur + Tailwind CSS CDN + Font Awesome 6.6 + Google Fonts (Montserrat/Inter)
- **Serveur test** : Node.js HTTP server (port 3000) — `/app/frontend/server.js`
- **Backend** : FastAPI minimal (port 8001) — santé uniquement
- **Contact form** : PHP SMTP handler — `/app/landing/contact.php`

## Fichiers Livrables (pour déploiement FTP)
| Fichier | Description |
|---|---|
| `/app/landing/index.html` | Page principale complète |
| `/app/landing/contact.php` | Handler email SMTP PHP |
| `/app/landing/robots.txt` | Fichier robots SEO |
| `/app/landing/sitemap.xml` | Sitemap XML SEO |

## Sections du Site
1. **Navbar** - Sticky transparente → dark navy au scroll, logo flottant, responsive mobile (hamburger)
2. **Hero** - Plein écran, image runners, badge localisation pulsant, H1, 2 CTA, scroll indicator
3. **À Propos** - Description association + 3 piliers + row de stats (membres, activités, CP, bénévolat)
4. **Activités** - 4 cartes image (Running, Cross-training, Street Workout, Tournois) + coming soon banner
5. **CTA Band** - Section navy appel à l'action
6. **Contact** - Formulaire AJAX (4 champs + dropdown sujet) + infos + réseaux sociaux
7. **Footer** - Logo, navigation, activités, réseaux sociaux, copyright suisse (+)

## SEO / GEO Standards 2026
- Meta: title, description, keywords, robots, author, language, theme-color
- GEO: geo.region (CH-VD), geo.placename, geo.position, ICBM (46.5522, 6.5558)
- Open Graph: type, url, title, description, image, locale, site_name
- Twitter Card: summary_large_image
- JSON-LD: SportsClub + Organization + WebSite + OfferCatalog
- hreflang: fr, fr-ch, x-default
- Canonical URL, sitemap.xml reference, robots.txt
- Structured data avec adresse postale, coordonnées géographiques, areaServed

## Animations Implémentées
- Fade-in-down/up sur hero (chargement initial)
- Float continu sur le logo navbar
- Blink sur le badge de localisation hero
- Scroll reveal via Intersection Observer (tous les éléments majeurs)
- Hover lift + zoom image sur les cartes activités
- Hover lift sur les feature cards
- Pulse CTA button (animation shadow)
- Navbar transition transparente → navy au scroll
- Arrow animated sur les liens "Rejoindre"

## Réseaux Sociaux (liens à corriger par le client)
- Instagram : https://www.instagram.com/bussysport (À CORRIGER)
- Facebook : https://www.facebook.com/bussysport (À CORRIGER)

## Tests (21 mars 2025)
- **15/15 tests passés (100%)**
- Navbar, Hero, About, 4 Activity cards, Banner, Contact form
- Mobile hamburger, Smooth scroll, Form validation, SEO meta
- Note: contact.php MOCKÉ en environnement Node.js (fonctionnel en production FTP/PHP)

## Backlog Prioritaire
### P0 - Immédiat
- [ ] Corriger les liens réseaux sociaux réels (Instagram/Facebook)
- [ ] Remplacer la référence CDN du logo par `images/logo.jpg` + déposer le logo dans `/images/`
- [ ] Tester l'envoi email sur le serveur FTP de production

### P1 - Prochaine itération
- [ ] Ajouter Google Maps embed section localisation
- [ ] Section événements / calendrier des activités
- [ ] Intégration PHPMailer SMTP avec identifiants hébergeur

### P2 - Futur
- [ ] Versions DE/EN (i18n)
- [ ] Newsletter signup
- [ ] Galerie photos des événements
- [ ] Blog / actualités
