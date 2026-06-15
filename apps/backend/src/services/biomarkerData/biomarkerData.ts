import { assessRangeBucket } from '@package/utils';

import { getLabRangesMap, resolveRanges } from '../../helpers/biomarkerRanges';
import type { DerivedBiomarker } from '../../helpers/derivedBiomarkers';
import {
  computeDerivedValue,
  computeFlag,
  fetchActiveDerivedBiomarkers,
} from '../../helpers/derivedBiomarkers';
import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { EnrichedBiomarkerResult } from '../ai';

export type LatestTest = {
  id: string;
  sample_taken_at: string;
  lab_id: number | null;
  panel_id?: number | null;
  panel?: { name: string } | null;
} | null;

export type Gender = 'male' | 'female' | 'other' | null;

export type BiomarkerDataSource =
  | { kind: 'latestPerBiomarker'; panelId?: number | null }
  | { kind: 'singleTest'; bloodTestId: string };

export interface UserBiomarkerData {
  latestTest: LatestTest;
  direct: EnrichedBiomarkerResult[];
  derived: EnrichedBiomarkerResult[];
  derivedDefs: DerivedBiomarker[];
  gender: Gender;
}

const BIOMARKER_FIELDS_BASE = `
  id, name, display_name, unit, kind, formula,
  ref_male_min, ref_male_max,
  ref_female_min, ref_female_max,
  performance_male_min, performance_male_max,
  performance_female_min, performance_female_max,
  is_active,
  category:category_id(id, name)
`;

const BIOMARKER_CONTENT_JOIN = `
  biomarker_content (
    what_it_measures,
    why_relevant,
    interpretation,
    optimization_tips,
    scientific_sources,
    how_to_optimize
  )
`;

interface LoadOptions {
  userId: string;
  source: BiomarkerDataSource;
  includeContent?: boolean;
}

/**
 * Load every piece of biomarker data a user-facing screen needs in one
 * place: the latest test row (for display + lab range resolution), the
 * user's enriched direct biomarker results, computed derived values
 * (ratios + calculated), and the raw derived definitions (needed when
 * formatting them for the AI prompt).
 *
 * Two source modes:
 *  - `latestPerBiomarker`: scans every result the user has, keeping only
 *    the most recent value per biomarker (used by the dashboard).
 *  - `singleTest`: returns only the results tied to one specific
 *    `blood_test_id` (used by deep research).
 */
export async function loadUserBiomarkerData(opts: LoadOptions): Promise<UserBiomarkerData> {
  const { userId, source, includeContent } = opts;

  const [profileResult, latestTest] = await Promise.all([
    supabaseAdmin.from('profiles').select('gender, show_all_biomarkers').eq('id', userId).single(),
    fetchLatestTest(userId, source),
  ]);

  const gender: Gender = (profileResult.data?.gender as Gender) ?? null;
  const showAllBiomarkers = profileResult.data?.show_all_biomarkers === true;
  const labId = latestTest?.lab_id ?? null;
  const labRangesMap = await getLabRangesMap(labId);

  // When show_all_biomarkers is enabled for this user, bypass panel filtering entirely
  const panelId = showAllBiomarkers
    ? null
    : source.kind === 'latestPerBiomarker'
      ? (source.panelId ?? latestTest?.panel_id ?? null)
      : (latestTest?.panel_id ?? null);

  const rawResults = await fetchRawResults({
    userId,
    source,
    includeContent: includeContent ?? false,
    panelId,
  });
  const direct = enrichDirectResults(rawResults, labRangesMap, source);

  const valuesBySourceId = new Map<number, number>();

  for (const r of direct) {
    valuesBySourceId.set(r.biomarker.id, r.value);
  }

  const derivedDefs = await fetchActiveDerivedBiomarkers(panelId);
  const derived = computeDerivedResults(derivedDefs, valuesBySourceId, gender);

  return { latestTest, direct, derived, derivedDefs, gender };
}

