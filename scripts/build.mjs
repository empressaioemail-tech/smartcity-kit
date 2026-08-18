/**
 * Build. Three outputs and no fourth:
 *   dist/index.mjs + dist/index.cjs   the components, React external
 *   dist/*.d.ts                       one declaration file per component module
 *   dist/sc-kit.css + dist/shell.css  byte copies of the vendored stylesheets
 *
 * The package adds no CSS of its own, so the build never compiles, bundles,
 * generates or transforms a stylesheet. It copies two files, and a test asserts
 * each copy still matches its pinned upstream source.
 */
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

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
