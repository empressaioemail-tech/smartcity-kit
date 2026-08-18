import * as React from "react";
import { Pill, SourceRow } from "@empressaio/smartcity-kit";

/**
 * Three rails: not connected (neutral, the default), partial (you have to ask
 * for the loud rail), and mounted (ok). Quiet on satisfied, loud on unresolved.
 */
export const NotConnected = () => (
  <SourceRow name="Adopted budget" description="Appropriations by fund and department for the current year">
    <Pill>Not connected</Pill>
  </SourceRow>
);

export const Partial = () => (
  <SourceRow
    rail="partial"
    name="Permit fee revenue"
    description="Fees assessed and collected, joined to the permit record"
  >
    <Pill meaning="warn">Partial</Pill>
  </SourceRow>
);

export const Mounted = () => (
  <SourceRow rail="ok" name="ArcGIS" description="Place map, through the SmartSite mount">
    <Pill meaning="restricted">Mounted</Pill>
  </SourceRow>
);
