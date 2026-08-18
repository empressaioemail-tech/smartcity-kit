import * as React from "react";
import {
  Button,
  ColStack,
  Grow,
  MountNote,
  Prov,
  Region,
  RegionBar,
  RegionCanvas,
  RegionFoot,
  Text,
} from "@empressaio/smartcity-kit";

/**
 * A region is bar, canvas, and footer together. The rail stack is the shipped
 * home that gives the map a height; empty canvas is a mount note, not a blank.
 */
export const CityMap = () => (
  <ColStack rail>
    <Region>
      <RegionBar title="The city">
        <Text step="caption">SmartSite</Text>
        <Button kind="ghost" size="sm" data-stage-present="map">
          Expand
        </Button>
        <Button kind="ghost" size="sm" data-stage-max="map">
          Full
        </Button>
      </RegionBar>
      <RegionCanvas data-stage="map">
        <MountNote>The city map mounts here.</MountNote>
      </RegionCanvas>
      <RegionFoot>
        <Text step="data">48021:34137</Text>
        <Text step="caption">Demo fixture</Text>
        <Grow />
        <Prov source="Public record" />
      </RegionFoot>
    </Region>
  </ColStack>
);

export const Review = () => (
  <ColStack rail>
    <Region>
      <RegionBar title="Review">
        <Text step="caption">Plan Review, mounted at city altitude</Text>
        <Button kind="ghost" size="sm" data-stage-max="review">
          Full
        </Button>
      </RegionBar>
      <RegionCanvas ground="doc" data-stage="review">
        <MountNote>The review console mounts here.</MountNote>
      </RegionCanvas>
      <RegionFoot>
        <Text step="caption">
          Native compose is a later card. This tab mounts the same console as Work, Plan review.
        </Text>
      </RegionFoot>
    </Region>
  </ColStack>
);
