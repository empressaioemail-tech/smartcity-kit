import * as React from "react";
import { cx } from "./base";
import type { AnchorBase, Base, ButtonBase } from "./base";

/**
 * The evidence layer: what a determination cites, what record backs it, which
 * sections apply, and the finding that results.
 *
 * These four families landed in the product stylesheet at G-88 item 2, ported
 * from the design law's own style block. They are the families a Plan Review
 * screen cannot be drawn without, and they are the ones where the API shape
 * has to carry a rule the CSS alone cannot hold. Three of those rules invert
 * the pattern the rest of this package follows, so each is stated at the
 * component it governs rather than only here: a rule whose reason lives in a
 * file header does not survive the next edit.
 */

/* ------------------------------------------------------------ code citation */

/**
 * A citation of a local ordinance.
 *
 * A city's own adopted code carries no licensing constraint, so this is the
 * form that may link to full quoted text and the form that is safe as demo
 * material. `marker` is the short qualifier the shipped chip sets in its em
 * slot, which is how a reader tells a local citation from a licensed one
 * without reading the corpus name.
 */
export function Cite({
  marker,
  children,
  ...rest
}: AnchorBase & { marker?: string; children?: React.ReactNode }) {
  return (
    <a className="cite" {...rest}>
      {children}
      {marker === undefined ? null : (
        <>
          {" "}
          <em>{marker}</em>
        </>
      )}
    </a>
  );
}

/**
 * A citation of licensed model code, and THE COMPONENT HAS NO BODY SLOT.
 *
 * That absence is the enforcement mechanism, not a styling choice. The ICC
 * Code Connect terms let this system display a section identifier and heading
 * alongside our own analysis and do not let it display the section body, so the
 * rule is held by making the body unrepresentable: `children` is removed from
 * the prop type, and passing any is a compile error rather than a review
 * comment. `test/law.test.mjs` asserts the removal is still in this source and
 * `test/consumer.test.mjs` watches the compiler reject a body on the offending
 * line.
 *
 * It is a separate component rather than a boolean on `Cite` for the same
 * reason. A `model` flag would have left the body slot attached to the licensed
 * form, and a slot that exists is a slot that gets filled.
 *
 * `corpus` and `section` are strings, not nodes, so a body cannot arrive
 * wrapped in an element through a slot that was meant for a title. `corpus` is
 * the FULL canonical title: an abbreviation alone is prohibited at any density,
 * so there is no compact form of this component anywhere in the system.
 */
export function ModelCite({
  corpus,
  section,
  ...rest
}: Omit<AnchorBase, "children"> & { corpus: string; section: string }) {
  return (
    <a className="cite model" {...rest}>
      <span className="corpus">{corpus}</span>
      <span className="sect">{section}</span>
    </a>
  );
}

/* --------------------------------------------------------------- atom chip */

/**
 * The evidence chip: a thing you can open and read the record of.
 *
 * It wears the reserved atom accent, and that reservation is on the MEANING
 * rather than on the value. The accent is not chrome, not emphasis, not a link
 * treatment and not a second accent, so anything that is not an openable
 * recorded source must not be able to render as one of these. That is why the
 * unverified form below is a different component rather than a flag here.
 *
 * `record` is the mono record identifier and is required. The chip's whole job
 * is to name which record it opens, and a chip with a label and no identifier
 * is a button wearing a reserved colour.
 *
 * `unservable` marks a record the system holds and cannot serve. It stays a
 * button, because an unservable record still opens and degrades to a local
 * brief plus a statement that the full record is unavailable. Forbidden,
 * unknown and unservable all degrade identically and the word forbidden never
 * leaks, so there is one flag here rather than three.
 */
export function AtomChip({
  record,
  open = false,
  unservable,
  children,
  ...rest
}: ButtonBase & {
  record: React.ReactNode;
  open?: boolean;
  unservable?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={cx("atomchip", unservable && "dead")}
      aria-expanded={open ? "true" : "false"}
      {...rest}
    >
      {children} <span className="did">{record}</span>
    </button>
  );
}

