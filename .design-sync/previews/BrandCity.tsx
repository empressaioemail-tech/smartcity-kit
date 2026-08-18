import * as React from "react";
import { BrandCity, EnvBadge, Seal, ShellTop } from "@empressaio/smartcity-kit";

/**
 * City name in the top bar. The only product identity in the chrome, and it
 * is This city rather than a held pack name.
 */
export const Name = () => <BrandCity>This city</BrandCity>;

export const InChrome = () => (
  <ShellTop>
    <Seal>TC</Seal>
    <BrandCity>This city</BrandCity>
    <EnvBadge environment="demo">Demo</EnvBadge>
  </ShellTop>
);
