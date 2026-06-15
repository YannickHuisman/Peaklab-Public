// ─── User & Auth ────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
}

export type UserRole = 'user' | 'admin' | 'super_admin';

export interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  website?: string;
  avatar_url?: string;
  role?: UserRole;
}

// ─── Profile ────────────────────────────────────────────────────────
export interface Profile {
  id: string;
  updated_at: string | null;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  birth_date: string | null;
  gender: 'male' | 'female' | 'other' | null;
  weight_kg: number | null;
  sport_type: 'strength' | 'endurance' | 'hybrid' | null;
  sport_frequency_per_week: number | null;
  panel_id: number | null;
  created_at: string;
}

// ─── Appointments ───────────────────────────────────────────────────
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';
export type AppointmentType =
  | 'blood_test'
  | 'consultation'
  | 'follow_up'
  | 'initial_assessment'
  | 'other';

export interface Appointment {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  appointment_type: AppointmentType;
  scheduled_at: string;
  duration_minutes: number;
  status: AppointmentStatus;
  location: string | null;
  admin_notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppointmentWithUser extends Appointment {
  user: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
  creator: {
    id: string;
    full_name: string | null;
  } | null;
}

// ─── Partners ───────────────────────────────────────────────────────
export type PartnerType = 'trainer' | 'expert' | 'supplement' | 'clothing' | 'other';

export type TrainerSpecialization =
  | 'personal_training'
  | 'hyrox_training'
  | 'running_training'
  | 'strength_training'
  | 'crossfit'
  | 'cycling'
  | 'swimming'
  | 'triathlon'
  | 'longevity_health'
  | 'rehabilitation';

export type DutchRegion =
  | 'noord_holland'
  | 'zuid_holland'
  | 'utrecht'
  | 'gelderland'
  | 'noord_brabant'
  | 'limburg'
  | 'zeeland'
  | 'friesland'
  | 'groningen'
  | 'drenthe'
  | 'overijssel'
  | 'flevoland';

export type PartnerLinkType = 'website' | 'instagram' | 'other';

export interface PartnerLink {
  type: PartnerLinkType;
  url: string;
  label?: string;
}

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  affiliate_url: string | null;
  website_url: string | null;
  rating: number | null;
  review_count: number;
  price_from: number | null;
  price_unit: string;
  /** Primary / single region (kept for backward compat). */
  region: DutchRegion | null;
  /** All selected regions. Requires DB column `regions DutchRegion[]`. */
  regions: DutchRegion[] | null;
  specializations: TrainerSpecialization[] | null;
  gender: 'male' | 'female' | 'other' | null;
  tags: string[];
  is_featured: boolean;
  /** Additional links (website, instagram, etc). Requires DB column `links jsonb`. */
  links: PartnerLink[] | null;
}

