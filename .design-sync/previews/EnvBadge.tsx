import * as React from "react";
import { BrandCity, EnvBadge } from "@empressaio/smartcity-kit";

/**
 * The environment badge. Three identities must never render alike: demo takes
 * the warn wash, live and staging stay the dashed chrome.
 */
export const AllThree = () => (
  <>
    <EnvBadge environment="demo">Demo</EnvBadge>
    <EnvBadge environment="live">Live</EnvBadge>
    <EnvBadge environment="staging">Staging</EnvBadge>
  </>
);

export const BesideCity = () => (
  <>
    <BrandCity>This city</BrandCity>
    <EnvBadge environment="demo">Demo</EnvBadge>
  </>
);
