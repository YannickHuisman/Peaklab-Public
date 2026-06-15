import type { BiomarkerKind, BiomarkerWithConfig, ScientificSource } from '@package/api';

export interface DependencyFormItem {
  source_id: number;
  role: string;
}

export interface BiomarkerFormData {
  name: string;
  display_name: string;
  category_id: number;
  unit: string;
  kind: BiomarkerKind;
  formula: string;
  dependencies: DependencyFormItem[];
  ref_male_min: string;
  ref_male_max: string;
  ref_female_min: string;
  ref_female_max: string;
  performance_male_min: string;
  performance_male_max: string;
  performance_female_min: string;
  performance_female_max: string;
  is_active: boolean;
  what_it_measures: string;
  why_relevant: string;
  interpretation: string;
  how_to_optimize: string;
  optimization_tips: string[];
  scientific_sources: ScientificSource[];
}

export type FormTab = 'basic' | 'content';

export function biomarkerToFormData(
  biomarker: BiomarkerWithConfig | null,
  defaultCategoryId: number
): BiomarkerFormData {
  return {
    name: biomarker?.name || '',
    display_name: biomarker?.display_name || '',
    category_id: biomarker?.category?.id || defaultCategoryId,
    unit: biomarker?.unit || '',
    kind: biomarker?.kind || 'direct',
    formula: biomarker?.formula || '',
    dependencies:
      biomarker?.dependencies?.map((d) => ({
        source_id: d.source_id,
        role: d.role,
      })) || [],
    ref_male_min: biomarker?.ref_male_min?.toString() || '',
    ref_male_max: biomarker?.ref_male_max?.toString() || '',
    ref_female_min: biomarker?.ref_female_min?.toString() || '',
    ref_female_max: biomarker?.ref_female_max?.toString() || '',
    performance_male_min: biomarker?.performance_male_min?.toString() || '',
    performance_male_max: biomarker?.performance_male_max?.toString() || '',
    performance_female_min: biomarker?.performance_female_min?.toString() || '',
    performance_female_max: biomarker?.performance_female_max?.toString() || '',
    is_active: biomarker?.is_active ?? true,
    what_it_measures: biomarker?.what_it_measures || '',
    why_relevant: biomarker?.why_relevant || '',
    interpretation: biomarker?.interpretation || '',
    how_to_optimize: biomarker?.how_to_optimize || '',
    optimization_tips: biomarker?.optimization_tips || [],
    scientific_sources: biomarker?.scientific_sources || [],
  };
}

export function formDataToPayload(formData: BiomarkerFormData) {
  const isDirect = formData.kind === 'direct';

  return {
    name: formData.name,
    display_name: formData.display_name,
    category_id: Number(formData.category_id),
    unit: formData.unit || null,
    kind: formData.kind,
    formula: isDirect ? null : formData.formula.trim() || null,
    dependencies: isDirect
      ? []
      : formData.dependencies
          .filter((d) => d.source_id && d.role.trim() !== '')
          .map((d, index) => ({
            source_id: Number(d.source_id),
            role: d.role.trim(),
            sort_order: index,
          })),
    ref_male_min: formData.ref_male_min ? Number(formData.ref_male_min) : null,
    ref_male_max: formData.ref_male_max ? Number(formData.ref_male_max) : null,
    ref_female_min: formData.ref_female_min ? Number(formData.ref_female_min) : null,
    ref_female_max: formData.ref_female_max ? Number(formData.ref_female_max) : null,
    performance_male_min: formData.performance_male_min
      ? Number(formData.performance_male_min)
      : null,
    performance_male_max: formData.performance_male_max
      ? Number(formData.performance_male_max)
      : null,
    performance_female_min: formData.performance_female_min
      ? Number(formData.performance_female_min)
      : null,
    performance_female_max: formData.performance_female_max
      ? Number(formData.performance_female_max)
      : null,
    is_active: formData.is_active,
    what_it_measures: formData.what_it_measures || null,
    why_relevant: formData.why_relevant || null,
    interpretation: formData.interpretation || null,
    how_to_optimize: formData.how_to_optimize || null,
    optimization_tips: formData.optimization_tips.filter((tip) => tip.trim() !== ''),
    scientific_sources: formData.scientific_sources.filter((s) => s.title.trim() !== ''),
  };
}
