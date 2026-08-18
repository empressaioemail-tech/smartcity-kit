import * as React from "react";
import { CompassTurn } from "@empressaio/smartcity-kit";

/**
 * One turn in the thread. Compass follows the current city and lens. It is
 * a source control, not a page and not a route.
 */
export const Follows = () => (
  <CompassTurn>Compass follows the current city and lens.</CompassTurn>
);

export const NotAPage = () => (
  <CompassTurn>
    Compass follows the current city and lens. It is a source control, not a page and not a route.
  </CompassTurn>
);
