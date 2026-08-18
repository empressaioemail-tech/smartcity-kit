import * as React from "react";
import { BrandCity, Seal, ShellTop } from "@empressaio/smartcity-kit";

/**
 * The city seal in the top bar. Two or three mono characters, never an
 * uploaded logo. Chrome is This city, not a held identity.
 */
export const Initials = () => <Seal>TC</Seal>;

export const BesideName = () => (
  <ShellTop>
    <Seal>TC</Seal>
    <BrandCity>This city</BrandCity>
  </ShellTop>
);
