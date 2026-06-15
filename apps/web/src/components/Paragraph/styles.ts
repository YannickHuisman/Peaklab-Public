import { layoutStyles } from '@helpers/layoutUtils/layoutUtils';
import styled from 'styled-components';

import { theme } from '@package/ui';

import type { StyledParagraphProps } from './types';

const PARAGRAPH_SIZES = {
  // xsmall: '0.75rem',
  // small: '0.875rem',
  // medium: '1rem',
  // large: '1.125rem',
  xsmall: `${theme.typography.fontSize.xs}`,
  small: `${theme.typography.fontSize.sm}`,
  medium: `${theme.typography.fontSize.base}`,
  large: `${theme.typography.fontSize.lg}`,
} as const;

const VARIANTS = {
  primary: theme.colors.text.primary,
  secondary: theme.colors.text.secondary,
  tertiary: theme.colors.text.muted,
  inverse: theme.colors.text.inverse,
};

export type ParagraphSize = keyof typeof PARAGRAPH_SIZES;
export type ParagraphVariant = keyof typeof VARIANTS;

export const StyledParagraph = styled.p<StyledParagraphProps>`
  margin: 0;
  font-size: ${(props) => PARAGRAPH_SIZES[props.$size || 'medium']};
  text-align: ${(props) => props.$align || 'left'};
  font-weight: ${(props) => props.$weight || 500};
  line-height: 1.5;
  text-transform: ${(props) => (props.$allCaps ? 'uppercase' : 'none')};
  font-style: ${(props) => (props.$italic ? 'italic' : 'normal')};
  white-space: ${(props) => props.$whiteSpace || 'normal'};

  color: ${(props) => {
    if (props.$color) return props.$color;
    if (props.$variant) return VARIANTS[props.$variant];

    return VARIANTS['primary'];
  }};

  ${layoutStyles}
`;
