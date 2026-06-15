import { useState } from 'react';

import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn } from '@components/styled/layout';

import { IntakeForm } from './components/IntakeForm';
import { SuccessMessage } from './components/SuccessMessage';
import { StyledIntakeContainer, StyledIntakePage, StyledLogo } from './styles';

export function PartnerIntake() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <StyledIntakePage>
      <StyledIntakeContainer>
        <StyledLogo>
          <FlexColumn $gap="sm" $align="center">
            <Heading $size="large">Peaklab</Heading>
            <Paragraph $variant="secondary">Partner Programma</Paragraph>
          </FlexColumn>
        </StyledLogo>

        {submitted && <SuccessMessage />}
        {!submitted && (
          <FlexColumn $gap="lg">
            <FlexColumn $gap="sm">
              <Heading $size="medium">Word partner van Peaklab</Heading>
              <Paragraph $variant="secondary">
                Vul onderstaand formulier in om je aan te melden als partner. We bekijken je
                aanvraag en nemen zo snel mogelijk contact met je op.
              </Paragraph>
            </FlexColumn>

            <IntakeForm onSuccess={() => setSubmitted(true)} />
          </FlexColumn>
        )}
      </StyledIntakeContainer>
    </StyledIntakePage>
  );
}
