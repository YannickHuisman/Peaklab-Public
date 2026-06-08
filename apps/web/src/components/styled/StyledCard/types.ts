import type { LayoutProps } from '@helpers/layoutUtils';

// Variants – source of truth for Card styling
export const CARD_VARIANTS = {
  neutral: 'neutral', // default card (use with $tone for colored variants)
  intro: 'intro', // hero card (Peak Score) with gradient
  section: 'section', // large content panels with xl padding
  pill: 'pill', // chips / filters
  small: 'small', // compact card with reduced padding
} as const;

export type CardVariant = keyof typeof CARD_VARIANTS;

// Tones – derived from theme.colors.accent + neutral + semantic colors
export const CARD_TONES = {
  neutral: 'neutral',
  subtle: 'subtle',
  orange: 'orange',
  green: 'green',
  magenta: 'magenta',
  teal: 'teal',
  blue: 'blue',
  hero: 'hero',
  error: 'error',
  warning: 'warning',
  info: 'info',
  success: 'success',
} as const;

export type CardTone = keyof typeof CARD_TONES;

// Base props used by StyledCard and Card
export interface StyledCardProps extends LayoutProps {
  $variant?: CardVariant;
  $tone?: CardTone;
  $interactive?: boolean;
  $fullWidth?: boolean;
  $active?: boolean; // pills
  $borderColor?: string;
  $noBorder?: boolean;
  $showBorder?: boolean;
  $noShadow?: boolean;
}
