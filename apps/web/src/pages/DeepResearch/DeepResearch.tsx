import { useEffect } from 'react';

import { Loader } from '@components/Loader';
import { PageHeader } from '@components/PageHeader';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import type { ReportData } from '@package/api';
import { useDeepResearch } from '@package/api';
import { theme } from '@package/ui';

import { EmptyState, GeneratingState, ReportHistory, ReportView } from './components';

export function DeepResearch() {
  const { t } = useTranslation();
  const {
    reports,
    activeReport,
    loading,
    loadingReport,
    generating,
    error,
    canGenerate,
    nextAvailableDate,
    fetchReports,
    loadReport,
    generateReport,
  } = useDeepResearch();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  if (loading) return <Loader />;

  const reportData =
    activeReport?.status === 'completed' ? (activeReport.report_data as ReportData) : null;

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

      {error && (
        <StyledCard $variant="small" $tone="error" $noShadow>
          <Paragraph $size="small" $color={theme.colors.error.strong}>
            {error}
          </Paragraph>
        </StyledCard>
      )}

      {generating && <GeneratingState />}

      <ReportHistory
        reports={reports}
        activeReportId={activeReport?.id || null}
        onSelect={loadReport}
      />

      {loadingReport && <Loader />}
      {!loadingReport && reportData && (
        <ReportView
          data={reportData}
          createdAt={activeReport?.created_at || ''}
          canGenerate={canGenerate}
          nextAvailableDate={nextAvailableDate}
          onRegenerate={generateReport}
        />
      )}
      {!loadingReport && !reportData && !generating && (
        <EmptyState
          canGenerate={canGenerate}
          nextAvailableDate={nextAvailableDate}
          onGenerate={generateReport}
        />
      )}
    </FlexColumn>
  );
}