/**
 * A web or otherwise unverified source. It is NEVER an atom chip.
 *
 * A separate component, and a span rather than a button, because the two are
 * different elements and not two settings of one. An `unverified` flag on
 * AtomChip would have produced a button carrying `aria-expanded` for a source
 * that cannot be opened, and would have let an unverified source inherit the
 * openable affordance the reserved accent is a promise about. The stylesheet
 * already drops the accent for neutral ink on this form; this keeps the same
 * separation at the API, which is where a design agent works.
 *
 * There is no `record` prop, because an unverified source has no record to
 * open, and no `open` prop, because there is nothing to expand.
 */
export function UnverifiedSource({
  children,
  ...rest
}: Base<HTMLSpanElement> & { children: React.ReactNode }) {
  return (
    <span className="atomchip web" {...rest}>
      {children}
    </span>
  );
}

/* ---------------------------------------------------- applicability matrix */

/**
 * The applicability matrix. Rows group under a corpus header and then carry
 * section identifiers alone, which is how the matrix stays dense without ever
 * printing an abbreviation on its own.
 */
export function Matrix({
  children,
  ...rest
}: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="mx" {...rest}>
      {children}
    </div>
  );
}

/**
 * The corpus header. It prints the full canonical title once, so the rows
 * beneath it do not have to.
 *
 * Both props are required. `corpus` is the full canonical title because an
 * abbreviation alone is prohibited at any density. `licence` is required
 * because the licensing posture of a corpus decides what may be rendered from
 * it, and a header that does not say whether these are a city's own adopted
 * rules or licensed model code leaves the next reader to guess.
 *
 * `children` is the trailing slot the layout document fills with a section
 * count. It composes the existing Grow and Text and needs no rule of its own.
 */
export function MatrixGroup({
  corpus,
  licence,
  children,
  ...rest
}: Base<HTMLDivElement> & {
  corpus: React.ReactNode;
  licence: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mxgroup" {...rest}>
      <span className="c">{corpus}</span>
      <span className="lic">{licence}</span>
      {children}
    </div>
  );
}

/**
 * The four values a row can carry. There is no fifth and no unset.
 */
export type Applicability = "pass" | "fail" | "uncertain" | "unchecked";

const APPLICABILITY_CLASS: Record<Applicability, string> = {
  pass: "mx-pass",
  fail: "mx-fail",
  uncertain: "mx-unc",
  unchecked: "mx-unchecked",
};

/**
 * One row of the applicability matrix, and THE STATUS IS INVERTED.
 *
 * Pass is the quietest row on the page: grey text, no fill, no rail. Fail takes
 * the critical rail and wash, Uncertain the warn rail and wash, and Unchecked a
 * diagonal hatch, the plat-drawing convention for nobody has been here yet,
 * because unreviewed is more dangerous than failed and must never read as
 * clean. A plans examiner is paid to find the rows that need a human, so the
 * loudest treatment is spent there and not on the rows needing no one.
 *
 * `applicability` HAS NO DEFAULT, and that is the ruling expressed at the API.
 *
 * Every other defaulted prop in this package defaults to the quietest form,
 * because for those, omission and quiet are the same thing and the cheapest
 * thing to write should be the thing the law wants. Copying that pattern here
 * would have made `pass` the default, which means an unreviewed row would
 * render as reviewed and clean by omission. So this follows EnvBadge instead,
 * where there is deliberately no default so a demo can never render as live by
 * omission. State which of the four it is, or it does not compile.
 *
 * `test/law.test.mjs` asserts there is no default in this source and that the
 * four values map to the four state classes. `test/consumer.test.mjs` watches
 * the compiler reject a row that omits it. `scripts/prove-gates.mjs` injects a
 * `pass` default and watches the law test fire.
 */
