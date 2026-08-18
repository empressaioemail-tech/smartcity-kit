import * as React from "react";
import { NavGroup, NavItem, ShellNav } from "@empressaio/smartcity-kit";

/**
 * A labeled cluster in the primary sidebar. City is the gallery group;
 * Lenses is Overview active and Parks on the roster.
 */
export const City = () => (
  <ShellNav open>
    <NavGroup label="City">
      <NavItem href="/?work=assets" badge="Empty">
        Assets
      </NavItem>
      <NavItem href="/?work=connections">Connections</NavItem>
      <NavItem state="roster" href="/?work=people" badge="Not built">
        People and access
      </NavItem>
    </NavGroup>
  </ShellNav>
);

export const Lenses = () => (
  <ShellNav open>
    <NavGroup label="Lenses">
      <NavItem active href="/?lens=city-manager" badge="Empty">
        Overview
      </NavItem>
      <NavItem state="roster" href="/?lens=parks" badge="Not built">
        Parks
      </NavItem>
    </NavGroup>
  </ShellNav>
);
