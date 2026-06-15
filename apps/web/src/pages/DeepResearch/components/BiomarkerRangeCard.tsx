import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import type { DomainBiomarker, RangeBucket } from '@package/api';

import { StyledStatusBadge } from '../styles';
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

interface BiomarkerRangeCardProps {
  biomarker: DomainBiomarker;
}

export function BiomarkerRangeCard({ biomarker }: BiomarkerRangeCardProps) {
  const bucket = biomarker.range_bucket;
  const status = bucket ? BUCKET_STATUS[bucket] : (biomarker.status ?? 'good');
  const displayName = biomarker.display_name ?? biomarker.name;

  return (
    <StyledCard $variant="small" $noShadow $showBorder>
      <FlexColumn $gap="md">
        <FlexRow $justify="space-between" $align="center" $gap="sm">
          <Paragraph $weight={600} $size="small">
            {displayName}
          </Paragraph>
          <StyledStatusBadge $status={status}>
            {bucket ? BUCKET_LABEL[bucket] : ''}
          </StyledStatusBadge>
        </FlexRow>

        {bucket && <BucketBar bucket={bucket} />}

        {biomarker.interpretation && (
          <Paragraph $size="xsmall" $variant="secondary">
            {biomarker.interpretation}
          </Paragraph>
        )}
      </FlexColumn>
    </StyledCard>
  );
}
