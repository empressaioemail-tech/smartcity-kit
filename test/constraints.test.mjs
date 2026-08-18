/**
 * The card constraints, in code.
 *
 * Two classes of needle, and they are NOT the same rule.
 *
 * Absolute: these strings must not appear in a shipping file at all.
 *
 * Assertion-only: `Bastrop` and `Chestnut` may appear in a refusal guard or a
 * leak detector that names one in order to reject it. What is forbidden is
 * ASSERTING one as content. The distinction matters because the last two
 * clauses written in this program that forbade a string outright also forbade
 * the compliant implementation, and a rule only correct implementations can fail
 * is not a rule. So the absolute list is checked as an absence, and the
 * assertion list is checked as an absence outside this file, which is itself the
 * detector and therefore names them.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { ROOT, rel, walk } from "./_lib.mjs";

const ABSOLUTE = ["permitflow", "citizenconnect", "leaflet", "pipedrive", "stripe.com"];
const ASSERTION_ONLY = ["bastrop", "chestnut"];

/**
 * Shipping files: everything the package would publish, plus everything it
 * authors. vendor/index.html, vendor/app.js and vendor/30b-section-4.1.css are
 * reference copies and are scanned too, because a needle reaching the repo at
 * all is worth knowing about even if npm would not carry it.
 */
function scannable() {
  return walk(ROOT)
    .map(rel)
    .filter((p) => p !== "test/constraints.test.mjs" && p !== "package-lock.json");
}

test("no shipping or reference file carries an absolutely forbidden string", () => {
  const hits = [];
  for (const file of scannable()) {
    const text = readFileSync(join(ROOT, file), "utf8").toLowerCase();
    for (const needle of ABSOLUTE) if (text.includes(needle)) hits.push(`${file}: ${needle}`);
  }
  assert.deepEqual(hits, [], `forbidden strings found:\n${hits.join("\n")}`);
});

test("no file asserts a held city identity as content", () => {
  const hits = [];
  for (const file of scannable()) {
    const text = readFileSync(join(ROOT, file), "utf8").toLowerCase();
    for (const needle of ASSERTION_ONLY) if (text.includes(needle)) hits.push(`${file}: ${needle}`);
  }
  assert.deepEqual(hits, [], `held identities asserted as content:\n${hits.join("\n")}`);
});

test("the needle detector is proven able to fire", () => {
  /* A gate nobody has watched fail is not a gate. Both lists are run against a
     synthetic document carrying every needle, and every one must be caught. */
  const synthetic = [...ABSOLUTE, ...ASSERTION_ONLY].join(" ");
  const caught = [...ABSOLUTE, ...ASSERTION_ONLY].filter((n) => synthetic.toLowerCase().includes(n));
  assert.equal(caught.length, ABSOLUTE.length + ASSERTION_ONLY.length);
});

test("no example carries a record the fixture pack did not generate", () => {
  /* Every example record must be marked as a fixture at source. The fixture
     data file is a verbatim capture of the generator output, so the check is
     that nothing was added to it by hand. */
  const data = JSON.parse(readFileSync(join(ROOT, "examples/fixture-records.json"), "utf8"));
  assert.equal(data.records.length, data.recordCount);
  for (const record of data.records) {
    assert.equal(record.origin, "fixture", `${record.recordId} is not marked as a fixture`);
    assert.equal(record.fixture, true, `${record.recordId} is not marked as a fixture`);
  }
  assert.match(data.generatedBy, /smartcity-dashboards@\w+ src\/fixtures\.mjs/);
});

test("no example carries a parcel outside the one demo fixture the product declares", () => {
  const allowed = new Set(["48021:34137"]);
  const parcel = /\b\d{5}:[A-Za-z0-9._-]+\b/g;
  const hits = [];
  for (const file of scannable().filter((p) => p.startsWith("examples/") || p.startsWith("src/"))) {
    const text = readFileSync(join(ROOT, file), "utf8");
    for (const m of text.matchAll(parcel)) if (!allowed.has(m[0])) hits.push(`${file}: ${m[0]}`);
  }
  assert.deepEqual(hits, [], `parcels outside the demo fixture:\n${hits.join("\n")}`);
});
