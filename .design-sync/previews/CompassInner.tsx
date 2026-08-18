import * as React from "react";
import {
  CompassGrab,
  CompassHead,
  CompassInner,
  CompassNote,
  CompassThread,
  CompassTurn,
  Grow,
  Text,
} from "@empressaio/smartcity-kit";

/**
 * The sheet interior. An empty inner is a blank card, so the shipped head
 * and thread sit inside it.
 */
export const WithHead = () => (
  <CompassInner>
    <CompassHead>
      <CompassGrab title="Drag to dismiss" />
      <Text step="label">Compass</Text>
      <Grow />
    </CompassHead>
  </CompassInner>
);

export const Thread = () => (
  <CompassInner>
    <CompassThread>
      <CompassTurn>Compass follows the current city and lens.</CompassTurn>
      <CompassNote>The sheet is chrome until the answer engine is built.</CompassNote>
    </CompassThread>
  </CompassInner>
);
