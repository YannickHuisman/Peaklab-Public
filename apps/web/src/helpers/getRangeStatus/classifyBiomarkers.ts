import type { BiomarkerResult } from '@package/api';

import { getRangeStatus } from './getRangeStatus';

export type BiomarkerRangeCategory = 'performance' | 'normal' | 'outOfRange';

export interface BiomarkerCounts {
  total: number;
  performance: number;
  normal: number;
  outOfRange: number;
}

/**
 * Classify a single biomarker result into a range category
 * using the existing getRangeStatus logic.
 * Uses male ranges by default; pass gender to select the appropriate ranges.
 */
export function classifyBiomarker(
  biomarker: BiomarkerResult,
  gender: 'male' | 'female' = 'male'
): BiomarkerRangeCategory {
  const { value, biomarker: meta } = biomarker;

  const ref_min = gender === 'female' ? meta.ref_female_min : meta.ref_male_min;
  const ref_max = gender === 'female' ? meta.ref_female_max : meta.ref_male_max;
  const perf_min = gender === 'female' ? meta.performance_female_min : meta.performance_male_min;
  const perf_max = gender === 'female' ? meta.performance_female_max : meta.performance_male_max;

  if (ref_min === null || ref_max === null) {
    return 'normal';
  }

  const normalRange = { min: ref_min, max: ref_max };
  const performanceRange =
    perf_min !== null && perf_max !== null ? { min: perf_min, max: perf_max } : undefined;

  const status = getRangeStatus(value, normalRange, performanceRange);

  if (status.tone === 'error') return 'outOfRange';

  if (status.tone === 'success') return 'performance';

  return 'normal';
}

/**
 * Count biomarkers by range category.
 */
export function countBiomarkersByRange(
  biomarkers: BiomarkerResult[],
  gender: 'male' | 'female' = 'male'
): BiomarkerCounts {
  const counts: BiomarkerCounts = { total: 0, performance: 0, normal: 0, outOfRange: 0 };

  for (const biomarker of biomarkers) {
    counts.total++;
    const category = classifyBiomarker(biomarker, gender);

    counts[category]++;
  }

  return counts;
}
