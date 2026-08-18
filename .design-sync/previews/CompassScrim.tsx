import * as React from "react";
import {
  Button,
  ColStack,
  CompassGrab,
  CompassHead,
  CompassInner,
  CompassScrim,
  CompassSheet,
  Grow,
  MountNote,
  Pill,
  Region,
  RegionBar,
  RegionCanvas,
  Text,
} from "@empressaio/smartcity-kit";

/**
 * The ground behind the presented sheet. A solo scrim is 0.34 canvas on a
 * canvas card, so Wash sits over the map region the product recedes. The rail
 * stack is the shipped height home; without it the canvas collapses and the
 * wash has nothing to recede. BehindSheet is the sibling pairing the gallery
 * already ships.
 */
export const Wash = () => (
  <>
    <ColStack rail>
      <Region>
        <RegionBar title="The city">
          <Text step="caption">SmartSite</Text>
        </RegionBar>
        <RegionCanvas>
          <MountNote>The city map mounts here.</MountNote>
        </RegionCanvas>
      </Region>
    </ColStack>
    <CompassScrim />
  </>
);

export const BehindSheet = () => (
  <>
    <CompassScrim />
    <CompassSheet>
      <CompassInner>
        <CompassHead>
          <CompassGrab title="Drag to dismiss" />
          <Text step="label">Compass</Text>
          <Grow />
          <Pill>Chrome only</Pill>
          <Button kind="ghost" size="sm">
            Close
          </Button>
        </CompassHead>
      </CompassInner>
    </CompassSheet>
  </>
);
