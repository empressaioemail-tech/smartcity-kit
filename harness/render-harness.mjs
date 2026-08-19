/**
 * The render harness.
 *
 * Writes three self-contained pages into harness/out and shoots each with
 * headless Chrome:
 *
 *   gallery.html         every component, every variant, from the gallery
 *   screen-kit.html      the Overview staff shell composed from kit components
 *   screen-product.html  the shipped page, stylesheets rewritten to local paths
 *                        and the runtime script removed, so the two pages are
 *                        the same static markup rendered by the same CSS
 *
 * There is no server. Every page is a file, every command exits on its own, and
 * nothing is left running.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GALLERY, OverviewScreen, CompassPanel } from "./out/gallery.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "harness/out");
mkdirSync(OUT, { recursive: true });

const kitCss = readFileSync(join(ROOT, "vendor/sc-kit.css"), "utf8");
const shellCss = readFileSync(join(ROOT, "vendor/shell.css"), "utf8");
const fonts =
  '<link rel="preconnect" href="https://fonts.googleapis.com" />' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />' +
  '<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;650&display=swap" rel="stylesheet" />';

/**
 * The harness page carries ONE authored style block and it is scaffolding for
 * the gallery listing, not design: it lays entries out in a column and labels
 * them. It lives in harness/, which gate 4 excludes from the component scan and
 * which is never published, and it declares no --sc- token and styles no kit
 * class. If it ever needs to, that is the signal a component is missing.
 */
const HARNESS_SCAFFOLD = `
  .h-page { padding: var(--sc-6); display: flex; flex-direction: column; gap: var(--sc-6); }
  .h-entry { display: flex; flex-direction: column; gap: var(--sc-2); }
  .h-name { font: 500 12px/16px var(--sc-font-data); letter-spacing: 0.08em;
            text-transform: uppercase; color: var(--sc-ink-3); }
  .h-from { font: 400 12px/16px var(--sc-font-ui); color: var(--sc-ink-3); }
  .h-demo { display: flex; flex-wrap: wrap; gap: var(--sc-3); align-items: flex-start;
            padding: var(--sc-4); border: 1px solid var(--sc-line);
            border-radius: var(--sc-r); background: var(--sc-surface);
            /* A transform makes this element the containing block for the
               position: fixed components (the scrims, the sheet, the stage), so
               a scrim demo dims its own box instead of the whole page. Harness
               scaffolding for the listing, not a design decision. */
            transform: translate(0); position: relative; min-height: 48px; }
`;

function page({ title, theme, body, scaffold = false, chromeless = false }) {
  return `<!doctype html>
<html lang="en" data-theme="${theme}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    ${fonts}
    <style>${kitCss}</style>
    <style>${shellCss}</style>
    ${scaffold ? `<style>${HARNESS_SCAFFOLD}</style>` : ""}
    ${chromeless ? "<style>body { overflow: auto; }</style>" : ""}
  </head>
  <body>${body}</body>
</html>
`;
}

/* ------------------------------------------------------------------ gallery */

const entryHtml = (entry) => `
  <div class="h-entry">
    <div class="h-name">${entry.component}</div>
    <div class="h-from">${entry.from}</div>
    <div class="h-demo">${renderToStaticMarkup(entry.node)}</div>
  </div>`;

const galleryBody = `<div class="h-page">${GALLERY.map(entryHtml).join("")}</div>`;

writeFileSync(
  join(OUT, "gallery.html"),
  page({ title: "SmartCity kit gallery", theme: "dark", body: galleryBody, scaffold: true, chromeless: true }),
);
writeFileSync(
  join(OUT, "gallery-light.html"),
  page({ title: "SmartCity kit gallery, light", theme: "light", body: galleryBody, scaffold: true, chromeless: true }),
);

/* Split pages so a screenshot of the gallery is legible rather than a postage
   stamp of eighty entries. Same entries, same order, twenty to a page, and the
   last part runs to the end so a new component cannot fall off the bottom
   unrendered. */
const PARTS = [
  { id: "1", from: 0, to: 20 },
  { id: "2", from: 20, to: 40 },
  { id: "3", from: 40, to: 60 },
  { id: "4", from: 60, to: 80 },
  { id: "5", from: 80, to: GALLERY.length },
];
for (const part of PARTS) {
  writeFileSync(
    join(OUT, `gallery-part${part.id}.html`),
    page({
      title: `SmartCity kit gallery, part ${part.id}`,
      theme: "dark",
      body: `<div class="h-page">${GALLERY.slice(part.from, part.to).map(entryHtml).join("")}</div>`,
      scaffold: true,
      chromeless: true,
    }),
  );
}

/* ---------------------------------------------------------- composed screen */

writeFileSync(
  join(OUT, "screen-kit.html"),
  page({
    title: "Overview, composed from kit components",
    theme: "dark",
    body: renderToStaticMarkup(React.createElement(OverviewScreen)),
  }),
);

writeFileSync(
  join(OUT, "screen-kit-compass.html"),
  page({
    title: "Compass sheet, composed from kit components",
    theme: "dark",
    body:
      `<div class="h-page">${renderToStaticMarkup(React.createElement(CompassPanel))}</div>`,
    scaffold: true,
    chromeless: true,
  }),
);

/* ------------------------------------------------------- product reference */

const productHtml = readFileSync(join(ROOT, "vendor/index.html"), "utf8")
  .replace('<link rel="stylesheet" href="/sc-kit.css" />', `<style>${kitCss}</style>`)
  .replace('<link rel="stylesheet" href="/shell.css" />', `<style>${shellCss}</style>`)
  /* The runtime script is removed so both pages are static markup. app.js only
     toggles state classes; the shipped page already renders the Overview lens
     active, which is exactly the screen the kit composes. */
  .replace('<script type="module" src="/app.js"></script>', "");
writeFileSync(join(OUT, "screen-product.html"), productHtml);

/* ------------------------------------------------------------- screenshots */

const CHROME = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const SHOTS = [
  { file: "gallery.html", out: "gallery-dark.png", size: "1200,7000" },
  { file: "gallery-light.html", out: "gallery-light.png", size: "1200,7000" },
  { file: "gallery-part1.html", out: "gallery-part1.png", size: "1100,1700" },
  { file: "gallery-part2.html", out: "gallery-part2.png", size: "1100,2100" },
  { file: "gallery-part3.html", out: "gallery-part3.png", size: "1100,2400" },
  { file: "gallery-part4.html", out: "gallery-part4.png", size: "1100,2000" },
  { file: "gallery-part5.html", out: "gallery-part5.png", size: "1100,3000" },
  { file: "screen-kit.html", out: "screen-kit.png", size: "1600,1000" },
  { file: "screen-product.html", out: "screen-product.png", size: "1600,1000" },
  { file: "screen-kit-compass.html", out: "screen-kit-compass.png", size: "700,420" },
];

if (!existsSync(CHROME)) {
  console.log(`chrome not found at ${CHROME}; pages written, no screenshots taken`);
} else {
  for (const shot of SHOTS) {
    const url = pathToFileURL(join(OUT, shot.file)).href;
    execFileSync(
      CHROME,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        "--virtual-time-budget=10000",
        `--window-size=${shot.size}`,
        `--screenshot=${join(OUT, shot.out)}`,
        url,
      ],
      { stdio: ["ignore", "pipe", "pipe"], timeout: 120000 },
    );
    console.log(`shot ${shot.out}`);
  }
}

console.log(`harness written to ${OUT}`);
