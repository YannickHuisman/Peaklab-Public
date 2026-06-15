import { type ReactNode, useMemo } from 'react';

import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import {
  StyledSliderIcon,
  StyledSliderInput,
  StyledSliderLabels,
  StyledSliderNumber,
  StyledSliderUnit,
} from './styles';

interface SliderProps {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  minLabel: string;
  maxLabel: string;
  icon?: ReactNode;
  formatValue?: (value: number) => string;
  customLabels?: ReactNode;
  children?: ReactNode;
  onChange: (value: number) => void;
}

export function Slider({
  label,
  description,
  value,
  min,
  max,
  step,
  unit,
  minLabel,
  maxLabel,
  icon,
  formatValue,
  customLabels,
  children,
  onChange,
}: SliderProps) {
  const { isMobile } = useDeviceBreakpoints();

  const progress = useMemo(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  const displayValue = formatValue ? formatValue(value) : String(value);

  return (
    <StyledCard $variant="section" $noShadow $showBorder>
      <FlexColumn $gap="md">
        {isMobile && (
          <FlexColumn $gap="sm">
            <FlexRow $align="center" $gap="sm">
              {icon && <StyledSliderIcon>{icon}</StyledSliderIcon>}
              <FlexColumn $gap="xxs" $flex={1}>
                <Paragraph $weight={500}>{label}</Paragraph>
                <Paragraph $size="small" $variant="secondary">
                  {description}
                </Paragraph>
              </FlexColumn>
            </FlexRow>
            <FlexRow $align="baseline" $gap="xs" $justify="center">
              <StyledSliderNumber>{displayValue}</StyledSliderNumber>
              <StyledSliderUnit>{unit}</StyledSliderUnit>
            </FlexRow>
          </FlexColumn>
        )}

        {!isMobile && (
          <FlexRow $align="center" $gap="md">
            {icon && <StyledSliderIcon>{icon}</StyledSliderIcon>}
            <FlexColumn $gap="xxs">
              <Paragraph $weight={500} $whiteSpace="nowrap">
                {label}
              </Paragraph>
              <Paragraph $size="small" $variant="secondary" $whiteSpace="nowrap">
                {description}
              </Paragraph>
            </FlexColumn>
            {/* <FlexRow $align="center" $gap="xs">
              <Paragraph $weight={500}>{label}</Paragraph>
              <Paragraph $size="small" $variant="secondary">
                {description}
              </Paragraph>
            </FlexRow> */}
            <FlexRow $align="baseline" $gap="xs" $justify="flex-end">
              <StyledSliderNumber>{displayValue}</StyledSliderNumber>
              <StyledSliderUnit>{unit}</StyledSliderUnit>
            </FlexRow>
          </FlexRow>
        )}

        <FlexColumn $gap="xs">
          <StyledSliderInput
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label={label}
            aria-valuetext={`${displayValue}${unit ? ` ${unit}` : ''}`}
            style={{ '--progress': `${progress}%` } as React.CSSProperties}
          />
          <StyledSliderLabels>
            {customLabels ?? (
              <>
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
              </>
            )}
          </StyledSliderLabels>
        </FlexColumn>

        {children}
      </FlexColumn>
    </StyledCard>
  );
}
