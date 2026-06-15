import { Button } from '@components/Button';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledResultsHeader = styled(FlexRow)`
  justify-content: space-between;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
`;

export const StyledSaveButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xxs};
`;

export const StyledEmptyState = styled.div`
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.text.secondary};
  background: ${theme.colors.background.raised};
  border-radius: ${theme.borderRadius.md};
`;

export const StyledCategoriesContainer = styled(FlexColumn)`
  gap: ${theme.spacing.lg};
`;

export const StyledCategorySection = styled.div``;

export const StyledBiomarkerCard = styled.div<{ $hasValue: boolean }>`
  padding: ${theme.spacing.md};
  background: ${theme.colors.background.raised};
  border: 2px solid
    ${(props) => (props.$hasValue ? theme.colors.success.main : theme.colors.border.subtle)};
  border-radius: ${theme.borderRadius.md};
`;

export const StyledBiomarkerHeader = styled(FlexRow)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xxs};
`;

export const StyledAutofillButton = styled.button`
  padding: ${theme.spacing.xxs} ${theme.spacing.sm};
  border: none;
  background: ${theme.colors.info.soft};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${theme.typography.fontSize.sm};
  transition: all ${theme.transitions.duration.normal};

  &:hover {
    background: ${theme.colors.accent.blue.soft};
  }
`;

export const StyledInputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 80px;
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.sm}px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledInput = styled.input`
  padding: ${theme.spacing.xxs} ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border.strong};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.background.raised};
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.blue.main};
    box-shadow: 0 0 0 2px ${theme.colors.accent.blue.soft};
  }
`;

export const StyledFlagSelect = styled.select`
  padding: ${theme.spacing.xxs} ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border.strong};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  background: ${theme.colors.background.raised};
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent.blue.main};
    box-shadow: 0 0 0 2px ${theme.colors.accent.blue.soft};
  }
`;

export const StyledExistingBadge = styled.div`
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.xxs} ${theme.spacing.sm};
  background: ${theme.colors.success.soft};
  color: ${theme.colors.success.strong};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 500;
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xxs};
`;

export const StyledPanelBadge = styled.span`
  display: inline-block;
  padding: 1px 6px;
  background: ${theme.colors.accent.blue.soft};
  color: ${theme.colors.accent.blue.main};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 600;
  border-radius: ${theme.borderRadius.sm};
  margin-left: ${theme.spacing.xxs};
`;
