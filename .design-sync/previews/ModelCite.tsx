import * as React from "react";
import { ModelCite } from "@empressaio/smartcity-kit";

/**
 * The licensed form, and it has NO slot for body copy.
 *
 * That absence is the point. Licensed model-code text cannot leak into a
 * screenshot, an export or a PDF because the component that would carry it does
 * not exist. Do not reach for a variant with a description underneath, and do
 * not put the section text in a Panel beside it: the identifier and the heading
 * may travel beside our own analysis, the section body may not.
 *
 * The corpus line is the FULL canonical title. There is no compact form of this
 * chip at any density, including inside an applicability matrix.
 */
export const Licensed = () => (
  <ModelCite href="#s4" corpus="2018 International Building Code" section="Section 1004.5" />
);

export const InARow = () => (
  <>
    <ModelCite href="#s4" corpus="2018 International Building Code" section="Section 802.3" />
    <ModelCite href="#s4" corpus="2018 International Building Code" section="Section 1011.5" />
  </>
);
