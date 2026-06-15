import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { formatDate } from '@helpers/formatDate';

import { theme } from '@package/ui';

import { RolePill } from '../RolePill';
import { StyledAvatar } from './styles';

interface UserInfoCardProps {
  user: {
    id: string;
    email: string;
    role: string;
    created_at: string;
    last_sign_in?: string;
  };
  profile: {
    first_name?: string;
    last_name?: string;
    username?: string;
    date_of_birth?: string;
    gender?: string;
  } | null;
}

export function UserInfoCard({ user, profile }: UserInfoCardProps) {
  return (
    <StyledCard $padding="lg">
      <FlexRow
        $gap="md"
        $mb="lg"
        $pb="lg"
        style={{ borderBottom: `1px solid ${theme.colors.border.subtle}` }}
      >
        <StyledAvatar>{user.email[0].toUpperCase()}</StyledAvatar>
        <FlexColumn $gap="xs">
          <Heading $size="small" $weight={600}>
            {profile?.first_name || profile?.last_name
              ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
              : 'No name set'}
          </Heading>
          <Paragraph $size="small" $variant="secondary">
            {user.email}
          </Paragraph>
          <RolePill role={user.role} />
        </FlexColumn>
      </FlexRow>

      <Grid $gridMinWidth="200px" $gap="md">
        <FlexColumn $gap="xxs">
          <Paragraph $size="xsmall" $variant="secondary" $weight={500} $allCaps>
            User ID
          </Paragraph>
          <Paragraph $size="small">{user.id}</Paragraph>
        </FlexColumn>
        <FlexColumn $gap="xxs">
          <Paragraph $size="xsmall" $variant="secondary" $weight={500} $allCaps>
            Username
          </Paragraph>
          <Paragraph $size="small">{profile?.username || 'Not set'}</Paragraph>
        </FlexColumn>
        <FlexColumn $gap="xxs">
          <Paragraph $size="xsmall" $variant="secondary" $weight={500} $allCaps>
            Date of Birth
          </Paragraph>
          <Paragraph $size="small">{profile?.date_of_birth || 'Not set'}</Paragraph>
        </FlexColumn>
        <FlexColumn $gap="xxs">
          <Paragraph $size="xsmall" $variant="secondary" $weight={500} $allCaps>
            Gender
          </Paragraph>
          <Paragraph $size="small">{profile?.gender || 'Not set'}</Paragraph>
        </FlexColumn>
        <FlexColumn $gap="xxs">
          <Paragraph $size="xsmall" $variant="secondary" $weight={500} $allCaps>
            Joined
          </Paragraph>
          <Paragraph $size="small">{formatDate(user.created_at, { preset: 'datetime' })}</Paragraph>
        </FlexColumn>
        <FlexColumn $gap="xxs">
          <Paragraph $size="xsmall" $variant="secondary" $weight={500} $allCaps>
            Last Sign In
          </Paragraph>
          <Paragraph $size="small">
            {formatDate(user.last_sign_in, { preset: 'datetime' })}
          </Paragraph>
        </FlexColumn>
      </Grid>
    </StyledCard>
  );
}
