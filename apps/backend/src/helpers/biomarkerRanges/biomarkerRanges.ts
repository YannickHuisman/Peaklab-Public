import { supabaseAdmin } from '../supabaseClient';

interface BiomarkerRanges {
  unit: string | null;
  ref_male_min: number | null;
  ref_male_max: number | null;
  ref_female_min: number | null;
  ref_female_max: number | null;
  performance_male_min: number | null;
  performance_male_max: number | null;
  performance_female_min: number | null;
  performance_female_max: number | null;
}

interface LabRefRow {
  unit: string;
  lab_ref_min: number | null;
  lab_ref_max: number | null;
  ref_male_min: number | null;
  ref_male_max: number | null;
  ref_female_min: number | null;
  ref_female_max: number | null;
  performance_male_min: number | null;
  performance_male_max: number | null;
  performance_female_min: number | null;
  performance_female_max: number | null;
  biomarker_id?: number;
}

/**
 * Build BiomarkerRanges from a lab reference row.
 * Falls back to lab_ref_min/lab_ref_max when gender-specific ref columns are null.
 */
function labRefToRanges(ref: LabRefRow): BiomarkerRanges {
  return {
    unit: ref.unit,
    ref_male_min: ref.ref_male_min ?? ref.lab_ref_min,
    ref_male_max: ref.ref_male_max ?? ref.lab_ref_max,
    ref_female_min: ref.ref_female_min ?? ref.lab_ref_min,
    ref_female_max: ref.ref_female_max ?? ref.lab_ref_max,
    performance_male_min: ref.performance_male_min,
    performance_male_max: ref.performance_male_max,
    performance_female_min: ref.performance_female_min,
    performance_female_max: ref.performance_female_max,
  };
}

const LAB_REF_SELECT =
  'unit, lab_ref_min, lab_ref_max, ref_male_min, ref_male_max, ref_female_min, ref_female_max, performance_male_min, performance_male_max, performance_female_min, performance_female_max';

/**
 * Get all lab reference ranges for a given lab, indexed by biomarker_id.
 * More efficient than calling getBiomarkerRanges per biomarker.
 */
export async function getLabRangesMap(labId: number | null): Promise<Map<number, BiomarkerRanges>> {
  const map = new Map<number, BiomarkerRanges>();

  if (!labId) return map;

  const { data } = await supabaseAdmin
    .from('lab_biomarker_references')
    .select(`biomarker_id, ${LAB_REF_SELECT}`)
    .eq('lab_id', labId);

  for (const ref of data || []) {
    map.set(ref.biomarker_id, labRefToRanges(ref as LabRefRow));
  }

  return map;
}

/**
 * Given a biomarker object (from DB) and an optional lab ranges map,
 * return the effective ranges: lab-specific if available, otherwise the biomarker defaults.
 */
export function resolveRanges(
  biomarker: Record<string, unknown>,
  labRangesMap: Map<number, BiomarkerRanges>
): BiomarkerRanges {
  const biomarkerId = biomarker.id as number;
  const labRef = labRangesMap.get(biomarkerId);

  return {
    unit: (labRef?.unit ?? biomarker.unit ?? null) as string | null,
    ref_male_min: (labRef?.ref_male_min ?? biomarker.ref_male_min ?? null) as number | null,
    ref_male_max: (labRef?.ref_male_max ?? biomarker.ref_male_max ?? null) as number | null,
    ref_female_min: (labRef?.ref_female_min ?? biomarker.ref_female_min ?? null) as number | null,
    ref_female_max: (labRef?.ref_female_max ?? biomarker.ref_female_max ?? null) as number | null,
    performance_male_min: (labRef?.performance_male_min ??
      biomarker.performance_male_min ??
      null) as number | null,
    performance_male_max: (labRef?.performance_male_max ??
      biomarker.performance_male_max ??
      null) as number | null,
    performance_female_min: (labRef?.performance_female_min ??
      biomarker.performance_female_min ??
      null) as number | null,
    performance_female_max: (labRef?.performance_female_max ??
      biomarker.performance_female_max ??
      null) as number | null,
  };
}
