import type { BiomarkerResult } from '@package/api';
import { assessBiomarkerStatus, scoreFromStatuses } from '@package/utils';

export function calculatePeakScore(
  biomarkers: BiomarkerResult[],
  gender: 'male' | 'female' = 'male'
): number {
  const statuses = biomarkers.map(({ value, biomarker: b }) =>
    assessBiomarkerStatus(
      value,
      gender === 'female' ? b.ref_female_min : b.ref_male_min,
      gender === 'female' ? b.ref_female_max : b.ref_male_max,
      gender === 'female' ? b.performance_female_min : b.performance_male_min,
      gender === 'female' ? b.performance_female_max : b.performance_male_max
    )
  );

  return scoreFromStatuses(statuses);
}
