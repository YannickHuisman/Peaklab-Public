import styled from 'styled-components';

import type { PartnerType } from '@package/api';
import { theme } from '@package/ui';

export const StyledDetailHero = styled.div`
  width: 100%;
  height: 260px;
  overflow: hidden;
  background: ${theme.colors.neutral[200]};
  border-radius: ${theme.borderRadius.lg};
  position: relative;

  @media (max-width: ${theme.breakpoints.sm}px) {
    height: 180px;
  }
`;

export const StyledDetailBadge = styled.span<{ $type: PartnerType }>`
  display: inline-flex;
  align-items: center;
  padding: 3px ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  background: ${theme.colors.neutral[100]};
  color: ${theme.colors.text.secondary};
`;

export const StyledRatingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xxs};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  background: ${theme.colors.neutral[100]};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
`;

export const StyledTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 500;
  background: ${theme.colors.background.app};
  color: ${theme.colors.text.secondary};
  border: 1px solid ${theme.colors.border.subtle};
`;

export const StyledInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

export const StyledSectionHeading = styled.h3`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 600;
  color: ${theme.colors.text.primary};
  margin: 0 0 ${theme.spacing.sm};
  padding-bottom: ${theme.spacing.xs};
  border-bottom: 1px solid ${theme.colors.border.subtle};
`;
