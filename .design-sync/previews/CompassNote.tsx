import * as React from "react";
import { CompassNote } from "@empressaio/smartcity-kit";

/**
 * A note about what the sheet cannot do. Quieter than a turn, on purpose.
 * No composer, no maximize, no generated answers.
 */
export const Chrome = () => (
  <CompassNote>The sheet is chrome until the answer engine is built.</CompassNote>
);

export const NoComposer = () => (
  <CompassNote>
    Answers are not generated on this card, so there is no maximize control and no composer. The
    sheet is chrome until the answer engine is built.
  </CompassNote>
);
