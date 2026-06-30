/**
 * Prérendu statique (SSG) post-build.
 * =====================================
 * L'hébergement (Infomaniak statique) ne sait pas faire de fallback SPA :
 * une URL ouverte directement (ex. /adhesion) renvoie 404. On génère donc un
 * vrai fichier HTML par route, rendu dans un vrai navigateur (Puppeteer) pour
 * capturer le contenu + les métas @unhead. Sortie en dossier (« /adhesion/
 * index.html ») pour qu'Apache la serve sans réécriture (.htaccess ignoré ici).
 *
 * Lancé automatiquement par `npm run build` après `vite build`.
 */
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const DIST = fileURLToPath(new URL("../dist", import.meta.url));
const PORT = 4178;

// À garder aligné avec les routes de contenu de src/router/index.js.
const ROUTES = [
  "/",
  "/courses-a-pied",
  "/cross-training",
  "/street-workout",
  "/tournois",
  "/mentions-legales",
  "/adhesion",
];

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

async function autoScroll(page) {
  // Déclenche les animations « reveal » (IntersectionObserver) pour que le
  // contenu soit présent et visible dans le HTML capturé.
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        let total = 0;
        const step = 500;
        const timer = setInterval(() => {
          window.scrollBy(0, step);
          total += step;
          if (total >= document.body.scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 40);
      }),
  );
  await new Promise((r) => setTimeout(r, 300));
}

async function main() {
  if (!existsSync(join(DIST, "index.html"))) {
    throw new Error("dist/index.html introuvable — lancez `vite build` d'abord.");
  }

  // index.html original = fallback SPA pour servir n'importe quelle route.
  const indexHtml = await readFile(join(DIST, "index.html"));

  const server = createServer(async (req, res) => {
    try {
      const url = decodeURIComponent((req.url || "/").split("?")[0]);
      const filePath = join(DIST, url);
      if (extname(url) && existsSync(filePath)) {
        const data = await readFile(filePath);
        res.writeHead(200, {
          "Content-Type": MIME[extname(url)] || "application/octet-stream",
        });
        res.end(data);
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(indexHtml);
    } catch (err) {
      res.writeHead(500);
      res.end(String(err));
    }
  });
  await new Promise((resolve) => server.listen(PORT, resolve));

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });
      await page.waitForSelector("#app > *", { timeout: 10000 }).catch(() => {});
      await autoScroll(page);

      const html = await page.evaluate(
        () => "<!DOCTYPE html>\n" + document.documentElement.outerHTML,
      );
      await page.close();

      const outDir = route === "/" ? DIST : join(DIST, route);
      await mkdir(outDir, { recursive: true });
      await writeFile(join(outDir, "index.html"), html, "utf8");
      const out = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
      console.log(`✓ prérendu ${route} → ${out}`);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
