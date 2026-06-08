import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import { StyledSuccessContainer, StyledSuccessIcon } from '../styles';

export function SuccessMessage() {
  return (
    <StyledCard $padding="2xl">
      <StyledSuccessContainer>
        <StyledSuccessIcon>
          <Icons.Check size="xl" />
        </StyledSuccessIcon>
        <FlexColumn $gap="md" $align="center">
          <Heading $size="medium">Aanvraag ontvangen!</Heading>
          <Paragraph $variant="secondary" $maxWidth="480px">
            Bedankt voor je interesse in een partnerschap met Peaklab. We bekijken je aanvraag zo
            snel mogelijk en nemen contact met je op via e-mail.
          </Paragraph>
          <Paragraph $size="small" $variant="tertiary" style={{ marginTop: '8px' }}>
            Je kunt dit venster nu sluiten.
          </Paragraph>
        </FlexColumn>
      </StyledSuccessContainer>
    </StyledCard>
  );
}