export interface PartnerDB extends Partner {
  logo_url: string | null;
  affiliate_code: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

// ─── Partner Applications ───────────────────────────────────────────
export type PartnerApplicationStatus = 'pending' | 'approved' | 'denied';

export type ContactPreference = 'email' | 'phone' | 'whatsapp' | 'instagram' | 'no_preference';

export interface PartnerApplication {
  id: string;
  contact_name: string;
  contact_email: string;
  /** Mobile / WhatsApp number. */
  phone: string | null;
  /** Optional company / office phone. Requires DB column `phone_company text`. */
  phone_company: string | null;
  company_name: string;
  /** Short tagline shown under the name. Requires DB column `subtitle text`. */
  subtitle: string | null;
  type: PartnerType;
  description: string | null;
  /** Primary website URL — derived from `links` on submit. */
  website_url: string | null;
  /** Profile/hero image. Requires DB column `image_url text`. */
  image_url: string | null;
  /** Starting price. Requires DB column `price_from numeric`. */
  price_from: number | null;
  /** Price unit (e.g. sessie, uur, maand). Requires DB column `price_unit text`. */
  price_unit: string | null;
  /** Primary / single region (kept for backward compat). */
  region: DutchRegion | null;
  /** All selected regions (multi-select). */
  regions: DutchRegion[] | null;
  specializations: TrainerSpecialization[];
  contact_preference: ContactPreference | null;
  /** Additional links (instagram, etc). Requires DB column `links jsonb`. */
  links: PartnerLink[] | null;
  /** Tags / keywords for the partner profile. Requires DB column `tags text[]`. */
  tags: string[];
  motivation: string | null;
  status: PartnerApplicationStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  partner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerApplicationWithReviewer extends PartnerApplication {
  reviewer: {
    id: string;
    full_name: string | null;
  } | null;
}

// ─── Labs ───────────────────────────────────────────────────────────
export interface Lab {
  id: number;
  name: string;
  description: string | null;
  website_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface LabBiomarkerReference {
  id: number;
  lab_id: number;
  biomarker_id: number;
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
}

export interface LabBiomarkerReferenceWithBiomarker extends LabBiomarkerReference {
  biomarker: {
    id: number;
    name: string;
    display_name: string;
    category?: { id: number; name: string };
  };
}

// ─── Biomarkers ─────────────────────────────────────────────────────
export interface ScientificSource {
  title: string;
  url: string;
}

export interface BiomarkerCategoryReference {
  id: number;
  name: string;
}

export interface BiomarkerCategory {
  id: number;
  name: string;
  description: string;
}

export type BiomarkerKind = 'direct' | 'ratio' | 'calculated';

export interface BiomarkerDependency {
  source_id: number;
  role: string;
  sort_order: number;
  source: {
    id: number;
    name: string;
    display_name: string;
    unit: string | null;
  };
}

export interface Biomarker {
  id: number;
  name: string;
  unit: string | null;
  category: BiomarkerCategoryReference;
  display_name: string;
  kind: BiomarkerKind;
  formula: string | null;
  dependencies?: BiomarkerDependency[];
  ref_male_min: number | null;
  ref_male_max: number | null;
  ref_female_min: number | null;
  ref_female_max: number | null;
  performance_male_min: number | null;
  performance_male_max: number | null;
  performance_female_min: number | null;
  performance_female_max: number | null;
  is_active: boolean;
  what_it_measures?: string | null;
  why_relevant?: string | null;
  interpretation?: string | null;
  optimization_tips?: string[];
  scientific_sources?: ScientificSource[];
  how_to_optimize?: string | null;
}

export interface BiomarkerWithConfig {
  id: number;
  name: string;
  display_name: string;
  unit: string | null;
  kind: BiomarkerKind;
  formula: string | null;
  dependencies: BiomarkerDependency[];
  ref_male_min: number | null;
  ref_male_max: number | null;
  ref_female_min: number | null;
  ref_female_max: number | null;
  performance_male_min: number | null;
  performance_male_max: number | null;
  performance_female_min: number | null;
  performance_female_max: number | null;
  is_active: boolean;
  what_it_measures: string | null;
  why_relevant: string | null;
  interpretation: string | null;
  optimization_tips: string[];
  scientific_sources: ScientificSource[];
  how_to_optimize: string | null;
  category: { id: number; name: string };
  panels?: Array<{
    panel_id: number;
    panel: { id: number; name: string; code: string };
  }>;
}

export interface BiomarkerResult {
  value: number;
  flag: 'normal' | 'high' | 'low';
  biomarker: Biomarker;
}

export interface BiomarkerHistoryEntry {
  value: number;
  flag: 'normal' | 'high' | 'low';
  blood_test: { sample_taken_at: string };
}

export interface BiomarkerContent {
  id: number;
  biomarker_id: number;
  what_it_measures: string | null;
  why_relevant: string | null;
  interpretation: string | null;
  optimization_tips: string[];
  scientific_sources: ScientificSource[];
  how_to_optimize: string | null;
  updated_at: string;
}

// ─── Panels ─────────────────────────────────────────────────────────
export interface PanelBiomarker {
  biomarker: Biomarker;
  sort_order: number;
}

export interface Panel {
  id: number;
  name: string;
  code: string;
  panel_biomarkers: PanelBiomarker[];
}

// ─── Blood Tests ────────────────────────────────────────────────────
export interface LatestTest {
  id: string;
  sample_taken_at: string;
  lab_id: number | null;
  panel: { name: string };
  lab?: { id: number; name: string } | null;
}

// ─── Blood Result Uploads ───────────────────────────────────────────
export type UploadStatus = 'pending' | 'in_review' | 'processed' | 'rejected';

export interface BloodResultUpload {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  status: UploadStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  blood_test_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BloodResultUploadWithUser extends BloodResultUpload {
  user: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
  reviewer: {
    id: string;
    full_name: string | null;
  } | null;
}

// ─── Goals & Performance ────────────────────────────────────────────
export interface Goal {
  id: string;
  user_id: string;
  type: string;
  title: string;
  target_value: number;
  target_unit: string;
  target_date: string;
  is_active: boolean;
  created_at: string;
}

export interface Performance {
  id: string;
  user_id: string;
  performed_at: string;
}

export interface PeakScore {
  score: number;
  calculated_at: string;
}

export interface PerformanceProfileData {
  form_data: unknown;
  plan_form_data: unknown;
  ai_plan: unknown;
}

export interface PerformanceProfileState {
  data: PerformanceProfileData | null;
  loading: boolean;
  error: string | null;
  fetched: boolean;
}

// ─── Achievements ───────────────────────────────────────────────────
export type AchievementCategory = 'algemeen' | 'kracht' | 'hardlopen';

export interface Achievement {
  id: string;
  user_id: string;
  category: AchievementCategory;
  title: string;
  value: string;
  reps: number | null;
  achieved_at: string;
  created_at: string;
  updated_at: string;
}

// ─── Notifications ──────────────────────────────────────────────────
export type AdminNotificationType = 'blood_result_upload' | 'partner_application';

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string | null;
  user_id: string | null;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
  user?: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export type UserNotificationType = 'deep_research_completed';

export interface UserNotification {
  id: string;
  user_id: string;
  type: UserNotificationType;
  title: string;
  message: string | null;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}
