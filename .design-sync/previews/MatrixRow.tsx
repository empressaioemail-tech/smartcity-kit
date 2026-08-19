import * as React from "react";
import { MatrixRow, Pill } from "@empressaio/smartcity-kit";

/**
 * The rows that need a human, in the order a reviewer should meet them.
 *
 * Unchecked is loudest by hatch and Fail loudest by colour. This is the
 * inversion: unreviewed is more dangerous than failed, so it never reads as
 * clean.
 */
export const NeedsAHuman = () => (
  <>
    <MatrixRow
      applicability="unchecked"
      section="Section 802.3"
      statement="Interior finish classification, not yet evaluated"
    >
      <Pill>Unchecked</Pill>
    </MatrixRow>
    <MatrixRow
      applicability="fail"
      section="Section 1004.5"
      statement="Occupant load exceeds the value the submitted plan is designed to"
    >
      <Pill meaning="crit">Fails code</Pill>
    </MatrixRow>
    <MatrixRow
      applicability="uncertain"
      section="Section 7.2.6"
      statement="Drainage plan required. Site grades conflict between sheets C-101 and C-201."
    >
      <Pill meaning="warn">Uncertain</Pill>
    </MatrixRow>
  </>
);

/**
 * Pass. Grey text, no fill, no rail. It is quiet by getting nothing, and there
 * is no state prop that could make it louder.
 *
 * There is also no default: you say which of the four a row is, or it does not
 * compile. A defaulted row would put the clean state one omission away.
 */
export const Satisfied = () => (
  <>
    <MatrixRow applicability="pass" section="Section 5.3.2" statement="Front setback">
      <Pill meaning="ok">Passed</Pill>
    </MatrixRow>
    <MatrixRow applicability="pass" section="Section 1011.5" statement="Stair tread and riser dimensions">
      <Pill meaning="ok">Passed</Pill>
    </MatrixRow>
  </>
);
