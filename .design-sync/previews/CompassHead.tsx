import * as React from "react";
import { Button, CompassGrab, CompassHead, Grow, Pill, Text } from "@empressaio/smartcity-kit";

/**
 * The sheet head: drag affordance, the Compass label, and the close control.
 * The pill is "Chrome only". No avatar and no AI badge.
 */
export const Bar = () => (
  <CompassHead>
    <CompassGrab title="Drag to dismiss" />
    <Text step="label">Compass</Text>
    <Grow />
  </CompassHead>
);

export const WithClose = () => (
  <CompassHead>
    <CompassGrab title="Drag to dismiss" />
    <Text step="label">Compass</Text>
    <Grow />
    <Pill>Chrome only</Pill>
    <Button kind="ghost" size="sm">
      Close
    </Button>
  </CompassHead>
);
