import { useEffect } from 'react';

import { Icons } from '@components/Icons';
import { Loader } from '@components/Loader';
import { PageHeader } from '@components/PageHeader';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { DeepResearchProvider } from '@context/DeepResearchProvider';
import { useTranslation } from '@helpers/i18n';

import type { ReportData } from '@package/api';
import { useDeepResearch } from '@package/api';
import { theme } from '@package/ui';

import { EmptyState, FailedState, GeneratingState, ReportHistory, ReportView } from './components';

function DeepResearchInner() {
  const { t } = useTranslation();
  const {
    reports,
    activeReport,
    loading,
    loadingReport,
    generating,
    error,
    fetchReports,
    loadReport,
  } = useDeepResearch();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    if (!generating) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [generating]);

  if (loading) return <Loader />;

  const reportData =
    activeReport?.status === 'completed' ? (activeReport.report_data as ReportData) : null;

  const latestReport = reports[0];
  const showFailed = !generating && latestReport?.status === 'failed';
  const showEmpty = !generating && !reportData && !showFailed;

  return (
    <FlexColumn $gap="lg" $flex={1}>
      <PageHeader
        title={t('Deep Research')}
        subtitle={
          reportData
            ? t('Jouw uitgebreide biomarker analyse')
            : t('Ontgrendel diepgaande inzichten uit je bloedwaarden')
        }
        backHref="/biomarkers"
      />

      {error && !generating && (
        <StyledCard $variant="section" $tone="error" $noShadow>
          <FlexRow $gap="sm" $align="center">
            <Icons.AlertCircle size={20} color={theme.colors.error.strong} />
            <Paragraph $size="small" $color={theme.colors.error.strong}>
              {error}
            </Paragraph>
          </FlexRow>
        </StyledCard>
      )}

      {generating && <GeneratingState startedAt={latestReport?.created_at ?? null} />}

      {showFailed && (
        <FailedState
          errorMessage={latestReport.error_message}
          createdAt={latestReport.created_at}
        />
      )}

      <ReportHistory
        reports={reports}
        activeReportId={activeReport?.id || null}
        onSelect={loadReport}
      />

      {loadingReport && <Loader />}
      {!loadingReport && reportData && (
        <ReportView data={reportData} createdAt={activeReport?.created_at || ''} />
      )}
      {showEmpty && <EmptyState />}
    </FlexColumn>
  );
}

export function DeepResearch() {
  return (
    <DeepResearchProvider>
      <DeepResearchInner />
    </DeepResearchProvider>
  );
}
