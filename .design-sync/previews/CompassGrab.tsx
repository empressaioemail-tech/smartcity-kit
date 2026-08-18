import * as React from "react";
import { CompassGrab, CompassHead, Text } from "@empressaio/smartcity-kit";

/**
 * The drag affordance on the sheet head. A four-pixel bar, not a handle
 * graphic and not a mascot. Solo it is lost against the card; the product
 * home is CompassHead.
 */
export const Default = () => (
  <CompassHead>
    <CompassGrab />
    <Text step="label">Compass</Text>
  </CompassHead>
);

export const Titled = () => (
  <CompassHead>
    <CompassGrab title="Drag to dismiss" />
    <Text step="label">Compass</Text>
  </CompassHead>
);
