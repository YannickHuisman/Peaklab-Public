import { supabaseAdmin } from '../supabaseClient';
import { evaluateExpression } from './formulaParser';

export interface DerivedDependency {
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

export interface DerivedBiomarker {
  id: number;
  name: string;
  display_name: string;
  unit: string | null;
  kind: 'ratio' | 'calculated';
  formula: string | null;
  category: { id: number; name: string } | null;
  ref_male_min: number | null;
  ref_male_max: number | null;
  ref_female_min: number | null;
  ref_female_max: number | null;
  performance_male_min: number | null;
  performance_male_max: number | null;
  performance_female_min: number | null;
  performance_female_max: number | null;
  is_active: boolean;
  dependencies: DerivedDependency[];
  what_it_measures?: string | null;
  why_relevant?: string | null;
  interpretation?: string | null;
  optimization_tips?: string[];
  scientific_sources?: Array<{ title: string; url: string }>;
  how_to_optimize?: string | null;
}

// Evaluate a small arithmetic formula against a role->value scope. Parsing and
// evaluation are handled by a dedicated parser (no code execution); only
// numbers, identifiers, whitespace, parentheses and + - * / are accepted.
export function evaluateFormula(formula: string, scope: Record<string, number>): number | null {
  return evaluateExpression(formula, scope);
}

// Default formula for ratios with exactly two ordered dependencies.
function defaultRatioFormula(deps: DerivedDependency[]): string | null {
  if (deps.length !== 2) return null;
  const sorted = [...deps].sort((a, b) => a.sort_order - b.sort_order);
  const numerator = sorted[0];
  const denominator = sorted[1];

  if (!numerator || !denominator) return null;

  return `${numerator.role} / ${denominator.role}`;
}

export function computeDerivedValue(
  derived: DerivedBiomarker,
  valuesBySourceId: Map<number, number>
): number | null {
  if (derived.dependencies.length === 0) return null;

  const scope: Record<string, number> = {};

  for (const dep of derived.dependencies) {
    const v = valuesBySourceId.get(dep.source_id);

    if (v === undefined) return null; // missing source — cannot compute
    scope[dep.role] = v;
  }

  const formula =
    derived.formula?.trim() ||
    (derived.kind === 'ratio' ? defaultRatioFormula(derived.dependencies) : null);

  if (!formula) return null;

  const raw = evaluateFormula(formula, scope);

  if (raw === null) return null;

  return Math.round(raw * 100) / 100;
}

export async function fetchActiveDerivedBiomarkers(
  panelId?: number | null
): Promise<DerivedBiomarker[]> {
  let panelBiomarkerIds: Set<number> | null = null;

  if (panelId) {
    const { data: panelBiomarkers } = await supabaseAdmin
      .from('panel_biomarkers')
      .select('biomarker_id')
      .eq('panel_id', panelId);

    panelBiomarkerIds = new Set((panelBiomarkers ?? []).map((pb) => pb.biomarker_id as number));
  }

  const query = supabaseAdmin
    .from('biomarkers')
    .select(
      `
      id, name, display_name, unit, kind, formula,
      ref_male_min, ref_male_max,
      ref_female_min, ref_female_max,
      performance_male_min, performance_male_max,
      performance_female_min, performance_female_max,
      is_active,
      category:category_id(id, name),
      biomarker_content (
        what_it_measures,
        why_relevant,
        interpretation,
        optimization_tips,
        scientific_sources,
        how_to_optimize
      ),
      dependencies:biomarker_dependencies!biomarker_dependencies_derived_id_fkey (
        source_id, role, sort_order,
        source:source_id (id, name, display_name, unit)
      )
    `
    )
    .in('kind', ['ratio', 'calculated'])
    .eq('is_active', true);

  const { data, error } = await query;

  if (error) throw error;

  const derived = ((data || []) as unknown as Array<Record<string, unknown>>).map((row) => {
    const rawContent = row.biomarker_content;
    const content =
      ((Array.isArray(rawContent) ? rawContent[0] : rawContent) as Record<string, unknown>) || {};

    return {
      id: row.id as number,
      name: row.name as string,
      display_name: row.display_name as string,
      unit: (row.unit as string | null) ?? null,
      kind: row.kind as 'ratio' | 'calculated',
      formula: (row.formula as string | null) ?? null,
      category: (row.category as DerivedBiomarker['category']) ?? null,
      ref_male_min: (row.ref_male_min as number | null) ?? null,
      ref_male_max: (row.ref_male_max as number | null) ?? null,
      ref_female_min: (row.ref_female_min as number | null) ?? null,
      ref_female_max: (row.ref_female_max as number | null) ?? null,
      performance_male_min: (row.performance_male_min as number | null) ?? null,
      performance_male_max: (row.performance_male_max as number | null) ?? null,
      performance_female_min: (row.performance_female_min as number | null) ?? null,
      performance_female_max: (row.performance_female_max as number | null) ?? null,
      is_active: row.is_active as boolean,
      dependencies: ((row.dependencies as DerivedDependency[]) || [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order),
      what_it_measures: (content.what_it_measures as string | null) ?? null,
      why_relevant: (content.why_relevant as string | null) ?? null,
      interpretation: (content.interpretation as string | null) ?? null,
      optimization_tips: (content.optimization_tips as string[]) ?? [],
      scientific_sources:
        (content.scientific_sources as Array<{ title: string; url: string }>) ?? [],
      how_to_optimize: (content.how_to_optimize as string | null) ?? null,
    };
  });

  // No panel context → expose every active ratio / calculated value.
  if (!panelBiomarkerIds) return derived;

  return selectPanelDerived(derived, panelBiomarkerIds);
}

/**
 * Filter derived biomarkers down to those that belong to a panel.
 *
 * A ratio / calculated value belongs to a panel when it is linked directly, or
 * — the common case — when every biomarker it depends on is linked to that
 * panel. Dependencies resolve transitively: a dependency may itself be another
 * derived value, which qualifies when *its* dependencies are all (transitively)
 * on the panel. That lets a ratio built on top of another ratio surface
 * automatically too. Results are memoized and a visiting set guards against
 * dependency cycles.
 *
 * Pure (no I/O) so it can be unit-tested in isolation.
 */
export function selectPanelDerived(
  derived: DerivedBiomarker[],
  panelBiomarkerIds: Set<number>
): DerivedBiomarker[] {
  const derivedById = new Map(derived.map((d) => [d.id, d]));
  const memo = new Map<number, boolean>();

  const sourceQualifies = (sourceId: number, visiting: Set<number>): boolean => {
    if (panelBiomarkerIds.has(sourceId)) return true; // direct panel member (direct or directly-linked derived)

    const nested = derivedById.get(sourceId);

    return nested ? qualifies(nested, visiting) : false;
  };

  function qualifies(d: DerivedBiomarker, visiting: Set<number>): boolean {
    const cached = memo.get(d.id);

    if (cached !== undefined) return cached;
    if (panelBiomarkerIds.has(d.id)) return true; // directly linked to the panel
    if (d.dependencies.length === 0) return false;
    if (visiting.has(d.id)) return false; // cycle — cannot bottom out at panel members

    visiting.add(d.id);
    const ok = d.dependencies.every((dep) => sourceQualifies(dep.source_id, visiting));

    visiting.delete(d.id);
    memo.set(d.id, ok);

    return ok;
  }

  return derived.filter((d) => qualifies(d, new Set<number>()));
}

export function computeFlag(
  value: number,
  refMin: number | null,
  refMax: number | null
): 'low' | 'normal' | 'high' | null {
  if (refMin === null && refMax === null) return null;
  if (refMin !== null && value < refMin) return 'low';
  if (refMax !== null && value > refMax) return 'high';

  return 'normal';
}

/**
 * Resolve every computable derived value on top of a set of direct source
 * values. Multi-pass so a derived value built on another derived value resolves
 * on a later pass (transitive resolution). Returns a new map holding the base
 * values plus every derived value that could be computed. Pure (no I/O).
 */
export function resolveDerivedValues(
  baseValues: Map<number, number>,
  derivedDefs: DerivedBiomarker[]
): Map<number, number> {
  const values = new Map(baseValues);
  const remaining = derivedDefs.filter((d) => !values.has(d.id));

  let progressed = true;

  while (progressed) {
    progressed = false;

    for (let i = remaining.length - 1; i >= 0; i--) {
      const derived = remaining[i];

      if (!derived) continue;

      const value = computeDerivedValue(derived, values);

      if (value === null) continue; // dependencies not all resolved (yet)

      values.set(derived.id, value);
      remaining.splice(i, 1);
      progressed = true;
    }
  }

  return values;
}

export interface DerivedHistoryPoint {
  value: number;
  flag: 'low' | 'normal' | 'high';
  blood_test: { sample_taken_at: string };
}

/**
 * Build a history series for a derived biomarker (ratio / calculated) by
 * recomputing its value for every blood test where all of its source values are
 * present. Tests where the value cannot be computed (a missing source) are
 * skipped, mirroring the dashboard, which only surfaces a derived value when
 * every dependency resolves. Points are returned oldest-first. Pure (no I/O).
 */
export function computeDerivedHistory(
  target: DerivedBiomarker,
  derivedDefs: DerivedBiomarker[],
  gender: 'male' | 'female' | 'other' | null,
  tests: Array<{ sample_taken_at: string; valuesBySourceId: Map<number, number> }>
): DerivedHistoryPoint[] {
  const isFemale = gender === 'female';
  const refMin = isFemale ? target.ref_female_min : target.ref_male_min;
  const refMax = isFemale ? target.ref_female_max : target.ref_male_max;

  const points: DerivedHistoryPoint[] = [];

  for (const test of tests) {
    const resolved = resolveDerivedValues(test.valuesBySourceId, derivedDefs);
    const value = resolved.get(target.id);

    if (value === undefined) continue; // not computable for this test

    points.push({
      value,
      flag: computeFlag(value, refMin, refMax) ?? 'normal',
      blood_test: { sample_taken_at: test.sample_taken_at },
    });
  }

  return points.sort(
    (a, b) =>
      new Date(a.blood_test.sample_taken_at).getTime() -
      new Date(b.blood_test.sample_taken_at).getTime()
  );
}