export function MatrixRow({
  applicability,
  section,
  statement,
  children,
  ...rest
}: Base<HTMLDivElement> & {
  applicability: Applicability;
  section: React.ReactNode;
  statement: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className={cx("mxrow", APPLICABILITY_CLASS[applicability])} {...rest}>
      <i className="rail" />
      <span className="sec">{section}</span>
      <span className="txt">{statement}</span>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------- the basis line */

/**
 * A confidence value and the state that earns it, in one object.
 *
 * They travel together because a confidence value with no state is prohibited:
 * an asserted baseline must never be dressed as a calibrated result. Two
 * separate optional props would have made the stateless number expressible,
 * which is exactly what this shape exists to prevent.
 */
export type Confidence = {
  state: "baseline" | "provenance-backed" | "earned";
  /** How many segments of the meter are lit. */
  level: number;
  /** How many segments the meter has. */
  of: number;
};

export type BasisLineProps = {
  confidence?: Confidence;
  /** The source count. Required. */
  sources: React.ReactNode;
  /** When it was read, or determined. Required. */
  read: React.ReactNode;
  /** A link into the reasoning behind the value. */
  reasoning?: string;
  reasoningLabel?: React.ReactNode;
};

/**
 * The basis line: what a value or a determination rests on.
 *
 * `sources` and `read` are BOTH REQUIRED and `confidence` is optional. That
 * asymmetry is the rule. A basis line with no confidence is honest; a
 * confidence with no basis is not.
 *
 * There is deliberately no exported Meter and no standalone confidence prop
 * anywhere in this package, so the only way to render a meter at all is through
 * this component, which cannot itself render without a source count and a
 * timestamp. Exporting the meter on its own would have put the bare number one
 * import away, which is the same defect one layer up.
 *
 * The separators are the ones the design law drew, kept rather than improved
 * on: this package renders the markup the product has and does not invent a
 * tidier one.
 */
export function BasisLine({
  confidence,
  sources,
  read,
  reasoning,
  reasoningLabel = "Open reasoning",
  ...rest
}: Base<HTMLDivElement> & BasisLineProps) {
  return (
    <div className="basisline" {...rest}>
      {confidence === undefined ? null : (
        <>
          <span className="conf">
            Confidence{" "}
            <span className="meter">
              {Array.from({ length: confidence.of }, (_, i) => (
                <i key={i} className={i < confidence.level ? "f" : undefined} />
              ))}
            </span>{" "}
            {confidence.state}
          </span>
          <span>{"·"}</span>
        </>
      )}
      <span>{sources}</span>
      <span>{"·"}</span>
      <span>{read}</span>
      {reasoning === undefined ? null : <a href={reasoning}>{reasoningLabel}</a>}
    </div>
  );
}

/* --------------------------------------------------------- the finding row */

/**
 * A finding: the unit of a comment letter.
 *
 * `basis` is required and it is the basis line's own props, so this component
 * CONSTRUCTS the basis line rather than accepting one. A slot typed as a node
 * was considered and rejected: a JSX expression is `ReactElement<any>` under
 * these React types, so a slot typed to demand a BasisLine would have accepted
 * any element at all and the type would have been decorative. Taking the data
 * instead makes a finding that carries a confidence and no basis line
 * unrepresentable at both layers.
 *
 * `children` is the meta slot, where the citation chip, the sheet reference and
 * the status pill sit. `actions` is the adjudication column; the system never
 * presents a determination as final on its own authority, so accept and
 * override sit at equal weight there, and which is louder is not this
 * component's business.
 *
 * `critical` escalates the rail. There is no quiet arm and this family is not
 * inverted: a finding is by definition something that needs a human, so the
 * default rail is already loud.
 */
export function Finding({
  identifier,
  title,
  basis,
  critical,
  actions,
  children,
  ...rest
}: Base<HTMLDivElement> & {
  identifier: React.ReactNode;
  title: React.ReactNode;
  basis: BasisLineProps;
  critical?: boolean;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className={cx("finding", critical && "crit")} {...rest}>
      <i className="rail" />
      <span className="fid">{identifier}</span>
      <div className="fbody">
        <div className="ftitle">{title}</div>
        {children === undefined ? null : <div className="fmeta">{children}</div>}
        <BasisLine {...basis} />
      </div>
      {actions === undefined ? null : <div className="fact">{actions}</div>}
    </div>
  );
}
