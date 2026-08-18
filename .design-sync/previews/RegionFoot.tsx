import * as React from "react";
import { Grow, Prov, RegionFoot, Text } from "@empressaio/smartcity-kit";

/**
 * Selection detail lives in the footer, never over the canvas. The parcel id
 * is the demo fixture identifier; the caption says so.
 */
export const DemoFixture = () => (
  <RegionFoot>
    <Text step="data">48021:34137</Text>
    <Text step="caption">Demo fixture</Text>
    <Grow />
    <Prov source="Public record" />
  </RegionFoot>
);

export const ReviewCaption = () => (
  <RegionFoot>
    <Text step="caption">
      Native compose is a later card. This tab mounts the same console as Work, Plan review.
    </Text>
  </RegionFoot>
);
