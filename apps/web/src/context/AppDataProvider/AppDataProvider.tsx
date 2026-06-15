import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { authenticatedFetch } from '@helpers/authenticatedFetch';
import { exportMock } from '@helpers/exportMock';

import type { BiomarkerCategory, BiomarkerWithConfig, Partner } from '@package/api';
import { AppDataContext, useAuth } from '@package/api';

interface AppDataProviderProps {
  children: ReactNode;
}

interface PanelSummary {
  id: number;
  name: string;
  code: string;
}

export function AppDataProvider({ children }: AppDataProviderProps) {
  const { isAuthenticated, isAdmin } = useAuth();

  const [categories, setCategories] = useState<BiomarkerCategory[]>([]);
  const [biomarkers, setBiomarkers] = useState<BiomarkerWithConfig[]>([]);
  const [panels, setPanels] = useState<PanelSummary[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false);

  const fetchBiomarkers = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;
    try {
      const res = await authenticatedFetch('/api/biomarkers/admin/all');
      const data = await res.json();

      setBiomarkers(data.biomarkers || []);
      exportMock('biomarkersAdminAll', data);
    } catch {
      // swallow: empty list is a valid fallback
    }
  }, [isAuthenticated, isAdmin]);

  const fetchPartners = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await authenticatedFetch('/api/partners');
      const data = await res.json();

      setPartners(data.partners || []);
      exportMock('partners', data);
    } catch {
      // swallow: empty list is a valid fallback
    }
  }, [isAuthenticated]);

  const fetchPanels = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await authenticatedFetch('/api/panels');
      const data = await res.json();

      setPanels(data.panels || []);
    } catch {
      // swallow: empty list is a valid fallback
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      hasFetched.current = false;

      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await authenticatedFetch('/api/biomarkers/categories');
        const data = await res.json();

        setCategories(data.categories || []);
        exportMock('biomarkerCategories', data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    load();
    fetchBiomarkers();
    fetchPartners();
    fetchPanels();
  }, [isAuthenticated, fetchBiomarkers, fetchPartners, fetchPanels]);

  const contextValue = useMemo(
    () => ({
      categories,
      biomarkers,
      panels,
      partners,
      loading,
      error,
      refetchBiomarkers: fetchBiomarkers,
      refetchPanels: fetchPanels,
      refetchPartners: fetchPartners,
    }),
    [
      categories,
      biomarkers,
      panels,
      partners,
      loading,
      error,
      fetchBiomarkers,
      fetchPanels,
      fetchPartners,
    ]
  );

  return <AppDataContext.Provider value={contextValue}>{children}</AppDataContext.Provider>;
}
