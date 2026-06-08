import styled from 'styled-components';

import { theme } from '@package/ui';

import type { StyledHeadingProps } from './types';

const HEADING_SIZES = {
  xsmall: `${theme.typography.fontSize.lg}`,
  small: `${theme.typography.fontSize.xl}`,
  medium: `${theme.typography.fontSize['2xl']}`,
  large: `${theme.typography.fontSize['3xl']}`,
  xlarge: `${theme.typography.fontSize['4xl']}`,
  xxlarge: `${theme.typography.fontSize['5xl']}`,
  xxxlarge: `${theme.typography.fontSize['6xl']}`,
} as const;

const VARIANTS = {
  primary: theme.colors.text.primary,
  secondary: theme.colors.text.secondary,
  tertiary: theme.colors.text.muted,
  inverse: theme.colors.text.inverse,
};

export type HeadingSize = keyof typeof HEADING_SIZES;
export type HeadingVariant = keyof typeof VARIANTS;

export const StyledHeading = styled.h1<StyledHeadingProps>`
  margin: 0;
  font-size: ${(props) => HEADING_SIZES[props.$size || 'medium']};
  font-weight: ${(props) => props.$weight || 600};
  text-align: ${(props) => props.$align || 'left'};

  color: ${(props) => {
    if (props.$color) return props.$color;
    if (props.$variant) return VARIANTS[props.$variant];

    return VARIANTS['primary'];
  }};
`;
