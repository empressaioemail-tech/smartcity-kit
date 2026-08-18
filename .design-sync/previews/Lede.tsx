import * as React from "react";
import { Lede, PageHead, Pill, TitleRow } from "@empressaio/smartcity-kit";

/**
 * The lede is a page-header sentence. Overview asks where you are; Finance
 * refuses four zeros in a header.
 */
export const Overview = () => (
  <PageHead>
    <TitleRow>
      <h1>Overview</h1>
      <Pill>Empty</Pill>
    </TitleRow>
    <Lede>Where am I, what needs me, and what is missing.</Lede>
  </PageHead>
);

export const Finance = () => (
  <PageHead>
    <TitleRow>
      <h1>Finance</h1>
      <Pill>Empty</Pill>
    </TitleRow>
    <Lede>No metric strip on this lens. Four zeros in a header would be four false claims.</Lede>
  </PageHead>
);
