import * as React from "react";
import { Crumb } from "@empressaio/smartcity-kit";

/**
 * Bold segments name a subject. The Overview crumb is city then lens; Development
 * services adds the active tab after the second slash.
 */
export const Overview = () => (
  <Crumb>
    <b>This city</b> <span>/</span> Overview
  </Crumb>
);

export const DevelopmentServices = () => (
  <Crumb>
    <b>This city</b> <span>/</span> <b>Development services</b> <span>/</span>{" "}
    <span>Pipeline</span>
  </Crumb>
);
