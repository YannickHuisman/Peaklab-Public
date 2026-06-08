import { useMemo } from 'react';

import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import type { Recommendation } from '@package/api';
import { theme } from '@package/ui';

import { PRIORITY_LABELS } from '../constants';
import { StyledCategoryBadge, StyledPriorityBadge } from '../styles';

export function RecommendationsSection({ recommendations }: { recommendations: Recommendation[] }) {
  const { t } = useTranslation();

  const sorted = useMemo(() => {
    const order = { high: 0, medium: 1, low: 2 };

    return [...recommendations].sort((a, b) => order[a.priority] - order[b.priority]);
  }, [recommendations]);

  return (
    <StyledCard $variant="section">
      <FlexColumn $gap="lg">
        <FlexRow $gap="sm" $align="center">
          <Icons.Target size="xs" color={theme.colors.primary} />
          <Heading $size="small">{t('Aanbevelingen')}</Heading>
        </FlexRow>

        <FlexColumn $gap="sm">
          {sorted.map((rec, i) => (
            <StyledCard
              key={i}
              $variant="small"
              $noShadow
              style={{ border: `1px solid ${theme.colors.border.subtle}` }}
            >
              <FlexColumn $gap="sm">
                <FlexRow $gap="sm" $align="center" $flexWrap="wrap">
                  <StyledPriorityBadge $priority={rec.priority}>
                    {PRIORITY_LABELS[rec.priority]}
                  </StyledPriorityBadge>
                  <StyledCategoryBadge>{rec.category}</StyledCategoryBadge>
                </FlexRow>
                <Paragraph $weight={600}>{rec.title}</Paragraph>
                <Paragraph $size="small" $variant="secondary">
                  {rec.description}
                </Paragraph>
              </FlexColumn>
            </StyledCard>
          ))}
        </FlexColumn>
      </FlexColumn>
    </StyledCard>
  );
}
