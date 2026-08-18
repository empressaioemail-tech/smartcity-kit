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
 * Each head cell is a column scope, not a style. Case is mono-bound in the
 * body; Status is last because colour lives only in the carrier, never in the
 * header.
 */
export const QueueColumns = () => (
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
        <DataCell cell="id">FIX-1091</DataCell>
        <DataCell cell="subject">Sign permit</DataCell>
        <DataCell>Issuance</DataCell>
        <DataCell>Template Commons Block 2, Lot 22</DataCell>
        <DataCell>due in 13 days</DataCell>
        <DataCell>
          <Pill meaning="ok">Ready to issue</Pill>
        </DataCell>
      </DataRow>
    </DataBody>
  </DataTable>
);

export const CaseAndStatus = () => (
  <DataTable caption="Generated permit cases, first and last columns">
    <DataHead>
      <DataHeadCell>Case</DataHeadCell>
      <DataHeadCell>Status</DataHeadCell>
    </DataHead>
    <DataBody>
      <DataRow>
        <DataCell cell="id">FIX-1070</DataCell>
        <DataCell>
          <Pill meaning="info">In review</Pill>
        </DataCell>
      </DataRow>
      <DataRow>
        <DataCell cell="id">FIX-1035</DataCell>
        <DataCell>
          <Pill meaning="warn">Awaiting applicant</Pill>
        </DataCell>
      </DataRow>
    </DataBody>
  </DataTable>
);
