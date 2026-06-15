import type { HeadingSize, HeadingVariant } from './styles';

export interface StyledHeadingProps {
  $size?: HeadingSize;
  $variant?: HeadingVariant;
  $weight?: 300 | 400 | 500 | 600 | 700 | 800;
  $align?: 'left' | 'center' | 'right';
  $color?: string;
}
