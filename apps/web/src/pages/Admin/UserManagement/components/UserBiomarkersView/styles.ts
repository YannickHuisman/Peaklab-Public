import { FlexColumn, FlexRow } from '@components/styled/layout';
import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledContainer = styled(FlexColumn)`
  gap: ${theme.spacing.md};
`;

export const StyledHeader = styled(FlexColumn)`
  gap: ${theme.spacing.sm};
`;

export const StyledCategoryFilter = styled(FlexRow)`
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;
`;

export const StyledFilterButton = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.xxs} ${theme.spacing.sm};
  border: 1px solid
    ${(props) => (props.$active ? theme.colors.accent.blue.main : theme.colors.border.strong)};
  background: ${(props) =>
    props.$active ? theme.colors.info.soft : theme.colors.background.raised};
  color: ${(props) =>
    props.$active ? theme.colors.accent.blue.main : theme.colors.text.secondary};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 500;
  cursor: pointer;
  transition: all ${theme.transitions.duration.normal};

  &:hover {
    border-color: ${theme.colors.accent.blue.main};
    background: ${theme.colors.info.soft};
    color: ${theme.colors.accent.blue.main};
  }
`;

export const StyledEmptyState = styled.div`
  padding: ${theme.spacing['2xl']};
  text-align: center;
  color: ${theme.colors.text.secondary};
  background: ${theme.colors.background.default};
  border-radius: ${theme.borderRadius.md};
  border: 1px dashed ${theme.colors.border.strong};
`;

export const StyledBiomarkerHeader = styled(FlexRow)`
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.xxs};
`;

export const StyledCategoryBadge = styled.span`
  padding: ${theme.spacing.xxs} ${theme.spacing.sm};
  background: ${theme.colors.neutral[100]};
  color: ${theme.colors.text.secondary};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 500;
`;

export const StyledLatestValue = styled.div`
  padding: ${theme.spacing.sm};
  background: ${theme.colors.background.default};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: ${theme.spacing.sm};
`;

export const StyledFlagBadge = styled.span<{ $flag: string | null }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xxs};
  padding: ${theme.spacing.xxs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 500;
  background: ${(props) => {
    switch (props.$flag) {
      case 'H':
        return theme.colors.error.soft;
      case 'L':
        return theme.colors.warning.soft;
      case 'N':
        return theme.colors.success.soft;
      default:
        return theme.colors.neutral[100];
    }
  }};
  color: ${(props) => {
    switch (props.$flag) {
      case 'H':
        return theme.colors.error.strong;
      case 'L':
        return theme.colors.warning.strong;
      case 'N':
        return theme.colors.success.strong;
      default:
        return theme.colors.text.secondary;
    }
  }};
`;

export const StyledResultsHistory = styled.div`
  border-top: 1px solid ${theme.colors.border.subtle};
  padding-top: ${theme.spacing.sm};
`;

export const StyledHistoryItem = styled(FlexRow)`
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.xxs} 0;
  font-size: ${theme.typography.fontSize.xs};
`;

export const StyledHistoryFlag = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xxs};
  color: ${(props) => props.$color};
  font-weight: 500;
`;
