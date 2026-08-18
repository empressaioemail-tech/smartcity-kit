/**
 * Shared instruments. Every counting rule these expose is stated here and
 * repeated where its output is read, because a ratio whose method lives in a
 * helper is a ratio that will be quoted without one.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Every byte comparison in this repo is over CRLF-normalized content.
 *
 * Reason, stated where it is read: this repo is cloned on Windows with autocrlf
 * and a raw-byte comparison would report drift that does not exist in git.
 * .gitattributes pins eol=lf so the checked-in form is LF everywhere. This is
 * the instrument's declared and only exclusion.
 */
export function lf(text) {
  return text.replace(/\r\n/g, "\n");
}

export function readLf(path) {
  return lf(readFileSync(path, "utf8"));
}

const SKIP_DIRS = new Set(["node_modules", ".git", "out"]);

/**
 * Directories skipped because they are a DIFFERENT repository checked out
 * inside this one. Recorded rather than silently dropped: an empty result is
 * not an absence, and a scan that quietly walks into a foreign clone reports
 * that repo's files as this one's violations.
 *
 * This happened. CI checked smartcity-dashboards out at .upstream/ inside the
 * workspace so the drift test could byte-compare, and three repo-wide scans
 * then reported the upstream product as authoring tokens and stylesheets here.
 * CI now moves the checkout outside the workspace AND this guard exists, because
 * a control that depends on the CI file staying right is one implementation of
 * a rule that needs two.
 */
const skippedClones = new Set();

export function nestedClonesSkipped() {
  return [...skippedClones].sort();
}

function isNestedClone(dir) {
  if (resolve(dir) === ROOT) return false;
  try {
    statSync(join(dir, ".git"));
    return true;
  } catch {
    return false;
  }
}

/**
 * Every file under a directory. Excludes node_modules, .git, build output, and
 * any nested foreign clone, which is recorded in nestedClonesSkipped().
 */
export function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (isNestedClone(full)) {
        skippedClones.add(rel(full));
        continue;
      }
      walk(full, acc);
    } else acc.push(full);
  }
  return acc;
}

export function rel(path) {
  return relative(ROOT, path).split(sep).join("/");
}

/**
 * Files this package AUTHORS, as opposed to files it copies or builds.
 *
 * Exclusion set, part of this instrument's contract: vendor/ is copies, dist/
 * and harness/out/ are build output, package-lock.json is generated. Everything
 * else in the repo is authored and is scanned.
 */
export function authoredFiles() {
  return walk(ROOT)
    .map(rel)
    .filter(
      (p) =>
        !p.startsWith("vendor/") &&
        !p.startsWith("dist/") &&
        !p.startsWith("harness/out/") &&
        p !== "package-lock.json",
    );
}

/** Component source only: the files the ruling calls "component files". */
export function componentFiles() {
  return walk(join(ROOT, "src")).map(rel);
}

/**
 * The shipped class vocabulary.
 *
 * Counting rule: distinct class-selector tokens appearing anywhere in the two
 * vendored stylesheets, with CSS comments stripped first so a class named only
 * inside a comment does not count as shipped. State modifiers (.on, .open),
 * element-scoped children (.t, .k, .rail) and the two theme classes all count,
 * because a component that emits one of them is emitting a class the stylesheet
 * defines. Pseudo-classes, attribute selectors and element selectors are not
 * classes and are not counted.
 */
export function stylesheetClasses() {
  const css = ["vendor/sc-kit.css", "vendor/shell.css"]
    .map((p) => readLf(join(ROOT, p)))
    .join("\n")
    .replace(/\/\*[\s\S]*?\*\//g, "");
  const found = new Set();
  for (const m of css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) found.add(m[1]);
  return found;
}

/** Every class token in a rendered HTML string. */
export function classesIn(html) {
  const found = new Set();
  for (const m of html.matchAll(/\sclass="([^"]*)"/g)) {
    for (const token of m[1].split(/\s+/)) if (token) found.add(token);
  }
  return found;
}

/** The vendor manifest, which is the only place an upstream copy is registered. */
export function upstream() {
  return JSON.parse(readLf(join(ROOT, "vendor/UPSTREAM.json")));
}
