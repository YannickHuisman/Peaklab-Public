import type { LayoutProps } from '@helpers/layoutUtils';

import type { ButtonSize, ButtonVariant } from './styles';

export interface StyledButtonProps extends LayoutProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
}
