import React, { useMemo } from 'react';

import { Loader } from '@components/Loader';

import {
  StyledLoaderOverlay,
  StyledTable,
  StyledTableContainer,
  StyledTd,
  StyledTh,
} from './styles';

export interface Column<RowType = unknown> {
  id: string;
  header: React.ReactNode;
  cell: (row: RowType) => React.ReactNode;
  width?: string;
}

interface DataTableProps<RowType = unknown> {
  columns: Column<RowType>[];
  data: RowType[];
  isLoading?: boolean;
  rowKey?: (row: RowType) => string;
  minWidth?: string;
}

export function DataTable<RowType = unknown>({
  columns,
  data,
  isLoading,
  rowKey,
  minWidth,
}: DataTableProps<RowType>) {
  const hideData = useMemo(() => isLoading || data.length === 0, [isLoading, data]);

  return (
    <StyledTableContainer>
      <StyledTable style={minWidth ? { minWidth } : undefined}>
        <thead>
          <tr>
            {columns.map((col) => (
              <StyledTh key={col.id} style={{ width: col.width }}>
                {col.header}
              </StyledTh>
            ))}
          </tr>
        </thead>
        <tbody>
          {!hideData &&
            data.map((row, idx) => (
              <tr key={rowKey ? rowKey(row) : idx}>
                {columns.map((col) => (
                  <StyledTd key={col.id}>{col.cell(row)}</StyledTd>
                ))}
              </tr>
            ))}
        </tbody>
      </StyledTable>
      {hideData && (
        <StyledLoaderOverlay>
          {isLoading && <Loader />}
          {!isLoading && 'No data'}
        </StyledLoaderOverlay>
      )}
    </StyledTableContainer>
  );
}
