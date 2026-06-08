import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';

import { theme } from '@package/ui';

import type { PerformanceTip } from '../types';
import { TIP_CATEGORY_LABELS } from '../types';
import { StyledCategoryBadge, StyledCheckCircle, StyledTipRow } from './tipStyles';

export function TipRow({
  tip,
  index,
  selected,
  onToggle,
}: {
  tip: PerformanceTip;
  index: number;
  selected: boolean;
  onToggle: () => void;
  viewSourceLabel: string;
}) {
  return (
    <StyledTipRow $selected={selected} onClick={onToggle} type="button">
      <StyledCheckCircle $selected={selected}>
        {selected && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke={theme.colors.text.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </StyledCheckCircle>

      <Paragraph
        $size="xsmall"
        $weight={600}
        $variant="tertiary"
        $minWidth="18px"
        style={{ marginTop: 3 }}
      >
        {index + 1}
      </Paragraph>

      <FlexColumn $gap="xs" style={{ flex: 1, minWidth: 0 }}>
        <FlexRow $gap="sm" $align="center" style={{ flexWrap: 'wrap' }}>
          <StyledCategoryBadge $category={tip.category}>
            {TIP_CATEGORY_LABELS[tip.category] ?? tip.category}
          </StyledCategoryBadge>
        </FlexRow>
        <Paragraph $weight={600}>{tip.title}</Paragraph>
        <Paragraph $size="small" $variant="secondary" $weight={400}>
          {tip.description}
        </Paragraph>
        {/* {tip.source_url && (
          <StyledSourceLink
            href={tip.source_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Icons.ExternalLink size="xs" />
            {viewSourceLabel}
          </StyledSourceLink>
        )} */}
      </FlexColumn>
    </StyledTipRow>
  );
}
