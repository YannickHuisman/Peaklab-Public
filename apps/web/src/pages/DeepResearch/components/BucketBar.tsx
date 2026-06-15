import { FlexColumn, FlexRow } from '@components/styled/layout';

import type { RangeBucket } from '@package/api';
import { theme } from '@package/ui';

import { StyledBucketLabel, StyledBucketSegment, StyledBucketTrack } from '../styles';

const SEGMENTS: { key: RangeBucket; label: string; color: string }[] = [
  {
    key: 'out_of_range_low',
    label: 'Te laag',
    color: theme.colors.error.strong,
  },
  {
    key: 'normal_range',
    label: 'Normaal',
    color: theme.colors.normaal,
  },
  {
    key: 'performance_range',
    label: 'Performance',
    color: theme.colors.primary,
  },
  {
    key: 'out_of_range_high',
    label: 'Te hoog',
    color: theme.colors.error.strong,
  },
];

interface BucketBarProps {
  bucket: RangeBucket;
}

export function BucketBar({ bucket }: BucketBarProps) {
  return (
    <FlexColumn $gap="xs">
      <StyledBucketTrack>
        {SEGMENTS.map((s) => (
          <StyledBucketSegment key={s.key} $color={s.color} $active={s.key === bucket} />
        ))}
      </StyledBucketTrack>
      <FlexRow $gap="xxs">
        {SEGMENTS.map((s) => (
          <StyledBucketLabel key={s.key} $active={s.key === bucket} $color={s.color}>
            {s.label}
          </StyledBucketLabel>
        ))}
      </FlexRow>
    </FlexColumn>
  );
}
