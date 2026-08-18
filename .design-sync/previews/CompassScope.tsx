import * as React from "react";
import { CompassScope, EnvBadge, Prov } from "@empressaio/smartcity-kit";

/**
 * The mandatory scope line: which city, which lens. City chrome is "This
 * city". Demo is an environment badge, not an AI badge.
 */
export const CityLens = () => (
  <CompassScope>
    <Prov source="This city" detail="Overview" />
    <EnvBadge environment="demo">Demo</EnvBadge>
  </CompassScope>
);

export const City = () => (
  <CompassScope>
    <Prov source="This city" detail="Overview" />
  </CompassScope>
);
