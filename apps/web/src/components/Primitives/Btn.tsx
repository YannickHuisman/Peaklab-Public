import React from 'react';

import { theme } from '@package/ui';

type ButtonKind = 'solid' | 'ghost' | 'quiet';

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  kind?: ButtonKind;
  icon?: React.ReactNode;
  small?: boolean;
}

/**
 * Btn - Primary button component with solid/ghost/quiet variants
 * solid: filled dark background, white text
 * ghost: white surface background, dark text, shadow
 * quiet: transparent, muted text
 */
export function Btn({ children, kind = 'ghost', icon, small = false, style, ...props }: BtnProps) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    fontFamily: theme.typography.fontFamily.primary,
    fontSize: small ? 12.5 : 13.5,
    fontWeight: 600,
    padding: small ? '8px 14px' : '10px 17px',
    borderRadius: 11,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    border: 'none',
    transition: 'all 0.15s',
    ...style,
  };

  const kindStyles: Record<ButtonKind, React.CSSProperties> = {
    solid: {
      background: theme.colors.ink,
      color: '#fff',
      boxShadow: theme.shadows.sm,
    },
    ghost: {
      background: theme.colors.surface,
      color: theme.colors.ink,
      boxShadow: theme.shadows.sm,
    },
    quiet: {
      background: 'transparent',
      color: theme.colors.ink60,
    },
  };

  const getIconColor = () => {
    if (kind === 'solid') return '#fff';

    return theme.colors.ink60;
  };

  return (
    <button {...props} style={{ ...baseStyles, ...kindStyles[kind] }}>
      {icon && (
        <span style={{ display: 'flex', alignItems: 'center', color: getIconColor() }}>{icon}</span>
      )}
      {children}
    </button>
  );
}
