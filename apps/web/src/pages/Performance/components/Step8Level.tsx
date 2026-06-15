import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import { theme } from '@package/ui';

import { StyledTextarea } from '../styles';
import type { PerformanceFormData } from '../types';

interface Step8LevelProps {
  formData: PerformanceFormData;
  onChange: <K extends keyof PerformanceFormData>(field: K, value: PerformanceFormData[K]) => void;
  hideHeading?: boolean;
}

export function Step8Level({ formData, onChange, hideHeading }: Step8LevelProps) {
  const { t } = useTranslation();
  const activeSecondaryGoals = formData.secondaryGoals
    .map((g, i) => ({ goal: g, index: i }))
    .filter(({ goal }) => goal.trim().length > 0);

  const handleSecondaryLevelChange = (index: number, value: string) => {
    const updated = [...formData.secondaryGoalCurrentLevels];

    updated[index] = value;
    onChange('secondaryGoalCurrentLevels', updated);
  };

  return (
    <FlexColumn $gap="lg">
      {!hideHeading && (
        <FlexColumn $gap="xs">
          <Heading $size="medium">{t('Huidig niveau')}</Heading>
          <Paragraph $variant="secondary">{t('Beschrijf je huidige niveau per doel')}</Paragraph>
        </FlexColumn>
      )}

      {/* Primary goal */}
      <FlexColumn $gap="sm">
        <StyledCard $variant="section" $noShadow $showBorder>
          <FlexRow $gap="sm" $align="center">
            <Icons.Target size="sm" color={theme.colors.primary} />
            <Paragraph $size="small" $weight={600}>
              {t('Primair doel')}
            </Paragraph>
          </FlexRow>
          <Paragraph $weight={500} style={{ marginTop: theme.spacing.sm }}>
            {formData.primaryGoal || '—'}
          </Paragraph>
        </StyledCard>

        <FlexColumn $gap="xs">
          <Paragraph $size="small" $variant="secondary">
            {t('Beschrijf je huidige niveau voor dit doel')}
          </Paragraph>
          <StyledTextarea
            placeholder="bijv. ik doe nu max 80kg 8 reps, maar wil naar de 10"
            value={formData.currentLevelDescription}
            onChange={(e) => onChange('currentLevelDescription', e.target.value)}
            style={{ minHeight: '90px' }}
          />
        </FlexColumn>
      </FlexColumn>

      {/* Secondary goals */}
      {activeSecondaryGoals.map(({ goal, index }) => (
        <FlexColumn $gap="sm" key={index}>
          <StyledCard $variant="section" $noShadow $showBorder>
            <FlexRow $gap="sm" $align="center">
              <Icons.Target size="sm" color={theme.colors.accent.blue.main} />
              <Paragraph $size="small" $weight={600}>
                {t('Secundair doel')} {index + 1}
              </Paragraph>
            </FlexRow>
            <Paragraph $weight={500} style={{ marginTop: theme.spacing.sm }}>
              {goal}
            </Paragraph>
          </StyledCard>

          <FlexColumn $gap="xs">
            <Paragraph $size="small" $variant="secondary">
              {t('Beschrijf je huidige niveau voor dit nevendoel')}
            </Paragraph>
            <StyledTextarea
              placeholder="bijv. mijn vitamine D is 35 nmol/L, optimaal is 75-150"
              value={formData.secondaryGoalCurrentLevels[index] ?? ''}
              onChange={(e) => handleSecondaryLevelChange(index, e.target.value)}
              style={{ minHeight: '80px' }}
            />
          </FlexColumn>
        </FlexColumn>
      ))}
    </FlexColumn>
  );
}
