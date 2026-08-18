/**
 * Markup comparison against the real product.
 *
 * The reference is vendor/index.html, a pinned copy of the page
 * smartcity-dashboards serves. Comparing rendered strings directly would fail on
 * things that are not design-system facts, so the comparison normalizes a
 * declared list and nothing else. The list IS the instrument's contract and is
 * stated here because that is where its output is read.
 *
 * Normalized away, with the reason each is not a parity claim:
 *
 *   id attributes            the product addresses elements from app.js; the kit
 *                            takes an id from its caller and asserts none of its
 *                            own, so an id is a consumer fact.
 *   hidden elements          runtime state. The product ships every conditional
 *                            branch in the page and hides the inactive one.
 *   every other attribute    aria, role, title, href, type, disabled, data-*.
 *                            Behaviour, not class vocabulary. Only tag and class
 *                            are compared, so the identity injection markers the
 *                            product carries on its own elements neither help nor
 *                            hurt: the element around them still has to match.
 *   whitespace               collapsed and trimmed.
 *   class "roster-lens"      present in index.html, defined in NEITHER
 *                            stylesheet, so the kit cannot emit it without
 *                            failing gate 3. Finding F-5.
 *
 * NOT normalized: tag names, class attributes, element order, nesting, and text
 * content. Those are the parity claim.
 */
import { parse } from "node-html-parser";

const DROPPED_CLASSES = new Set(["roster-lens"]);

function collapse(text) {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * A normalized shape string. Readable on failure on purpose: a parity failure
 * that prints two blobs of minified HTML gets skipped rather than read.
 */
export function shape(node, depth = 0) {
  if (node.nodeType === 3) {
    const t = collapse(node.text);
    return t ? `${"  ".repeat(depth)}"${t}"` : "";
  }
  if (node.nodeType !== 1) return "";

  if (node.hasAttribute && node.hasAttribute("hidden")) return "";

  const tag = node.rawTagName?.toLowerCase();
  const classes = (node.getAttribute("class") || "")
    .split(/\s+/)
    .filter((c) => c && !DROPPED_CLASSES.has(c));

  const head = `${"  ".repeat(depth)}<${tag}${classes.length ? ` .${classes.join(".")}` : ""}>`;
  const kids = node.childNodes
    .map((c) => shape(c, depth + 1))
    .filter(Boolean);
  return [head, ...kids].join("\n");
}

/** Parses an HTML string and returns the shape of its single root element. */
export function shapeOf(html) {
  const root = parse(html, { comment: false });
  const el = root.childNodes.filter((n) => n.nodeType === 1);
  return el.map((e) => shape(e)).join("\n");
}

/** Parses vendor/index.html once and hands back a query helper. */
export function referencePage(html) {
  const root = parse(html, { comment: false });
  return {
    /** First element matching the selector, as a normalized shape. */
    shapeAt(selector) {
      const el = root.querySelector(selector);
      if (!el) throw new Error(`reference selector matched nothing: ${selector}`);
      return shape(el);
    },
    /** All elements matching, as normalized shapes. */
    shapesAt(selector) {
      return root.querySelectorAll(selector).map((e) => shape(e));
    },
    root,
  };
}

/** A first-difference report, so a failure names the line rather than the file. */
export function firstDifference(a, b) {
  const la = a.split("\n");
  const lb = b.split("\n");
  for (let i = 0; i < Math.max(la.length, lb.length); i += 1) {
    if (la[i] !== lb[i]) {
      return `line ${i + 1}\n  kit      : ${la[i] ?? "(end)"}\n  product  : ${lb[i] ?? "(end)"}`;
    }
  }
  return "";
}
