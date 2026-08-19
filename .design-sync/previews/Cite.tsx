import * as React from "react";
import { Cite } from "@empressaio/smartcity-kit";

/**
 * A citation of a city's own adopted code.
 *
 * Local ordinance carries no licensing constraint, so this is the form that may
 * link to full quoted text and the form that is safe as demo material. The em
 * marker is how a reader tells a local citation from a licensed one without
 * reading the corpus name.
 */
export const Local = () => (
  <>
    <Cite href="#s4" marker="local">
      Template UDC Section 5.3.2
    </Cite>
    <Cite href="#s4" marker="local">
      Template UDC Section 7.2.6
    </Cite>
  </>
);

export const Unmarked = () => <Cite href="#s4">Template UDC Section 5.4.1</Cite>;
