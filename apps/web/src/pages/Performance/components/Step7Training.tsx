import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { Slider } from '@components/Slider';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';

import { theme } from '@package/ui';

import { StyledWarning } from '../styles';
import type { PerformanceFormData } from '../types';

interface Step7TrainingProps {
  formData: PerformanceFormData;
  onChange: <K extends keyof PerformanceFormData>(field: K, value: PerformanceFormData[K]) => void;
  hideHeading?: boolean;
}

export function Step7Training({ formData, onChange, hideHeading }: Step7TrainingProps) {
  const { t } = useTranslation();
  const showIntensityWarning = formData.highIntensitySessionsPerWeek > 3;

  return (
    <FlexColumn $gap="lg">
      {!hideHeading && (
        <FlexColumn $gap="xs">
          <Heading $size="medium">{t('Trainingsbelasting')}</Heading>
          <Paragraph $variant="secondary">{t('Hoe ziet jouw trainingsschema eruit?')}</Paragraph>
        </FlexColumn>
      )}

      <Slider
        label={t('Trainingsuren per week')}
        description={t('Totaal aantal uren sport per week')}
        value={formData.trainingHoursPerWeek}
        min={0}
        max={14}
        step={1}
        unit="uur"
        minLabel="0 uur"
        maxLabel="14+ uur"
        icon={<Icons.Clock size="md" color={theme.colors.text.secondary} />}
        onChange={(v) => onChange('trainingHoursPerWeek', v)}
        customLabels={
          <>
            <span>0 uur</span>
            <FlexRow $gap="xl">
              <span>7 uur</span>
              <span>14+ uur</span>
            </FlexRow>
          </>
        }
      />

      <Slider
        label={t('Intensieve sessies per week')}
        description={t('Aantal sessies met hoge intensiteit per week')}
        value={formData.highIntensitySessionsPerWeek}
        min={0}
        max={6}
        step={1}
        unit="sessies"
        minLabel="0"
        maxLabel="6+"
        icon={<Icons.Zap size="md" color={theme.colors.text.secondary} />}
        onChange={(v) => onChange('highIntensitySessionsPerWeek', v)}
        customLabels={
          <>
            <span>0</span>
            <span>2-3 (optimaal)</span>
            <span>6+</span>
          </>
        }
      >
        {showIntensityWarning && (
          <StyledWarning>
            <Icons.AlertCircle size="sm" />
            <span>
              {t('Let op: meer dan 3 intensieve sessies per week kan overtraining veroorzaken')}
            </span>
          </StyledWarning>
        )}
      </Slider>
    </FlexColumn>
  );
}
