export type BiomarkerStatus = 'optimal' | 'good' | 'attention' | 'concern';

export const STATUS_SCORES: Record<BiomarkerStatus, number> = {
  optimal: 100,
  good: 75,
  attention: 40,
  concern: 10,
};

// How far outside the reference range a value can be before escalating from attention → concern
export const ATTENTION_DEVIATION_THRESHOLD = 0.2;

/**
 * Maps a biomarker value against its reference and performance ranges to a 4-tier status.
 *
 * optimal   — within performance range
 * good      — within reference range
 * attention — slightly outside reference (≤ ATTENTION_DEVIATION_THRESHOLD)
 * concern   — significantly outside reference
 */
export function assessBiomarkerStatus(
  value: number,
  refMin: number | null,
  refMax: number | null,
  perfMin: number | null,
  perfMax: number | null
): BiomarkerStatus {
  if (perfMin !== null && perfMax !== null && value >= perfMin && value <= perfMax) {
    return 'optimal';
  }

  if (refMin !== null && refMax !== null) {
    if (value >= refMin && value <= refMax) return 'good';

    const range = refMax - refMin;

    if (range > 0) {
      const deviation = value < refMin ? (refMin - value) / range : (value - refMax) / range;

      if (deviation <= ATTENTION_DEVIATION_THRESHOLD) return 'attention';
    }

    return 'concern';
  }

  return 'good';
}

/**
 * Calculates a 0–100 score from a list of biomarker statuses.
 * Returns 50 when the list is empty.
 */
export function scoreFromStatuses(statuses: BiomarkerStatus[]): number {
  if (statuses.length === 0) return 50;

  const total = statuses.reduce((sum, s) => sum + STATUS_SCORES[s], 0);

  return Math.round(total / statuses.length);
}

/**
 * Privacy-preserving bucket for sending biomarker context to AI providers.
 * Captures where a value falls relative to its ranges without leaking the value itself.
 */
export type RangeBucket =
  | 'performance_range'
  | 'normal_range'
  | 'out_of_range_high'
  | 'out_of_range_low';

export function assessRangeBucket(
  value: number,
  refMin: number | null,
  refMax: number | null,
  perfMin: number | null,
  perfMax: number | null
): RangeBucket {
  if (perfMin !== null && perfMax !== null && value >= perfMin && value <= perfMax) {
    return 'performance_range';
  }

  if (refMin !== null && value < refMin) return 'out_of_range_low';
  if (refMax !== null && value > refMax) return 'out_of_range_high';

  return 'normal_range';
}
