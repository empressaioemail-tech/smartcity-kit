import * as React from "react";
import { NavItem, ShellNav } from "@empressaio/smartcity-kit";

/**
 * Navigation states the roster stays honest about: active Overview, a built
 * City item, Parks named and dim, Municipal court named and not interactive.
 */
export const Overview = () => (
  <ShellNav open>
    <NavItem active href="/?lens=city-manager" badge="Empty">
      Overview
    </NavItem>
  </ShellNav>
);

export const Connections = () => (
  <ShellNav open>
    <NavItem href="/?work=connections">Connections</NavItem>
  </ShellNav>
);

export const RosterAndUnbuilt = () => (
  <ShellNav open>
    <NavItem state="roster" href="/?lens=parks" badge="Not built">
      Parks
    </NavItem>
    <NavItem state="unbuilt" badge="Not built">
      Municipal court
    </NavItem>
  </ShellNav>
);
