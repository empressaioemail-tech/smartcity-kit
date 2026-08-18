import * as React from "react";
import { BrandCity, EnvBadge, MenuButton, Seal, ShellTop } from "@empressaio/smartcity-kit";

/**
 * The narrow-viewport navigation toggle in the top bar. The stylesheet hides
 * it above 900px; the composition is still the shipped chrome, not a lone
 * invisible node.
 */
export const Toggle = () => <MenuButton aria-label="Open menu" />;

export const InTopBar = () => (
  <ShellTop>
    <MenuButton aria-label="Open menu" />
    <Seal>TC</Seal>
    <BrandCity>This city</BrandCity>
    <EnvBadge environment="demo">Demo</EnvBadge>
  </ShellTop>
);
