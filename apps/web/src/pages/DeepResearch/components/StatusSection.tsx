import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import type { Domain } from '@package/api';
import { theme } from '@package/ui';

import { BiomarkerRangeCard } from './BiomarkerRangeCard';

interface StatusSectionProps {
  domains: Domain[];
}

export function StatusSection({ domains }: StatusSectionProps) {
  const allBiomarkers = domains.flatMap((d) => d.biomarkers);

  const buiten = allBiomarkers.filter(
    (b) =>
      b.range_bucket === 'out_of_range_high' ||
      b.range_bucket === 'out_of_range_low' ||
      (!b.range_bucket && (b.status === 'attention' || b.status === 'concern'))
  );

  if (buiten.length === 0) return null;

  return (
    <StyledCard $variant="section">
      <FlexColumn $gap="lg">
        <Heading $size="small">Aandachtspunten</Heading>

        <FlexColumn $gap="md">
          <FlexColumn $gap="xxs">
            <Paragraph $weight={600} $size="small" $color={theme.colors.buiten}>
              Buiten bereik — {buiten.length}
            </Paragraph>
            <Paragraph $size="xsmall" $variant="tertiary">
              Deze waarden vallen buiten het normale referentiebereik.
            </Paragraph>
          </FlexColumn>
          <Grid $gap="md" $gridMinWidth="320px">
            {buiten.map((b) => (
              <BiomarkerRangeCard key={b.name} biomarker={b} />
            ))}
          </Grid>
        </FlexColumn>
      </FlexColumn>
    </StyledCard>
  );
}
