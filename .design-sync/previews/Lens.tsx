import * as React from "react";
import { Crumb, Lede, Lens, PageHead, Pill, Text, TitleRow } from "@empressaio/smartcity-kit";

/**
 * Only the active lens renders. The inactive class is display:none, so both
 * cells are `.lens.on` with children taken from the shipped Overview and
 * roster nesting.
 */
export const Overview = () => (
  <Lens active>
    <PageHead>
      <Crumb>
        <b>This city</b> <span>/</span> Overview
      </Crumb>
      <TitleRow>
        <h1>Overview</h1>
        <Pill>Empty</Pill>
      </TitleRow>
      <Lede>Where am I, what needs me, and what is missing.</Lede>
    </PageHead>
    <Text step="caption">Every lens on the roster, and whether it read</Text>
  </Lens>
);

export const NotBuilt = () => (
  <Lens active>
    <PageHead>
      <Crumb>
        <b>This city</b> <span>/</span> Parks
      </Crumb>
      <TitleRow>
        <h1>Parks</h1>
        <Pill meaning="quiet">Not built</Pill>
      </TitleRow>
    </PageHead>
    <Text step="caption">no view designed for this lens</Text>
  </Lens>
);
