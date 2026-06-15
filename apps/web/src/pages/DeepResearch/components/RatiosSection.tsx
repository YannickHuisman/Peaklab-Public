import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import type { Ratio } from '@package/api';

import { RatioCard } from './RatioCard';

export function RatiosSection({ ratios }: { ratios: Ratio[] }) {
  const { t } = useTranslation();

  return (
    <StyledCard $variant="section">
      <FlexColumn $gap="lg">
        <FlexColumn $gap="xs">
          <FlexRow $gap="sm" $align="center">
            <Heading $size="small">{t("Ratio's & Verbanden")}</Heading>
          </FlexRow>
          <Paragraph $variant="secondary" $size="small">
            {t(
              'Verhoudingen en berekende waardes die context geven aan losse biomarkers door ze te combineren.'
            )}
          </Paragraph>
        </FlexColumn>

        <Grid $gap="md" $gridMinWidth="320px">
          {ratios.map((ratio) => (
            <RatioCard key={ratio.name} ratio={ratio} />
          ))}
        </Grid>
      </FlexColumn>
    </StyledCard>
  );
}
