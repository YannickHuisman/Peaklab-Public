export interface DeepResearchReport {
  id: string;
  user_id: string;
  blood_test_id: string;
  status: 'generating' | 'completed' | 'failed';
  summary: string | null;
  report_data: ReportData | null;
  created_at: string;
  completed_at: string | null;
  error_message: string | null;
}

export interface ReportSummary {
  id: string;
  status: 'generating' | 'completed' | 'failed';
  summary: string | null;
  created_at: string;
  completed_at: string | null;
  error_message: string | null;
  blood_test_id: string;
}

export interface ReportData {
  executive_summary: string;
  overall_score: number;
  domains: Domain[];
  ratios: Ratio[];
  performance_impact: PerformanceImpact;
  recommendations: Recommendation[];
}

export interface Domain {
  name: string;
  score: number;
  status: 'optimal' | 'good' | 'attention' | 'concern';
  summary: string;
  biomarkers: DomainBiomarker[];
  insights: string[];
}

export type RangeBucket =
  | 'performance_range'
  | 'normal_range'
  | 'out_of_range_high'
  | 'out_of_range_low';

export interface DomainBiomarker {
  name: string;
  display_name?: string;
  value?: number;
  unit?: string;
  status?: 'optimal' | 'good' | 'attention' | 'concern';
  range_bucket?: RangeBucket;
  interpretation: string;
  ref_min?: number | null;
  ref_max?: number | null;
  perf_min?: number | null;
  perf_max?: number | null;
}

export interface Ratio {
  name: string;
  value?: number;
  optimal_range?: string;
  status?: 'optimal' | 'good' | 'attention' | 'concern';
  range_bucket?: RangeBucket;
  interpretation: string;
  sources?: string[];
}

export interface PerformanceImpact {
  strengths: string[];
  areas_for_improvement: string[];
  sport_specific_notes: string;
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
}

// Public interface returned by useDeepResearch
export interface DeepResearchContextType {
  reports: ReportSummary[];
  activeReport: DeepResearchReport | null;
  loading: boolean;
  loadingReport: boolean;
  generating: boolean;
  error: string | null;
  canGenerate: boolean;
  nextAvailableDate: Date | null;
  fetchReports: () => Promise<void>;
  loadReport: (reportId: string) => Promise<void>;
  generateReport: () => Promise<void>;
}

// Internal context shared between provider and hook — not part of the public API
export interface DeepResearchInternalContextType {
  reports: ReportSummary[];
  setReports: (value: ReportSummary[] | ((prev: ReportSummary[]) => ReportSummary[])) => void;
  activeReport: DeepResearchReport | null;
  setActiveReport: (report: DeepResearchReport | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  loadingReport: boolean;
  setLoadingReport: (loadingReport: boolean) => void;
  generating: boolean;
  setGenerating: (generating: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  pollForReport: (reportId: string) => void;
}
