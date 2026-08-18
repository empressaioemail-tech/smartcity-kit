import * as React from "react";
import { Text } from "@empressaio/smartcity-kit";

/**
 * The three type steps the stylesheet ships. Label is the roster-note step,
 * caption is panel metadata, data is the parcel identifier in a region footer.
 */
export const Label = () => <Text step="label">Jobs waiting on this lens</Text>;

export const Caption = () => <Text step="caption">Decision queue</Text>;

export const Data = () => <Text step="data">48021:34137</Text>;
