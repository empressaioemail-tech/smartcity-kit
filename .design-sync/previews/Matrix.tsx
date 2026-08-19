import * as React from "react";
import { Matrix, MatrixGroup, MatrixRow, Pill } from "@empressaio/smartcity-kit";

/**
 * The applicability matrix, and the status reading is INVERTED.
 *
 * Pass is the quietest row on the page. Fail takes the critical rail and wash,
 * Uncertain the warn rail and wash, and Unchecked a diagonal hatch, the
 * plat-drawing convention for nobody has been here yet, because unreviewed is
 * more dangerous than failed and must never read as clean. A reviewer scanning
 * two hundred sections should be pulled to exactly the rows that need a human.
 *
 * Never add a green wash to a passing row. That single edit reverses the ruling
 * the whole component exists to express.
 */
export const Inverted = () => (
  <Matrix>
    <MatrixGroup corpus="Template Unified Development Code" licence="Local, adopted 2024" />
    <MatrixRow
      applicability="uncertain"
      section="Section 7.2.6"
      statement="Drainage plan required. Site grades conflict between sheets C-101 and C-201."
    >
      <Pill meaning="warn">Uncertain</Pill>
    </MatrixRow>
    <MatrixRow applicability="pass" section="Section 5.3.2" statement="Front setback">
      <Pill meaning="ok">Passed</Pill>
    </MatrixRow>
    <MatrixGroup corpus="2018 International Building Code" licence="Licensed, citation only" />
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
  </Matrix>
);

/** Grouping is structural. Rows carry section identifiers only, because the
 *  header above them has already printed the full canonical title once. */
export const OneCorpus = () => (
  <Matrix>
    <MatrixGroup corpus="Template Unified Development Code" licence="Local, adopted 2024" />
    <MatrixRow applicability="pass" section="Section 5.3.2" statement="Front setback">
      <Pill meaning="ok">Passed</Pill>
    </MatrixRow>
    <MatrixRow applicability="pass" section="Section 5.4.1" statement="Maximum lot coverage">
      <Pill meaning="ok">Passed</Pill>
    </MatrixRow>
  </Matrix>
);
