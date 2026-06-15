import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledTableContainer = styled.div<{ $maxHeight?: string }>`
  display: flex;
  flex-direction: column;
  max-height: 100%;
  flex: 1 1 0;
  min-height: 0;
  position: relative;
  overflow-x: auto;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border.subtle};
  box-sizing: border-box;
`;

export const StyledLoaderOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
  pointer-events: none;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${theme.colors.background.raised};
  table-layout: auto;
  min-width: 600px;
`;

export const StyledTh = styled.th`
  text-align: left;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-weight: 600;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  background: ${theme.colors.background.default};
  border-bottom: 1px solid ${theme.colors.border.subtle};
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 2;
`;

export const StyledTd = styled.td`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  border-bottom: 1px solid ${theme.colors.neutral[100]};
`;
