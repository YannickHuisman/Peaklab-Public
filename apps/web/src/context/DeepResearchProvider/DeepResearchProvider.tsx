import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { DeepResearchReport, ReportSummary } from '@package/api';
import { authenticatedFetch, DeepResearchContext } from '@package/api';

const POLL_FIRST_INTERVAL = 3000;
const POLL_INTERVAL = 10000;
const POLL_TIMEOUT = 900000;

interface DeepResearchProviderProps {
  children: ReactNode;
}

export function DeepResearchProvider({ children }: DeepResearchProviderProps) {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [activeReport, setActiveReport] = useState<DeepResearchReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollStartRef = useRef<number>(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    };
  }, []);

  const pollForReport = useCallback((reportId: string) => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
    }

    pollStartRef.current = Date.now();

    const doPoll = async () => {
      if (!mountedRef.current) return;

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
          const listResponse = await authenticatedFetch('/api/deep-research');
          const updatedList: ReportSummary[] = listResponse.ok
            ? (await listResponse.json()).reports || []
            : [];

          if (!mountedRef.current) return;

          setGenerating(false);
          setActiveReport(data.report);
          setReports(updatedList);

          return;
        }

        if (data.report.status === 'failed') {
          const listResponse = await authenticatedFetch('/api/deep-research');
          const updatedList: ReportSummary[] = listResponse.ok
            ? (await listResponse.json()).reports || []
            : [];

          let restoredReport: DeepResearchReport | null = null;
          const previousCompleted = updatedList.find((r) => r.status === 'completed');

          if (previousCompleted) {
            const completedResponse = await authenticatedFetch(
              `/api/deep-research/${previousCompleted.id}`
            );

            if (completedResponse.ok) {
              restoredReport = (await completedResponse.json()).report;
            }
          }

          if (!mountedRef.current) return;

          setGenerating(false);
          setReports(updatedList);
          setActiveReport(restoredReport);

          return;
        }

        pollTimerRef.current = setTimeout(doPoll, POLL_INTERVAL);
      } catch {
        if (mountedRef.current) {
          pollTimerRef.current = setTimeout(doPoll, POLL_INTERVAL);
        }
      }
    };

    pollTimerRef.current = setTimeout(doPoll, POLL_FIRST_INTERVAL);
  }, []);

  const contextValue = useMemo(
    () => ({
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
    }),
    [reports, activeReport, loading, loadingReport, generating, error, pollForReport]
  );

  return (
    <DeepResearchContext.Provider value={contextValue}>{children}</DeepResearchContext.Provider>
  );
}
