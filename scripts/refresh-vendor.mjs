/**
 * Refreshes the vendored copies from a smartcity-dashboards checkout and
 * rewrites the pinned hashes.
 *
 * This exists so that "update the copy" is one command rather than a hand edit
 * in two places. vendor/UPSTREAM.json is the single source of truth for what is
 * copied from where; the file list is read from it, never from here.
 *
 *   node scripts/refresh-vendor.mjs <path-to-smartcity-dashboards>
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const checkout = process.argv[2];

if (!checkout) {
  console.error("usage: node scripts/refresh-vendor.mjs <path-to-smartcity-dashboards>");
  process.exit(2);
}
if (!existsSync(checkout)) {
  console.error(`no such checkout: ${checkout}`);
  process.exit(2);
}

let commit = "unknown";
try {
  commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: checkout, encoding: "utf8" }).trim();
} catch {
  console.error("warning: could not read the upstream commit; recording it as unknown");
}

const manifestPath = join(ROOT, "vendor/UPSTREAM.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const today = new Date().toISOString().slice(0, 10);
let changed = 0;

for (const source of manifest.sources) {
  if (!source.upstreamRepo.endsWith("smartcity-dashboards")) continue;
  const from = join(checkout, source.upstreamPath);
  if (!existsSync(from)) {
    console.error(`missing upstream file: ${source.upstreamPath}`);
    process.exit(1);
  }
  /* Normalized to LF on the way in, which is the form the hashes are taken over
     and the form .gitattributes pins in the checkout. */
  const text = readFileSync(from, "utf8").replace(/\r\n/g, "\n");
  const sha = createHash("sha256").update(text).digest("hex");
  if (sha !== source.sha256) changed += 1;
  writeFileSync(join(ROOT, source.file), text, "utf8");
  source.bytes = Buffer.byteLength(text);
  source.sha256 = sha;
  source.capturedCommit = commit;
  source.capturedOn = today;
  console.log(`${source.file} <- ${source.upstreamPath} (${source.bytes} bytes, ${sha.slice(0, 12)})`);
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(
  changed === 0
    ? "no upstream file changed; pins refreshed with the current commit"
    : `${changed} upstream file(s) changed. Run npm test: a class rename will surface as a gate-3 or markup-parity failure, which is the point.`,
);
