import { layoutStyles } from '@helpers/layoutUtils';
import styled, { css } from 'styled-components';

import { theme } from '@package/ui';

import type { CardTone, CardVariant, StyledCardProps } from './types';

// Helper to centralize how each tone looks – uses ONLY theme colors
const getToneColors = (tone: CardTone) => {
  // Default neutral card – solid white on light grey background
  if (tone === 'neutral') {
    return {
      bgSoft: theme.colors.background.raised, // #FFFFFF
      border: theme.colors.border.subtle, // light gray
      accentMain: theme.colors.primary, // lime, if you ever need it
      accentStrong: theme.colors.success.strong,
    };
  }

  // New: very light “subtle” grey tone – like the right two cards
  if (tone === 'subtle') {
    return {
      bgSoft: theme.colors.neutral[200], // #F9FAFB, almost white
      border: theme.colors.border.subtle, // light gray border
      accentMain: theme.colors.neutral[600], // for any small accents
      accentStrong: theme.colors.neutral[700],
    };
  }

  // Check semantic colors first (error, warning, info, success)
  const semanticColors = {
    error: theme.colors.error,
    warning: theme.colors.warning,
    info: theme.colors.info,
    success: theme.colors.success,
  } as const;

  if (tone in semanticColors) {
    const semantic = semanticColors[tone as keyof typeof semanticColors];

    return {
      bgSoft: semantic.soft,
      border: semantic.main,
      accentMain: semantic.main,
      accentStrong: semantic.strong,
    };
  }

  // Otherwise, check accent colors (orange, green, magenta, teal, blue, hero)
  const accentMap = theme.colors.accent as Record<
    string,
    { soft: string; main: string; strong: string }
  >;

  const accent = accentMap[tone];

  if (!accent) {
    // Fallback to neutral if tone is misconfigured
    return {
      bgSoft: theme.colors.background.raised,
      border: theme.colors.border.subtle,
      accentMain: theme.colors.primary,
      accentStrong: theme.colors.success.strong,
    };
  }

  return {
    bgSoft: accent.soft,
    border: accent.main,
    accentMain: accent.main,
    accentStrong: accent.strong,
  };
};

/**
 * SMALL – compact card with reduced padding
 */
const SMALL_CARD = css<StyledCardProps>`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.lg};
  ${({ $tone = 'neutral', $noShadow }) => {
    const tone = getToneColors($tone);
    const boxShadow = $noShadow ? 'none' : theme.shadows.md;

    return css`
      background-color: ${tone.bgSoft};
      border: none;
      box-shadow: ${boxShadow};
    `;
  }}
`;

/**
 * INTRO – hero cards like "Peak score"
 * - Supports $tone for different color gradients
 * - Supports $borderColor override
 */
const INTRO_CARD = css<StyledCardProps>`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.xl};
  color: ${theme.colors.text.inverse};
  ${({ $tone = 'hero', $noShadow }) => {
    const tone = getToneColors($tone);
    const boxShadow = $noShadow ? 'none' : theme.shadows.xl;

    return css`
      background: linear-gradient(180deg, ${tone.accentMain}, ${tone.bgSoft});
      border: none;
      box-shadow: ${boxShadow};
    `;
  }}
`;

/**
 * SECTION – big white panels (charts, feed container)
 * Supports $tone and $borderColor override
 */
const SECTION_CARD = css<StyledCardProps>`
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.xl};
  ${({ $tone = 'neutral', $noShadow }) => {
    const tone = getToneColors($tone);
    const boxShadow = $noShadow ? 'none' : theme.shadows.lg;

    return css`
      background-color: ${tone.bgSoft};
      border: none;
      box-shadow: ${boxShadow};
    `;
  }}
`;

/**
 * PILL – filter chips (Alles, Hormones, Heart, etc.)
 * Supports $tone, $active state, and $borderColor override
 */
const PILL_CARD = css<StyledCardProps>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: 0.2rem 0.9rem;
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: 500;

  ${({ $tone = 'neutral', $active, $noShadow }) => {
    const tone = getToneColors($tone);
    const boxShadow = $noShadow ? 'none' : theme.shadows.sm;

    if ($active) {
      return css`
        background-color: ${theme.colors.primary};
        color: ${theme.colors.neutral[800]};
        border: none;
        box-shadow: ${theme.shadows.md};
      `;
    }

    return css`
      background-color: ${tone.bgSoft};
      color: ${theme.colors.text.secondary};
      border: none;
      box-shadow: ${boxShadow};
    `;
  }}
`;

/**
 * NEUTRAL – default card variant
 * Supports $tone and $borderColor override
 */
const NEUTRAL_CARD = css<StyledCardProps>`
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.xl};
  ${({ $tone = 'neutral', $noShadow }) => {
    const tone = getToneColors($tone);
    const boxShadow = $noShadow ? 'none' : theme.shadows.lg;

    return css`
      background-color: ${tone.bgSoft};
      border: none;
      box-shadow: ${boxShadow};
    `;
  }}
`;

/**
 * StyledCard component
 */

// Variant map
const CARD_VARIANTS: Record<CardVariant, ReturnType<typeof css>> = {
  neutral: NEUTRAL_CARD,
  intro: INTRO_CARD,
  section: SECTION_CARD,
  pill: PILL_CARD,
  small: SMALL_CARD,
};

export const StyledCard = styled.div<StyledCardProps>`
  position: relative;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  color: ${theme.colors.text.primary};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition-property: background-color, color, box-shadow, transform, opacity, filter;
  transition-duration: ${theme.transitions.duration.normal};
  transition-timing-function: ease-out;

  ${({ $variant = 'neutral' }) => CARD_VARIANTS[$variant]}
  ${layoutStyles}

  ${({ $interactive }) =>
    $interactive &&
    css`
      cursor: pointer;

      &:hover {
        box-shadow: ${theme.shadows.xl};
        // transform: translateY(-1px);
      }

      &:active {
        box-shadow: ${theme.shadows.md};
        // transform: translateY(0);
      }
    `}
`;
