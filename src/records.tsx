import * as React from "react";
import { cx } from "./base";
import type { Base } from "./base";

/* ------------------------------------------------------------------- table */

/**
 * The queue table. Column order is fixed across every queue in the product:
 * identifier, subject, then the rest, with dates in mono and status last.
 * `caption` is the accessible name, not a visible heading.
 */
export function DataTable({
  caption,
  children,
  ...rest
}: Base<HTMLTableElement> & { caption?: string; children?: React.ReactNode }) {
  return (
    <table className="dt" {...rest}>
      {caption === undefined ? null : <caption>{caption}</caption>}
      {children}
    </table>
  );
}

export function DataHead({ children, ...rest }: Base<HTMLTableSectionElement> & { children?: React.ReactNode }) {
  return (
    <thead {...rest}>
      <tr>{children}</tr>
    </thead>
  );
}

export function DataHeadCell({ children, ...rest }: Base<HTMLTableCellElement> & { children?: React.ReactNode }) {
  return (
    <th scope="col" {...rest}>
      {children}
    </th>
  );
}

export function DataBody({ children, ...rest }: Base<HTMLTableSectionElement> & { children?: React.ReactNode }) {
  return <tbody {...rest}>{children}</tbody>;
}

/** A queue row. Clicking a row opens a drawer; it never navigates away. */
export function DataRow({ children, ...rest }: Base<HTMLTableRowElement> & { children?: React.ReactNode }) {
  return <tr {...rest}>{children}</tr>;
}

/**
 * A cell. `role` here means the cell's job in the fixed column order, not an
 * ARIA role: identifier cells set in mono, the subject cell reads in ink, and
 * everything else is secondary. There is no alignment or colour prop, because
 * alignment follows from the column and colour lives only in status carriers.
 */
export type CellRole = "id" | "subject" | "default";

const CELL_CLASS: Record<CellRole, string | false> = {
  id: "id",
  subject: "subj",
  default: false,
};

export function DataCell({
  cell = "default",
  children,
  ...rest
}: Base<HTMLTableCellElement> & { cell?: CellRole; children?: React.ReactNode }) {
  const className = CELL_CLASS[cell];
  return className ? (
    <td className={className} {...rest}>
      {children}
    </td>
  ) : (
    <td {...rest}>{children}</td>
  );
}

/* -------------------------------------------------------------- source row */

/**
 * A row in a source register: the severity rail, the name and its one-line
 * description, and a trailing status carrier.
 *
 * `rail` defaults to neutral. The loud rails are the ones you have to ask for,
 * which is the register-level expression of the third law.
 */
export type Rail = "neutral" | "ok" | "partial";

export function SourceRow({
  name,
  description,
  rail = "neutral",
  children,
  ...rest
}: Base<HTMLDivElement> & {
  name: React.ReactNode;
  description?: React.ReactNode;
  rail?: Rail;
  children?: React.ReactNode;
}) {
  return (
    <div className={cx("srcreg", rail === "ok" && "ok", rail === "partial" && "partial")} {...rest}>
      <i className="rail" />
      <span className="nm">
        <b>{name}</b>
        {description === undefined ? null : <span>{description}</span>}
      </span>
      {children}
    </div>
  );
}

/** The sticky group heading inside a register. */
export function RegisterGroup({
  children,
  ...rest
}: Base<HTMLDivElement> & { children?: React.ReactNode }) {
  return (
    <div className="reg-group" {...rest}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------ record parts */

/** The key and value list on a record surface. */
export function KeyValues({ children, ...rest }: Base<HTMLDListElement> & { children?: React.ReactNode }) {
  return (
    <dl className="kv" {...rest}>
      {children}
    </dl>
  );
}

/** One key and value pair. Identifier values are set with Text step data. */
export function KeyValue({
  label,
  children,
}: {
  label: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </>
  );
}

/** The row of actions beside a page title. */
export function ActionBar({ children, ...rest }: Base<HTMLSpanElement> & { children?: React.ReactNode }) {
  return (
    <span className="actionbar" {...rest}>
      {children}
    </span>
  );
}

/**
 * The jobs waiting on a lens that is named and not built. It keeps the roster
 * honest about coverage instead of hiding what the product does not have.
 */
export function RosterNote({
  label,
  children,
  ...rest
}: Base<HTMLDivElement> & { label: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="roster-note" {...rest}>
      <span className="t-label">{label}</span>
      <div className="roster-list">{children}</div>
    </div>
  );
}
