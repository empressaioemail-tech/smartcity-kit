import * as React from "react";
import { Pill, RegisterGroup, SourceRow } from "@empressaio/smartcity-kit";

/**
 * Sticky group headings inside a register. Built versus Roster, not yet built,
 * which is the gallery pair; Work is the third heading the Overview register
 * actually ships between them.
 */
export const Built = () => (
  <>
    <RegisterGroup>Built</RegisterGroup>
    <SourceRow name="Development services" description="Permits, inspections, licenses">
      <Pill>Not connected</Pill>
    </SourceRow>
    <SourceRow name="Finance" description="Adopted budget and fund ledger">
      <Pill>Not connected</Pill>
    </SourceRow>
  </>
);

export const Roster = () => (
  <>
    <RegisterGroup>Roster, not yet built</RegisterGroup>
    <SourceRow name="Public works" description="CIP, projects, reporting, phones">
      <Pill meaning="quiet">Not built</Pill>
    </SourceRow>
    <SourceRow name="Parks" description="Department on the roster">
      <Pill meaning="quiet">Not built</Pill>
    </SourceRow>
  </>
);

export const Work = () => (
  <>
    <RegisterGroup>Work</RegisterGroup>
    <SourceRow name="Plan review" description="Submittals against the adopted code">
      <Pill meaning="restricted">Preview</Pill>
    </SourceRow>
    <SourceRow name="Files" description="The city private filing system">
      <Pill meaning="restricted">Preview</Pill>
    </SourceRow>
  </>
);
