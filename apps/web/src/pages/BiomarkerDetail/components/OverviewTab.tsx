import { BiomarkerHistoryChart } from '@components/BiomarkerHistoryChart';
import { Heading } from '@components/Heading';
import { Loader } from '@components/Loader';
import { Paragraph } from '@components/Paragraph';
import { Pill } from '@components/Primitives';
import { Spacer } from '@components/Spacer/Spacer';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import type { CardTone } from '@components/styled/StyledCard/types';
import { RangeBarCard } from '@pages/Biomarkers/components/RangeBarCard';

import type { BiomarkerHistoryEntry, BiomarkerResult } from '@package/api';
import { theme } from '@package/ui';

interface RangeInfo {
  min: number;
  max: number;
}

interface OverviewTabProps {
  value: number;
  unit?: string;
  status: string;
  tone: CardTone;
  normalRange?: RangeInfo;
  performanceRange?: RangeInfo;
  history: BiomarkerHistoryEntry[];
  isLoadingHistory: boolean;
  isMobile: boolean;
  linkedDerived?: BiomarkerResult[];
  sourcesOfThis?: BiomarkerResult[];
}

export function OverviewTab({
  value,
  unit,
  status,

  normalRange,
  performanceRange,
  history,
  isLoadingHistory,
  isMobile,
  linkedDerived = [],
  sourcesOfThis = [],
}: OverviewTabProps) {
  return (
    <>
      <FlexRow $gap="lg" $reverseOnMobile>
        <StyledCard $variant="section" $noShadow $flex={3}>
          <FlexColumn $gap="md">
            <Heading $size="small">Geschiedenis</Heading>

            <FlexColumn $align="center" $minHeight="300px" $justify="center">
              {isLoadingHistory && <Loader />}
              {!isLoadingHistory && !history.length && (
                <Paragraph $size="small" $variant="secondary">
                  Geen historische data beschikbaar.
                </Paragraph>
              )}
              {!isLoadingHistory && !!history.length && (
                <BiomarkerHistoryChart
                  history={history}
                  normalRange={normalRange}
                  performanceRange={performanceRange}
                />
              )}
            </FlexColumn>
          </FlexColumn>
        </StyledCard>

        <StyledCard $variant="section" $noShadow $flex={1}>
          <FlexColumn
            $gap="lg"
            $flex={1}
            $flexDirection={isMobile ? 'row' : 'column'}
            $justify={isMobile ? 'space-between' : undefined}
          >
            <FlexColumn $gap="xs">
              <Paragraph $size="xsmall" $variant="secondary">
                JOUW WAARDE
              </Paragraph>
              <FlexRow $align="flex-end" $gap="sm">
                <Heading $size="xxlarge">{value}</Heading>
                <Paragraph $size="small" $variant="secondary">
                  {unit}
                </Paragraph>
              </FlexRow>
              <Pill status={status} />
            </FlexColumn>

            <FlexColumn $gap="xs" $mt="auto">
              <Paragraph $size="xsmall" $variant="secondary">
                NORMAAL BEREIK
              </Paragraph>
              <FlexRow $align="flex-end" $gap="sm">
                <Heading $size="large">
                  {normalRange?.min}—{normalRange?.max}
                </Heading>
                <Paragraph $size="small" $variant="secondary">
                  {unit}
                </Paragraph>
              </FlexRow>
              <Paragraph $size="xsmall" $variant="secondary">
                Gezonde populatie
              </Paragraph>

              {isMobile && (
                <>
                  <Spacer size="md" />
                  <Paragraph $size="xsmall" $color={theme.colors.performance}>
                    PERFORMANCE RANGE
                  </Paragraph>
                  <FlexRow $align="flex-end" $gap="sm">
                    <Heading $size="large" $color={theme.colors.performance}>
                      {performanceRange?.min}—{performanceRange?.max}
                    </Heading>
                    <Paragraph $size="small" $color={theme.colors.performance}>
                      {unit}
                    </Paragraph>
                  </FlexRow>
                  <Paragraph $size="xsmall" $color={theme.colors.performance}>
                    Atleten
                  </Paragraph>
                </>
              )}
            </FlexColumn>

            {!isMobile && (
              <FlexColumn $gap="xs">
                <Paragraph $size="xsmall" $color={theme.colors.performance}>
                  PERFORMANCE RANGE
                </Paragraph>
                <FlexRow $align="flex-end" $gap="sm">
                  <Heading $size="large" $color={theme.colors.performance}>
                    {performanceRange?.min}—{performanceRange?.max}
                  </Heading>
                  <Paragraph $size="small" $color={theme.colors.performance}>
                    {unit}
                  </Paragraph>
                </FlexRow>
                <Paragraph $size="xsmall" $variant="secondary">
                  Atleten
                </Paragraph>
              </FlexColumn>
            )}
          </FlexColumn>
        </StyledCard>
      </FlexRow>

      <FlexColumn $gap="lg">
        {linkedDerived.length > 0 && (
          <StyledCard $variant="section" $noShadow>
            <FlexColumn $gap="md">
              <Heading $size="small">Gerelateerde ratio's & berekeningen</Heading>
              <Grid $gap="md" $gridMinWidth={isMobile ? '100%' : '350px'}>
                {linkedDerived.map((b) => (
                  <RangeBarCard key={b.biomarker.id} biomarker={b} />
                ))}
              </Grid>
            </FlexColumn>
          </StyledCard>
        )}

        {sourcesOfThis.length > 0 && (
          <StyledCard $variant="section" $noShadow>
            <FlexColumn $gap="md">
              <Heading $size="small">Bronbiomarkers</Heading>
              <Grid $gap="md" $gridMinWidth={isMobile ? '100%' : '350px'}>
                {sourcesOfThis.map((b) => (
                  <RangeBarCard key={b.biomarker.id} biomarker={b} />
                ))}
              </Grid>
            </FlexColumn>
          </StyledCard>
        )}
      </FlexColumn>
    </>
  );
}
