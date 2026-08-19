import * as React from "react";
import { Grow, MatrixGroup, Text } from "@empressaio/smartcity-kit";

/**
 * The corpus header. It prints the FULL canonical title once, which is how the
 * matrix stays dense without ever printing an abbreviation on its own. There is
 * no compact form at any density.
 *
 * The licence badge is required, because the licensing posture of a corpus
 * decides what may be rendered from it. A city adopted code is the safe demo
 * material; licensed model code may show a section identifier and heading
 * beside our analysis and may never show the section body.
 */
export const TwoCorpora = () => (
  <>
    <MatrixGroup corpus="Template Unified Development Code" licence="Local, adopted 2024" />
    <MatrixGroup corpus="2018 International Building Code" licence="Licensed, citation only" />
  </>
);

/** With a trailing section count, which composes Grow and Text and needs no
 *  rule of its own. */
export const WithACount = () => (
  <MatrixGroup corpus="Template Unified Development Code" licence="Local, adopted 2024">
    <Grow />
    <Text step="caption">28 sections</Text>
  </MatrixGroup>
);
