import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledProfileHeader = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-direction: ${({ $isMobile }) => ($isMobile ? 'column' : 'row')};
  align-items: ${({ $isMobile }) => ($isMobile ? 'center' : 'center')};
  gap: ${theme.spacing.xl};
`;

export const StyledProfileHeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  flex: 1;
  min-width: 0;
`;

export const StyledAvatar = styled.div`
  width: 110px;
  height: 110px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.neutral[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid ${theme.colors.border.subtle};
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color ${theme.transitions.duration.fast} ease;
`;

export const StyledAvatarOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.full};
  opacity: 0;
  transition: opacity ${theme.transitions.duration.fast} ease;

  ${StyledAvatar}:hover & {
    opacity: 1;
  }
`;

export const StyledAvatarModalPreview = styled.div`
  width: 180px;
  height: 180px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.neutral[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid ${theme.colors.border.subtle};
  margin: 0 auto;
`;

export const StyledFileInput = styled.input`
  display: none;
`;

export const StyledStatsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.lg};
`;

export const StyledStatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xxs};
`;

export const StyledStatusBadge = styled.span<{ $variant?: 'success' | 'warning' | 'info' }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xxs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 600;
  width: fit-content;

  ${({ $variant = 'info' }) => {
    const colorMap = {
      success: { bg: theme.colors.success.soft, text: theme.colors.success.strong },
      warning: { bg: theme.colors.warning.soft, text: theme.colors.warning.strong },
      info: { bg: theme.colors.info.soft, text: theme.colors.info.strong },
    };
    const c = colorMap[$variant];

    return `
      background: ${c.bg};
      color: ${c.text};
    `;
  }}
`;

export const StyledMessage = styled.div<{ $variant: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 500;

  ${({ $variant }) => {
    const colorMap = {
      success: { bg: theme.colors.success.soft, text: theme.colors.success.strong },
      error: { bg: theme.colors.error.soft, text: theme.colors.error.strong },
    };
    const c = colorMap[$variant];

    return `
      background: ${c.bg};
      color: ${c.text};
    `;
  }}
`;

export const StyledSectionTitleIcon = styled.div<{ $color?: string }>`
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.md};
  background: ${({ $color }) => $color ?? theme.colors.neutral[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const StyledViewField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xxs};
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 1px solid ${theme.colors.border.subtle};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;
