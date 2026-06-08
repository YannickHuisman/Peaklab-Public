import { Button } from '@components/Button/Button';
import { Divider } from '@components/Divider';
import { Icons } from '@components/Icons';
import { PageHeader } from '@components/PageHeader';
import { Paragraph } from '@components/Paragraph';
import { Spacer } from '@components/Spacer';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import { TOTAL_STEPS } from '../consts';
import type { PerformanceFormData } from '../types';
import { Stepper } from './Stepper';
import { StepRenderer } from './StepRenderer';

interface PerformanceStepperViewProps {
  formData: PerformanceFormData;
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
  isGenerating: boolean;
  onFieldChange: <K extends keyof PerformanceFormData>(
    field: K,
    value: PerformanceFormData[K]
  ) => void;
  onPrevious: () => void;
  onNext: () => void;
  onStepClick: (step: number) => void;
  onSubmit: () => void;
}

export function PerformanceStepperView({
  formData,
  currentStep,
  isFirstStep,
  isLastStep,
  canProceed,
  isGenerating,
  onFieldChange,
  onPrevious,
  onNext,
  onStepClick,
  onSubmit,
}: PerformanceStepperViewProps) {
  const { t } = useTranslation();

  return (
    <FlexColumn $gap="md">
      <PageHeader
        title={t('Performance Profiel')}
        subtitle={t('Vul je gegevens in voor gepersonaliseerde performance tips')}
      />

      <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} onStepClick={onStepClick} />

      <StyledCard $variant="section">
        <StepRenderer step={currentStep} formData={formData} onChange={onFieldChange} />

        <Spacer size="xl" />
        <Divider />
        <FlexRow $justify="space-between" $align="center" $mt="lg">
          {isFirstStep ? (
            <div />
          ) : (
            <Button $variant="ghost" onClick={onPrevious}>
              <FlexRow $gap="xs" $align="center">
                <Icons.ArrowLeft size="sm" />
                <span>{t('Vorige')}</span>
              </FlexRow>
            </Button>
          )}

          <Paragraph $size="small" $variant="tertiary">
            Stap {currentStep} van {TOTAL_STEPS}
          </Paragraph>

          {isLastStep ? (
            <Button $variant="primary" onClick={onSubmit} disabled={!canProceed || isGenerating}>
              <span>{isGenerating ? t('Tips genereren...') : t('Compleet')}</span>
            </Button>
          ) : (
            <Button $variant="primary" onClick={onNext} disabled={!canProceed}>
              <FlexRow $gap="xs" $align="center">
                <span>{t('Volgende')}</span>
                <Icons.ArrowRight size="sm" />
              </FlexRow>
            </Button>
          )}
        </FlexRow>
      </StyledCard>
    </FlexColumn>
  );
}
