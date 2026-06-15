import type { BiomarkerResult } from '@package/api';

export interface BiomarkerRangeConfig {
  unit: string;
  normalRange: { label: string; min: number; max: number };
  performanceRange?: { label: string; min: number; max: number };
}

/**
 * Build a range config from a BiomarkerResult.
 * Returns null when the biomarker lacks the required metadata (unit, ref ranges).
 * Uses male ranges by default; pass gender to select the appropriate ranges.
 */
export function buildBiomarkerConfig(
  biomarker: BiomarkerResult,
  gender: 'male' | 'female' = 'male'
): BiomarkerRangeConfig | null {
  const b = biomarker.biomarker;
  const unit = b.unit;
  const ref_min = gender === 'female' ? b.ref_female_min : b.ref_male_min;
  const ref_max = gender === 'female' ? b.ref_female_max : b.ref_male_max;
  const perf_min = gender === 'female' ? b.performance_female_min : b.performance_male_min;
  const perf_max = gender === 'female' ? b.performance_female_max : b.performance_male_max;

  if (!unit || ref_min === null || ref_max === null) return null;

  return {
    unit,
    normalRange: { label: 'Normal', min: ref_min, max: ref_max },
    performanceRange:
      perf_min !== null && perf_max !== null
        ? { label: 'Performance', min: perf_min, max: perf_max }
        : undefined,
  };
}
