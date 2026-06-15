import styled from 'styled-components';

import { theme } from '@package/ui';

import type { PartnerType } from './types';

// Partner Card Styles
export const StyledPartnerCardImage = styled.div`
  width: 100%;
  height: 180px;
  overflow: hidden;
  background-color: ${theme.colors.neutral[200]};
  position: relative;
`;

export const StyledPartnerRating = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 700;
  color: ${theme.colors.text.primary};
  background: ${theme.colors.neutral[100]};
  padding: 2px ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  flex-shrink: 0;
`;

// Tag color mapping based on partner type
const TAG_COLORS: Record<PartnerType, { bg: string; color: string }> = {
  trainer: {
    bg: theme.colors.accent.green.soft,
    color: theme.colors.accent.green.strong,
  },
  expert: {
    bg: theme.colors.accent.blue.soft,
    color: theme.colors.accent.blue.strong,
  },
  supplement: {
    bg: theme.colors.accent.magenta.soft,
    color: theme.colors.accent.magenta.strong,
  },
  clothing: {
    bg: theme.colors.accent.teal.soft,
    color: theme.colors.accent.teal.strong,
  },
  other: {
    bg: theme.colors.neutral[200],
    color: theme.colors.text.secondary,
  },
};

export const StyledPartnerTag = styled.span<{ $type: PartnerType }>`
  display: inline-flex;
  align-items: center;
  padding: 2px ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: 500;
  background-color: ${({ $type }) => TAG_COLORS[$type]?.bg || TAG_COLORS.other.bg};
  color: ${({ $type }) => TAG_COLORS[$type]?.color || TAG_COLORS.other.color};
  letter-spacing: 0.01em;
`;

export const StyledDescriptionText = styled.p`
  margin: 0;
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  font-weight: 400;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
