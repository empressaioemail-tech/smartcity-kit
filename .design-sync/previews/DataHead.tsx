import * as React from "react";
import {
  DataBody,
  DataCell,
  DataHead,
  DataHeadCell,
  DataRow,
  DataTable,
  Pill,
} from "@empressaio/smartcity-kit";

/**
 * The head row is the product's fixed column order: identifier, subject, then
 * the rest, status last. Uppercase tracking lives on the `th`, not on a prop.
 */
export const ColumnOrder = () => (
  <DataTable caption="Generated permit cases in flight">
    <DataHead>
      <DataHeadCell>Case</DataHeadCell>
      <DataHeadCell>Subject</DataHeadCell>
      <DataHeadCell>Stage</DataHeadCell>
      <DataHeadCell>Place</DataHeadCell>
      <DataHeadCell>Due</DataHeadCell>
      <DataHeadCell>Status</DataHeadCell>
    </DataHead>
    <DataBody>
      <DataRow>
        <DataCell cell="id">FIX-1014</DataCell>
        <DataCell cell="subject">Roof replacement</DataCell>
        <DataCell>Revisions</DataCell>
        <DataCell>Specimen Yard Block 7, Lot 28</DataCell>
        <DataCell>17 days past due</DataCell>
        <DataCell>
          <Pill meaning="crit">Overdue</Pill>
        </DataCell>
      </DataRow>
      <DataRow>
        <DataCell cell="id">FIX-1070</DataCell>
        <DataCell cell="subject">Fence and retaining wall</DataCell>
        <DataCell>Review</DataCell>
        <DataCell>Example Crossing Block 3, Lot 22</DataCell>
        <DataCell>due in 4 days</DataCell>
        <DataCell>
          <Pill meaning="info">In review</Pill>
        </DataCell>
      </DataRow>
    </DataBody>
  </DataTable>
);

export const IdentifierFirst = () => (
  <DataTable caption="Generated permit cases, identifier first">
    <DataHead>
      <DataHeadCell>Case</DataHeadCell>
      <DataHeadCell>Subject</DataHeadCell>
      <DataHeadCell>Status</DataHeadCell>
    </DataHead>
    <DataBody>
      <DataRow>
        <DataCell cell="id">FIX-1035</DataCell>
        <DataCell cell="subject">Residential solar array</DataCell>
        <DataCell>
          <Pill meaning="warn">Awaiting applicant</Pill>
        </DataCell>
      </DataRow>
    </DataBody>
  </DataTable>
);
