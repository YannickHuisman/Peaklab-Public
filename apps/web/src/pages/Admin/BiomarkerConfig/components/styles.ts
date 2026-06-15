import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${theme.typography.fontSize.sm};
`;

export const StyledTableHeader = styled.th`
  text-align: left;
  padding: ${theme.spacing.md};
  border-bottom: 2px solid ${theme.colors.border.subtle};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  white-space: nowrap;
`;

export const StyledTableCell = styled.td`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border.subtle};
  color: ${theme.colors.text.primary};

  &:last-child {
    text-align: right;
  }
`;

export const StyledModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex?.modal || 1000};
  padding: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.sm}px) {
    padding: ${theme.spacing.sm};
  }
`;

export const StyledModalContent = styled.div`
  background: ${theme.colors.background.default};
  border-radius: ${theme.borderRadius.lg};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: ${theme.shadows.xl};
`;

export const StyledModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.xl} ${theme.spacing.xl} ${theme.spacing.md};
  flex-shrink: 0;
  border-bottom: 1px solid ${theme.colors.border.subtle};
`;

export const StyledModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${theme.spacing.lg} ${theme.spacing.xl} ${theme.spacing.xl};
  -webkit-overflow-scrolling: touch;

  @media (max-width: ${theme.breakpoints.sm}px) {
    padding: ${theme.spacing.md};
  }
`;

export const StyledFormGrid = styled.div`
  display: grid;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

export const StyledFormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.sm}px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledLabel = styled.label`
  display: block;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.base};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.background.raised};
  border: 1px solid ${theme.colors.border.subtle};
  border-radius: ${theme.borderRadius.md};
  transition: border-color ${theme.transitions.duration.fast} ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.border.strong};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StyledCheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  user-select: none;

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  span {
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.primary};
  }
`;

export const StyledPanelsList = styled.div`
  border: 1px solid ${theme.colors.border.subtle};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  max-height: 200px;
  overflow-y: auto;
`;

export const StyledPanelCheckbox = styled.label`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.sm};
  cursor: pointer;
  border-radius: ${theme.borderRadius.sm};
  margin-bottom: ${theme.spacing.xxs};
  transition: background-color ${theme.transitions.duration.fast} ease;

  &:hover {
    background-color: ${theme.colors.neutral[100]};
  }

  input[type='checkbox'] {
    margin-right: ${theme.spacing.sm};
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

export const StyledPanelCheckboxName = styled.div`
  font-weight: 500;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
`;

export const StyledPanelCheckboxCode = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
`;
