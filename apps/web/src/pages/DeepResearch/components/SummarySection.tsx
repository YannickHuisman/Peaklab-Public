import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

export function SummarySection({ summary }: { summary: string }) {
  const { t } = useTranslation();

  return (
    <StyledCard $variant="section">
      <FlexColumn $gap="md">
        <FlexRow $gap="sm" $align="center">
          <Heading $size="small">{t('Samenvatting')}</Heading>
        </FlexRow>
        <Paragraph $variant="secondary" style={{ lineHeight: 1.7 }}>
          {summary}
        </Paragraph>
      </FlexColumn>
    </StyledCard>
  );
}
