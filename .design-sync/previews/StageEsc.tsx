import * as React from "react";
import { Button, Prov, StageEsc } from "@empressaio/smartcity-kit";

/**
 * The escape affordance while a stage is presented. Provenance names the
 * stage; the Close control is the way out. Escape to close is stated on the
 * line, not implied by a blank overlay.
 */
export const Map = () => (
  <StageEsc>
    <Prov source="Map" detail="Escape to close" />
    <Button size="sm">Close</Button>
  </StageEsc>
);

export const Close = () => (
  <StageEsc>
    <Button size="sm">Close</Button>
  </StageEsc>
);
