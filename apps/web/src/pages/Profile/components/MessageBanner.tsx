import { Icons } from '@components/Icons';

import { theme } from '@package/ui';

import { StyledMessage } from '../styles';

interface MessageBannerProps {
  type: 'success' | 'error';
  text: string;
}

const ICON_MAP = {
  success: { icon: Icons.Check, color: theme.colors.success.strong },
  error: { icon: Icons.AlertCircle, color: theme.colors.error.strong },
} as const;

export function MessageBanner({ type, text }: MessageBannerProps) {
  const { icon: Icon, color } = ICON_MAP[type];

  return (
    <StyledMessage $variant={type}>
      <Icon size="sm" color={color} />
      {text}
    </StyledMessage>
  );
}
