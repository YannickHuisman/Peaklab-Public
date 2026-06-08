import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import type { ReportData } from '@package/api';
import { theme } from '@package/ui';

import { StyledPerformanceList } from '../styles';

export function PerformanceSection({ impact }: { impact: ReportData['performance_impact'] }) {
  const { t } = useTranslation();

  return (
    <StyledCard $variant="section">
      <FlexColumn $gap="lg">
        <FlexRow $gap="sm" $align="center">
          <Icons.Zap size="xs" color={theme.colors.primary} />
          <Heading $size="small">{t('Performance Impact')}</Heading>
        </FlexRow>

        <Grid $gap="lg" $gridMinWidth="280px">
          <FlexColumn $gap="md">
            <FlexRow $gap="xs" $align="center">
              <Icons.TrendingUp size="xs" color={theme.colors.accent.green.main} />
              <Paragraph $weight={600}>{t('Sterke punten')}</Paragraph>
            </FlexRow>
            <StyledPerformanceList $variant="strength">
              {impact.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </StyledPerformanceList>
          </FlexColumn>

          <FlexColumn $gap="md">
            <FlexRow $gap="xs" $align="center">
              <Icons.Target size="xs" color={theme.colors.warning.main} />
              <Paragraph $weight={600}>{t('Verbeterpunten')}</Paragraph>
            </FlexRow>
            <StyledPerformanceList $variant="improvement">
              {impact.areas_for_improvement.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </StyledPerformanceList>
          </FlexColumn>
        </Grid>

        {impact.sport_specific_notes && (
          <StyledCard $variant="small" $tone="subtle" $noShadow>
            <FlexRow $gap="sm" $align="flex-start">
              <Icons.Dumbbell
                size="xs"
                color={theme.colors.text.secondary}
                style={{ marginTop: '2px', flexShrink: 0 }}
              />
              <Paragraph $size="small" $variant="secondary">
                {impact.sport_specific_notes}
              </Paragraph>
            </FlexRow>
          </StyledCard>
        )}
      </FlexColumn>
    </StyledCard>
  );
}
