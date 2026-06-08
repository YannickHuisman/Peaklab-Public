import { useCallback, useEffect, useRef, useState } from 'react';

import { authenticatedFetch } from '../../utils/authenticatedFetch';

export interface DeepResearchReport {
  id: string;
  user_id: string;
  blood_test_id: string;
  status: 'generating' | 'completed' | 'failed';
  summary: string | null;
  report_data: ReportData | null;
  created_at: string;
  completed_at: string | null;
  error_message: string | null;
}

export interface ReportSummary {
  id: string;
  status: 'generating' | 'completed' | 'failed';
  summary: string | null;
  created_at: string;
  completed_at: string | null;
  error_message: string | null;
  blood_test_id: string;
}

export interface ReportData {
  executive_summary: string;
  overall_score: number;
  domains: Domain[];
  ratios: Ratio[];
  performance_impact: PerformanceImpact;
  recommendations: Recommendation[];
}

export interface Domain {
  name: string;
  score: number;
  status: 'optimal' | 'good' | 'attention' | 'concern';
  summary: string;
  biomarkers: DomainBiomarker[];
  insights: string[];
}

export interface DomainBiomarker {
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'good' | 'attention' | 'concern';
  interpretation: string;
}

export interface Ratio {
  name: string;
  value: number;
  optimal_range: string;
  status: 'optimal' | 'good' | 'attention' | 'concern';
  interpretation: string;
}

export interface PerformanceImpact {
  strengths: string[];
  areas_for_improvement: string[];
  sport_specific_notes: string;
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
}

const POLL_INTERVAL = 10000; // 10 seconds
const POLL_TIMEOUT = 900000; // 15 minutes

export function useDeepResearch() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [activeReport, setActiveReport] = useState<DeepResearchReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollStartRef = useRef<number>(0);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    };
  }, []);

  // Fetch all reports (lightweight list)
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authenticatedFetch('/api/deep-research');

      if (!response.ok) {
        throw new Error('Kon rapporten niet ophalen');
      }

      const data = await response.json();

      if (!mountedRef.current) return;

      const reportList: ReportSummary[] = data.reports || [];

      setReports(reportList);

      // Auto-select: if something is generating, track it; otherwise select the latest completed
      const generatingReport = reportList.find((r) => r.status === 'generating');

      if (generatingReport) {
        setGenerating(true);
        pollStartRef.current = Date.now();
        pollForReport(generatingReport.id);
      }

      // Auto-load the latest completed report if nothing is actively selected
      const latestCompleted = reportList.find((r) => r.status === 'completed');

      if (latestCompleted) {
        await loadReport(latestCompleted.id);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Onbekende fout');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Load a full report by ID
  const loadReport = useCallback(async (reportId: string) => {
    try {
      setLoadingReport(true);

      const response = await authenticatedFetch(`/api/deep-research/${reportId}`);

      if (!response.ok) throw new Error('Kon rapport niet laden');

      const data = await response.json();

      if (mountedRef.current) {
        setActiveReport(data.report);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Onbekende fout');
      }
    } finally {
      if (mountedRef.current) {
        setLoadingReport(false);
      }
    }
  }, []);

  // Poll for a specific report until completed/failed
  const pollForReport = useCallback((reportId: string) => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
    }

    const doPoll = async () => {
      if (!mountedRef.current) return;

      // Check timeout
      if (Date.now() - pollStartRef.current > POLL_TIMEOUT) {
        setGenerating(false);
        setError('Het genereren duurt langer dan verwacht. Probeer de pagina te vernieuwen.');

        return;
      }

      try {
        const response = await authenticatedFetch(`/api/deep-research/${reportId}`);

        if (!response.ok) throw new Error('Polling mislukt');

        const data = await response.json();

        if (!mountedRef.current) return;

        if (data.report.status === 'completed') {
          setGenerating(false);
          setActiveReport(data.report);

          // Refresh the list to update statuses
          const listResponse = await authenticatedFetch('/api/deep-research');

          if (listResponse.ok) {
            const listData = await listResponse.json();

            if (mountedRef.current) {
              setReports(listData.reports || []);
            }
          }

          return;
        }

        if (data.report.status === 'failed') {
          setGenerating(false);
          setError(data.report.error_message || 'Het genereren is mislukt. Probeer het opnieuw.');

          // Refresh the list
          const listResponse = await authenticatedFetch('/api/deep-research');

          if (listResponse.ok) {
            const listData = await listResponse.json();

            if (mountedRef.current) {
              setReports(listData.reports || []);
            }
          }

          return;
        }

        // Still generating, poll again
        pollTimerRef.current = setTimeout(doPoll, POLL_INTERVAL);
      } catch {
        if (mountedRef.current) {
          pollTimerRef.current = setTimeout(doPoll, POLL_INTERVAL);
        }
      }
    };

    pollTimerRef.current = setTimeout(doPoll, POLL_INTERVAL);
  }, []);

  // Generate a new report
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
          setError(data.error);
          setGenerating(false);

          return;
        }

        throw new Error(data.error || 'Kon rapport niet genereren');
      }

      if (!mountedRef.current) return;

      // Add the generating report to the list
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

      // Start polling
      pollStartRef.current = Date.now();
      pollForReport(data.reportId);
    } catch (err) {
      if (mountedRef.current) {
        setGenerating(false);
        setError(err instanceof Error ? err.message : 'Onbekende fout');
      }
    }
  }, [pollForReport]);

  // Derived state
  const canGenerate = (() => {
    if (reports.length === 0) return true;

    const latest = reports[0];

    if (latest.status === 'failed') return true;

    const createdAt = new Date(latest.created_at);
    const thirtyDaysLater = new Date(createdAt);

    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    return new Date() >= thirtyDaysLater;
  })();

  const nextAvailableDate = (() => {
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
