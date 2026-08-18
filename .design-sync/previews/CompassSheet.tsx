import * as React from "react";
import {
  Button,
  CompassGrab,
  CompassHead,
  CompassInner,
  CompassNote,
  CompassScope,
  CompassSheet,
  CompassThread,
  CompassTurn,
  EnvBadge,
  Grow,
  Pill,
  Prov,
  Text,
} from "@empressaio/smartcity-kit";

/**
 * Compass is a source control sheet, not a page and not an AI bubble. City
 * chrome is "This city". The pill on the sheet is "Chrome only". No avatar,
 * no mascot, no AI badge.
 */
export const Chrome = () => (
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
      <CompassScope>
        <Prov source="This city" detail="Overview" />
        <EnvBadge environment="demo">Demo</EnvBadge>
      </CompassScope>
      <CompassThread>
        <CompassTurn>
          Compass follows the current city and lens. It is a source control, not a page and not a
          route.
        </CompassTurn>
        <CompassNote>
          Answers are not generated on this card, so there is no maximize control and no composer.
          The sheet is chrome until the answer engine is built.
        </CompassNote>
      </CompassThread>
    </CompassInner>
  </CompassSheet>
);

export const Head = () => (
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
      <CompassScope>
        <Prov source="This city" detail="Overview" />
        <EnvBadge environment="demo">Demo</EnvBadge>
      </CompassScope>
    </CompassInner>
  </CompassSheet>
);
