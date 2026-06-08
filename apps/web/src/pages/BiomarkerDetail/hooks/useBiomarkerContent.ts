import { useState } from 'react';

import { authenticatedFetch } from '@helpers/authenticatedFetch';

import type { Biomarker, ScientificSource } from '@package/api';

interface ContentValues {
  what_it_measures: string;
  why_relevant: string;
  interpretation: string;
  how_to_optimize: string;
  optimization_tips: string[];
  scientific_sources: ScientificSource[];
}

interface UseBiomarkerContentOptions {
  onSave?: () => void;
}

export function useBiomarkerContent(biomarker: Biomarker, options?: UseBiomarkerContentOptions) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editValues, setEditValues] = useState<ContentValues>({
    what_it_measures: '',
    why_relevant: '',
    interpretation: '',
    how_to_optimize: '',
    optimization_tips: [],
    scientific_sources: [],
  });

  const startEditing = () => {
    const {
      what_it_measures,
      why_relevant,
      interpretation,
      how_to_optimize,
      optimization_tips,
      scientific_sources,
    } = biomarker;

    setEditValues({
      what_it_measures: what_it_measures || '',
      why_relevant: why_relevant || '',
      interpretation: interpretation || '',
      how_to_optimize: how_to_optimize || '',
      optimization_tips: optimization_tips?.length ? [...optimization_tips] : [''],
      scientific_sources: scientific_sources?.length
        ? scientific_sources.map((s) => ({ ...s }))
        : [{ title: '', url: '' }],
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveContent = async () => {
    setIsSaving(true);

    try {
      const payload = {
        what_it_measures: editValues.what_it_measures || null,
        why_relevant: editValues.why_relevant || null,
        interpretation: editValues.interpretation || null,
        how_to_optimize: editValues.how_to_optimize || null,
        optimization_tips: editValues.optimization_tips.filter((t) => t.trim() !== ''),
        scientific_sources: editValues.scientific_sources.filter((s) => s.title.trim() !== ''),
      };

      const response = await authenticatedFetch(`/api/biomarkers/admin/${biomarker.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsEditing(false);
        options?.onSave?.();
      }
    } catch {
      // editing state stays open
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof ContentValues, value: string) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const addTip = () => {
    setEditValues((prev) => ({
      ...prev,
      optimization_tips: [...prev.optimization_tips, ''],
    }));
  };

  const updateTip = (index: number, value: string) => {
    setEditValues((prev) => {
      const tips = [...prev.optimization_tips];

      tips[index] = value;

      return { ...prev, optimization_tips: tips };
    });
  };

  const removeTip = (index: number) => {
    setEditValues((prev) => ({
      ...prev,
      optimization_tips: prev.optimization_tips.filter((_, i) => i !== index),
    }));
  };

  const addSource = () => {
    setEditValues((prev) => ({
      ...prev,
      scientific_sources: [...prev.scientific_sources, { title: '', url: '' }],
    }));
  };

  const updateSource = (index: number, field: keyof ScientificSource, value: string) => {
    setEditValues((prev) => {
      const sources = [...prev.scientific_sources];

      sources[index] = { ...sources[index], [field]: value };

      return { ...prev, scientific_sources: sources };
    });
  };

  const removeSource = (index: number) => {
    setEditValues((prev) => ({
      ...prev,
      scientific_sources: prev.scientific_sources.filter((_, i) => i !== index),
    }));
  };

  return {
    isEditing,
    isSaving,
    editValues,
    startEditing,
    cancelEditing,
    saveContent,
    updateField,
    addTip,
    updateTip,
    removeTip,
    addSource,
    updateSource,
    removeSource,
  };
}
