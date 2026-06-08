import styled, { css } from 'styled-components';

import { theme } from '@package/ui';

export const StyledStepperContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${theme.spacing.lg} 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledStep = styled.div<{ $active?: boolean; $completed?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.xs};
  min-width: 70px;
`;

export const StyledStepCircle = styled.div<{
  $active?: boolean;
  $completed?: boolean;
  $clickable?: boolean;
}>`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 600;
  transition: all ${theme.transitions.duration.fast} ease;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  ${({ $active, $completed }) => {
    if ($completed) {
      return css`
        background-color: ${theme.colors.primary};
        color: ${theme.colors.text.primary};
      `;
    }
    if ($active) {
      return css`
        background-color: ${theme.colors.primary};
        color: ${theme.colors.text.primary};
      `;
    }

    return css`
      background-color: ${theme.colors.neutral[200]};
      color: ${theme.colors.text.muted};
    `;
  }}

  ${({ $clickable }) =>
    $clickable &&
    css`
      &:hover {
        transform: scale(1.1);
        box-shadow: ${theme.shadows.md};
      }
    `}
`;

export const StyledStepLabel = styled.span<{ $active?: boolean; $completed?: boolean }>`
  font-size: ${theme.typography.fontSize.xs};
  color: ${({ $active, $completed }) =>
    $active || $completed ? theme.colors.text.primary : theme.colors.text.muted};
  text-align: center;
  white-space: nowrap;
`;

export const StyledStepConnector = styled.div<{ $completed?: boolean }>`
  flex: 1;
  height: 2px;
  background-color: ${({ $completed }) =>
    $completed ? theme.colors.primary : theme.colors.neutral[300]};
  align-self: flex-start;
  margin-top: 15px;
`;

export const StyledOptionCard = styled.button<{ $selected?: boolean; $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  // padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  border: none;
  background-color: ${theme.colors.background.raised};
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast} ease;
  min-width: 100px;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  box-shadow: ${theme.shadows.sm};

  ${({ $selected }) =>
    $selected
      ? css`
          background-color: ${theme.colors.primarySoft};
          box-shadow: ${theme.shadows.md};
        `
      : css`
          &:hover {
            box-shadow: ${theme.shadows.md};
          }
        `}
`;

export const StyledToggleOption = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  // height: 48px;
  height: ${theme.spacing['2xl']};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  border: none;
  cursor: pointer;
  transition: all ${theme.transitions.duration.fast} ease;

  ${({ $selected }) =>
    $selected
      ? css`
          background-color: ${theme.colors.primarySoft};
        `
      : css`
          background-color: ${theme.colors.background.raised};
          &:hover {
            background-color: ${theme.colors.neutral[200]};
          }
        `}
`;

export const StyledToggleBadge = styled.span`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.text.primary};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 500;
`;

export const StyledFrequencyOption = styled.button<{ $selected?: boolean }>`
  flex: 1;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: none;
  cursor: pointer;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 500;
  transition: all ${theme.transitions.duration.fast} ease;

  ${({ $selected }) =>
    $selected
      ? css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text.primary};
        `
      : css`
          background-color: ${theme.colors.neutral[200]};
          color: ${theme.colors.text.secondary};
          &:hover {
            background-color: ${theme.colors.neutral[300]};
          }
        `}
`;

export const StyledGoalIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  background-color: ${theme.colors.primarySoft};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.primary};
`;

export const StyledGoalRequired = styled.span`
  color: ${theme.colors.error.strong};
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.border.subtle};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.base};
  font-family: inherit;
  color: ${theme.colors.text.primary};
  background-color: ${theme.colors.background.raised};
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.border.strong};
  }

  &::placeholder {
    color: ${theme.colors.text.muted};
  }
`;

export const StyledGoalsOverview = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.primarySoft};
  border-radius: ${theme.borderRadius.lg};
`;

export const StyledGoalsOverviewTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 600;
  color: ${theme.colors.text.primary};
`;

export const StyledGoalsOverviewItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};

  &::before {
    content: '\2713';
    color: ${theme.colors.success.main};
  }
`;

export const StyledLimitationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${theme.colors.text.secondary};
`;

export const StyledFocusCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.primarySoft};
  border-radius: ${theme.borderRadius.xl};
`;

export const StyledFocusItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};

  &::before {
    content: '\2713';
    color: ${theme.colors.success.main};
  }
`;

export const StyledWarning = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.warning.soft};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.warning.strong};
`;
