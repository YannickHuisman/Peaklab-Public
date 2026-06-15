import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { OptimizedImage } from '@components/OptimizedImage';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { getClickableProps } from '@helpers/getClickableProps';
import { useTranslation } from '@helpers/i18n';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import type { Profile } from '@package/api';
import { theme } from '@package/ui';

import {
  StyledAvatar,
  StyledAvatarOverlay,
  StyledProfileHeader,
  StyledProfileHeaderInfo,
  StyledStatItem,
  StyledStatsRow,
  StyledStatusBadge,
} from '../styles';

interface ProfileHeaderProps {
  profile: Profile | null;
  email?: string;
  displayName: string;
  memberSince: string;
  sportLabel: string | null;
  frequencyLabel: string | null;
  onAvatarClick: () => void;
}

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <StyledStatItem>
      <Paragraph $size="xsmall" $variant="tertiary" $allCaps>
        {label}
      </Paragraph>
      <Paragraph $size="small" $weight={600}>
        {value}
      </Paragraph>
    </StyledStatItem>
  );
}

export function ProfileHeader({
  profile,
  email,
  displayName,
  memberSince,
  sportLabel,
  frequencyLabel,
  onAvatarClick,
}: ProfileHeaderProps) {
  const { t } = useTranslation();
  const { isMobile } = useDeviceBreakpoints();

  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <StyledCard $padding="2xl">
      <StyledProfileHeader $isMobile={isMobile}>
        <StyledAvatar {...getClickableProps(() => onAvatarClick?.(), t('Profielfoto wijzigen'))}>
          {avatarUrl && (
            <OptimizedImage
              src={avatarUrl}
              alt="Avatar"
              width="100%"
              height="100%"
              borderRadius={theme.borderRadius.full}
              fallbackIcon={<Icons.User size={48} color={theme.colors.text.muted} />}
            />
          )}
          {!avatarUrl && <Icons.User size={48} color={theme.colors.text.muted} />}
          <StyledAvatarOverlay aria-hidden="true">
            <Icons.Edit size="sm" color={theme.colors.text.inverse} />
          </StyledAvatarOverlay>
        </StyledAvatar>

        <StyledProfileHeaderInfo>
          <FlexColumn $gap="xs">
            <FlexRow $align="center" $gap="sm">
              <Heading $size="medium" $weight={700}>
                {displayName}
              </Heading>
              <StyledStatusBadge $variant="success">{t('Actief')}</StyledStatusBadge>
            </FlexRow>
            {profile?.username && (
              <Paragraph $variant="tertiary" $size="small">
                @{profile.username}
              </Paragraph>
            )}
            {email && (
              <Paragraph $variant="secondary" $size="small">
                {email}
              </Paragraph>
            )}
          </FlexColumn>

          <StyledStatsRow>
            <Stat label={t('Lid sinds')} value={memberSince} />
            {profile?.weight_kg && <Stat label={t('Gewicht')} value={`${profile.weight_kg} kg`} />}
            {sportLabel && <Stat label={t('Sport')} value={sportLabel} />}
            {frequencyLabel && <Stat label={t('Frequentie')} value={frequencyLabel} />}
          </StyledStatsRow>
        </StyledProfileHeaderInfo>
      </StyledProfileHeader>
    </StyledCard>
  );
}
