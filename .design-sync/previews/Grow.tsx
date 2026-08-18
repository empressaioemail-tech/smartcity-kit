import * as React from "react";
import {
  Button,
  CompassHead,
  Grow,
  Pill,
  Prov,
  RegionFoot,
  Text,
} from "@empressaio/smartcity-kit";

/**
 * The flexible gap between a title and its trailing controls. A lone Grow is
 * an invisible node, so these cells sit it in the compositions the gallery
 * names: the Compass sheet head and the region footer provenance line.
 */
export const Compass = () => (
  <CompassHead>
    <Text step="label">Compass</Text>
    <Grow />
    <Pill>Chrome only</Pill>
    <Button kind="ghost" size="sm">
      Close
    </Button>
  </CompassHead>
);

export const ParcelFoot = () => (
  <RegionFoot>
    <Text step="data">48021:34137</Text>
    <Text step="caption">Demo fixture</Text>
    <Grow />
    <Prov source="Public record" />
  </RegionFoot>
);
