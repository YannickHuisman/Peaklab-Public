import { supabaseAdmin } from '../supabaseClient';

export interface AIContextPreferences {
  profile: boolean;
  biomarkers: boolean;
  performancePlan: boolean;
}

const DEFAULT_PREFS: AIContextPreferences = {
  profile: true,
  biomarkers: true,
  performancePlan: true,
};

/**
 * Read the user's AI-context preferences from user_settings. Each toggle
 * controls whether the matching data category may be sent to an AI provider.
 * Defaults to `true` for any missing row or column so the feature still works
 * before the migration is applied — but once the user toggles something off,
 * we strictly honor it.
 */
export async function getUserAIContextPreferences(userId: string): Promise<AIContextPreferences> {
  const { data } = await supabaseAdmin
    .from('user_settings')
    .select('ai_context_profile, ai_context_biomarkers, ai_context_performance_plan')
    .eq('user_id', userId)
    .maybeSingle();

  if (!data) return DEFAULT_PREFS;

  return {
    profile: data.ai_context_profile ?? DEFAULT_PREFS.profile,
    biomarkers: data.ai_context_biomarkers ?? DEFAULT_PREFS.biomarkers,
    performancePlan: data.ai_context_performance_plan ?? DEFAULT_PREFS.performancePlan,
  };
}
