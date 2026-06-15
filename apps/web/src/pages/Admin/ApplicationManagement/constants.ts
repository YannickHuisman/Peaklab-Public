import { REGION_OPTIONS, SPECIALIZATION_OPTIONS } from '@consts';

import type { PartnerApplicationStatus } from '@package/types';

export const STATUS_LABELS: Record<PartnerApplicationStatus, { label: string; tone: string }> = {
  pending: { label: 'In afwachting', tone: 'warning' },
  approved: { label: 'Goedgekeurd', tone: 'success' },
  denied: { label: 'Afgewezen', tone: 'error' },
};

export const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: '', label: 'Alle' },
  { value: 'pending', label: 'In afwachting' },
  { value: 'approved', label: 'Goedgekeurd' },
  { value: 'denied', label: 'Afgewezen' },
];

export const TYPE_LABELS: Record<string, string> = {
  trainer: 'Trainer',
  expert: 'Expert',
  supplement: 'Supplementen',
  clothing: 'Sportkleding',
  other: 'Anders',
};

export function getRegionLabel(value: string | null): string {
  if (!value) return '-';
  const option = REGION_OPTIONS.find((o) => o.value === value);

  return option?.label || value;
}

export function getSpecializationLabels(values: string[]): string {
  if (!values || values.length === 0) return '-';

  return values
    .map((v) => SPECIALIZATION_OPTIONS.find((o) => o.value === v)?.label || v)
    .join(', ');
}
