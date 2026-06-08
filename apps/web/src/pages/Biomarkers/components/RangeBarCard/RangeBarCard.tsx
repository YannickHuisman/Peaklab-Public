import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { RangeBar } from '@components/RangeBar';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { buildBiomarkerConfig, getRangeStatus } from '@helpers/getRangeStatus';

import type { BiomarkerResult } from '@package/api';
import { useData } from '@package/api';
import { theme } from '@package/ui';

import { StyledDot } from './styles';

interface RangeBarCardProps {
  biomarker: BiomarkerResult;
}

export const RangeBarCard = memo(function RangeBarCard({ biomarker }: RangeBarCardProps) {
  const navigate = useNavigate();
  const { userGender } = useData();

  const gender = userGender === 'female' ? 'female' : 'male';
  const config = buildBiomarkerConfig(biomarker, gender);

  const rangeStatus = useMemo(
    () =>
      config ? getRangeStatus(biomarker.value, config.normalRange, config.performanceRange) : null,
    [biomarker.value, config]
  );

  // Show biomarkers without config in a simpler view
  if (!config) {
    return (
      <StyledCard
        $variant="small"
        $interactive
        onClick={() => navigate(`/biomarkers/${biomarker.biomarker.id}`)}
        $padding="lg"
      >
        <FlexColumn $gap="md">
          <FlexRow $justify="space-between" $align="center">
            <Paragraph $variant="secondary" $size="small">
              {biomarker.biomarker.display_name}
            </Paragraph>
            <Icons.ChevronRight size="sm" color={theme.colors.text.secondary} />
          </FlexRow>

          <FlexColumn $gap="sm">
            <FlexRow $align="center" $gap="xs">
              <Heading $size="xlarge" $weight={800}>
                {biomarker.value}
              </Heading>
              {biomarker.biomarker.unit && (
                <Paragraph $size="small" $variant="secondary">
                  {biomarker.biomarker.unit}
                </Paragraph>
              )}
            </FlexRow>
            <Paragraph $size="xsmall" $variant="secondary" $italic>
              Configuratie ontbreekt
            </Paragraph>
          </FlexColumn>
        </FlexColumn>
      </StyledCard>
    );
  }

  if (!rangeStatus) return null;

  return (
    <StyledCard
      $variant="small"
      $interactive
      onClick={() => navigate(`/biomarkers/${biomarker.biomarker.id}`)}
      $padding="lg"
    >
      <FlexColumn $gap="md">
        <FlexRow $justify="space-between" $align="center">
          <Paragraph $variant="secondary" $size="small">
            {biomarker.biomarker.display_name}
          </Paragraph>
          <Icons.ChevronRight size="sm" color={theme.colors.text.secondary} />
        </FlexRow>

        <FlexColumn $gap="lg">
          <FlexRow $align="center" $gap="xs">
            <Heading $size="xlarge" $weight={800}>
              {biomarker.value}
            </Heading>
            <Paragraph $size="small" $variant="secondary">
              {config.unit}
            </Paragraph>
          </FlexRow>

          <StyledCard $variant="pill" $tone={rangeStatus.tone} $width="fit-content">
            <Paragraph $size="small" $color={rangeStatus.color}>
              <StyledDot />
              {rangeStatus.label}
            </Paragraph>
          </StyledCard>

          <RangeBar
            value={biomarker.value}
            normalRange={config.normalRange}
            performanceRange={config.performanceRange}
          />

          <FlexColumn $gap="xs">
            <FlexRow $justify="space-between" $align="center">
              <Paragraph $size="xsmall" $variant="secondary">
                Normal:
              </Paragraph>
              <Paragraph $size="xsmall" $variant="secondary">
                {config.normalRange.min}–{config.normalRange.max} {config.unit}
              </Paragraph>
            </FlexRow>
            {config.performanceRange && (
              <FlexRow $justify="space-between" $align="center">
                <Paragraph $size="xsmall" $color={theme.colors.success.strong}>
                  Performance:
                </Paragraph>
                <Paragraph $size="xsmall" $color={theme.colors.success.strong}>
                  {config.performanceRange.min}–{config.performanceRange.max} {config.unit}
                </Paragraph>
              </FlexRow>
            )}
          </FlexColumn>
        </FlexColumn>
      </FlexColumn>
    </StyledCard>
  );
});
