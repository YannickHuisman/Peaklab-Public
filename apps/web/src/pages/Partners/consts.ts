import type { TabItem } from '@components/Tabs';
import {
  GENDER_OPTIONS as BASE_GENDER_OPTIONS,
  REGION_OPTIONS as BASE_REGION_OPTIONS,
  SPECIALIZATION_OPTIONS as BASE_SPECIALIZATION_OPTIONS,
} from '@consts';

import type { PartnerTabId, SelectOption } from './types';

// Tab configuration
export const PARTNER_TABS: TabItem<PartnerTabId>[] = [
  { id: 'all', label: 'Alles' },
  { id: 'trainer', label: 'Trainers' },
  { id: 'expert', label: 'Experts' },
  { id: 'supplement', label: 'Supplementen' },
  { id: 'clothing', label: 'Kleding' },
];

// Filter options (base options with "all" prefix for filtering)
export const REGION_OPTIONS: SelectOption[] = [
  { value: '', label: "Alle regio's" },
  ...BASE_REGION_OPTIONS,
];

export const SPECIALIZATION_OPTIONS: SelectOption[] = [
  { value: '', label: 'Alle specialisaties' },
  ...BASE_SPECIALIZATION_OPTIONS,
];

export const GENDER_OPTIONS: SelectOption[] = [
  { value: '', label: 'Alle trainers' },
  ...BASE_GENDER_OPTIONS.filter((o) => o.value !== 'other'),
];
