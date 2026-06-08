export interface Biomarker {
  id: number;
  name: string;
  display_name: string;
  unit: string;
  ref_male_min: number | null;
  ref_male_max: number | null;
  ref_female_min: number | null;
  ref_female_max: number | null;
  performance_male_min: number | null;
  performance_male_max: number | null;
  performance_female_min: number | null;
  performance_female_max: number | null;
  category: {
    id: number;
    name: string;
  };
}

export interface BiomarkerResult {
  value: number | string;
  unit: string;
  ref_low: number | null;
  ref_high: number | null;
  flag: string | null;
}
