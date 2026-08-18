import * as React from "react";
import { Pill } from "@empressaio/smartcity-kit";

/**
 * The severity ladder, ordered the way the system reads it.
 *
 * 30b law 3: quiet on satisfied, loud on unresolved. The default Pill is the
 * quiet one on purpose — a satisfied thing should be the least insistent object
 * on the page, and the loudest treatment is spent on the rows that need someone.
 */
export const Unresolved = () => (
  <>
    <Pill meaning="crit">Overdue</Pill>
    <Pill meaning="warn">Awaiting applicant</Pill>
    <Pill meaning="info">In review</Pill>
  </>
);

export const Satisfied = () => (
  <>
    <Pill meaning="ok">Ready to issue</Pill>
    <Pill>Empty</Pill>
    <Pill meaning="quiet">Not built</Pill>
  </>
);

export const Access = () => (
  <>
    <Pill meaning="restricted">Preview</Pill>
    <Pill meaning="restricted">Register</Pill>
    <Pill meaning="quiet">Excluded</Pill>
  </>
);
