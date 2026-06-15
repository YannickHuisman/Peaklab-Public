import { useEffect, useState } from 'react';

import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import { StyledGeneratingRing, StyledGeneratingWrapper } from '../styles';

interface GeneratingStateProps {
  startedAt?: string | null;
}

const TYPICAL_DURATION_MIN = 5;

function formatElapsed(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
}

export function GeneratingState({ startedAt }: GeneratingStateProps) {
  const { t } = useTranslation();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startedAt) return;

    const start = new Date(startedAt).getTime();
    const tick = () => setElapsed(Math.max(0, Math.floor((Date.now() - start) / 1000)));

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [startedAt]);

  return (
    <StyledCard $variant="section">
      <StyledGeneratingWrapper>
        <StyledGeneratingRing />

        <FlexColumn $gap="sm" $align="center">
          <Heading $size="small">{t('Analyse wordt gegenereerd')}</Heading>
          <Paragraph $variant="secondary" $size="small" $maxWidth="400px">
            {t(
              'We voeren een diepgaand onderzoek uit op basis van je biomarkers met behulp van AI-gestuurde research. Dit duurt doorgaans 3 tot 8 minuten. Je ontvangt een notificatie zodra het rapport klaar is.'
            )}
          </Paragraph>
          {startedAt && (
            <Paragraph $variant="tertiary" $size="small">
              {t('Verstreken')}: {formatElapsed(elapsed)} · {t('verwacht ~')}
              {TYPICAL_DURATION_MIN} {t('min')}
            </Paragraph>
          )}
        </FlexColumn>
      </StyledGeneratingWrapper>
    </StyledCard>
  );
}
