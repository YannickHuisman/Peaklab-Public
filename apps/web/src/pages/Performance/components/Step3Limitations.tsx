import type { ReactNode } from 'react';

import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, Grid } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import { theme } from '@package/ui';

import { StyledLimitationHeader, StyledToggleOption } from '../styles';
import type { LimitationCategory, PerformanceFormData } from '../types';
import { LIMITATION_CATEGORIES } from '../types';

const CATEGORY_ICONS: Record<keyof LimitationCategory, ReactNode> = {
  energy_recovery: <Icons.Battery size="sm" color={theme.colors.text.secondary} />,
  sleep_stress: <Icons.Moon size="sm" color={theme.colors.text.secondary} />,
  muscles_joints: <Icons.Bone size="sm" color={theme.colors.text.secondary} />,
  cognition_digestion: <Icons.Brain size="sm" color={theme.colors.text.secondary} />,
};

interface Step3LimitationsProps {
  formData: PerformanceFormData;
  onChange: <K extends keyof PerformanceFormData>(field: K, value: PerformanceFormData[K]) => void;
}

export function Step3Limitations({ formData, onChange }: Step3LimitationsProps) {
  const { isMobile } = useDeviceBreakpoints();
  const { t } = useTranslation();

  const toggleLimitation = (category: keyof LimitationCategory, value: string) => {
    const currentCategory = formData.currentLimitations[category];
    const newCategory = currentCategory.includes(value)
      ? currentCategory.filter((v) => v !== value)
      : [...currentCategory, value];

    onChange('currentLimitations', {
      ...formData.currentLimitations,
      [category]: newCategory,
    });
  };

  return (
    <FlexColumn $gap="lg">
      <FlexColumn $gap="xs">
        <Heading $size="medium">{t('Beperkingen & Klachten')}</Heading>
        <Paragraph $variant="secondary">
          {t('Selecteer wat er van toepassing is op dit moment')}
        </Paragraph>
      </FlexColumn>

      <Grid $gap="lg" $gridColumns={isMobile ? '1fr' : '1fr 1fr'}>
        {Object.entries(LIMITATION_CATEGORIES).map(([categoryKey, category]) => (
          <FlexColumn $gap="sm" key={categoryKey}>
            <StyledLimitationHeader>
              {CATEGORY_ICONS[categoryKey as keyof LimitationCategory]}
              <span>{category.label}</span>
            </StyledLimitationHeader>

            <FlexColumn $gap="xs">
              {category.options.map((option) => {
                const isSelected = formData.currentLimitations[
                  categoryKey as keyof LimitationCategory
                ].includes(option.value);

                return (
                  <StyledToggleOption
                    key={option.value}
                    type="button"
                    $selected={isSelected}
                    onClick={() =>
                      toggleLimitation(categoryKey as keyof LimitationCategory, option.value)
                    }
                  >
                    <Paragraph $size="small" $weight={isSelected ? 500 : 400}>
                      {option.label}
                    </Paragraph>
                    {isSelected && <Icons.Check size="sm" color={theme.colors.primary} />}
                  </StyledToggleOption>
                );
              })}
            </FlexColumn>
          </FlexColumn>
        ))}
      </Grid>
    </FlexColumn>
  );
}