async function fetchLatestTest(userId: string, source: BiomarkerDataSource): Promise<LatestTest> {
  if (source.kind === 'singleTest') {
    const { data } = await supabaseAdmin
      .from('blood_tests')
      .select('id, sample_taken_at, lab_id, panel_id')
      .eq('id', source.bloodTestId)
      .single();

    return (data as LatestTest) ?? null;
  }

  const { data } = await supabaseAdmin
    .from('blood_tests')
    .select('id, sample_taken_at, lab_id, panel_id, panel:panel_id(name)')
    .eq('user_id', userId)
    .order('sample_taken_at', { ascending: false })
    .limit(1)
    .single();

  return (data as LatestTest) ?? null;
}

interface FetchRawOptions {
  userId: string;
  source: BiomarkerDataSource;
  includeContent: boolean;
  panelId: number | null;
}

interface RawRow {
  value: number;
  flag: string;
  biomarker: Record<string, unknown> | null;
  blood_tests: { sample_taken_at: string } | null;
}

async function fetchRawResults({
  userId,
  source,
  includeContent,
  panelId,
}: FetchRawOptions): Promise<RawRow[]> {
  const contentJoin = includeContent ? `,${BIOMARKER_CONTENT_JOIN}` : '';
  const select = `
    value, flag,
    biomarker:biomarker_id (
      ${BIOMARKER_FIELDS_BASE}${contentJoin}
    ),
    blood_tests!inner ( sample_taken_at )
  `;

  let query = supabaseAdmin.from('blood_test_results').select(select);

  if (source.kind === 'singleTest') {
    query = query.eq('blood_test_id', source.bloodTestId);
  } else {
    query = query.eq('blood_tests.user_id', userId);
  }

  if (panelId) {
    const { data: panelBiomarkers } = await supabaseAdmin
      .from('panel_biomarkers')
      .select('biomarker_id')
      .eq('panel_id', panelId);

    const ids = panelBiomarkers?.map((pb) => pb.biomarker_id) || [];

    // Panel is assigned but has no biomarkers → return nothing (don't fall through to all)
    if (ids.length === 0) return [];
    query = query.in('biomarker_id', ids);
  }

  const { data } = await query;

  return (data ?? []) as unknown as RawRow[];
}

function enrichDirectResults(
  rawResults: RawRow[],
  labRangesMap: Awaited<ReturnType<typeof getLabRangesMap>>,
  source: BiomarkerDataSource
): EnrichedBiomarkerResult[] {
  const rowsToEnrich =
    source.kind === 'singleTest' ? rawResults : keepLatestPerBiomarker(rawResults);

  return rowsToEnrich
    .filter((r) => r.biomarker)
    .map((result) => {
      const biomarker = result.biomarker as unknown as Record<string, unknown>;
      const rawContent = biomarker.biomarker_content;
      const content =
        ((Array.isArray(rawContent) ? rawContent[0] : rawContent) as
          | Record<string, unknown>
          | undefined) || {};
      const ranges = resolveRanges(biomarker, labRangesMap);

      const { biomarker_content: _content, ...biomarkerWithoutContent } = biomarker;

      return {
        value: result.value,
        flag: result.flag,
        biomarker: {
          ...biomarkerWithoutContent,
          ...content,
          unit: ranges.unit,
          ref_male_min: ranges.ref_male_min,
          ref_male_max: ranges.ref_male_max,
          ref_female_min: ranges.ref_female_min,
          ref_female_max: ranges.ref_female_max,
          performance_male_min: ranges.performance_male_min,
          performance_male_max: ranges.performance_male_max,
          performance_female_min: ranges.performance_female_min,
          performance_female_max: ranges.performance_female_max,
        },
      } as EnrichedBiomarkerResult;
    });
}

