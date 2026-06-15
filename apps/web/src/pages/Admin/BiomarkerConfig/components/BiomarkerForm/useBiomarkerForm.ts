import { useEffect, useRef } from 'react';

import { authenticatedFetch } from '@helpers/authenticatedFetch';
import { useForm } from '@hooks/useForm';

import type { BiomarkerCategory, BiomarkerWithConfig } from '@package/api';

import { type BiomarkerFormData, biomarkerToFormData, formDataToPayload } from './types';
import { makeMaxValidator, makeMinValidator } from './validation';

interface UseBiomarkerFormOptions {
  biomarker: BiomarkerWithConfig | null;
  categories: BiomarkerCategory[];
  selectedPanels: number[];
  onSuccess: () => void;
}

export function useBiomarkerForm({
  biomarker,
  categories,
  selectedPanels,
  onSuccess,
}: UseBiomarkerFormOptions) {
  const hasMounted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      hasMounted.current = true;
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const form = useForm<BiomarkerFormData>({
    initialValues: biomarkerToFormData(biomarker, categories[0]?.id ?? 0),
    requiredFields: ['name', 'display_name', 'category_id'],
    validationRules: {
      ref_male_min: makeMinValidator('ref_male_max'),
      ref_male_max: makeMaxValidator('ref_male_min'),
      ref_female_min: makeMinValidator('ref_female_max'),
      ref_female_max: makeMaxValidator('ref_female_min'),
      performance_male_min: makeMinValidator('performance_male_max'),
      performance_male_max: makeMaxValidator('performance_male_min'),
      performance_female_min: makeMinValidator('performance_female_max'),
      performance_female_max: makeMaxValidator('performance_female_min'),
    },
    onSubmit: async (formData) => {
      if (!hasMounted.current) return;

      const payload = formDataToPayload(formData);

      const targetId = biomarker?.id;
      const response = targetId
        ? await authenticatedFetch(`/api/biomarkers/admin/${targetId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await authenticatedFetch('/api/biomarkers/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      if (!response.ok) return;

      const idForPanels = targetId ?? (await response.json()).biomarker?.id;

      if (idForPanels) {
        await authenticatedFetch(`/api/panels/biomarker/${idForPanels}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ panelIds: selectedPanels }),
        });
      }

      onSuccess();
    },
  });

  return form;
}
