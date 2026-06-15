import { useMemo } from 'react';

import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { formatDate } from '@helpers/formatDate';
import { calculatePeakScore } from '@helpers/getRangeStatus';
import { useTranslation } from '@helpers/i18n';
import { PerformancePlanView } from '@pages/Performance/components';
import type { PerformanceTipsData } from '@pages/Performance/types';

import { useData } from '@package/api';

import { HeroBanner, TrophyCase } from './components';

function TestIcon({ background }: { background: string }) {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background,
        flexShrink: 0,
      }}
    />
  );
}

export function Home() {
  const { t } = useTranslation();

  const {
    biomarkers,
    userGender,
    lastAppointment,
    nextAppointment,
    appointmentsLoading,
    performanceProfile,
  } = useData();

  const peakScore = useMemo(() => {
    if (!biomarkers || biomarkers.length === 0) return null;

    const gender = userGender === 'female' ? 'female' : 'male';
    const directBiomarkers = biomarkers.filter((b) => b.biomarker.kind === 'direct');

    return calculatePeakScore(directBiomarkers, gender);
  }, [biomarkers, userGender]);

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
      <HeroBanner score={peakScore} biomarkers={biomarkers ?? []} />

      <Grid $gap="lg" $mt="lg" $mb="lg" $align="start" $gridColumns="1.7fr 1fr">
        {tipsData && (
          <StyledCard $variant="section">
            <PerformancePlanView tipsData={tipsData} />
          </StyledCard>
        )}

        <FlexColumn $gap="md">
          <StyledCard $padding="lg" $gap="xs">
            <FlexRow $gap="sm" $align="center" $mb="md">
              <TestIcon background="#0C1722" />
              <div>
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
              </div>
            </FlexRow>
            {nextAppointment && daysUntilNextAppointment !== null && (
              <Paragraph $size="xsmall" $variant="tertiary" $mb="md">
                Over {daysUntilNextAppointment}{' '}
                {daysUntilNextAppointment === 1 ? t('dag') : t('dagen')}
              </Paragraph>
            )}
          </StyledCard>

          <StyledCard $padding="lg" $gap="xs">
            <FlexRow $gap="sm" $align="center">
              <TestIcon background="#F1F3F6" />
              <div>
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
              </div>
            </FlexRow>
            {lastAppointment && (
              <Paragraph $size="xsmall" $variant="tertiary" $mt="sm">
                106 biomarkers · PeakScore 89
              </Paragraph>
            )}
          </StyledCard>
        </FlexColumn>
      </Grid>

      <TrophyCase />
    </>
  );
}
