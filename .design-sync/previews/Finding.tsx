import * as React from "react";
import { Button, Cite, Finding, ModelCite, Pill, Prov } from "@empressaio/smartcity-kit";

/**
 * The unit of a comment letter: severity rail, finding identifier in mono, one
 * sentence in plain language, then the citation, the sheet reference and the
 * status carrier, then the basis line, then the adjudication controls.
 *
 * Reviewer judgment governs. Accept and Override sit at equal visual weight,
 * and the system never presents a determination as final on its own authority.
 *
 * The basis line is not a slot you can leave empty. Finding takes the basis
 * line data and builds it, so a finding carrying a confidence value with
 * nothing to earn it cannot be drawn.
 */
export const Critical = () => (
  <Finding
    critical
    identifier="F-04"
    title="Occupant load exceeds the value the submitted plan is designed to."
    basis={{
      confidence: { state: "provenance-backed", level: 4, of: 4 },
      sources: "3 sources",
      read: "determined 2026-08-17 09:42",
      reasoning: "#reasoning",
    }}
    actions={
      <>
        <Button size="sm">Override</Button>
        <Button kind="primary" size="sm">
          Accept
        </Button>
      </>
    }
  >
    <ModelCite href="#code" corpus="2018 International Building Code" section="Section 1004.5" />
    <Prov source="Sheet A-501" detail="detail 3" />
    <Pill meaning="crit">Fails code</Pill>
  </Finding>
);

export const NeedsAHuman = () => (
  <Finding
    identifier="F-05"
    title="Drainage plan required. Site grades conflict between sheets C-101 and C-201."
    basis={{
      confidence: { state: "baseline", level: 2, of: 4 },
      sources: "2 sheets",
      read: "needs a human determination",
      reasoning: "#reasoning",
    }}
    actions={
      <>
        <Button size="sm">Override</Button>
        <Button kind="primary" size="sm">
          Accept
        </Button>
      </>
    }
  >
    <Cite href="#code" marker="local">
      Template UDC Section 7.2.6
    </Cite>
    <Prov source="Sheet C-101" detail="and C-201" />
    <Pill meaning="warn">Uncertain</Pill>
  </Finding>
);
