import { BiomarkerHistoryChart } from '@components/BiomarkerHistoryChart';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { Spacer } from '@components/Spacer';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import type { CardTone } from '@components/styled/StyledCard/types';
import { useTranslation } from '@helpers/i18n';

import type { BiomarkerHistoryEntry } from '@package/api';
import { theme } from '@package/ui';

interface RangeInfo {
  min: number;
  max: number;
}

interface OverviewTabProps {
  value: number;
  unit?: string;
  isOutOfRange: boolean;
  tone: CardTone;
  normalRange?: RangeInfo;
  performanceRange?: RangeInfo;
  history: BiomarkerHistoryEntry[];
  isLoadingHistory: boolean;
  isMobile: boolean;
}

export function OverviewTab({
  value,
  unit,
  isOutOfRange,
  tone,
  normalRange,
  performanceRange,
  history,
  isLoadingHistory,
  isMobile,
}: OverviewTabProps) {
  const { t } = useTranslation();

  return (
    <>
      <StyledCard $variant="section" $tone={tone || 'neutral'} $noShadow>
        <Grid
          $gridColumns={isMobile ? '1fr' : 'repeat(3, 1fr)'}
          $columnsCount={isMobile ? 1 : 3}
          $dividers
          $gap="md"
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
            {isOutOfRange && (
              <FlexRow $align="center" $gap="xs">
                <Icons.AlertCircle size="xs" color={theme.colors.error.strong} />
                <Paragraph $size="xsmall" $color={theme.colors.error.strong}>
                  Buiten Range
                </Paragraph>
              </FlexRow>
            )}
          </FlexColumn>

          <FlexColumn $gap="md">
            <Paragraph $size="xsmall" $variant="secondary">
              NORMAAL BEREIK
            </Paragraph>
            <FlexRow $align="flex-end" $gap="sm">
              <Heading $size="large">{normalRange?.min}</Heading>
              <Paragraph $size="xsmall" $variant="secondary">
                min
              </Paragraph>
            </FlexRow>
            <FlexRow $align="flex-end" $gap="sm">
              <Heading $size="large">{normalRange?.max}</Heading>
              <Paragraph $size="xsmall" $variant="secondary">
                max
              </Paragraph>
            </FlexRow>
            <Spacer size="xs" />
            <Paragraph $size="xsmall" $variant="secondary">
              Gezonde populatie
            </Paragraph>
          </FlexColumn>

          <FlexColumn $gap="md">
            <Paragraph $size="xsmall" $variant="secondary">
              PERFORMANCE RANGE
            </Paragraph>
            <FlexRow $align="flex-end" $gap="sm">
              <Heading $size="large">{performanceRange?.min}</Heading>
              <Paragraph $size="xsmall" $variant="secondary">
                min
              </Paragraph>
            </FlexRow>
            <FlexRow $align="flex-end" $gap="sm">
              <Heading $size="large">{performanceRange?.max}</Heading>
              <Paragraph $size="xsmall" $variant="secondary">
                max
              </Paragraph>
            </FlexRow>
            <Spacer size="xs" />
            <Paragraph $size="xsmall" $variant="secondary">
              Elite atleten
            </Paragraph>
          </FlexColumn>
        </Grid>
      </StyledCard>

      <FlexColumn $gap="lg">
        <StyledCard $variant="section" $noShadow>
          <FlexColumn $gap="md">
            <Heading $size="small">Geschiedenis</Heading>
            {isLoadingHistory && (
              <Paragraph $size="small" $variant="secondary">
                {t('Laden...')}
              </Paragraph>
            )}
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
        </StyledCard>
      </FlexColumn>
    </>
  );
}
