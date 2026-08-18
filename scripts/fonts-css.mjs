/**
 * The one place @font-face is written.
 *
 * Ruling item 4 as amended 2026-08-18: the package adds no CSS rule of its own,
 * with one bounded exception — it may ship @font-face rules, and only those, for
 * families the canonical token block already names. This module is that
 * exception, in full. It emits one rule per registered face and nothing else,
 * from fonts/FONTS.json, which is a record of files that were fetched rather
 * than a place a design value can be chosen.
 *
 * Nothing here selects, sizes, colours or spaces anything. There is no selector
 * in the output, so there is nothing for a component to be styled by.
 */

/** Emitted paths are relative to the stylesheet, which sits beside the directory. */
export const FONT_SUBDIR = "fonts";

/**
 * What the product asks the font host for, read out of its own page.
 *
 * These two live here rather than in the fetch script because three things read
 * them: the fetch script, which downloads that set; the gate, which fails if the
 * package ships a different set; and nothing else may. One rule with two
 * implementations is one edit away from disagreeing, so there is one.
 *
 * Both throw rather than returning empty when they find nothing. An instrument
 * that returns an empty set on a parse failure turns its own gate vacuous, which
 * is the failure this repo keeps finding.
 */
export function productFontUrl(html) {
  const m = html.match(/https:\/\/fonts\.googleapis\.com\/css2\?[^"']+/);
  if (!m) throw new Error("no font-host stylesheet URL found in the product page");
  return m[0].replace(/&amp;/g, "&");
}

export function requestedFaces(url) {
  const out = [];
  for (const m of url.matchAll(/family=([^&:]+):wght@([\d;]+)/g)) {
    const family = decodeURIComponent(m[1]).replace(/\+/g, " ");
    for (const w of m[2].split(";")) out.push({ family, weight: Number(w) });
  }
  if (out.length === 0) throw new Error(`no family+weight pairs parsed from ${url}`);
  return out;
}

export function fontsCss(manifest) {
  const header = [
    "/* @empressaio/smartcity-kit - the two typefaces the design system declares.",
    "   @font-face rules only. No selector, no token, no design value: the families",
    `   are named by the canonical token block and this file carries them.`,
    "   Files are copies. Provenance, licence and hashes are in fonts/FONTS.json.",
    `   Licence: ${manifest.licence.id}. The licence texts ship in ./${FONT_SUBDIR}/. */`,
  ].join("\n");

  const faces = manifest.faces.map((f) => {
    const file = f.file.replace(/^fonts\/files\//, "");
    return [
      `/* ${f.subset} */`,
      "@font-face {",
      `  font-family: "${f.family}";`,
      `  font-style: ${f.style};`,
      `  font-weight: ${f.weight};`,
      "  font-display: swap;",
      `  src: url("./${FONT_SUBDIR}/${file}") format("woff2");`,
      `  unicode-range: ${f.unicodeRange};`,
      "}",
    ].join("\n");
  });

  return [header, ...faces].join("\n") + "\n";
}
