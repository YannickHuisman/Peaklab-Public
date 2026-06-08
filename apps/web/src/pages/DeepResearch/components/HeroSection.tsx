import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import type { ReportData } from '@package/api';
import { theme } from '@package/ui';

import {
  StyledHeroMeta,
  StyledScoreCircle,
  StyledScoreLabel,
  StyledScoreValue,
  StyledStatusBadge,
} from '../styles';

export function HeroSection({ data, createdAt }: { data: ReportData; createdAt: string }) {
  const { t } = useTranslation();
  const dateStr = new Date(createdAt).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <StyledCard $variant="intro" $tone="hero">
      <FlexRow $gap="xl" $align="center" $flexWrap="wrap">
        <StyledScoreCircle $score={data.overall_score}>
          <FlexColumn $align="center">
            <StyledScoreValue>{data.overall_score}</StyledScoreValue>
            <StyledScoreLabel>Score</StyledScoreLabel>
          </FlexColumn>
        </StyledScoreCircle>

        <FlexColumn $gap="sm" $flex={1} $minWidth="200px">
          <Heading $size="large" $variant="inverse">
            {t('Deep Research Report')}
          </Heading>
          <StyledHeroMeta>
            <Icons.Calendar size="xs" color={theme.colors.whiteAlpha.visible} />
            <span>{dateStr}</span>
          </StyledHeroMeta>

          <FlexRow $gap="sm" $flexWrap="wrap" style={{ marginTop: theme.spacing.xs }}>
            {data.domains?.slice(0, 4).map((d) => (
              <StyledStatusBadge key={d.name} $status={d.status}>
                {d.name}
              </StyledStatusBadge>
            ))}
          </FlexRow>
        </FlexColumn>
      </FlexRow>
    </StyledCard>
  );
}
