import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import { theme } from '@package/ui';

export function SummarySection({ summary }: { summary: string }) {
  const { t } = useTranslation();

  return (
    <StyledCard $variant="section">
      <FlexColumn $gap="md">
        <FlexRow $gap="sm" $align="center">
          <Icons.Sparkles size="xs" color={theme.colors.primary} />
          <Heading $size="small">{t('Samenvatting')}</Heading>
        </FlexRow>
        <Paragraph $variant="secondary" style={{ lineHeight: 1.7 }}>
          {summary}
        </Paragraph>
      </FlexColumn>
    </StyledCard>
  );
}
