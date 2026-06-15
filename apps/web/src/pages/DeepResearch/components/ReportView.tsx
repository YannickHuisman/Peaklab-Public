import { FlexColumn } from '@components/styled/layout';

import type { ReportData } from '@package/api';

import { DomainsSection } from './DomainsSection';
import { HeroSection } from './HeroSection';
import { PerformanceSection } from './PerformanceSection';
import { RatiosSection } from './RatiosSection';
import { RecommendationsSection } from './RecommendationsSection';
import { RegenerateSection } from './RegenerateSection';
import { StatusSection } from './StatusSection';
import { SummarySection } from './SummarySection';

export function ReportView({ data, createdAt }: { data: ReportData; createdAt: string }) {
  return (
    <FlexColumn $gap="lg">
      <HeroSection data={data} createdAt={createdAt} />
      <SummarySection summary={data.executive_summary} />
      {data.domains?.length > 0 && <StatusSection domains={data.domains} />}
      {data.domains?.length > 0 && <DomainsSection domains={data.domains} />}
      {data.ratios?.length > 0 && <RatiosSection ratios={data.ratios} />}
      {data.performance_impact && <PerformanceSection impact={data.performance_impact} />}
      {data.recommendations?.length > 0 && (
        <RecommendationsSection recommendations={data.recommendations} />
      )}
      <RegenerateSection />
    </FlexColumn>
  );
}
