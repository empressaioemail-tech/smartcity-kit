import * as React from "react";
import { CompassNote, CompassThread, CompassTurn } from "@empressaio/smartcity-kit";

/**
 * The thread inside the sheet. Compass is a source control, not a chat
 * transcript: one turn states the follow, one note states the chrome limit.
 */
export const Chrome = () => (
  <CompassThread>
    <CompassTurn>Compass follows the current city and lens.</CompassTurn>
    <CompassNote>The sheet is chrome until the answer engine is built.</CompassNote>
  </CompassThread>
);

export const Turn = () => (
  <CompassThread>
    <CompassTurn>Compass follows the current city and lens.</CompassTurn>
  </CompassThread>
);
