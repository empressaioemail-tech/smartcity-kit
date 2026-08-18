import * as React from "react";
import { Fill, PageHead, Pill, Text, TitleRow } from "@empressaio/smartcity-kit";

/**
 * The flexible gap inside a page-header title row. Fill only flexes under
 * .pagehead, so the gallery TitleRow is wrapped in PageHead the way the
 * shipped screen actually sits it.
 */
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

export const Overview = () => (
  <PageHead>
    <TitleRow>
      <h1>Overview</h1>
      <Pill>Empty</Pill>
      <Fill />
    </TitleRow>
  </PageHead>
);
