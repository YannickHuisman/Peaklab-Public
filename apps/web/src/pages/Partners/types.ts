// Partner Types - Re-export from @package/api for shared types
import type { PartnerType } from '@package/api';

export type { PartnerType };

// Local types for Partners page
export type PartnerTabId = 'all' | PartnerType;

export interface SelectOption {
  value: string;
  label: string;
}
