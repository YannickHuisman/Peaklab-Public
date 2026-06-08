import { memo, useMemo } from 'react';

import { Paragraph } from '@components/Paragraph';
import { Spacer } from '@components/Spacer';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { calculateBMI } from '@helpers/calculations';
import { BIOMARKER_RANGE_CONFIG, countBiomarkersByRange } from '@helpers/getRangeStatus';
import { useTranslation } from '@helpers/i18n';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints/useDeviceBreakpoints';

import type { BiomarkerResult } from '@package/api';
import { theme } from '@package/ui';

import type { PerformanceFormData } from '../../types';
import {
  LIMITATION_CATEGORIES,
  NUTRITION_PATTERNS,
  RECOVERY_METHODS,
  SPORT_TYPES,
} from '../../types';
import { CardHeader } from './components/CardHeader';
import { StyledDot } from './styles';

export type SnapshotCardType =
  | 'profile'
  | 'goals'
  | 'training'
  | 'recovery'
  | 'limitations'
  | 'nutrition';

interface PerformanceSnapshotProps {
  formData: PerformanceFormData;
  biomarkers?: BiomarkerResult[];
  onEditCard?: (cardId: SnapshotCardType) => void;
}

export const PerformanceSnapshot = memo(function PerformanceSnapshot({
  formData,
  biomarkers = [],
  onEditCard,
}: PerformanceSnapshotProps) {
  const { t } = useTranslation();

  const { isMobile } = useDeviceBreakpoints();
  const bmi = useMemo(() => {
    return calculateBMI(formData.heightCm, formData.weightKg);
  }, [formData.heightCm, formData.weightKg]);

  const sportLabel =
    SPORT_TYPES.find((s) => s.value === formData.primarySportType)?.label || t('Niet opgegeven');

  const genderLabel =
    formData.gender === 'male' ? t('Man') : formData.gender === 'female' ? t('Vrouw') : t('Anders');

  const stressLabel =
    formData.stressLevel <= 3
      ? t('Laag')
      : formData.stressLevel <= 5
        ? t('Licht')
        : formData.stressLevel <= 7
          ? t('Matig')
          : formData.stressLevel <= 9
            ? t('Hoog')
            : t('Extreem');

  const allLimitations = [
    ...formData.currentLimitations.energy_recovery,
    ...formData.currentLimitations.sleep_stress,
    ...formData.currentLimitations.muscles_joints,
    ...formData.currentLimitations.cognition_digestion,
  ];

  const limitationLabels = allLimitations
    .map((l) => {
      for (const cat of Object.values(LIMITATION_CATEGORIES)) {
        const option = cat.options.find((o) => o.value === l);

        if (option) return option.label;
      }

      return l;
    })
    .join(', ');

  const activeRecoveryMethods = Object.entries(formData.recoveryMethods)
    .filter(([, method]) => method.active)
    .map(([key]) => RECOVERY_METHODS.find((r) => r.key === key)?.label || key)
    .join(', ');

  const nutritionLabels = formData.nutritionPatterns
    .map((p) => NUTRITION_PATTERNS.find((n) => n.value === p)?.label || p)
    .join(', ');

  const gender = formData.gender === 'female' ? 'female' : ('male' as const);
  const biomarkerCounts = useMemo(
    () => countBiomarkersByRange(biomarkers, gender),
    [biomarkers, gender]
  );

  return (
    <FlexColumn $gap="lg">
      <Grid
        $gap="md"
        $gridColumns={isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'}
        $gridMinWidth="280px"
      >
        <StyledCard $variant="small">
          <CardHeader
            title={t('Profiel')}
            accentColor={theme.colors.accent.blue.main}
            onEdit={() => onEditCard?.('profile')}
            showEditButton={!!onEditCard}
          />
          <Spacer size="lg" />

          <FlexColumn $gap="xs">
            <FlexRow $justify="space-between" $align="center">
              <Paragraph $size="small" $variant="secondary" $weight={400}>
                {t('Leeftijd')}
              </Paragraph>
              <Paragraph $size="small">{formData.age} jaar</Paragraph>
            </FlexRow>

            <FlexRow $justify="space-between" $align="center">
              <Paragraph $size="small" $variant="secondary" $weight={400}>
                {t('Geslacht')}
              </Paragraph>
              <Paragraph $size="small">{genderLabel}</Paragraph>
            </FlexRow>

            <FlexRow $justify="space-between" $align="center">
              <Paragraph $size="small" $variant="secondary" $weight={400}>
                {t('Gewicht')}
              </Paragraph>
              <Paragraph $size="small">{formData.weightKg} kg</Paragraph>
            </FlexRow>

            <FlexRow $justify="space-between" $align="center">
              <Paragraph $size="small" $variant="secondary" $weight={400}>
                {t('Lengte')}
              </Paragraph>
              <Paragraph $size="small">{formData.heightCm} cm</Paragraph>
            </FlexRow>

            {bmi && (
              <FlexRow $justify="space-between">
                <Paragraph $size="small" $variant="secondary" $weight={400}>
                  {t('BMI')}
                </Paragraph>
                <Paragraph $size="small">{bmi}</Paragraph>
              </FlexRow>
            )}

            <FlexRow $justify="space-between" $align="center">
              <Paragraph $size="small" $variant="secondary" $weight={400}>
                {t('Sport')}
              </Paragraph>
              <Paragraph $size="small">{sportLabel}</Paragraph>
            </FlexRow>
          </FlexColumn>
        </StyledCard>

        <StyledCard $variant="small">
          <CardHeader
            title={t('Doelen & Niveau')}
            accentColor={theme.colors.accent.magenta.main}
            onEdit={() => onEditCard?.('goals')}
            showEditButton={!!onEditCard}
          />
          <Spacer size="lg" />

          <FlexColumn $gap="xs">
            <FlexColumn $gap="xxs">
              <Paragraph $size="small" $variant="secondary" $weight={400}>
                {t('Primair doel')}
              </Paragraph>
              <Paragraph $size="small">{formData.primaryGoal || t('Niet opgegeven')}</Paragraph>
            </FlexColumn>

            {!!formData.secondaryGoals.length && (
              <FlexColumn $gap="xxs">
                <Paragraph $size="small" $variant="secondary" $weight={400}>
                  {t('Secundaire doelen')}
                </Paragraph>
                <ul>
                  {formData.secondaryGoals.map((goal, index) => (
                    <li key={index}>
                      <Paragraph $size="small">{goal}</Paragraph>
                    </li>
                  ))}
                </ul>
              </FlexColumn>
            )}
          </FlexColumn>
        </StyledCard>

        <StyledCard $variant="small">
          <CardHeader
            title={t('Training')}
            accentColor={theme.colors.accent.green.main}
            onEdit={() => onEditCard?.('training')}
            showEditButton={!!onEditCard}
          />
          <Spacer size="lg" />

          <FlexColumn $gap="xs">
            <FlexRow $justify="space-between" $align="center">
              <Paragraph $size="small" $variant="secondary" $weight={400}>
                {t('Uren per week')}
              </Paragraph>
              <Paragraph $size="small">{formData.trainingHoursPerWeek}u</Paragraph>
            </FlexRow>

            <FlexRow $justify="space-between" $align="center">
              <Paragraph $size="small" $variant="secondary" $weight={400}>
                {t('Intensieve sessies')}
              </Paragraph>
              <Paragraph $size="small">{formData.highIntensitySessionsPerWeek}x/week</Paragraph>
            </FlexRow>
          </FlexColumn>
        </StyledCard>

        <StyledCard $variant="small">
          <CardHeader
            title={t('Herstel & Beperkingen')}
            accentColor={theme.colors.accent.orange.main}
            onEdit={() => onEditCard?.('recovery')}
            showEditButton={!!onEditCard}
          />
          <Spacer size="lg" />

          <FlexColumn $gap="xs">
            <FlexRow $justify="space-between" $align="center">
              <Paragraph $size="small" $variant="secondary" $weight={400}>
                {t('Slaap')}
              </Paragraph>
              <Paragraph $size="small">{formData.sleepHoursPerNight}u per nacht</Paragraph>
            </FlexRow>

            <FlexRow $justify="space-between" $align="center">
              <Paragraph $size="small" $variant="secondary" $weight={400}>
                {t('Stress')}
              </Paragraph>
              <Paragraph $size="small">{stressLabel}</Paragraph>
            </FlexRow>

            {activeRecoveryMethods && (
              <FlexColumn $gap="xxs">
                <Paragraph $size="small" $variant="secondary" $weight={400}>
                  {t('Herstelmethoden')}
                </Paragraph>
                <Paragraph $size="small">{activeRecoveryMethods}</Paragraph>
              </FlexColumn>
            )}

            <FlexColumn $gap="xxs">
              <Paragraph $size="small" $variant="secondary" $weight={400}>
                {t('Beperkingen')}
              </Paragraph>
              {allLimitations.length > 0 ? (
                <Paragraph $size="small">{limitationLabels}</Paragraph>
              ) : (
                <Paragraph $size="small" $variant="secondary">
                  {t('Geen')}
                </Paragraph>
              )}
            </FlexColumn>
          </FlexColumn>
        </StyledCard>

        <StyledCard $variant="small">
          <CardHeader
            title={t('Voeding')}
            accentColor={theme.colors.accent.teal.main}
            onEdit={() => onEditCard?.('nutrition')}
            showEditButton={!!onEditCard}
          />
          <Spacer size="lg" />

          <FlexColumn $gap="xs">
            <FlexRow $justify="space-between" $align="center">
              <Paragraph $size="small" $variant="secondary" $weight={400}>
                {t('Calorie-inname')}
              </Paragraph>
              <Paragraph $size="small">{formData.dailyCalorieIntake} kcal</Paragraph>
            </FlexRow>

            {nutritionLabels && (
              <FlexColumn $gap="xxs">
                <Paragraph $size="small" $variant="secondary" $weight={400}>
                  {t('Voedingspatronen')}
                </Paragraph>
                <Paragraph $size="small">{nutritionLabels}</Paragraph>
              </FlexColumn>
            )}
          </FlexColumn>
        </StyledCard>

        <StyledCard $variant="small">
          <CardHeader title={t('Biomarkers')} accentColor={theme.colors.info.main} />
          <Spacer size="lg" />

          <FlexColumn $gap="xs">
            <FlexRow $justify="space-between" $align="center">
              <Paragraph $size="small" $variant="secondary" $weight={400}>
                {t('Totaal getest')}
              </Paragraph>
              <Paragraph $size="small">{biomarkerCounts.total}</Paragraph>
            </FlexRow>

            {BIOMARKER_RANGE_CONFIG.map(({ key, label, color }) => (
              <FlexRow key={key} $justify="space-between" $align="center">
                <FlexRow $align="center" $gap="xs" $width="auto">
                  <StyledDot $color={color} />
                  <Paragraph $size="small" $variant="secondary" $weight={400}>
                    {label}:
                  </Paragraph>
                </FlexRow>
                <Paragraph $size="small">{biomarkerCounts[key]}</Paragraph>
              </FlexRow>
            ))}
          </FlexColumn>
        </StyledCard>
      </Grid>
    </FlexColumn>
  );
});
