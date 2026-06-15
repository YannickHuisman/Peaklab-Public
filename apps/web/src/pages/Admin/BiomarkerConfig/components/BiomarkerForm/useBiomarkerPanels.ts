import { useEffect, useState } from 'react';

import { authenticatedFetch } from '@helpers/authenticatedFetch';

import type { BiomarkerWithConfig } from '@package/api';

export function useBiomarkerPanels(biomarker: BiomarkerWithConfig | null) {
  const [selectedPanels, setSelectedPanels] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!biomarker) {
      setLoading(false);

      return;
    }

    if (biomarker.panels && Array.isArray(biomarker.panels)) {
      setSelectedPanels(biomarker.panels.map((p) => p.panel_id));
      setLoading(false);

      return;
    }

    (async () => {
      try {
        const res = await authenticatedFetch(`/api/panels/biomarker/${biomarker.id}`);
        const data = await res.json();
        const panelIds = data.panels?.map((p: { panel_id: number }) => p.panel_id) ?? [];

        setSelectedPanels(panelIds);
      } catch {
        // empty selection is a valid fallback
      } finally {
        setLoading(false);
      }
    })();
  }, [biomarker]);

  return { selectedPanels, setSelectedPanels, loading };
}
