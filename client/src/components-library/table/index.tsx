import React, { ReactNode } from 'react';
import { TableWrapper, TableWithBorder } from './table.styles';

interface Comlumn {
  [key: string]: ReactNode;
}

interface TableProps {
  columns: string[];
  rows: Comlumn[];
}

export const Table = ({ columns, rows }: TableProps) => {
  return (
    <TableWithBorder>
      <TableWrapper>
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i}>{column}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((column, j) => (
                <td key={j}>{row[column as keyof typeof row]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </TableWrapper>
    </TableWithBorder>
  );
};
