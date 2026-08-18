import * as React from "react";
import { Button, RegionBar, Text } from "@empressaio/smartcity-kit";

/**
 * Mono label, caption, and the Expand / Full controls from the map region bar.
 * Asset map is the other shipped bar: caption only, no stage buttons.
 */
export const CityMap = () => (
  <RegionBar title="The city">
    <Text step="caption">SmartSite</Text>
    <Button kind="ghost" size="sm" data-stage-present="map">
      Expand
    </Button>
    <Button kind="ghost" size="sm" data-stage-max="map">
      Full
    </Button>
  </RegionBar>
);

export const AssetMap = () => (
  <RegionBar title="Asset map">
    <Text step="caption">City outline, no asset layer</Text>
  </RegionBar>
);
