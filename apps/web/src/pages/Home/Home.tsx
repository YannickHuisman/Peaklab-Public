import { useMemo } from 'react';

import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { Spacer } from '@components/Spacer';
import { FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { formatDate } from '@helpers/formatDate';
import { useTranslation } from '@helpers/i18n';
import { PerformancePlanView } from '@pages/Performance/components';
import type { PerformanceTipsData } from '@pages/Performance/types';

import type { PeakScore } from '@package/api';
import { useData } from '@package/api';

import { HeroBanner, TrophyCase } from './components';

export function Home() {
  const { t } = useTranslation();

  const {
    biomarkers,
    peakScores,
    lastAppointment,
    nextAppointment,
    appointmentsLoading,
    performanceProfile,
  } = useData();

  const latestPeakScore = useMemo(() => {
    if (!peakScores || peakScores.length === 0) return null;

    return peakScores.reduce(
      (latest: PeakScore | null, score) => {
        if (!latest) return score;

        return new Date(score.calculated_at) > new Date(latest.calculated_at) ? score : latest;
      },
      null as PeakScore | null
    );
  }, [peakScores]);

  // Extract tips data from cached performance profile (new format)
  const tipsData = useMemo(() => {
    if (!performanceProfile.data?.ai_plan) return null;
    const aiPlan = performanceProfile.data.ai_plan as PerformanceTipsData;

    return aiPlan.tips_by_goal ? aiPlan : null;
  }, [performanceProfile.data]);

  // Calculate days until next appointment
  const daysUntilNextAppointment = useMemo(() => {
    if (!nextAppointment) return null;
    const now = new Date();
    const appointmentDate = new Date(nextAppointment.scheduled_at);
    const diffTime = appointmentDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }, [nextAppointment]);

  return (
    <>
      <HeroBanner score={latestPeakScore?.score ?? null} biomarkers={biomarkers ?? []} />

      <FlexRow $gap="md" $mt="md" $equalChildren>
        <StyledCard $padding="lg" $gap="xs">
          <Paragraph $size="xsmall" $variant="tertiary" $allCaps>
            {t('Laatste test')}
          </Paragraph>
          <Heading $size="medium">
            {appointmentsLoading
              ? '...'
              : lastAppointment
                ? formatDate(lastAppointment.scheduled_at, { preset: 'shortDate' })
                : t('Geen afspraak')}
          </Heading>
        </StyledCard>
        <StyledCard $padding="lg" $gap="xs">
          <Paragraph $size="xsmall" $variant="tertiary" $allCaps>
            {t('Volgende test')}
          </Paragraph>
          <Heading $size="medium">
            {appointmentsLoading
              ? '...'
              : nextAppointment
                ? formatDate(nextAppointment.scheduled_at, { preset: 'shortDate' })
                : t('Geen afspraak')}
          </Heading>
          {nextAppointment && daysUntilNextAppointment !== null && (
            <Paragraph $size="xsmall" $variant="tertiary">
              Over {daysUntilNextAppointment}{' '}
              {daysUntilNextAppointment === 1 ? t('dag') : t('dagen')}
            </Paragraph>
          )}
        </StyledCard>
      </FlexRow>

      {tipsData && (
        <StyledCard $variant="section" $mt="md">
          <PerformancePlanView tipsData={tipsData} />
        </StyledCard>
      )}

      <Spacer size="md" />
      <TrophyCase />
    </>
  );
}
