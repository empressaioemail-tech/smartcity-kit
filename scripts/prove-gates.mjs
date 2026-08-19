/**
 * Proves every gate is able to FIRE.
 *
 * A test that has only ever passed is not a gate; it is a comment that costs
 * CPU. This script injects one real violation per gate into a scratch copy of
 * the repo, runs the gate against it, and asserts the gate fails AND names the
 * violation. Then it restores.
 *
 * It runs against a COPY, never the working tree, so a crash cannot leave a
 * violation behind. Exit code 0 means every gate fired.
 */
import { execFileSync } from "node:child_process";
import { appendFileSync, cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The injected payloads are assembled from fragments rather than written out.
 *
 * This file is a detector of detectors, so a literal token declaration or a
 * literal forbidden string here would trip gate 1a and the needle scan on the
 * CLEAN tree, and the obvious fix for that would be to add this file to their
 * exclusion lists. An instrument exclusion is part of its contract and every one
 * added makes the contract weaker, so the payloads are joined at runtime and the
 * exclusion set stays at exactly one file: the gate-1 test, which has to quote
 * the pinned token line in order to pin it.
 *
 * CI found this. The local suite did not.
 */
const token = (name) => `--sc${"-"}${name}`;
const needle = (a, b) => a + b;

/**
 * The divergence pair below plants THIS, byte for byte, in two places: under
 * ds-bundle/ where the converter writes, and under .design-sync/ where authored
 * source lives. Held in one constant so "the same payload" is a fact about the
 * code rather than a claim in a comment.
 */
const CONVERTER_STYLESHEET = ".panel { box-shadow: 0 2px 8px rgba(0,0,0,.3); }\n";

const CASES = [
  {
    gate: "gate 1a",
    what: "a component file declares its own token",
    file: "src/base.ts",
    mutate: (t) => `${t}\n/* ${token("invented")}: #ff0000; */\n`,
    test: "test/gate1-tokens.test.mjs",
    expect: "declare a --sc- token",
  },
  {
    gate: "gate 1b",
    what: "the carried token file is edited",
    file: "vendor/sc-kit.css",
    mutate: (t) => t.replace(`${token("accent")}:#0B6A7B`, `${token("accent")}:#0B6A7C`),
    test: "test/gate1-tokens.test.mjs",
    expect: "no longer matches its pinned upstream hash",
  },
  {
    gate: "gate 1c",
    what: "a token is invented inside the carried block",
    file: "vendor/sc-kit.css",
    mutate: (t) => t.replace(`  ${token("row")}:44px;`, `  ${token("brand-glow")}:8px;\n  ${token("row")}:44px;`),
    test: "test/gate1-tokens.test.mjs",
    expect: "30b section 4.1 does not",
  },
  {
    gate: "gate 2",
    what: "a component hardcodes a colour",
    file: "src/status.tsx",
    mutate: (t) => `${t}\nexport const ACCENT = "#0B6A7B";\n`,
    test: "test/gate2-values.test.mjs",
    expect: "hex-colour",
  },
  {
    gate: "gate 2",
    what: "a component hardcodes a radius",
    file: "src/status.tsx",
    mutate: (t) => `${t}\nexport const RADIUS = "6px";\n`,
    test: "test/gate2-values.test.mjs",
    expect: "px-length",
  },
  {
    gate: "gate 3",
    what: "a component emits a class no stylesheet defines",
    file: "src/status.tsx",
    mutate: (t) => t.replace('className={cx("pill", PILL_CLASS[meaning])}', 'className={cx("pill", "pill-hero", PILL_CLASS[meaning])}'),
    test: "test/gate3-classes.test.mjs",
    expect: "exist in neither",
    rebuild: true,
  },
  {
    gate: "gate 3",
    what: "a new export is not registered in the gallery",
    file: "src/status.tsx",
    mutate: (t) => `${t}\nexport function Unregistered() {\n  return null;\n}\n`,
    also: [
      {
        file: "src/index.ts",
        mutate: (t) => t.replace('export { Pill, Prov, Basis, Seal, BrandCity, EnvBadge } from "./status";', 'export { Pill, Prov, Basis, Seal, BrandCity, EnvBadge, Unregistered } from "./status";'),
      },
    ],
    test: "test/gate3-classes.test.mjs",
    expect: "render no example",
    rebuild: true,
  },
  {
    gate: "gate 4",
    what: "the package authors a stylesheet",
    file: "src/kit-extra.css",
    create: ".panel { box-shadow: 0 2px 8px rgba(0,0,0,.3); }\n",
    test: "test/gate4-no-css.test.mjs",
    expect: "authored by this package",
  },
  {
    gate: "gate 4",
    what: "a component imports a stylesheet",
    file: "src/status.tsx",
    mutate: (t) => `import "./nowhere.css";\n${t}`,
    test: "test/gate4-no-css.test.mjs",
    expect: "stylesheet-import",
  },
  /**
   * The bounded exception, one injected violation per new assertion.
   *
   * Ruling item 4 as amended permits @font-face and only @font-face, for
   * families the token block already names. These six are what stop it widening,
   * and the last is the ORIGINAL defect: the shipped CSS naming a family the
   * package does not carry. It fails against the tree as it stood before this
   * change, which is the only way to know the assertion is about the real bug.
   */
  {
    gate: "gate 4 fonts",
    what: "the font sheet carries a rule that is not an @font-face",
    file: "dist/fonts.css",
    mutate: (t) => `${t}\n.panel { font-weight: 700; }\n`,
    test: "test/gate4-no-css.test.mjs",
    expect: "is not an @font-face rule",
  },
  {
    gate: "gate 4 fonts",
    what: "the font sheet declares a family no token names",
    file: "dist/fonts.css",
    mutate: (t) =>
      `${t}\n/* latin */\n@font-face {\n  font-family: "Comic Sans MS";\n  font-style: normal;\n  font-weight: 400;\n  font-display: swap;\n  src: url("./fonts/inter-latin-400-normal.woff2") format("woff2");\n  unicode-range: U+0000-00FF;\n}\n`,
    test: "test/gate4-no-css.test.mjs",
    expect: "token names them",
  },
  {
    gate: "gate 4 fonts",
    what: "a src url points at a file the package does not ship",
    file: "dist/fonts.css",
    mutate: (t) => t.replace("inter-latin-400-normal.woff2", "inter-latin-400-nowhere.woff2"),
    test: "test/gate4-no-css.test.mjs",
    expect: "does not resolve to a shipped file",
  },
  {
    gate: "gate 4 fonts",
    what: "a shipped font file is edited",
    file: "fonts/files/inter-latin-400-normal.woff2",
    mutate: (t) => `${t}\n`,
    test: "test/gate4-no-css.test.mjs",
    expect: "no longer matches its pinned hash",
  },
  {
    gate: "gate 4 fonts",
    what: "the licence text that has to travel with the fonts is altered",
    file: "fonts/OFL-Inter.txt",
    mutate: (t) => t.replace("Copyright", "Copyright (altered)"),
    test: "test/gate4-no-css.test.mjs",
    expect: "pinned in the manifest",
  },
  {
    gate: "gate 4 fonts",
    what: "the product asks for a weight the package does not ship",
    file: "vendor/index.html",
    mutate: (t) => t.replace("Inter:wght@400;500;600;650", "Inter:wght@400;500;600;650;700"),
    test: "test/gate4-no-css.test.mjs",
    expect: "the product requests weights the package does not ship",
  },
  {
    gate: "gate 4 fonts",
    what: "the shipped CSS names a family no @font-face ships (the original defect)",
    file: "dist/fonts.css",
    mutate: (t) =>
      t
        .split(/(?=\/\* [a-z-]+ \*\/\n@font-face)/)
        .filter((block) => !block.includes('font-family: "Inter"'))
        .join(""),
    test: "test/gate4-no-css.test.mjs",
    expect: "no @font-face ships it",
  },
  {
    gate: "law 3",
    what: "the quiet default is flipped to a loud one",
    file: "src/status.tsx",
    mutate: (t) => t.replace('meaning = "quiet",', 'meaning = "ok",'),
    test: "test/law.test.mjs",
    expect: "p-quiet",
    rebuild: true,
  },
  {
    gate: "law: elevation",
    what: "Panel gains an elevation prop",
    file: "src/surfaces.tsx",
    mutate: (t) => t.replace("export function Panel({ children, ...rest }: Base<HTMLDivElement> & { children?: React.ReactNode }) {", "export function Panel({ children, ...rest }: Base<HTMLDivElement> & { elevation?: number; children?: React.ReactNode }) {"),
    test: "test/law.test.mjs",
    expect: "elevation props found",
  },
  {
    /* G-90. The rule this family carries is that an unavailable entry states why,
       and it is held by the ABSENCE of a disabled prop. An absence cannot be
       watched by reading the clean tree, so the injection puts the escape hatch
       back and watches the law test go red. The needle is a fragment of the
       PRINTED REGEX that assertion carries, not the word "disabled", which
       appears in that suite for a dozen unrelated reasons and would score any
       other failure as this gate working. It is also not "Omit<" alone, because
       the G-88 licensed-body law prints Omit<AnchorBase and the two would be
       indistinguishable. */
    gate: "law: no-reason-no-disabled",
    what: "PopItem gets its disabled escape hatch back",
    file: "src/shell.tsx",
    mutate: (t) => t.replace('Omit<ButtonBase, "disabled"> & { unavailable?: React.ReactNode; children?: React.ReactNode }', "ButtonBase & { unavailable?: React.ReactNode; children?: React.ReactNode }"),
    test: "test/law.test.mjs",
    expect: "Omit<ButtonBase,",
    rebuild: true,
  },
  {
    /* And the other half of the same law: the rendered output. A source-only
       check passes on a component that keeps the Omit and stops emitting the
       basis line, which would be the rule intact in the types and gone from the
       page. */
    gate: "law: no-reason-no-disabled",
    what: "an unavailable PopItem stops rendering its basis line",
    file: "src/shell.tsx",
    mutate: (t) => t.replace("<Basis>{unavailable}</Basis>", ""),
    test: "test/law.test.mjs",
    expect: '<span class="basis">Basis: not read</span>',
    rebuild: true,
  },
  {
    gate: "law: closed by omission",
    what: "Pop opens by default",
    file: "src/shell.tsx",
    mutate: (t) => t.replace("  open = false,", "  open = true,"),
    test: "test/law.test.mjs",
    expect: "open = false",
    rebuild: true,
  },
  {
    gate: "markup parity",
    what: "a component adds a wrapper the product does not have",
    file: "src/status.tsx",
    mutate: (t) => t.replace('<span className={cx("pill", PILL_CLASS[meaning])} {...rest}>\n      {children}\n    </span>', '<span className={cx("pill", PILL_CLASS[meaning])} {...rest}>\n      <span>{children}</span>\n    </span>'),
    test: "test/markup-parity.test.mjs",
    expect: "Pill matches",
    rebuild: true,
  },
  {
    /* RELABELLED at G-88. This case was called "vendor parity arm B" and it has
       never proven arm B. Editing a vendored file breaks its PIN, which is arm
       A, and the needle below is arm A own message. Arm B is the only guardrail
       in this repo that can see the PRODUCT move away from the copy, it is the
       one that goes red when smartcity-dashboards merges without a re-vendor,
       and it had no injection at all. Found while re-vendoring this branch after
       the product moved under it, which is precisely the scenario arm B is for.
       The real arm B case is the next one. */
    gate: "vendor parity arm A",
    what: "a vendored copy is edited here, so it no longer matches its own pin",
    file: "vendor/shell.css",
    mutate: (t) => `${t}\n.panel { border-width: 2px; }\n`,
    test: "test/vendor-parity.test.mjs",
    expect: "has been edited",
  },
  {
    gate: "vendor parity arm B",
    what: "upstream moves away from the copy while the copy still matches its own pin",
    /* No file is edited here, deliberately. The vendored copies and their pins
       stay correct, so arm A cannot see this and stays green; only a byte
       compare against a live checkout can. That is the whole point of arm B and
       it is why this case needs a divergent upstream rather than an edit. */
    setup: (scratch) => {
      const web = join(scratch, ".fake-upstream", "web");
      mkdirSync(web, { recursive: true });
      for (const f of ["sc-kit.css", "shell.css", "index.html", "app.js"]) {
        cpSync(join(scratch, "vendor", f), join(web, f));
      }
      appendFileSync(join(web, "shell.css"), "\n.panel { border-width: 2px; }\n");
      return { SC_DASHBOARDS_DIR: join(scratch, ".fake-upstream") };
    },
    test: "test/vendor-parity.test.mjs",
    /* Arm B message, not arm A message. If this ever starts matching because arm
       A fired, the case has stopped proving what it claims. */
    expect: "has drifted from",
  },
  {
    gate: "constraints",
    what: "a forbidden string reaches a file",
    file: "src/regions.tsx",
    mutate: (t) => `${t}\n/* mounts the ${needle("permit", "flow")} console */\n`,
    test: "test/constraints.test.mjs",
    expect: "forbidden strings found",
  },
  /**
   * G-87, the two cases the row exists for.
   *
   * `expect` is the PATH, not the generic failure banner, because the
   * requirement is that the suite turns red AND names the file. A gate that
   * fails without saying where is a gate that gets debugged by bisection.
   *
   * These are not hypotheticals. A real vendor-brand violation sat in
   * conventions.md with CI green, because walk() skipped `.design-sync` whole
   * and conventions.md ships verbatim inside the uploaded README.
   */
  {
    gate: "constraints .design-sync",
    what: "a forbidden string reaches the conventions header, which ships inside the README",
    file: ".design-sync/conventions.md",
    mutate: (t) => `${t}\n\nRender the parcel map with ${needle("leaf", "let")}.\n`,
    test: "test/constraints.test.mjs",
    expect: ".design-sync/conventions.md",
  },
  {
    gate: "constraints .design-sync",
    what: "a forbidden string reaches a preview, which ships as a preview card",
    file: ".design-sync/previews/Button.tsx",
    mutate: (t) => `${t}\n/* deal sync via ${needle("pipe", "drive")} */\n`,
    test: "test/constraints.test.mjs",
    expect: ".design-sync/previews/Button.tsx",
  },
  /**
   * THE DIVERGENCE PAIR. One payload, two locations, opposite required verdicts.
   *
   * Widening the scan to reach `.design-sync` re-opens exactly one risk: that
   * gate 4 starts reading the converter's generated stylesheets as CSS this
   * package authored. That false positive is why the skip was written in the
   * first place (kit PR #2), so "the skip still works" cannot be left to the
   * shape of a Set — it has to be watched.
   *
   * Two cases with the SAME bytes are the only honest form of that check. A
   * single case proves a verdict; a pair proves the boundary is where it is
   * claimed to be. If someone ever deletes ds-bundle from the skip list, the
   * first of these goes red and says why.
   */
  {
    gate: "skip list staleness",
    what: "authored, tracked source is added to the skip list and hidden from its own gate",
    file: "test/_lib.mjs",
    /* `src/` is authored and tracked. Skipping it is precisely what happened to
       `.design-sync`: a directory that was legitimately generated once, still on
       the list after it stopped being. */
    mutate: (t) => t.replace('  "ds-bundle",', '  "ds-bundle",\n  "src",'),
    test: "test/gate4-no-css.test.mjs",
    expect: "NOT gitignored",
  },
  {
    gate: "gate 4 boundary",
    what: "converter output is still NOT read as package-authored CSS",
    file: "ds-bundle/_ds_bundle.css",
    create: CONVERTER_STYLESHEET,
    test: "test/gate4-no-css.test.mjs",
    mode: "stays-clean",
  },
  {
    gate: "gate 4 boundary",
    what: "the same stylesheet IS caught when authored under .design-sync",
    file: ".design-sync/authored.css",
    create: CONVERTER_STYLESHEET,
    test: "test/gate4-no-css.test.mjs",
    expect: "authored by this package",
  },
  {
    gate: "runtime classes",
    what: "the product assigns a class no stylesheet defines",
    file: "vendor/app.js",
    mutate: (t) => `${t}\nconst unused = () => { const el = document.createElement("div"); el.className = "vendor-wallpaper"; return el; };\n`,
    test: "test/runtime-classes.test.mjs",
    expect: "assigns classes no stylesheet defines",
  },
  /* G-88. The evidence layer inverts three rules the rest of the package follows,
     so each of the three has an instrument, and each instrument is watched
     failing here rather than trusted on a passing run. */
  {
    gate: "law: licensed body slot",
    what: "the licensed citation form regains a slot for body copy",
    file: "src/evidence.tsx",
    mutate: (t) =>
      t.replace(
        'Omit<AnchorBase, "children"> & { corpus: string; section: string }',
        "AnchorBase & { corpus: string; section: string }",
      ),
    test: "test/law.test.mjs",
    expect: "Omit<AnchorBase",
  },
  {
    gate: "law: inverted applicability",
    what: "a matrix row defaults to pass, so an unreviewed row reads as clean by omission",
    file: "src/evidence.tsx",
    mutate: (t) => t.replace("  applicability,", '  applicability = "pass",'),
    test: "test/law.test.mjs",
    /* The needle is the printed regex of the doesNotMatch assertion, not the
       bare word: "applicability" appears in this suite for a dozen reasons and
       a needle that loose would score an unrelated failure as this gate
       working. */
    expect: 'not match the regular expression /applicability',
  },
  {
    gate: "law: never-bare confidence",
    what: "the basis line drops the timestamp that earns its confidence value",
    file: "src/evidence.tsx",
    mutate: (t) => t.replace("      <span>{read}</span>", ""),
    test: "test/law.test.mjs",
    expect: "2026-08-17 09:42",
    rebuild: true,
  },
  {
    gate: "runtime classes",
    what: "the kit stops covering a class the product builds at runtime",
    file: "src/regions.tsx",
    mutate: (t) => t.replace('        state === "max" && "is-max",\n', ""),
    test: "test/runtime-classes.test.mjs",
    expect: "by no kit component",
    rebuild: true,
  },
];

const results = [];

for (const [i, c] of CASES.entries()) {
  const scratch = mkdtempSync(join(tmpdir(), `sc-kit-prove-${i}-`));
  try {
    for (const dir of ["src", "test", "vendor", "examples", "harness", "scripts", "fonts"]) {
      cpSync(join(ROOT, dir), join(scratch, dir), { recursive: true });
    }

    /**
     * G-87. `.design-sync` was not copied here, and that was invisible for as
     * long as nothing scanned it. It holds authored source that SHIPS —
     * conventions.md travels verbatim into the uploaded README, the previews
     * become the preview cards — so a violation planted there could not fire
     * against a scratch that did not contain the directory, and a case that
     * cannot fire is indistinguishable from a gate that does not work.
     *
     * The generated paths inside it are excluded on the way in, matching what
     * test/_lib.mjs refuses to walk. .cache is also large, and copying it per
     * case would cost more than the whole run.
     */
    cpSync(join(ROOT, ".design-sync"), join(scratch, ".design-sync"), {
      recursive: true,
      filter: (src) => {
        const r = relative(ROOT, src).split(sep).join("/");
        return !(
          r.startsWith(".design-sync/.cache") ||
          r.startsWith(".design-sync/learnings") ||
          r.startsWith(".design-sync/node_modules")
        );
      },
    });
    for (const f of ["package.json", "tsconfig.json", "tsconfig.examples.json", ".gitignore"]) {
      cpSync(join(ROOT, f), join(scratch, f));
    }

    /**
     * The scratch is a plain directory, not a clone, and the skip-list-vs-
     * .gitignore guard asks git what is ignored. Without a repo here that guard
     * reports itself UNRUN and passes, which would make it unprovable by this
     * harness — a gate nobody can watch fail, which is the thing this file
     * exists to prevent. `git init` plus the copied .gitignore is enough for
     * `git check-ignore`; no commit is needed.
     */
    execFileSync("git", ["init", "-q"], { cwd: scratch, stdio: "ignore" });
    cpSync(join(ROOT, "node_modules"), join(scratch, "node_modules"), { recursive: true });
    cpSync(join(ROOT, "dist"), join(scratch, "dist"), { recursive: true });

    /* Most cases plant their violation IN a file. One cannot: arm B fires when
       the PRODUCT moves and this repo does not, so its injection is a divergent
       upstream checkout rather than an edit here. `setup` builds that and hands
       back the environment the test needs to see it. */
    if (c.file) {
      const target = join(scratch, c.file);
      if (c.create) {
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, c.create);
      } else {
        const before = readFileSync(target, "utf8");
        const after = c.mutate(before);
        if (after === before) throw new Error(`the injected violation did not change ${c.file}`);
        writeFileSync(target, after);
      }
    }
    const caseEnv = c.setup ? c.setup(scratch) || {} : {};
    for (const extra of c.also || []) {
      const p = join(scratch, extra.file);
      const before = readFileSync(p, "utf8");
      const after = extra.mutate(before);
      if (after === before) throw new Error(`the injected violation did not change ${extra.file}`);
      writeFileSync(p, after);
    }

    if (c.rebuild) {
      execFileSync(process.execPath, [join(scratch, "scripts/build.mjs")], {
        cwd: scratch,
        stdio: ["ignore", "pipe", "pipe"],
      });
    }

    let out = "";
    let failed = false;
    try {
      out = execFileSync(process.execPath, ["--test", join(scratch, c.test)], {
        cwd: scratch,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, ...caseEnv },
      });
    } catch (err) {
      failed = true;
      out = String(err.stdout || "") + String(err.stderr || "");
    }
    if (c.mode === "stays-clean") {
      /**
       * A CONTROL, not an injection. This payload is legitimate where it was
       * planted and the gate must stay green; a failure here means the boundary
       * moved and the gate has started reading generated output as authored.
       */
      results.push({
        gate: c.gate,
        what: c.what,
        mode: "stays-clean",
        ok: !failed,
        detail: failed ? `gate fired on a legitimate file: ${out.slice(-240).replace(/\s+/g, " ").trim()}` : "",
      });
    } else {
      const named = out.includes(c.expect);
      results.push({
        gate: c.gate,
        what: c.what,
        mode: "fires",
        ok: failed && named,
        detail: !failed ? "" : named ? "" : `failed but did not name ${c.expect}`,
      });
    }
  } catch (err) {
    results.push({ gate: c.gate, what: c.what, mode: c.mode || "fires", ok: false, detail: String(err.message).slice(0, 160) });
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

let bad = 0;
for (const r of results) {
  if (!r.ok) bad += 1;
  const label = r.mode === "stays-clean" ? (r.ok ? "CLEAN  " : "MISFIRE") : r.ok ? "FIRED  " : "SILENT ";
  console.log(`${label} ${r.gate.padEnd(24)} ${r.what}${r.detail ? `  [${r.detail}]` : ""}`);
}

/* Counting rule, stated where it is read: the denominator is every case, and
   the two kinds are not interchangeable. An injection passes by FIRING and
   naming its file; a control passes by STAYING GREEN. Reporting them as one
   number without saying so would let a control that never fires be mistaken for
   a gate that works. */
const controls = results.filter((r) => r.mode === "stays-clean");
const injections = results.filter((r) => r.mode !== "stays-clean");
console.log(
  `\n${injections.filter((r) => r.ok).length} of ${injections.length} injected violations were caught and named.` +
    `\n${controls.filter((r) => r.ok).length} of ${controls.length} legitimate-payload controls stayed green.`,
);
process.exit(bad === 0 ? 0 : 1);
