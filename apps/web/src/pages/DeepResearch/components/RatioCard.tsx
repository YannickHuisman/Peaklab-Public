import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import type { RangeBucket, Ratio } from '@package/api';

import { StyledCategoryBadge, StyledStatusBadge } from '../styles';
import { BucketBar } from './BucketBar';

const BUCKET_LABEL: Record<RangeBucket, string> = {
  performance_range: 'Performance bereik',
  normal_range: 'Normaal bereik',
  out_of_range_high: 'Boven bereik',
  out_of_range_low: 'Onder bereik',
};

const BUCKET_STATUS: Record<RangeBucket, 'optimal' | 'good' | 'attention' | 'concern'> = {
  performance_range: 'optimal',
  normal_range: 'good',
  out_of_range_high: 'concern',
  out_of_range_low: 'concern',
};

interface RatioCardProps {
  ratio: Ratio;
}

export function RatioCard({ ratio }: RatioCardProps) {
  const bucket = ratio.range_bucket;
  const status = bucket ? BUCKET_STATUS[bucket] : (ratio.status ?? 'good');
  const sources = ratio.sources ?? [];

  return (
    <StyledCard $variant="small" $noShadow $showBorder>
      <FlexColumn $gap="md">
        <FlexRow $justify="space-between" $align="center" $gap="sm">
          <Paragraph $weight={600} $size="small">
            {ratio.name}
          </Paragraph>
          <StyledStatusBadge $status={status}>
            {bucket ? BUCKET_LABEL[bucket] : ''}
          </StyledStatusBadge>
        </FlexRow>

        {bucket && <BucketBar bucket={bucket} />}

        {sources.length > 0 && (
          <FlexColumn $gap="xs">
            <Paragraph $size="xsmall" $variant="tertiary">
              Berekend uit:
            </Paragraph>
            <FlexRow $gap="xs" $flexWrap="wrap">
              {sources.map((s) => (
                <StyledCategoryBadge key={s}>{s}</StyledCategoryBadge>
              ))}
            </FlexRow>
          </FlexColumn>
        )}

        {ratio.interpretation && (
          <Paragraph $size="xsmall" $variant="secondary">
            {ratio.interpretation}
          </Paragraph>
        )}
      </FlexColumn>
    </StyledCard>
  );
}
