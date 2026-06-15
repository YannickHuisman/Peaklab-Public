import type { LayoutProps } from '@helpers/layoutUtils/layoutUtils';

import type { ParagraphSize, ParagraphVariant } from './styles';

export interface StyledParagraphProps extends LayoutProps {
  $size?: ParagraphSize;
  $variant?: ParagraphVariant;
  $weight?: 300 | 400 | 500 | 600 | 700;
  $align?: 'left' | 'center' | 'right';
  $color?: string;
  $allCaps?: boolean;
  $italic?: boolean;
  $whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';
}
