import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { Slider } from '@components/Slider';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import { theme } from '@package/ui';

import { StyledOptionCard } from '../styles';
import type { NutritionPattern, PerformanceFormData } from '../types';
import { NUTRITION_PATTERNS } from '../types';

interface Step5NutritionProps {
  formData: PerformanceFormData;
  onChange: <K extends keyof PerformanceFormData>(field: K, value: PerformanceFormData[K]) => void;
}

export function Step5Nutrition({ formData, onChange }: Step5NutritionProps) {
  const { isMobile } = useDeviceBreakpoints();
  const { t } = useTranslation();

  const toggleNutritionPattern = (pattern: NutritionPattern) => {
    const currentPatterns = formData.nutritionPatterns;

    if (currentPatterns.includes(pattern)) {
      onChange(
        'nutritionPatterns',
        currentPatterns.filter((p) => p !== pattern)
      );
    } else if (currentPatterns.length < 2) {
      onChange('nutritionPatterns', [...currentPatterns, pattern]);
    }
  };

  return (
    <FlexColumn $gap="lg">
      <FlexColumn $gap="xs">
        <Heading $size="medium">{t('Voeding')}</Heading>
        <Paragraph $variant="secondary">{t('Vertel ons over jouw voedingsgewoonten')}</Paragraph>
      </FlexColumn>

      <Slider
        label={t('Dagelijkse calorie-inname')}
        description={t('Schatting van je gemiddelde dagelijkse calorie-inname')}
        value={formData.dailyCalorieIntake}
        min={1000}
        max={5000}
        step={100}
        unit="kcal"
        minLabel="1000 kcal"
        maxLabel="5000 kcal"
        onChange={(v) => onChange('dailyCalorieIntake', v)}
      />

      {/* Nutrition Patterns */}
      <FlexColumn $gap="sm">
        <FlexColumn $gap="xs">
          <Paragraph $size="small" $weight={500}>
            {t('Voedingspatroon')} *
          </Paragraph>
          <Paragraph $size="small" $variant="secondary">
            {t('Selecteer maximaal 2 patronen die het beste bij jou passen')}
          </Paragraph>
        </FlexColumn>

        <Grid
          $gap="sm"
          $gridColumns={isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'}
          $gridMinWidth="100px"
        >
          {NUTRITION_PATTERNS.map((pattern) => {
            const isSelected = formData.nutritionPatterns.includes(pattern.value);
            const isDisabled = !isSelected && formData.nutritionPatterns.length >= 2;

            return (
              <StyledOptionCard
                key={pattern.value}
                type="button"
                $selected={isSelected}
                onClick={() => !isDisabled && toggleNutritionPattern(pattern.value)}
                style={{
                  opacity: isDisabled ? 0.5 : 1,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                <Paragraph $size="small" $weight={isSelected ? 500 : 400}>
                  {pattern.label}
                </Paragraph>
              </StyledOptionCard>
            );
          })}
        </Grid>

        {formData.nutritionPatterns.length > 0 && (
          <FlexRow $gap="sm" $align="center" $padding="sm" $borderRadius="md">
            <Icons.Check size="sm" color={theme.colors.success.main} />
            <Paragraph $size="small" $variant="secondary">
              {formData.nutritionPatterns.length} {t('patronen geselecteerd')}
            </Paragraph>
          </FlexRow>
        )}
      </FlexColumn>
    </FlexColumn>
  );
}
