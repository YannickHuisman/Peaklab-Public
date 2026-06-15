import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import type { BiomarkerRangeCategory } from '@helpers/getRangeStatus';
import { BIOMARKER_RANGE_CONFIG } from '@helpers/getRangeStatus';

import type { Domain, RangeBucket } from '@package/api';
import { theme } from '@package/ui';

import { StyledStatusBar, StyledStatusItem, StyledStatusSegment } from '../styles';

type Status = 'optimal' | 'good' | 'attention' | 'concern';

function bucketToCategory(
  bucket: RangeBucket | undefined,
  status: Status | undefined
): BiomarkerRangeCategory {
  if (bucket === 'performance_range') return 'performance';
  if (bucket === 'out_of_range_high' || bucket === 'out_of_range_low') return 'outOfRange';
  if (bucket === 'normal_range') return 'normal';

  if (status === 'optimal') return 'performance';
  if (status === 'attention' || status === 'concern') return 'outOfRange';

  return 'normal';
}

interface StatusBreakdownProps {
  domains: Domain[];
}

export function StatusBreakdown({ domains }: StatusBreakdownProps) {
  const counts: Record<BiomarkerRangeCategory, number> = {
    performance: 0,
    normal: 0,
    outOfRange: 0,
  };
  let total = 0;

  for (const d of domains) {
    for (const b of d.biomarkers) {
      const category = bucketToCategory(b.range_bucket, b.status);

      counts[category]++;
      total++;
    }
  }

  if (total === 0) return null;

  const statConfig = [
    { key: 'total' as const, label: 'Totaal', color: theme.colors.text.inverse },
    ...BIOMARKER_RANGE_CONFIG.map(({ key, label, color }) => ({ key, label, color })),
  ];

  const getCount = (key: 'total' | BiomarkerRangeCategory): number =>
    key === 'total' ? total : counts[key];

  return (
    <FlexColumn $gap="md" $width="100%">
      <FlexRow $align="flex-end" $gap="lg">
        {statConfig.map(({ key, label, color }, i) => (
          <StyledStatusItem key={key} $hasDivider={i < statConfig.length - 1}>
            <Heading $size="large" $color={color}>
              {getCount(key)}
            </Heading>
            <Paragraph
              $size="xsmall"
              $color={theme.colors.text.muted}
              $whiteSpace="nowrap"
              $allCaps
            >
              {label}
            </Paragraph>
          </StyledStatusItem>
        ))}
      </FlexRow>

      <StyledStatusBar>
        {BIOMARKER_RANGE_CONFIG.map(({ key, color }) => {
          const widthPct = (counts[key] / total) * 100;

          return (
            counts[key] > 0 && <StyledStatusSegment key={key} $color={color} $widthPct={widthPct} />
          );
        })}
      </StyledStatusBar>
    </FlexColumn>
  );
}
