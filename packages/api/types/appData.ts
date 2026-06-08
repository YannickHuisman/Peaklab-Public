import type { BiomarkerCategory, BiomarkerWithConfig, Partner } from '@package/types';

export type {
  BiomarkerCategory,
  BiomarkerWithConfig,
  DutchRegion,
  Partner,
  PartnerType,
  ScientificSource,
  TrainerSpecialization,
} from '@package/types';

export interface AppDataContextType {
  categories: BiomarkerCategory[];
  biomarkers: BiomarkerWithConfig[];
  panels: Array<{ id: number; name: string; code: string }>;
  partners: Partner[];
  loading: boolean;
  error: string | null;
  refetchBiomarkers: () => Promise<void>;
  refetchPanels: () => Promise<void>;
  refetchPartners: () => Promise<void>;
}
