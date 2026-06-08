import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import type { Ratio } from '@package/api';
import { theme } from '@package/ui';

import { STATUS_LABELS } from '../constants';
import { StyledRatiosRow, StyledStatusBadge } from '../styles';

export function RatiosSection({ ratios }: { ratios: Ratio[] }) {
  const { t } = useTranslation();

  return (
    <StyledCard $variant="section">
      <FlexColumn $gap="lg">
        <FlexRow $gap="sm" $align="center">
          <Icons.TrendingUp size="xs" color={theme.colors.primary} />
          <Heading $size="small">{t("Ratio's & Verbanden")}</Heading>
        </FlexRow>

        <StyledRatiosRow>
          {ratios.map((ratio) => (
            <StyledCard
              key={ratio.name}
              $variant="small"
              $noShadow
              style={{ border: `1px solid ${theme.colors.border.subtle}` }}
            >
              <FlexColumn $gap="sm">
                <FlexRow $justify="space-between" $align="center">
                  <Paragraph $weight={600} $size="small">
                    {ratio.name}
                  </Paragraph>
                  <StyledStatusBadge $status={ratio.status}>
                    {STATUS_LABELS[ratio.status]}
                  </StyledStatusBadge>
                </FlexRow>
                <FlexRow $gap="sm" $align="baseline">
                  <Heading $size="medium">{ratio.value}</Heading>
                  <Paragraph $size="xsmall" $variant="tertiary">
                    {t('optimaal')}: {ratio.optimal_range}
                  </Paragraph>
                </FlexRow>
                <Paragraph $size="xsmall" $variant="secondary">
                  {ratio.interpretation}
                </Paragraph>
              </FlexColumn>
            </StyledCard>
          ))}
        </StyledRatiosRow>
      </FlexColumn>
    </StyledCard>
  );
}
