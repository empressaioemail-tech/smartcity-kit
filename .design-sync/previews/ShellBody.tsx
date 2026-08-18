import * as React from "react";
import { NavGroup, NavItem, ShellBody, ShellMain, ShellNav, Text } from "@empressaio/smartcity-kit";

/**
 * The sidebar and main grid. Resting names the main column; NavOpen is the
 * sidebar the product toggles below the breakpoint.
 */
export const SidebarAndMain = () => (
  <ShellBody>
    <ShellNav>
      <NavGroup label="City">
        <NavItem href="/?work=connections">Connections</NavItem>
      </NavGroup>
    </ShellNav>
    <ShellMain>
      <Text step="caption">The main column. Page head and work surface nest here.</Text>
    </ShellMain>
  </ShellBody>
);

export const NavOpen = () => (
  <ShellBody>
    <ShellNav open>
      <NavGroup label="Lenses">
        <NavItem active href="/?lens=city-manager" badge="Empty">
          Overview
        </NavItem>
        <NavItem state="roster" href="/?lens=parks" badge="Not built">
          Parks
        </NavItem>
      </NavGroup>
      <NavGroup label="City">
        <NavItem href="/?work=connections">Connections</NavItem>
      </NavGroup>
    </ShellNav>
    <ShellMain>
      <Text step="caption">The main column sits behind the open sidebar.</Text>
    </ShellMain>
  </ShellBody>
);
