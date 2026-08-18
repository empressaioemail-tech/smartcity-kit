/**
 * The copy is still a copy.
 *
 * Two arms, because a guardrail that does not survive a clone is not a
 * guardrail and a pinned hash alone cannot see upstream move.
 *
 *   Arm A, always runs, survives a clone: each vendored file matches its pinned
 *   hash. This catches an edit to the copy.
 *
 *   Arm B, runs where a smartcity-dashboards checkout is reachable: byte-compare
 *   against the real upstream file. This catches upstream moving. CI checks the
 *   public repo out and sets SC_DASHBOARDS_DIR so arm B is not optional there.
 *
 * When arm B cannot run it says so and names why. An unrun check and a passing
 * check must never look the same.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { ROOT, lf, readLf, upstream } from "./_lib.mjs";

const manifest = upstream();

test("arm A: every vendored file matches its pinned upstream hash", () => {
  for (const source of manifest.sources) {
    const text = readLf(join(ROOT, source.file));
    assert.equal(
      createHash("sha256").update(text).digest("hex"),
      source.sha256,
      `${source.file} has been edited. It is a copy of ${source.upstreamRepo}/${source.upstreamPath}; change it there and run npm run refresh:vendor.`,
    );
  }
});

test("arm B: vendored copies byte-match the live upstream checkout", (t) => {
  const dir = process.env.SC_DASHBOARDS_DIR;
  if (!dir) {
    t.diagnostic(
      "arm B NOT RUN: SC_DASHBOARDS_DIR is unset, so no smartcity-dashboards checkout was reachable. This is an unrun check, not a pass. CI sets it.",
    );
    t.skip("no upstream checkout available");
    return;
  }
  const checkout = resolve(dir);
  assert.ok(existsSync(checkout), `SC_DASHBOARDS_DIR points at ${checkout}, which does not exist`);

  const fromDashboards = manifest.sources.filter((s) => s.upstreamRepo.endsWith("smartcity-dashboards"));
  assert.ok(fromDashboards.length > 0, "no upstream files registered");

  for (const source of fromDashboards) {
    const live = join(checkout, source.upstreamPath);
    assert.ok(existsSync(live), `${source.upstreamPath} is missing from the checkout`);
    assert.equal(
      lf(readFileSync(live, "utf8")),
      readLf(join(ROOT, source.file)),
      `${source.file} has drifted from ${source.upstreamRepo}/${source.upstreamPath}. Upstream is canonical; run npm run refresh:vendor.`,
    );
  }
});

test("the manifest states which copies ship and which are reference only", () => {
  const shipped = manifest.sources.filter((s) => s.shipped).map((s) => s.file).sort();
  assert.deepEqual(shipped, ["vendor/sc-kit.css", "vendor/shell.css"]);
  const reference = manifest.sources.filter((s) => !s.shipped).map((s) => s.file).sort();
  assert.deepEqual(reference, ["vendor/30b-section-4.1.css", "vendor/app.js", "vendor/index.html"]);
});
