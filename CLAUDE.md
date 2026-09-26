# CLAUDE.md

Site vitrine de l'association sportive **BussySport** (Bussigny-près-Lausanne, VD, Suisse) — https://bussysport.ch. Contenu 100 % en français (`fr-CH`).

## Commandes

```bash
npm run dev            # serveur de dev → http://localhost:3000
npm run build          # vite build + prérendu Puppeteer (scripts/prerender.mjs) → dist/
npm run build:spa      # vite build seul, sans prérendu (debug)
npm run preview        # sert dist/ sur :3000
npm test               # vitest run (happy-dom)
npx vitest run src/composables/__tests__/useContactForm.spec.js   # un seul fichier
npm run test:coverage
```

## Stack

Vue 3 (`<script setup>`, Composition API) · Vite 8 · Vue Router 5 (history mode, lazy routes) · Tailwind CSS v4 via `@tailwindcss/vite` (pas de `tailwind.config`, pas de PostCSS) · `@unhead/vue` pour le SEO. JavaScript pur (pas de TypeScript), pas de librairie UI. Alias `@` → `src/`.

Font Awesome 6.6 et Google Fonts (Montserrat / Inter) sont chargés par CDN dans [index.html](index.html) — les icônes s'utilisent avec des classes `fa-*`.

## Contrainte d'hébergement (critique)

Production = **Infomaniak, hébergement statique via FTP** :
- **PHP ne s'exécute pas** et **`.htaccess` est ignoré**. [public/contact.php](public/contact.php) et [public/.htaccess](public/.htaccess) sont des vestiges : ne pas s'appuyer dessus, ne pas proposer de backend PHP/serveur.
- Tout traitement doit être **côté client** ou via un service tiers (Web3Forms, Forminit).
- Pas de fallback SPA (une URL inconnue renvoie une vraie 404) → chaque route est **prérendue** en `dist/<route>/index.html` par [scripts/prerender.mjs](scripts/prerender.mjs). Les URLs canoniques et le sitemap utilisent la forme **avec slash final** (`/adhesion/`). La 301 `/adhesion` → `/adhesion/` vient du `DirectorySlash` natif d'Apache.
- `contact.php` est servi **en texte brut** en production : n'y mettre aucun secret.
- Les anciennes URLs `*.html` sont gérées par des fichiers de redirection générés au build (`LEGACY_REDIRECTS` dans `prerender.mjs`). Les `redirect` du router ne servent qu'en dev et en navigation SPA.
- Déploiement : `npm run build` puis upload de tout `dist/` (dossiers de routes inclus).

## Architecture

- [src/main.js](src/main.js) — app + head + router + directive globale `v-reveal`.
- [src/App.vue](src/App.vue) — navbar / `<RouterView>` / footer + métas SEO globales (`titleTemplate` « … – BussySport », géo, OG).
- [src/router/index.js](src/router/index.js) — routes + redirections des anciennes URLs `*.html`.
- [src/data/activities.js](src/data/activities.js) — **source unique** des 4 activités (slug, labels, icône, textes, images). Utilisée par la home, les pages activité, la nav/footer et le formulaire d'adhésion (`activities[].slug`).
- `src/views/` — une vue par page. Les pages activité (`CoursesAPiedView`, `CrossTrainingView`, `StreetWorkoutView`, `TournoisView`) suivent le même gabarit : `getActivity(slug)` + `useHead(...)` + `ActivityHero` → `ActivityIntro` → `BenefitsGrid` → `OtherActivities` → `ActivityCtaBand` (composants dans `src/components/activity/`). Le contenu spécifique est déclaré en tableaux dans le `<script setup>`.
- Section **Forme & Santé** (`/forme-sante` + sous-pages `nutrition`, `exercices`, `etirements`) : contenu dans [src/data/formeSante.js](src/data/formeSante.js), `FormeSanteView` pour l'index, `SanteTopicView` générique pour les sous-pages (le sujet est passé via `route.meta.topic`), composants dans `src/components/sante/`. Ce sont des notes du comité, **pas des conseils de professionnels de santé** : garder le disclaimer (`SanteDisclaimer`) et ne jamais formuler de conseil médical.
- `src/components/home/` — sections de la page d'accueil ; `src/components/layout/` — `AppNavbar`, `AppFooter`.
- [src/directives/reveal.js](src/directives/reveal.js) — `v-reveal` : IntersectionObserver partagé qui ajoute `.is-visible` (animations dans `style.css`).
- [src/style.css](src/style.css) — `@import 'tailwindcss'`, tokens du thème dans `@theme` (`primary`, `primary-dark`, `primary-light`, `navy`, `swiss-red`, fonts `sans`/`display`) et classes CSS partagées (`.app-navbar`, `.hero-overlay`, `.feature-card`, `.reveal`…). Utiliser ces tokens plutôt que des couleurs en dur quand c'est possible.

### Formulaires

Configuration publique dans [public/contact-config.js](public/contact-config.js) (globals `window.BUSSYSPORT_*`, chargé avant l'app). Le dépôt est **public** : n'y mettre que des identifiants publics, jamais de clé secrète (ex. `sk_live_…` Forminit).

- **Contact** — [useContactForm.js](src/composables/useContactForm.js) → Web3Forms (JSON). Fallback `contact.php` si pas de clé (inopérant en prod).
- **Adhésion** (`/adhesion`) — [useAdhesionForm.js](src/composables/useAdhesionForm.js) → **Forminit** (`multipart/form-data`), car il accepte les pièces jointes (autorisation parentale pour les 16–17 ans, PDF/JPG/PNG ≤ 5 Mo). Forminit n'enregistre que les champs préfixés `fi-{type}-` (`fi-sender-email`, `fi-text-message`, `fi-file-authorization`). Âge minimum 16 ans.
- Anti-spam commun : honeypot `website` (faux succès silencieux) + [useSubmissionThrottle.js](src/composables/useSubmissionThrottle.js) (cooldown persistant en `localStorage`, horloge injectable pour les tests).
- Les messages d'erreur sont en HTML (`errorHtml`) : toujours échapper les textes d'origine externe (`escapeHtml` / `showErrorPlain`).

## Ajouter une page

1. Créer la vue dans `src/views/` avec son `useHead` (title, description, `og:url` et `canonical` en `https://bussysport.ch/<route>/`).
2. Ajouter la route dans [src/router/index.js](src/router/index.js) (en cas de renommage : ajouter une redirection dans le router **et** dans `LEGACY_REDIRECTS`).
3. Ajouter la route à `ROUTES` dans [scripts/prerender.mjs](scripts/prerender.mjs) — sinon 404 en production.
4. Ajouter l'URL (slash final) dans [public/sitemap.xml](public/sitemap.xml).
5. Nouvelle activité : l'ajouter aussi dans `src/data/activities.js`.

## Tests

Vitest + `@vue/test-utils` + happy-dom ; fichiers `src/**/__tests__/*.spec.js`. [vitest.setup.js](vitest.setup.js) installe un `localStorage` en mémoire (celui de happy-dom est masqué sous Node 22+). Dans les tests de composants, stubber la directive `reveal` (`global.directives.reveal`). Les éléments de formulaire exposent des `data-testid` — les conserver lors des refactors.

## Divers

- Workflow git : travail sur `develop`, `main` = production. Commits au format Conventional Commits (`feat:`, `refactor:`, `feat(build):`…).
- `memory/` et `test_reports/` sont ignorés par git (anciens artefacts ; `memory/PRD.md` décrit l'ancienne version HTML statique et est marqué obsolète).
- Images des activités : URLs Pexels/Unsplash externes ; assets locaux dans `public/images/`.
