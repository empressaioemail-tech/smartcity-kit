/**
 * Build. Three outputs and no fourth:
 *   dist/index.mjs + dist/index.cjs   the components, React external
 *   dist/*.d.ts                       one declaration file per component module
 *   dist/sc-kit.css + dist/shell.css  byte copies of the vendored stylesheets
 *   dist/kit.css                      the two, concatenated in their required order
 *   dist/fonts.css + dist/fonts/      the two declared typefaces, @font-face only
 *
 * The package adds no CSS RULE of its own, with the one bounded exception the
 * ruling grants: @font-face for families the canonical token block already
 * names. The build copies two stylesheets and concatenates them into a third; it
 * never compiles, bundles, generates or transforms one. A test asserts each copy
 * still matches its pinned upstream source, and asserts kit.css is exactly those
 * two copies in order, so the concatenation cannot become a place to hide a rule.
 *
 * The font sheet is emitted from fonts/FONTS.json by scripts/fonts-css.mjs and
 * held inside the exception by test/gate4-no-css.test.mjs: every rule in it is
 * an @font-face, every family it names is named by a token, and every file it
 * points at ships. It is deliberately NOT folded into kit.css, whose byte
 * equality with its two registered copies is what keeps the concatenation
 * honest.
 */
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import { FONT_SUBDIR, fontsCss } from "./fonts-css.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const shared = {
  entryPoints: [resolve(root, "src/index.ts")],
  bundle: true,
  platform: "neutral",
  target: ["es2022"],
  jsx: "automatic",
  /** React is a peer, never bundled. */
  external: ["react", "react/jsx-runtime", "react-dom"],
  logLevel: "warning",
};

await esbuild.build({ ...shared, format: "esm", outfile: resolve(dist, "index.mjs") });
await esbuild.build({ ...shared, format: "cjs", outfile: resolve(dist, "index.cjs") });

execFileSync(process.execPath, [resolve(root, "node_modules/typescript/bin/tsc"), "-p", "tsconfig.json"], {
  cwd: root,
  stdio: "inherit",
});

/**
 * Declaration aliases. tsc emits index.d.ts; a consumer resolving under node16
 * or nodenext asks for index.d.mts beside index.mjs and index.d.cts beside
 * index.cjs. These are copies, not a second declaration source.
 */
cpSync(resolve(dist, "index.d.ts"), resolve(dist, "index.d.mts"));
cpSync(resolve(dist, "index.d.ts"), resolve(dist, "index.d.cts"));

for (const css of ["sc-kit.css", "shell.css"]) {
  cpSync(resolve(root, "vendor", css), resolve(dist, css));
}

/**
 * kit.css is the two stylesheets concatenated in their required order, emitted
 * rather than vendored so it can never disagree with the copies it is built
 * from. It exists because the order is load-bearing and unenforceable across
 * two imports: shell.css consumes var(--sc-*) throughout and defines none of
 * them, so a consumer who imports them the other way round, or who has a
 * bundler that reorders, gets a fully rendered layout with every colour, size
 * and radius falling back. One import cannot be mis-ordered.
 *
 * It is additive. The separate exports stay, byte-parity with upstream is
 * unaffected, and the canonical files remain the ones in smartcity-dashboards.
 */
writeFileSync(
  resolve(dist, "kit.css"),
  [
    "/* @empressaio/smartcity-kit — sc-kit.css then shell.css, concatenated at build time.",
    "   Order is load-bearing: shell.css consumes the tokens sc-kit.css defines.",
    "   Canonical sources live in smartcity-dashboards web/. Do not edit here. */",
    readFileSync(resolve(root, "vendor", "sc-kit.css"), "utf8"),
    readFileSync(resolve(root, "vendor", "shell.css"), "utf8"),
  ].join("\n"),
);

/**
 * The typefaces.
 *
 * dist/fonts.css carries one @font-face per registered face and nothing else,
 * and dist/fonts/ carries the files those rules point at plus the licence text
 * that has to travel with them. Both are emitted rather than vendored so the
 * stylesheet cannot disagree with the manifest it is written from.
 *
 * This is the fix for the defect that the shipped CSS named two families the
 * package did not ship, so every design built from it rendered in a system
 * fallback and lost the type ramp silently.
 */
const fontManifest = JSON.parse(readFileSync(resolve(root, "fonts/FONTS.json"), "utf8"));
mkdirSync(resolve(dist, FONT_SUBDIR), { recursive: true });
for (const face of fontManifest.faces) {
  cpSync(resolve(root, face.file), resolve(dist, FONT_SUBDIR, face.file.replace(/^fonts\/files\//, "")));
}
for (const licence of fontManifest.licence.texts) {
  cpSync(resolve(root, "fonts", licence.file), resolve(dist, FONT_SUBDIR, licence.file));
}
writeFileSync(resolve(dist, "fonts.css"), fontsCss(fontManifest));

/**
 * The gallery bundle. Not shipped and not in package.json files: it is the
 * registry the gate-3 class check, the coverage figure, the markup parity test
 * and the screenshot harness all read, and it imports from dist/ on purpose so
 * every one of them exercises the BUILT package rather than the source tree.
 */
mkdirSync(resolve(root, "harness/out"), { recursive: true });
await esbuild.build({
  entryPoints: [resolve(root, "examples/gallery.tsx")],
  bundle: true,
  format: "esm",
  platform: "node",
  target: ["es2022"],
  jsx: "automatic",
  external: ["react", "react/jsx-runtime", "react-dom", "react-dom/server"],
  outfile: resolve(root, "harness/out/gallery.mjs"),
  logLevel: "warning",
});

const emitted = readdirSync(dist).sort();
console.log(`built ${emitted.length} files into dist/: ${emitted.join(" ")}`);
