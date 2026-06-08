import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import { theme } from '@package/ui';

import type { PerformanceTip } from '../types';
import { TIP_CATEGORY_LABELS } from '../types';
import { StyledCategoryBadge, StyledTipNumber } from './tipStyles';

export function TipItem({ tip, index }: { tip: PerformanceTip; index: number }) {
  return (
    <StyledCard
      $variant="small"
      $noShadow
      style={{ border: `1px solid ${theme.colors.border.subtle}` }}
    >
      <FlexRow $gap="md" $align="flex-start">
        <StyledTipNumber>{index + 1}</StyledTipNumber>
        <FlexColumn $gap="xs" $flex={1} $minWidth="0">
          <StyledCategoryBadge $category={tip.category}>
            {TIP_CATEGORY_LABELS[tip.category] ?? tip.category}
          </StyledCategoryBadge>
          <Paragraph $weight={600} style={{ lineHeight: 1.3 }}>
            {tip.title}
          </Paragraph>
          <Paragraph $size="small" $variant="secondary" $weight={400}>
            {tip.description}
          </Paragraph>
          {/* {tip.source_url && (
            <StyledSourceLink href={tip.source_url} target="_blank" rel="noopener noreferrer">
              <Icons.ExternalLink size="xs" />
              Bekijk bron
            </StyledSourceLink>
          )} */}
        </FlexColumn>
      </FlexRow>
    </StyledCard>
  );
}
