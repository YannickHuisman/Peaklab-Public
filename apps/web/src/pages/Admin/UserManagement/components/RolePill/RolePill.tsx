import React from 'react';

import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import type { CardTone } from '@components/styled/StyledCard/types';

import { theme } from '@package/ui';

interface RolePillProps {
  role?: string | null;
  centered?: boolean;
}

export const RolePill: React.FC<RolePillProps> = ({ role, centered = false }) => {
  if (!role) return null;

  const mapping: Record<
    string,
    { label: string; icon: React.ReactNode; tone: CardTone; color: string }
  > = {
    admin: {
      label: 'Admin',
      icon: <Icons.Crown size="xs" color={theme.colors.warning.strong} />,
      tone: 'warning',
      color: theme.colors.warning.strong,
    },
    super_admin: {
      label: 'Super Admin',
      icon: <Icons.Shield size="xs" color={theme.colors.success.strong} />,
      tone: 'success',
      color: theme.colors.success.strong,
    },
    user: {
      label: 'User',
      icon: <Icons.User size="xs" color={theme.colors.info.strong} />,
      tone: 'info',
      color: theme.colors.info.strong,
    },
  };

  const info = mapping[role] || {
    label: role,
    icon: null,
    tone: 'neutral' as CardTone,
    color: theme.colors.text.secondary,
  };

  return (
    <FlexRow $justify={centered ? 'center' : 'flex-start'}>
      <StyledCard $variant="pill" $tone={info.tone} $noShadow $pl="sm" $pr="sm">
        <FlexRow $align="center" $gap="xs">
          {info.icon}
          <Paragraph $size="xsmall" $color={info.color} $whiteSpace="nowrap">
            {info.label}
          </Paragraph>
        </FlexRow>
      </StyledCard>
    </FlexRow>
  );
};
