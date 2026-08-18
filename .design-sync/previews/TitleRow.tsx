import * as React from "react";
import { Fill, PageHead, Pill, Text, TitleRow } from "@empressaio/smartcity-kit";

/**
 * Title-row type and fill live under the page header, so the row is shown in
 * that home. Overview is the quiet Empty pill; Plan review is the Preview
 * treatment with the console caption.
 */
export const Overview = () => (
  <PageHead>
    <TitleRow>
      <h1>Overview</h1>
      <Pill>Empty</Pill>
    </TitleRow>
  </PageHead>
);

export const PlanReview = () => (
  <PageHead>
    <TitleRow>
      <h1>Plan review</h1>
      <Pill meaning="restricted">Preview</Pill>
      <Fill />
      <Text step="caption">Same console as Development services, Review</Text>
    </TitleRow>
  </PageHead>
);
