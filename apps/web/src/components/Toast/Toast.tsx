import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import type { ToastVariant } from '@context/ToastProvider';

import { theme } from '@package/ui';

import { ToastBody, ToastClose, ToastItem } from './styles';

interface ToastProps {
  message: string;
  variant: ToastVariant;
  onDismiss: () => void;
}

const ICON_COLOR: Record<ToastVariant, string> = {
  error: theme.colors.error.strong,
  success: theme.colors.success.strong,
  info: theme.colors.text.primary,
};

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const color = ICON_COLOR[variant];

  if (variant === 'success') return <Icons.Check size={18} color={color} />;
  if (variant === 'info') return <Icons.Info size={18} color={color} />;

  return <Icons.AlertCircle size={18} color={color} />;
}

export function Toast({ message, variant, onDismiss }: ToastProps) {
  return (
    <ToastItem $variant={variant} role="status" aria-live="polite">
      <ToastIcon variant={variant} />
      <ToastBody>
        <Paragraph $size="small" $color={theme.colors.text.primary}>
          {message}
        </Paragraph>
      </ToastBody>
      <ToastClose type="button" onClick={onDismiss} aria-label="Sluiten">
        <Icons.X size={16} color={theme.colors.text.muted} />
      </ToastClose>
    </ToastItem>
  );
}
