/**
 * Prints the kit-versus-product shape diff for the composed screen. A working
 * tool, not a gate: test/markup-parity.test.mjs is the gate.
 */
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { OverviewLens } from "../harness/out/gallery.mjs";
import { ROOT, readLf } from "../test/_lib.mjs";
import { referencePage, shapeOf } from "../test/_markup.mjs";

const page = referencePage(readLf(join(ROOT, "vendor/index.html")));
const product = page.shapeAt("#lens-city-manager");
const kit = shapeOf(renderToStaticMarkup(OverviewLens()));

const la = kit.split("\n");
const lb = product.split("\n");
let shown = 0;
for (let i = 0; i < Math.max(la.length, lb.length); i += 1) {
  if (la[i] !== lb[i]) {
    console.log(`line ${i + 1}`);
    console.log(`  kit     : ${la[i] ?? "(end)"}`);
    console.log(`  product : ${lb[i] ?? "(end)"}`);
    shown += 1;
    if (shown >= 40) {
      console.log("... truncated at 40 differences");
      break;
    }
  }
}
console.log(shown === 0 ? "IDENTICAL" : `${shown} differing lines (kit ${la.length} lines, product ${lb.length} lines)`);
