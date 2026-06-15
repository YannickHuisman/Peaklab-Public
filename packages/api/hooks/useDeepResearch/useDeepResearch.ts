import { useCallback, useContext } from 'react';

import { DeepResearchContext } from '../../context/DeepResearchContext';
import type { ReportSummary } from '../../types/deepResearch';
import { authenticatedFetch } from '../../utils/authenticatedFetch';

export type {
  DeepResearchReport,
  Domain,
  DomainBiomarker,
  PerformanceImpact,
  Ratio,
  Recommendation,
  ReportData,
  ReportSummary,
} from '../../types/deepResearch';

export function useDeepResearch() {
  const context = useContext(DeepResearchContext);

  if (!context) {
    throw new Error('useDeepResearch must be used within a DeepResearchProvider');
  }

  const {
    reports,
    setReports,
    activeReport,
    setActiveReport,
    loading,
    setLoading,
    loadingReport,
    setLoadingReport,
    generating,
    setGenerating,
    error,
    setError,
    pollForReport,
  } = context;

  const loadReport = useCallback(
    async (reportId: string) => {
      try {
        setLoadingReport(true);

        const response = await authenticatedFetch(`/api/deep-research/${reportId}`);

        if (!response.ok) throw new Error('Kon rapport niet laden');

        const data = await response.json();

        setActiveReport(data.report);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Onbekende fout');
      } finally {
        setLoadingReport(false);
      }
    },
    [setActiveReport, setError, setLoadingReport]
  );

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authenticatedFetch('/api/deep-research');

      if (!response.ok) throw new Error('Kon rapporten niet ophalen');

      const data = await response.json();
      const reportList: ReportSummary[] = data.reports || [];

      setReports(reportList);

      const generatingReport = reportList.find((r) => r.status === 'generating');

      if (generatingReport) {
        setGenerating(true);
        pollForReport(generatingReport.id);
      }

      const latestCompleted = reportList.find((r) => r.status === 'completed');

      if (latestCompleted) {
        await loadReport(latestCompleted.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout');
    } finally {
      setLoading(false);
    }
  }, [loadReport, pollForReport, setError, setGenerating, setLoading, setReports]);

  const generateReport = useCallback(async () => {
    try {
      setGenerating(true);
      setError(null);

      const response = await authenticatedFetch('/api/deep-research/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setGenerating(false);
          setError(data.error);

          return;
        }

        throw new Error(data.error || 'Kon rapport niet genereren');
      }

      const newSummary: ReportSummary = {
        id: data.reportId,
        status: 'generating',
        summary: null,
        created_at: new Date().toISOString(),
        completed_at: null,
        error_message: null,
        blood_test_id: '',
      };

      setReports((prev) => [newSummary, ...prev]);
      pollForReport(data.reportId);
    } catch (err) {
      setGenerating(false);
      setError(err instanceof Error ? err.message : 'Onbekende fout');
    }
  }, [pollForReport, setError, setGenerating, setReports]);

  const canGenerate: boolean = (() => {
    // TODO: uncomment when live
    return true;
    if (reports.length === 0) return true;

    const latest = reports[0];

    if (latest.status === 'failed') return true;

    const createdAt = new Date(latest.created_at);
    const thirtyDaysLater = new Date(createdAt);

    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    return new Date() >= thirtyDaysLater;
  })();

  const nextAvailableDate: Date | null = (() => {
    // TODO: uncomment when live
    return null;
    if (reports.length === 0) return null;

    const latest = reports[0];

    if (latest.status === 'failed') return null;

    const createdAt = new Date(latest.created_at);
    const thirtyDaysLater = new Date(createdAt);

    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    return thirtyDaysLater > new Date() ? thirtyDaysLater : null;
  })();

  return {
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
  };
}
