import * as React from "react";
import { CitizenColumn, CitizenScroll, Pill, TitleRow } from "@empressaio/smartcity-kit";

/**
 * Citizen is a lens, scoped light inside a dark staff session. The scroll
 * ground paints its own canvas so the light subtree is a real theme, not a
 * wrapper around Theme.
 */
const nearYou = (
  <CitizenColumn>
    <div>
      <TitleRow>
        <h1>Near you</h1>
        <Pill meaning="restricted">Preview</Pill>
      </TitleRow>
      <p>
        See what is happening around an address in this city. Nothing here requires
        an account. This is a public lens, not a separate product.
      </p>
    </div>
  </CitizenColumn>
);

export const Light = () => <CitizenScroll>{nearYou}</CitizenScroll>;

export const Dark = () => <CitizenScroll theme="dark">{nearYou}</CitizenScroll>;
