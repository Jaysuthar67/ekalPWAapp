import React, { useEffect, useState } from 'react';
import {
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  createTableColumn,
} from '@fluentui/react-components';
import type { TableColumnDefinition } from '@fluentui/react-components';
import { getAllResponses } from '../services/db';
import surveys from '../data/surveys.json';

type ResponseItem = {
  survey: string;
  respondent: string;
  status: string;
  submittedDate: string;
  duration: string;
};

const columns: TableColumnDefinition<ResponseItem>[] = [
  createTableColumn<ResponseItem>({
    columnId: 'survey',
    compare: (a, b) => a.survey.localeCompare(b.survey),
    renderHeaderCell: () => 'Survey',
    renderCell: (item) => item.survey,
  }),
  createTableColumn<ResponseItem>({
    columnId: 'respondent',
    compare: (a, b) => a.respondent.localeCompare(b.respondent),
    renderHeaderCell: () => 'Respondent',
    renderCell: (item) => item.respondent,
  }),
  createTableColumn<ResponseItem>({
    columnId: 'status',
    compare: (a, b) => a.status.localeCompare(b.status),
    renderHeaderCell: () => 'Status',
    renderCell: (item) => item.status,
  }),
  createTableColumn<ResponseItem>({
    columnId: 'submittedDate',
    compare: (a, b) => a.submittedDate.localeCompare(b.submittedDate),
    renderHeaderCell: () => 'Submitted Date',
    renderCell: (item) => item.submittedDate,
  }),
  createTableColumn<ResponseItem>({
    columnId: 'duration',
    compare: (a, b) => a.duration.localeCompare(b.duration),
    renderHeaderCell: () => 'Duration',
    renderCell: (item) => item.duration,
  }),
];

export const ReportsPage: React.FC = () => {
  const [items, setItems] = useState<ResponseItem[]>([]);

  useEffect(() => {
    const fetchResponses = async () => {
      const responses = await getAllResponses();
      const surveyMap = new Map(surveys.map((s) => [s.id, s.title]));

      const formattedItems = responses.map((r, index) => ({
        survey: surveyMap.get(r.surveyId) || 'Unknown Survey',
        respondent: `User #${index + 1}`, // Fake data
        status: r.completed ? 'Completed' : 'Partial',
        submittedDate: new Date(r.submittedAt).toLocaleDateString(),
        duration: '5m 30s', // Fake data
      }));
      setItems(formattedItems);
    };

    fetchResponses();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Survey Reports</h2>
      <DataGrid items={items} columns={columns} sortable selectionMode="multiselect">
        <DataGridHeader>
          <DataGridRow>
            {(column) => (
              <DataGridHeaderCell key={column.columnId}>
                {column.renderHeaderCell()}
              </DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<ResponseItem>>
          {({ item, rowId }) => (
            <DataGridRow<ResponseItem> key={rowId}>
              {(column) => (
                <DataGridCell key={column.columnId}>
                  {column.renderCell(item)}
                </DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    </div>
  );
};
