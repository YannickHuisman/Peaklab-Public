import { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { Label, Pill } from '@components/Primitives';
import { RangeBar } from '@components/RangeBar';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { getClickableProps } from '@helpers/getClickableProps';
import { buildBiomarkerConfig, getRangeStatus } from '@helpers/getRangeStatus';

import type { BiomarkerResult } from '@package/api';
import { useData } from '@package/api';
import { theme } from '@package/ui';

import { StyledCardHeader, StyledValue } from './styles';

interface RangeBarCardProps {
  biomarker: BiomarkerResult;
}

export const RangeBarCard = memo(function RangeBarCard({ biomarker }: RangeBarCardProps) {
  const navigate = useNavigate();
  const { userGender } = useData();

  const gender = userGender === 'female' ? 'female' : 'male';
  const config = buildBiomarkerConfig(biomarker, gender);

  const status = useMemo((): 'performance' | 'normaal' | 'buiten' => {
    if (!config) return 'normaal';
    const result = getRangeStatus(biomarker.value, config.normalRange, config.performanceRange);

    if (result.tone === 'error') return 'buiten';
    if (result.tone === 'success') return 'performance';

    return 'normaal';
  }, [biomarker.value, config]);

  if (!config) {
    return (
      <StyledCard
        $interactive
        $gap="md"
        {...getClickableProps(
          () => navigate(`/biomarkers/${biomarker.biomarker.id}`),
          `${biomarker.biomarker.display_name} bekijken`
        )}
      >
        <StyledCardHeader>
          <div>
            <Label color={theme.colors.ink40}>{biomarker.biomarker.category?.name || 'N/A'}</Label>
            <Paragraph $variant="secondary" $size="small" style={{ marginTop: 4 }}>
              {biomarker.biomarker.display_name}
            </Paragraph>
          </div>
        </StyledCardHeader>

        <StyledValue>
          <Heading $size="medium" $weight={700} $color={theme.colors.ink}>
            {biomarker.value}
          </Heading>
          {biomarker.biomarker.unit && (
            <Paragraph $size="small" $variant="secondary">
              {biomarker.biomarker.unit}
            </Paragraph>
          )}
        </StyledValue>

        <Paragraph $size="xsmall" $variant="secondary" $italic>
          Configuratie ontbreekt
        </Paragraph>
      </StyledCard>
    );
  }

  return (
    <StyledCard
      $interactive
      $gap="md"
      {...getClickableProps(
        () => navigate(`/biomarkers/${biomarker.biomarker.id}`),
        `${biomarker.biomarker.display_name} bekijken`
      )}
    >
      <StyledCardHeader>
        <div>
          <Label color={theme.colors.ink40}>{biomarker.biomarker.category?.name || 'N/A'}</Label>
          <Paragraph $variant="secondary" $size="small" $mt="xs">
            {biomarker.biomarker.display_name}
          </Paragraph>
        </div>
      </StyledCardHeader>

      <StyledValue>
        <Heading $size="large" $weight={700} $color={theme.colors.ink}>
          {biomarker.value}
        </Heading>
        <Paragraph $size="small" $variant="secondary" $whiteSpace="nowrap">
          {config.unit}
        </Paragraph>
      </StyledValue>

      <Pill status={status} />

      <RangeBar
        value={biomarker.value}
        normalRange={config.normalRange}
        performanceRange={config.performanceRange}
      />

      <FlexRow $justify="space-between">
        <FlexColumn $gap="xs">
          <Label color={theme.colors.ink40}>Normaal</Label>
          <Paragraph $size="xsmall">
            {config.normalRange.min}–{config.normalRange.max} {config.unit}
          </Paragraph>
        </FlexColumn>
        {config.performanceRange && (
          <FlexColumn $gap="xs">
            <Label color={theme.colors.performance}>Performance</Label>
            <Paragraph $size="xsmall" $color={theme.colors.performance}>
              {config.performanceRange.min}–{config.performanceRange.max} {config.unit}
            </Paragraph>
          </FlexColumn>
        )}
      </FlexRow>
    </StyledCard>
  );
});
