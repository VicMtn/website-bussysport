# BussySport

Landing site of the **BussySport** non-profit sports association in
Bussigny-près-Lausanne (Vaud, Switzerland).

## Stack

- **Vue 3** (`<script setup>`, Composition API)
- **Vite** for dev server, bundling and asset pipeline
- **Vue Router** in history mode with per-route code splitting
- **Tailwind CSS v4** via `@tailwindcss/vite` (no PostCSS config)
- **@unhead/vue** for per-route SEO metadata (title, description, canonical, OG/Twitter, JSON-LD)
- Plain ES modules, no TypeScript, no UI library

## Project layout

```
.
├── index.html                   # Vite entry — mounts <App /> in #app
├── vite.config.js
├── public/
│   ├── .htaccess                # Apache SPA fallback + cache headers
│   ├── contact.php              # PHP SMTP handler (FTP/Apache target)
│   ├── contact-config.js        # Web3Forms access key (window global)
│   ├── images/                  # logo + blason
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.js                  # createApp + plugins
    ├── style.css                # Tailwind + theme tokens + animations
    ├── App.vue                  # navbar / <RouterView /> / footer
    ├── router/index.js
    ├── data/activities.js       # SSOT for the 4 activities
    ├── directives/reveal.js     # v-reveal (IntersectionObserver)
    ├── composables/
    │   ├── useNavbarScroll.js
    │   └── useContactForm.js
    ├── components/
    │   ├── layout/   AppNavbar, AppFooter
    │   ├── home/     HeroSection, AboutSection, ActivitiesSection,
    │   │             ActivityCard, ComingSoonBanner, CtaBand,
    │   │             ContactSection
    │   └── activity/ ActivityHero, ActivityIntro, BenefitsGrid,
    │                 OtherActivities, ActivityCtaBand
    └── views/        HomeView, CoursesAPiedView, CrossTrainingView,
                      StreetWorkoutView, TournoisView,
                      MentionsLegalesView
```

## Scripts

```bash
npm install     # install deps
npm run dev     # start dev server on http://localhost:3000
npm run build   # production bundle in dist/
npm run preview # serve dist/ locally for QA
```

## Deployment (FTP / shared Apache hosting)

1. `npm run build`
2. Upload **the entire content of `dist/`** to the web root (typically
   `public_html/` or `www/`).
3. Upload `public/contact.php` and `public/contact-config.js` if they are
   not already present (they are copied verbatim into `dist/` by Vite).
4. Make sure the bundled `.htaccess` reaches the web root — it provides
   the SPA fallback (Apache `mod_rewrite`) and cache headers required for
   Vue Router's history mode.

> If hosting runs nginx instead of Apache, add a `try_files $uri $uri/ /index.html;`
> directive — `.htaccess` will be ignored.

## Contact form

The contact form supports two backends, both via `useContactForm.js`:

1. **Web3Forms** (recommended for a static FTP deploy). Fill in your access
   key in `public/contact-config.js`:
   ```js
   window.BUSSYSPORT_WEB3FORMS_ACCESS_KEY = "your-key-here";
   ```
2. **Native PHP fallback** (`public/contact.php`) — used automatically when
   no Web3Forms key is set. Requires PHP-enabled Apache hosting.

A honeypot (`website` field) blocks naive bots.

## Adhesion form

The membership form at `/adhesion` (`useAdhesionForm.js`) is sent through
**Web3Forms** — the same no-backend service as the contact form, so it works on
static FTP hosting with **no PHP required**. It posts `multipart/form-data` to
`https://api.web3forms.com/submit` so the optional parental-authorization file
(16–17 yo) can be attached.

Setup: reuse the Web3Forms access key already set in `public/contact-config.js`
(`window.BUSSYSPORT_WEB3FORMS_ACCESS_KEY`), and make sure the recipient address
for that key is `info@bussysport.ch` in your Web3Forms dashboard.

Spam protection (Web3Forms free tier):

- Honeypot (`website` field) — naive bots get a silent fake success.
- Client-side cooldown between submissions (10 s).
- Web3Forms built-in spam filtering.

File upload: the free tier accepts a single attachment up to 5 MB (PDF/JPG/PNG),
which matches the parental-authorization limit enforced client-side.

> **Stronger anti-bot (optional):** Cloudflare Turnstile server-side
> verification is a Web3Forms **Pro** feature. If you upgrade, enable it in the
> Web3Forms dashboard (paste the Turnstile secret there) and add the widget to
> the form — nothing needs to run on your own server.

## SEO

Each route declares its own title, description, canonical URL, OG/Twitter
card and (for the home view) `SportsClub` + `WebSite` JSON-LD blocks via
`@unhead/vue`. Site-wide defaults (geo tags, language, theme colour) live
in `App.vue`.

## Legacy URLs

The old `.html` URLs from the static-site era (`/courses-a-pied.html`, …)
are 301-redirected to their clean-URL equivalents inside the router so
existing inbound links keep working.
