import * as React from "react";
import { CompassSource } from "@empressaio/smartcity-kit";

const compassIcon = (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6" />
    <path d="M10.4 5.6L9 9 5.6 10.4 7 7z" />
  </svg>
);

/**
 * The top-bar source control. The scope line is required: an assistant that
 * cannot say which city and which lens it is answering for is the failure
 * this shape exists to prevent. It is not a page and not a bubble.
 */
export const Closed = () => (
  <CompassSource scope="This city · Overview" aria-expanded="false" />
);

export const WithIcon = () => (
  <CompassSource scope="This city · Overview" aria-expanded="false">
    {compassIcon}
  </CompassSource>
);

export const Open = () => (
  <CompassSource scope="This city · Overview" aria-expanded="true">
    {compassIcon}
  </CompassSource>
);
