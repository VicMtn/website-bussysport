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

The membership form at `/adhesion` posts to `public/adhesion.php` (multipart,
with optional parent-authorization upload). Protections:

- Honeypot field
- Server-side rate limit (1 request / 10 s per IP)
- Client-side cooldown between submissions (10 s)
- **Cloudflare Turnstile** captcha (recommended in production)

To enable Turnstile:

1. Create a widget at [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) for `bussysport.ch`.
2. Under **Hostname management**, add every domain where the form runs:
   - `bussysport.ch` and `www.bussysport.ch` (production)
   - `localhost` if you test locally with the production site key ([docs](https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/))
3. Set the **site key** in `public/contact-config.js`:
   ```js
   window.BUSSYSPORT_TURNSTILE_SITE_KEY = "your-site-key";
   ```
4. Set the matching **secret key** server-side. The secret must **never** be
   committed (this repo is public). Copy the template and fill it in, then
   upload the copy via FTP next to `adhesion.php`:
   ```bash
   cp public/adhesion-config.sample.php public/adhesion-config.php
   ```
   ```php
   // public/adhesion-config.php  (git-ignored)
   return ['turnstile_secret' => 'your-secret-key'];
   ```
   Alternatively, set the `BS_TURNSTILE_SECRET` environment variable on your host.

Both keys must be configured together. Without a secret (file absent or empty),
server-side verification is disabled (fail-open): the form still works but is no
longer captcha-protected on the server — only the honeypot + rate limits apply.

Turnstile uses [explicit rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)
(SPA-compatible) with `language: fr`. Visitor-facing errors use plain language
(« contrôle de sécurité »); technical codes are logged server-side only.

**Troubleshooting (developers):** Error `110200` = hostname not in widget settings.
Add `localhost` exactly (not `locahost`). For local dev, prefer [test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).

## SEO

Each route declares its own title, description, canonical URL, OG/Twitter
card and (for the home view) `SportsClub` + `WebSite` JSON-LD blocks via
`@unhead/vue`. Site-wide defaults (geo tags, language, theme colour) live
in `App.vue`.

## Legacy URLs

The old `.html` URLs from the static-site era (`/courses-a-pied.html`, …)
are 301-redirected to their clean-URL equivalents inside the router so
existing inbound links keep working.
