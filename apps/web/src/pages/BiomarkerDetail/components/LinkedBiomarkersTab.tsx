import { Paragraph } from '@components/Paragraph';
import { Grid } from '@components/styled/layout';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';
import { RangeBarCard } from '@pages/Biomarkers/components/RangeBarCard';

import type { BiomarkerResult } from '@package/api';

interface LinkedBiomarkersTabProps {
  items: BiomarkerResult[];
  emptyMessage: string;
}

export function LinkedBiomarkersTab({ items, emptyMessage }: LinkedBiomarkersTabProps) {
  const { isMobile } = useDeviceBreakpoints();

  if (items.length === 0) {
    return (
      <Paragraph $size="small" $variant="secondary" $italic>
        {emptyMessage}
      </Paragraph>
    );
  }

  return (
    <Grid $gap="md" $gridMinWidth={isMobile ? '100%' : '350px'}>
      {items.map((b) => (
        <RangeBarCard key={b.biomarker.id} biomarker={b} />
      ))}
    </Grid>
  );
}
