import { ChatBot } from '@components/ChatBot';
import { PageHeader } from '@components/PageHeader';
import { FlexColumn } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';
import type { ChatUserContext } from '@helpers/llmClient';

import type { BiomarkerResult } from '@package/api';

import type { PerformanceFormData, PerformanceTipsData } from '../types';
import { PerformancePlanView } from './PerformancePlan';
import { PerformanceSnapshot } from './PerformanceSnapshot';
import type { SnapshotCardType } from './PerformanceSnapshot/PerformanceSnapshot';

interface PerformanceResultsViewProps {
  formData: PerformanceFormData;
  tipsData: PerformanceTipsData;
  biomarkers: BiomarkerResult[];
  chatUserContext: ChatUserContext;
  hasFormDataChanged: boolean;
  isRegenerating: boolean;
  onEditCard: (card: SnapshotCardType) => void;
  onEditTips: () => void;
  onRegenerate: () => void;
}

export function PerformanceResultsView({
  formData,
  tipsData,
  biomarkers,
  chatUserContext,
  hasFormDataChanged,
  isRegenerating,
  onEditCard,
  onEditTips,
  onRegenerate,
}: PerformanceResultsViewProps) {
  const { t } = useTranslation();

  return (
    <FlexColumn $gap="xl">
      <PageHeader
        title={t('Performance Dashboard')}
        subtitle={t('Jouw gepersonaliseerde performance overzicht')}
      />

      <PerformanceSnapshot formData={formData} biomarkers={biomarkers} onEditCard={onEditCard} />

      <StyledCard $variant="section">
        <PerformancePlanView
          tipsData={tipsData}
          onEditTips={onEditTips}
          onRegenerate={hasFormDataChanged ? onRegenerate : undefined}
          isRegenerating={isRegenerating}
        />
      </StyledCard>

      <StyledCard $variant="section">
        <ChatBot userContext={chatUserContext} />
      </StyledCard>
    </FlexColumn>
  );
}
