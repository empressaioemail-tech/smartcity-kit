/**
 * Instruments for the bounded exception.
 *
 * Ruling item 4 as amended 2026-08-18 lets the package ship @font-face rules and
 * only those, for families the canonical token block already names. Everything
 * that keeps that boundary mechanical reads through here, so the boundary has
 * one definition rather than one per test.
 *
 * Exclusion set, stated where it is read: these parsers strip CSS comments and
 * then require every remaining byte to belong to a rule. There is no other
 * exclusion. A rule they cannot parse is a violation, never a skip.
 */
import { readFileSync } from "node:fs";

/**
 * Top-level rules, and whatever was left over.
 *
 * Counting rule: comments are stripped first, then each `prelude { body }` is
 * taken in order. `outside` is every byte that belonged to no rule, which is how
 * a nested block (@media wrapping a rule) shows up: its outer brace cannot pair
 * and lands there. An empty `outside` is therefore part of the assertion, not
 * housekeeping.
 */
export function topLevelRules(css) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = [];
  let cursor = 0;
  let outside = "";
  for (const m of stripped.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    outside += stripped.slice(cursor, m.index);
    cursor = m.index + m[0].length;
    rules.push({ prelude: m[1].trim(), body: m[2] });
  }
  outside += stripped.slice(cursor);
  return { rules, outside: outside.trim() };
}

export function declaration(body, name) {
  const m = new RegExp(`(?:^|;)\\s*${name}\\s*:\\s*([^;]+)`, "i").exec(body);
  return m ? m[1].trim() : null;
}

export const unquote = (s) => String(s).trim().replace(/^['"]|['"]$/g, "");

export function srcUrls(body) {
  const src = declaration(body, "src") || "";
  return [...src.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)].map((m) => m[2].trim());
}

/**
 * Every rule in a stylesheet that claims to carry font faces, plus every reason
 * it is not one. The violations are returned rather than thrown so a test can
 * report all of them at once.
 */
export function fontFaceRules(css) {
  const { rules, outside } = topLevelRules(css);
  const violations = [];
  const faces = [];
  if (outside) {
    violations.push(`content sits outside any rule, which is not an @font-face rule: ${JSON.stringify(outside.slice(0, 80))}`);
  }
  for (const rule of rules) {
    if (rule.prelude.toLowerCase() !== "@font-face") {
      violations.push(`${JSON.stringify(rule.prelude.slice(0, 80))} is not an @font-face rule`);
      continue;
    }
    faces.push({
      family: unquote(declaration(rule.body, "font-family") || ""),
      weight: declaration(rule.body, "font-weight"),
      style: declaration(rule.body, "font-style"),
      display: declaration(rule.body, "font-display"),
      unicodeRange: declaration(rule.body, "unicode-range"),
      urls: srcUrls(rule.body),
    });
  }
  return { faces, violations };
}

/**
 * The families the canonical token block names.
 *
 * `named` is every quoted family appearing in any font token value, lowercased:
 * these are the families the exception permits. `primary` is the FIRST entry of
 * each token value where that entry is a quoted family: these are the families
 * the system actually asks for first, and a primary with no face shipped is the
 * defect this card exists to fix.
 */
export function tokenFamilies(css) {
  const named = new Set();
  const primary = [];
  const stacks = [];
  const decl = new RegExp("--sc-font-([\\w-]+)\\s*" + ":" + "\\s*([^;]+);", "g");
  for (const m of css.matchAll(decl)) {
    const token = `--sc-font-${m[1]}`;
    const entries = m[2].split(",").map((s) => s.trim());
    for (const entry of entries) {
      if (/^['"]/.test(entry)) named.add(unquote(entry).toLowerCase());
    }
    const first = entries.length > 0 && /^['"]/.test(entries[0]);
    if (first) primary.push({ token, family: unquote(entries[0]) });
    /**
     * `entries` is kept whole so a caller can build the control it needs. The
     * font-load proof drops exactly the families this package ships and keeps
     * every system face, because the control it wants is what a viewer actually
     * got before this change, not a generic-only stack.
     */
    stacks.push({ token, value: entries.join(", "), primary: first ? unquote(entries[0]) : null, entries });
  }
  if (named.size === 0) throw new Error("no quoted font family found in any font token value");
  return { named, primary, stacks };
}

export const readText = (p) => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