function keepLatestPerBiomarker(rawResults: RawRow[]): RawRow[] {
  const latest = new Map<number, RawRow>();

  for (const result of rawResults) {
    if (!result.biomarker) continue;
    const biomarker = result.biomarker as unknown as Record<string, unknown>;
    const id = biomarker.id as number;
    const bloodTest = result.blood_tests as unknown as Record<string, unknown> | null;
    const date = new Date((bloodTest?.sample_taken_at as string) || 0).getTime();
    const existing = latest.get(id);
    const existingBloodTest = existing?.blood_tests as unknown as Record<string, unknown> | null;
    const existingDate = existing
      ? new Date((existingBloodTest?.sample_taken_at as string) || 0).getTime()
      : 0;

    if (!existing || date > existingDate) {
      latest.set(id, result);
    }
  }

  return Array.from(latest.values());
}

function computeDerivedResults(
  derivedDefs: DerivedBiomarker[],
  valuesBySourceId: Map<number, number>,
  gender: Gender
): EnrichedBiomarkerResult[] {
  const isFemale = gender === 'female';

  // Mutable scope seeded with the direct results. Each computed derived value
  // is added back keyed by its biomarker id, so a derived value that depends on
  // another derived value resolves on a later pass (transitive resolution).
  // Passes repeat until no further value can be computed.
  const values = new Map(valuesBySourceId);
  const resultByIndex = new Map<number, EnrichedBiomarkerResult>();
  const remaining = derivedDefs.map((derived, index) => ({ derived, index }));

  let progressed = true;

  while (progressed) {
    progressed = false;

    for (let i = remaining.length - 1; i >= 0; i--) {
      const entry = remaining[i];

      if (!entry) continue;

      const { derived, index } = entry;
      const value = computeDerivedValue(derived, values);

      if (value === null) continue; // dependencies not all resolved (yet) or not computable

      const refMin = isFemale ? derived.ref_female_min : derived.ref_male_min;
      const refMax = isFemale ? derived.ref_female_max : derived.ref_male_max;
      const flag = computeFlag(value, refMin, refMax);
      const { dependencies, ...biomarker } = derived;

      values.set(derived.id, value);
      resultByIndex.set(index, {
        value,
        flag: flag ?? 'normal',
        biomarker: { ...biomarker, dependencies },
      } as EnrichedBiomarkerResult);

      remaining.splice(i, 1);
      progressed = true;
    }
  }

  // Preserve the original derivedDefs order in the output.
  return derivedDefs
    .map((_, index) => resultByIndex.get(index))
    .filter((r): r is EnrichedBiomarkerResult => r !== undefined);
}

export interface BiomarkerChatContextEntry {
  name: string;
  displayName: string;
  bucket: string;
  category?: string;
}

/**
 * Build the privacy-preserving biomarker context for the AI chat, computed
 * fully server-side from the exact same pipeline the dashboard / overview and
 * deep research use (`loadUserBiomarkerData`). This guarantees the chat sees
 * an identical set of biomarkers — including ratios / calculated values that
 * are linked to the user's panel via their components — and never trusts a
 * client-supplied array. Only the qualitative range bucket is exposed to the
 * AI, never the exact value.
 */
export async function buildBiomarkerChatContext(
  userId: string
): Promise<BiomarkerChatContextEntry[]> {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('panel_id')
    .eq('id', userId)
    .single();

  const { direct, derived, gender } = await loadUserBiomarkerData({
    userId,
    source: { kind: 'latestPerBiomarker', panelId: profile?.panel_id ?? null },
  });

  const isFemale = gender === 'female';

  return [...direct, ...derived].map((result) => {
    const bio = result.biomarker;
    const refMin = isFemale ? bio.ref_female_min : bio.ref_male_min;
    const refMax = isFemale ? bio.ref_female_max : bio.ref_male_max;
    const perfMin = isFemale ? bio.performance_female_min : bio.performance_male_min;
    const perfMax = isFemale ? bio.performance_female_max : bio.performance_male_max;

    return {
      name: bio.name,
      displayName: bio.display_name,
      bucket: assessRangeBucket(result.value, refMin, refMax, perfMin, perfMax),
      ...(bio.category?.name ? { category: bio.category.name } : {}),
    };
  });
}
