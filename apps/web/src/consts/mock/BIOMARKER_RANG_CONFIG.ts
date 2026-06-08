// Mock config for biomarker ranges and units
export const BIOMARKER_RANGE_CONFIG: Record<
  number,
  {
    unit: string;
    normalRange: { label: string; min: number; max: number };
    performanceRange?: { label: string; min: number; max: number };
  }
> = {
  1: {
    // Hemoglobine
    unit: 'mmol/L',
    normalRange: { label: 'Normal', min: 8.5, max: 10.5 },
    performanceRange: { label: 'Performance', min: 9, max: 10 },
  },
  7: {
    // Testosteron
    unit: 'nmol/L',
    normalRange: { label: 'Normal', min: 12, max: 28 },
    performanceRange: { label: 'Performance', min: 23, max: 25 },
    // performanceRange: { label: 'Performance', min: 18, max: 25 },
  },
  8: {
    // Cortisol
    unit: 'nmol/L',
    normalRange: { label: 'Normal', min: 150, max: 600 },
    performanceRange: { label: 'Performance', min: 200, max: 500 },
  },
  9: {
    // TSH
    unit: 'mU/L',
    normalRange: { label: 'Normal', min: 0.4, max: 3.5 },
    performanceRange: { label: 'Performance', min: 0.5, max: 2.5 },
  },
  15: {
    // Vitamine D
    unit: 'nmol/L',
    normalRange: { label: 'Normal', min: 50, max: 120 },
    performanceRange: { label: 'Performance', min: 75, max: 100 },
  },
  18: {
    // Ferritine
    unit: 'µg/L',
    normalRange: { label: 'Normal', min: 30, max: 200 },
    performanceRange: { label: 'Performance', min: 50, max: 150 },
  },
  21: {
    // Natrium
    unit: 'mmol/L',
    normalRange: { label: 'Normal', min: 135, max: 145 },
    performanceRange: { label: 'Performance', min: 137, max: 143 },
  },
  23: {
    // Magnesium
    unit: 'mmol/L',
    normalRange: { label: 'Normal', min: 0.7, max: 1.1 },
    performanceRange: { label: 'Performance', min: 0.8, max: 1.0 },
  },
  24: {
    // CK
    unit: 'U/L',
    normalRange: { label: 'Normal', min: 50, max: 200 },
    performanceRange: { label: 'Performance', min: 60, max: 180 },
  },
  28: {
    // Bilirubine, totaal
    unit: 'µmol/L',
    normalRange: { label: 'Normal', min: 5, max: 21 },
    performanceRange: { label: 'Performance', min: 8, max: 18 },
  },
};
