import * as React from "react";
import { Prov, RosterNote } from "@empressaio/smartcity-kit";

/**
 * Jobs waiting on a lens that is named and not built. The note keeps the
 * roster honest about coverage instead of hiding the work behind an overflow.
 */
export const PublicWorks = () => (
  <RosterNote label="Jobs waiting on this lens">
    <Prov source="CIP / projects" />
    <Prov source="Reporting" />
    <Prov source="Phones" />
  </RosterNote>
);

export const Police = () => (
  <RosterNote label="Jobs waiting on this lens">
    <Prov source="Patrol" />
    <Prov source="Cameras" />
    <Prov source="Incident log" />
  </RosterNote>
);
