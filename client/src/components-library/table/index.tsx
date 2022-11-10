import React, { ReactNode } from 'react';
import { TableWrapper, TableWithBorder, TR } from './table.styles';

interface Row {
  [key: string]: ReactNode;
}

interface TableProps {
  columns: string[];
  rows: Row[];
  handleRowClick?: any;
}

export const Table = ({ columns, rows, handleRowClick }: TableProps) => {
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
            <TR
              key={i}
              onClick={() => handleRowClick(row)}
              handleRowClick={!!handleRowClick}
            >
              {columns.map((column, j) => (
                <td key={j}>{row[column as keyof typeof row]}</td>
              ))}
            </TR>
          ))}
        </tbody>
      </TableWrapper>
    </TableWithBorder>
  );
};
