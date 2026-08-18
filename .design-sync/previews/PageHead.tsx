import * as React from "react";
import { Crumb, Lede, PageHead, Pill, TitleRow } from "@empressaio/smartcity-kit";

/**
 * The Overview page header, inlined from the shipped screen: city name, lens,
 * Empty pill, and the lede that refuses to count until a source reads.
 */
export const Overview = () => (
  <PageHead>
    <Crumb>
      <b>This city</b> <span>/</span> Overview
    </Crumb>
    <TitleRow>
      <h1>Overview</h1>
      <Pill>Empty</Pill>
    </TitleRow>
    <Lede>
      Where am I, what needs me, and what is missing. Nothing on this page is a count until a
      source reads.
    </Lede>
  </PageHead>
);

export const DevelopmentServices = () => (
  <PageHead>
    <Crumb>
      <b>This city</b> <span>/</span> <b>Development services</b> <span>/</span>{" "}
      <span>Pipeline</span>
    </Crumb>
    <TitleRow>
      <h1>Development services</h1>
      <Pill>Empty</Pill>
    </TitleRow>
  </PageHead>
);
