import { theme } from '@package/ui';

import type { BiomarkerRangeCategory } from './classifyBiomarkers';

export interface BiomarkerRangeDisplayConfig {
  key: BiomarkerRangeCategory;
  label: string;
  labelEn: string;
  color: string;
}

export const BIOMARKER_RANGE_CONFIG: BiomarkerRangeDisplayConfig[] = [
  {
    key: 'performance',
    label: 'Optimaal',
    labelEn: 'Performance range',
    color: theme.colors.primary,
  },
  {
    key: 'normal',
    label: 'Let op',
    labelEn: 'Normal range',
    color: theme.colors.accent.orange.main,
  },
  {
    key: 'outOfRange',
    label: 'Buiten bereik',
    labelEn: 'Out of range',
    color: theme.colors.error.strong,
  },
];
