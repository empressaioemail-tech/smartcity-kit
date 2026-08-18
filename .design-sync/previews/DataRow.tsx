import * as React from "react";
import {
  DataBody,
  DataCell,
  DataHead,
  DataHeadCell,
  DataRow,
  DataTable,
  Pill,
  Text,
} from "@empressaio/smartcity-kit";

/**
 * A queue row opens a drawer; it never navigates away. One overdue row versus
 * the mixed queue so the card is about the row, not the table chrome.
 */
export const Overdue = () => (
  <DataTable caption="Generated permit case past due">
    <DataHead>
      <DataHeadCell>Case</DataHeadCell>
      <DataHeadCell>Subject</DataHeadCell>
      <DataHeadCell>Place</DataHeadCell>
      <DataHeadCell>Due</DataHeadCell>
      <DataHeadCell>Status</DataHeadCell>
    </DataHead>
    <DataBody>
      <DataRow>
        <DataCell cell="id">FIX-1014</DataCell>
        <DataCell cell="subject">Roof replacement</DataCell>
        <DataCell>Specimen Yard Block 7, Lot 28</DataCell>
        <DataCell>
          <Text step="data">17 days past due</Text>
        </DataCell>
        <DataCell>
          <Pill meaning="crit">Overdue</Pill>
        </DataCell>
      </DataRow>
    </DataBody>
  </DataTable>
);

export const Queue = () => (
  <DataTable caption="Generated permit cases in flight">
    <DataHead>
      <DataHeadCell>Case</DataHeadCell>
      <DataHeadCell>Subject</DataHeadCell>
      <DataHeadCell>Stage</DataHeadCell>
      <DataHeadCell>Status</DataHeadCell>
    </DataHead>
    <DataBody>
      <DataRow>
        <DataCell cell="id">FIX-1014</DataCell>
        <DataCell cell="subject">Roof replacement</DataCell>
        <DataCell>Revisions</DataCell>
        <DataCell>
          <Pill meaning="crit">Overdue</Pill>
        </DataCell>
      </DataRow>
      <DataRow>
        <DataCell cell="id">FIX-1070</DataCell>
        <DataCell cell="subject">Fence and retaining wall</DataCell>
        <DataCell>Review</DataCell>
        <DataCell>
          <Pill meaning="info">In review</Pill>
        </DataCell>
      </DataRow>
      <DataRow>
        <DataCell cell="id">FIX-1091</DataCell>
        <DataCell cell="subject">Sign permit</DataCell>
        <DataCell>Issuance</DataCell>
        <DataCell>
          <Pill meaning="ok">Ready to issue</Pill>
        </DataCell>
      </DataRow>
    </DataBody>
  </DataTable>
);
