import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { Slider } from '@components/Slider';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import { theme } from '@package/ui';

import { StyledFrequencyOption, StyledToggleBadge, StyledToggleOption } from '../styles';
import type { FrequencyType, PerformanceFormData, RecoveryMethods } from '../types';
import { FREQUENCY_OPTIONS, RECOVERY_METHODS } from '../types';

const METHOD_ICONS: Record<keyof RecoveryMethods, React.ReactNode> = {
  rest_days: <Icons.Moon size="sm" color={theme.colors.text.secondary} />,
  stretching_mobility: <Icons.Activity size="sm" color={theme.colors.text.secondary} />,
  massage_foam_rolling: <Icons.Hand size="sm" color={theme.colors.text.secondary} />,
  sauna_cold: <Icons.Snowflake size="sm" color={theme.colors.text.secondary} />,
  active_recovery: <Icons.Footprints size="sm" color={theme.colors.text.secondary} />,
  no_structured_recovery: <Icons.Ban size="sm" color={theme.colors.text.secondary} />,
};

interface Step4RecoveryProps {
  formData: PerformanceFormData;
  onChange: <K extends keyof PerformanceFormData>(field: K, value: PerformanceFormData[K]) => void;
  hideHeading?: boolean;
}

export function Step4Recovery({ formData, onChange, hideHeading }: Step4RecoveryProps) {
  const { isMobile } = useDeviceBreakpoints();
  const { t } = useTranslation();

  const getStressLabel = (level: number): string => {
    if (level <= 3) return t('Laag');
    if (level <= 5) return t('Licht');
    if (level <= 7) return t('Matig');
    if (level <= 9) return t('Hoog');

    return t('Extreem');
  };

  const toggleRecoveryMethod = (key: keyof RecoveryMethods) => {
    const currentMethod = formData.recoveryMethods[key];
    const newMethod = { ...currentMethod, active: !currentMethod.active };

    if (!newMethod.active) {
      delete newMethod.frequency;
    }

    onChange('recoveryMethods', {
      ...formData.recoveryMethods,
      [key]: newMethod,
    });
  };

  const setRecoveryFrequency = (key: keyof RecoveryMethods, frequency: FrequencyType) => {
    onChange('recoveryMethods', {
      ...formData.recoveryMethods,
      [key]: {
        ...formData.recoveryMethods[key],
        frequency,
      },
    });
  };

  return (
    <FlexColumn $gap="lg">
      {!hideHeading && (
        <FlexColumn $gap="xs">
          <Heading $size="medium">{t('Herstel & Welzijn')}</Heading>
          <Paragraph $variant="secondary">{t('Hoe ziet jouw herstel eruit?')}</Paragraph>
        </FlexColumn>
      )}

      <Slider
        label={t('Slaap per nacht')}
        description={t('Gemiddeld aantal uren slaap per nacht')}
        value={formData.sleepHoursPerNight}
        min={4}
        max={12}
        step={0.5}
        unit="uur"
        minLabel="4 uur"
        maxLabel="12 uur"
        icon={<Icons.Clock size="md" color={theme.colors.text.secondary} />}
        onChange={(v) => onChange('sleepHoursPerNight', v)}
      />

      <Slider
        label={t('Stressniveau')}
        description={t('Hoe stressvol is jouw leven gemiddeld?')}
        value={formData.stressLevel}
        min={1}
        max={10}
        step={1}
        unit={getStressLabel(formData.stressLevel)}
        minLabel={t('Laag')}
        maxLabel={t('Extreem')}
        icon={<Icons.Zap size="md" color={theme.colors.text.secondary} />}
        onChange={(v) => onChange('stressLevel', v)}
      />

      {/* Recovery Methods */}
      <FlexColumn $gap="xs">
        <Paragraph $weight={500}>{t('Herstelmethoden')}</Paragraph>
        <Paragraph $size="small" $variant="secondary">
          {t('Welke herstelmethoden pas jij toe?')}
        </Paragraph>
      </FlexColumn>

      <FlexColumn $gap="sm">
        {RECOVERY_METHODS.map((method) => {
          const recoveryMethod = formData.recoveryMethods[method.key];
          const isActive = recoveryMethod.active;

          return (
            <FlexColumn key={method.key} $gap="xs">
              <StyledToggleOption
                type="button"
                $selected={isActive}
                aria-pressed={isActive}
                onClick={() => toggleRecoveryMethod(method.key)}
              >
                <FlexRow $align="center" $gap="md">
                  {METHOD_ICONS[method.key]}
                  <Paragraph $weight={500}>{method.label}</Paragraph>
                </FlexRow>
                {isActive && (
                  <StyledToggleBadge>
                    <Icons.Check size="xs" />
                    {t('Actief')}
                  </StyledToggleBadge>
                )}
              </StyledToggleOption>

              {isActive && method.hasFrequency && (
                <FlexColumn $gap="xs" $ml={isMobile ? 'md' : 'xl'}>
                  <Paragraph $size="small" $variant="secondary">
                    Hoe vaak?
                  </Paragraph>
                  <FlexRow $gap="xs">
                    {FREQUENCY_OPTIONS.map((option) => (
                      <StyledFrequencyOption
                        key={option.value}
                        type="button"
                        $selected={recoveryMethod.frequency === option.value}
                        aria-pressed={recoveryMethod.frequency === option.value}
                        onClick={() => setRecoveryFrequency(method.key, option.value)}
                      >
                        {option.label}
                      </StyledFrequencyOption>
                    ))}
                  </FlexRow>
                </FlexColumn>
              )}
            </FlexColumn>
          );
        })}
      </FlexColumn>
    </FlexColumn>
  );
}
