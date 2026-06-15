import type { UploadStatus } from '@package/types';

export const STATUS_LABELS: Record<UploadStatus, { label: string; tone: string }> = {
  pending: { label: 'In afwachting', tone: 'warning' },
  in_review: { label: 'In beoordeling', tone: 'info' },
  processed: { label: 'Verwerkt', tone: 'success' },
  rejected: { label: 'Afgewezen', tone: 'error' },
};

export const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: '', label: 'Alle' },
  { value: 'pending', label: 'In afwachting' },
  { value: 'in_review', label: 'In beoordeling' },
  { value: 'processed', label: 'Verwerkt' },
  { value: 'rejected', label: 'Afgewezen' },
];
