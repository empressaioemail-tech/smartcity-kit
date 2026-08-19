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
 *                            `shapeAtRevealed` skips this test on the SELECTED
 *                            element only, for the G-90 popovers, which the
 *                            product ships closed and which would otherwise be
 *                            uncomparable. Its reason is at that function.
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
export function shape(node, depth = 0, reveal = false) {
  if (node.nodeType === 3) {
    const t = collapse(node.text);
    return t ? `${"  ".repeat(depth)}"${t}"` : "";
  }
  if (node.nodeType !== 1) return "";

  /* `reveal` applies to THIS node only. The recursive call below does not pass
     it on, so a revealed root keeps hidden descendants dropped. */
  if (!reveal && node.hasAttribute && node.hasAttribute("hidden")) return "";

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
    /**
     * The same, with the hidden test skipped ON THE SELECTED ELEMENT ONLY.
     *
     * Added at G-90 and it is a widening of the normalization contract above,
     * so it is stated here rather than used quietly. The product ships every
     * conditional branch in the page and hides the inactive one, which is why
     * hidden elements are normalized away. Both G-90 popovers ship hidden, so a
     * parity case for the popover panel under the plain rule would compare an
     * empty string against an empty string: green forever and unable to fail
     * for the right reason, which is the defect DEV_PROCESS 2.2 is about.
     *
     * `reveal` does not propagate. Descendants keep the hidden test, so the
     * hidden feedback form inside the account menu stays dropped, which is
     * correct: it is runtime state, not a shape the product always serves.
     *
     * This cannot go vacuously green in the other direction either. The kit side
     * of such a case renders the panel OPEN, so it emits no hidden attribute and
     * its shape is never empty; a bug that made this return "" turns the case
     * red rather than green.
     */
    shapeAtRevealed(selector) {
      const el = root.querySelector(selector);
      if (!el) throw new Error(`reference selector matched nothing: ${selector}`);
      return shape(el, 0, true);
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
