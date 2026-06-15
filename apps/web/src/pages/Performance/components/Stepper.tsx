import { memo, useEffect } from 'react';

import { Icons } from '@components/Icons';
import { FlexRow } from '@components/styled/layout';
import { useDirectionalScroll } from '@hooks/useDirectionalScroll';

import { theme } from '@package/ui';

import {
  StyledStep,
  StyledStepCircle,
  StyledStepConnector,
  StyledStepLabel,
  StyledStepperContainer,
} from '../styles';
import { STEP_LABELS } from '../types';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

export const Stepper = memo(function Stepper({
  currentStep,
  totalSteps,
  onStepClick,
}: StepperProps) {
  const {
    containerRef,
    itemRefs: stepRefs,
    scrollToIndex,
  } = useDirectionalScroll<HTMLDivElement>();

  useEffect(() => {
    scrollToIndex(currentStep - 1);
  }, [currentStep, scrollToIndex]);

  const handleStepClick = (stepNumber: number) => {
    if (onStepClick && stepNumber <= currentStep) {
      onStepClick(stepNumber);
    }
  };

  return (
    <StyledStepperContainer ref={containerRef}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const isClickable = stepNumber <= currentStep;

        return (
          <FlexRow
            key={stepNumber}
            ref={(el) => {
              stepRefs.current[index] = el;
            }}
            $align="center"
            style={stepNumber < totalSteps ? { flex: 1, width: 'auto' } : { width: 'auto' }}
          >
            <StyledStep $active={isActive} $completed={isCompleted}>
              <StyledStepCircle
                $active={isActive}
                $completed={isCompleted}
                $clickable={isClickable}
                onClick={() => handleStepClick(stepNumber)}
                role="button"
                tabIndex={isClickable ? 0 : -1}
                aria-disabled={!isClickable}
                aria-current={isActive ? 'step' : undefined}
                aria-label={`${STEP_LABELS[index]} (stap ${stepNumber} van ${totalSteps})`}
                onKeyDown={(e) => {
                  if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleStepClick(stepNumber);
                  }
                }}
              >
                {isCompleted && <Icons.Check size="sm" color={theme.colors.text.primary} />}
                {!isCompleted && stepNumber}
              </StyledStepCircle>
              <StyledStepLabel $active={isActive} $completed={isCompleted}>
                {STEP_LABELS[index]}
              </StyledStepLabel>
            </StyledStep>
            {stepNumber < totalSteps && <StyledStepConnector $completed={isCompleted} />}
          </FlexRow>
        );
      })}
    </StyledStepperContainer>
  );
});
