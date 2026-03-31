# BussySport – Landing Page

## Informations du Projet
- **Nom** : BussySport
- **Type** : Landing page statique (HTML/CSS/Tailwind CDN)
- **Localisation** : Bussigny-près-Lausanne, 1030 Vaud, Suisse
- **Email** : info@bussysport.ch
- **Déploiement** : FTP server (fichiers dans /app/landing/)

## Architecture
- **Frontend** : HTML5 pur + Tailwind CSS CDN + Font Awesome + Google Fonts (Montserrat/Inter)
- **Serveur test** : Node.js HTTP server (port 3000)
- **Backend** : FastAPI minimal (port 8001) - santé uniquement
- **Contact form** : PHP SMTP handler (contact.php)

## Fichiers Livrables (pour FTP)
- `/app/landing/index.html` - Page principale
- `/app/landing/contact.php` - Gestionnaire email SMTP
- `/app/landing/robots.txt` - SEO robots
- `/app/landing/sitemap.xml` - SEO sitemap

## Sections du Site
1. **Navbar** - Sticky, transparente → dark au scroll, responsive mobile
2. **Hero** - Plein écran, image runners, badge localisation, CTA
3. **À Propos** - Description association, 3 piliers (Accessibilité, Communauté, Santé), stats
4. **Activités** - 4 cartes (Running, Cross-training, Street Workout, Tournois) + "Plus à venir"
5. **CTA Band** - Section sombre d'appel à l'action
6. **Contact** - Formulaire AJAX + infos contact + réseaux sociaux
7. **Footer** - Navigation, activités, réseaux, copyright suisse

## SEO / GEO (2026)
- Balises meta complètes (description, keywords, robots, author)
- GEO tags (geo.region, geo.placename, geo.position, ICBM)
- Open Graph (Facebook)
- Twitter Card
- JSON-LD Structured Data (SportsClub, Organization, WebSite)
- hreflang fr / fr-ch / x-default
- Canonical URL
- sitemap.xml + robots.txt

## Intégrations
- Tailwind CSS CDN (via cdn.tailwindcss.com)
- Font Awesome 6.6.0 CDN
- Google Fonts CDN (Montserrat + Inter)
- Images : Pexels + Unsplash (hotlinking)
- Contact : PHP mail() avec option PHPMailer SMTP

## Animations
- Fade-in-down/up sur les éléments hero (au chargement)
- Scroll reveal via Intersection Observer
- Float animation sur le logo
- Hover lift sur les cartes activités (avec zoom image)
- Pulse CTA button
- Navbar transition transparente → sombre au scroll

## Réseaux Sociaux (liens à corriger par le client)
- Instagram : https://www.instagram.com/bussysport
- Facebook : https://www.facebook.com/bussysport

## Statut d'Implémentation (21 mars 2025)
- [x] Structure HTML complète
- [x] SEO/GEO optimisé 2026
- [x] JSON-LD Structured Data
- [x] Toutes les sections actives
- [x] Animations et micro-interactions
- [x] Formulaire de contact (AJAX → contact.php)
- [x] PHP SMTP handler
- [x] robots.txt + sitemap.xml
- [x] Design responsive (mobile + desktop)

## Backlog / Prochaines Étapes
- P1: Corriger les liens réseaux sociaux (Instagram/Facebook)
- P1: Remplacer le logo dans index.html par chemin relatif `images/logo.jpg`
- P2: Ajouter une section "Événements" ou calendrier des activités
- P2: Intégrer Google Maps avec localisation Bussigny
- P2: Ajouter version DE/EN pour localisation future
- P3: Newsletter signup
- P3: Galerie photos des événements
