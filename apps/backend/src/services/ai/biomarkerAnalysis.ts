export interface EnrichedBiomarkerResult {
  value: number;
  flag: string;
  biomarker: {
    id: number;
    name: string;
    display_name: string;
    unit: string | null;
    ref_male_min: number | null;
    ref_male_max: number | null;
    ref_female_min: number | null;
    ref_female_max: number | null;
    performance_male_min: number | null;
    performance_male_max: number | null;
    performance_female_min: number | null;
    performance_female_max: number | null;
    category?: { id: number; name: string } | null;
    [key: string]: unknown;
  };
}

export interface BiomarkerDomain {
  name: string;
  categoryId: number;
  biomarkers: Array<{
    name: string;
    displayName: string;
    value: number;
    unit: string | null;
    status: BiomarkerStatus;
    bucket: RangeBucket;
    refMin: number | null;
    refMax: number | null;
    perfMin: number | null;
    perfMax: number | null;
  }>;
}

export interface CalculatedRatio {
  name: string;
  value: number | null;
  bucket: RangeBucket;
  status: BiomarkerStatus;
  optimalRange: string;
  interpretation: string;
  sources: string[];
}

export type { BiomarkerStatus, RangeBucket } from '@package/utils';
export { assessBiomarkerStatus, assessRangeBucket } from '@package/utils';
import type { BiomarkerStatus, RangeBucket } from '@package/utils';
import { assessBiomarkerStatus, assessRangeBucket, scoreFromStatuses } from '@package/utils';

import type { DerivedBiomarker } from '../../helpers/derivedBiomarkers';

const BUCKET_LABEL_NL: Record<RangeBucket, string> = {
  performance_range: 'performance bereik (optimaal voor sporters)',
  normal_range: 'normaal referentiebereik',
  out_of_range_high: 'boven het normale bereik',
  out_of_range_low: 'onder het normale bereik',
};

const UNCATEGORIZED_DOMAIN_ID = -1;
const UNCATEGORIZED_DOMAIN_NAME = 'Overig';

/**
 * Group enriched biomarker results by their category (domain). Biomarkers
 * without a category fall into an "Overig" bucket so we never silently
 * drop results from the report.
 */
export function groupBiomarkersByDomain(
  results: EnrichedBiomarkerResult[],
  gender: string | null
): BiomarkerDomain[] {
  const domainMap = new Map<number, BiomarkerDomain>();

  for (const result of results) {
    const bio = result.biomarker;
    const catId = bio.category?.id ?? UNCATEGORIZED_DOMAIN_ID;
    const catName = bio.category?.name ?? UNCATEGORIZED_DOMAIN_NAME;

    if (!domainMap.has(catId)) {
      domainMap.set(catId, {
        name: catName,
        categoryId: catId,
        biomarkers: [],
      });
    }

    const refMin = gender === 'female' ? bio.ref_female_min : bio.ref_male_min;
    const refMax = gender === 'female' ? bio.ref_female_max : bio.ref_male_max;
    const perfMin = gender === 'female' ? bio.performance_female_min : bio.performance_male_min;
    const perfMax = gender === 'female' ? bio.performance_female_max : bio.performance_male_max;

    domainMap.get(catId)?.biomarkers.push({
      name: bio.name,
      displayName: bio.display_name,
      value: result.value,
      unit: bio.unit,
      status: assessBiomarkerStatus(result.value, refMin, refMax, perfMin, perfMax),
      bucket: assessRangeBucket(result.value, refMin, refMax, perfMin, perfMax),
      refMin,
      refMax,
      perfMin,
      perfMax,
    });
  }

  return Array.from(domainMap.values());
}

/**
 * Format precomputed derived biomarker results into the AI-prompt-ready
 * `CalculatedRatio` shape. Values are taken from the supplied results
 * (already computed by the biomarker data service) and zipped with the
 * raw definitions for sources + interpretation metadata.
 */
export function calculateRatios(
  derivedResults: EnrichedBiomarkerResult[],
  derivedDefs: DerivedBiomarker[]
): CalculatedRatio[] {
  const defById = new Map(derivedDefs.map((d) => [d.id, d]));
  const computed: CalculatedRatio[] = [];

  for (const result of derivedResults) {
    const def = defById.get(result.biomarker.id);

    if (!def) continue;

    const value = result.value;
    const refMin = def.ref_male_min;
    const refMax = def.ref_male_max;

    computed.push({
      name: def.display_name,
      value,
      bucket: assessRangeBucket(value, refMin, refMax, null, null),
      status: assessBiomarkerStatus(value, refMin, refMax, null, null),
      optimalRange:
        refMin !== null && refMax !== null
          ? `${refMin} - ${refMax}`
          : refMin !== null
            ? `> ${refMin}`
            : refMax !== null
              ? `< ${refMax}`
              : 'n.v.t.',
      interpretation: def.interpretation ?? def.why_relevant ?? '',
      sources: def.dependencies.map((d) => d.source.display_name),
    });
  }

  return computed;
}

interface ProfileContext {
  age?: number | null;
  gender?: string | null;
  weightKg?: number | null;
  heightCm?: number | null;
}

/**
 * Build the comprehensive Dutch prompt for the AI deep research report.
 *
 * Privacy: never sends exact biomarker values, reference ranges, or
 * performance ranges to the AI. Only the qualitative range bucket
 * (performance / normal / out-of-range high / out-of-range low) is
 * disclosed. The server fills in actual values into the structured
 * response after the AI is done.
 */
export function buildDeepResearchPrompt(
  domains: BiomarkerDomain[],
  ratios: CalculatedRatio[],
  profile: ProfileContext
): string {
  const domainSections = domains
    .map((domain) => {
      const biomarkerLines = domain.biomarkers
        .map((b) => `  - ${b.displayName} → ${BUCKET_LABEL_NL[b.bucket]}`)
        .join('\n');

      return `### ${domain.name}\n${biomarkerLines}`;
    })
    .join('\n\n');

  const ratioLines =
    ratios.length > 0
      ? ratios
          .map((r) => {
            const sourceStr = r.sources.length ? ` [bron: ${r.sources.join(', ')}]` : '';

            return `- ${r.name} → ${BUCKET_LABEL_NL[r.bucket]}${sourceStr} — ${r.interpretation}`;
          })
          .join('\n')
      : "Geen ratio's beschikbaar (onvoldoende biomarkers voor berekening)";

  const profileLines = [
    profile.age ? `Leeftijd: ${profile.age}` : null,
    profile.gender
      ? `Geslacht: ${profile.gender === 'male' ? 'Man' : profile.gender === 'female' ? 'Vrouw' : 'Anders'}`
      : null,
    profile.weightKg ? `Gewicht: ${profile.weightKg} kg` : null,
    profile.heightCm ? `Lengte: ${profile.heightCm} cm` : null,
  ]
    .filter(Boolean)
    .join(' | ');

  return `Je bent een expert sportfysioloog en biomarker-analist binnen het PeakLab platform. Analyseer de volgende bloedwaarden en genereer een uitgebreid deep research rapport.

PRIVACY: Je krijgt GEEN exacte meetwaardes of getallen — alleen de kwalitatieve indeling per biomarker (performance / normaal / boven / onder bereik). Schrijf je interpretaties dus zonder specifieke getallen te noemen.

## GEBRUIKERSPROFIEL
${profileLines || 'Geen profielgegevens beschikbaar'}

## BIOMARKER DATA PER DOMEIN

${domainSections}

## BEREKENDE RATIO'S EN VERBANDEN

${ratioLines}

## OPDRACHT

Genereer een uitgebreid, persoonlijk deep research rapport op basis van bovenstaande data. Het rapport moet:

1. **Niet generiek zijn** — verwijs naar de specifieke bevindingen (welke biomarkers in welk bereik) en hun onderlinge verbanden voor deze gebruiker
2. **Verbanden leggen** — koppel biomarkers aan elkaar (bijv. schildklier + energie, hormonen + herstel) en gebruik de ratio-bronnen om verbanden uit te leggen
3. **Performance-gericht zijn** — focus op wat dit betekent voor sportprestaties, niet op medische diagnoses
4. **Concrete actiepunten geven** — geen vage adviezen, maar specifieke stappen
5. **Geen exacte getallen** — beschrijf in tekst (bijv. "binnen het optimale bereik", "iets onder normaal"), nooit met getallen

Antwoord ALLEEN in valid JSON met exact dit format. BELANGRIJK: lever voor ELKE biomarker en ELKE ratio uit de input een interpretatie — sla er geen over, ook niet als ze "goed" zijn. De server koppelt jouw interpretaties weer aan de volledige lijst, dus ontbrekende entries worden leeg getoond.

{
  "executive_summary": "Korte samenvatting van de 3-5 belangrijkste bevindingen (max 200 woorden)",
  "overall_score": <getal 0-100 gebaseerd op hoeveel biomarkers in performance/normaal/buiten bereik zijn>,
  "domains": [
    {
      "name": "Domeinnaam exact zoals in input",
      "score": <getal 0-100>,
      "status": "optimal|good|attention|concern",
      "summary": "Samenvatting van dit domein voor deze gebruiker (2-3 zinnen)",
      "biomarkers": [
        {
          "name": "biomarker_display_name_exact_zoals_in_input",
          "interpretation": "Wat betekent deze bevinding voor deze gebruiker (1-2 zinnen, geen getallen)"
        }
      ],
      "insights": ["Inzicht 1 specifiek voor dit domein", "Inzicht 2"]
    }
  ],
  "ratios": [
    {
      "name": "Ratio naam exact zoals in input",
      "interpretation": "Wat betekent deze ratio voor deze gebruiker (1-2 zinnen, geen getallen)"
    }
  ],
  "performance_impact": {
    "strengths": ["Sterkte punt 1 gebaseerd op de data", "Sterkte punt 2"],
    "areas_for_improvement": ["Verbeterpunt 1", "Verbeterpunt 2"],
    "sport_specific_notes": "Specifieke opmerkingen gerelateerd aan het sporttype van de gebruiker"
  },
  "recommendations": [
    {
      "priority": "high|medium|low",
      "category": "voeding|supplementen|lifestyle|training|herstel",
      "title": "Concrete actietitel (max 8 woorden)",
      "description": "Uitgebreide uitleg met specifieke details (2-4 zinnen)"
    }
  ]
}

BELANGRIJK:
- Geef GEEN medische diagnoses of claims
- Focus op performance optimalisatie
- Schrijf in het Nederlands
- Sorteer recommendations op prioriteit (high eerst)
- Geef minimaal 5 en maximaal 10 recommendations
- Elk domein moet minstens 1 insight hebben
- Gebruik exact dezelfde naam voor "name" als in de input is meegegeven`;
}

const STRUCTURING_SYSTEM_PROMPT =
  'Je bent een data-structureerder. Je krijgt een uitgebreid deep research rapport over biomarkers van een sporter. ' +
  'Structureer dit rapport in het gevraagde JSON-formaat. Behoud alle specifieke details en inzichten uit het onderzoek. ' +
  'Vertaal alles naar het Nederlands als dat nog niet het geval is. Geef nooit medische diagnoses. ' +
  'Privacy: je krijgt GEEN exacte meetwaardes — gebruik alleen kwalitatieve omschrijvingen (range buckets). ' +
  'Antwoord ALLEEN in valid JSON.';

const STRUCTURING_USER_PROMPT_SUFFIX =
  '\n\nStructureer dit rapport in exact dit JSON-formaat:\n\n' +
  '{\n' +
  '  "executive_summary": "Korte samenvatting van de 3-5 belangrijkste bevindingen (max 200 woorden)",\n' +
  '  "overall_score": <getal 0-100>,\n' +
  '  "domains": [\n' +
  '    {\n' +
  '      "name": "Domeinnaam",\n' +
  '      "score": <getal 0-100>,\n' +
  '      "status": "optimal|good|attention|concern",\n' +
  '      "summary": "Samenvatting (2-3 zinnen)",\n' +
  '      "biomarkers": [\n' +
  '        {\n' +
  '          "name": "biomarker_display_name",\n' +
  '          "range_bucket": "performance_range|normal_range|out_of_range_high|out_of_range_low",\n' +
  '          "interpretation": "Interpretatie (1-2 zinnen, geen getallen)"\n' +
  '        }\n' +
  '      ],\n' +
  '      "insights": ["Inzicht 1", "Inzicht 2"]\n' +
  '    }\n' +
  '  ],\n' +
  '  "ratios": [\n' +
  '    {\n' +
  '      "name": "Ratio naam",\n' +
  '      "range_bucket": "performance_range|normal_range|out_of_range_high|out_of_range_low",\n' +
  '      "interpretation": "Interpretatie (1-2 zinnen, geen getallen)"\n' +
  '    }\n' +
  '  ],\n' +
  '  "performance_impact": {\n' +
  '    "strengths": ["Sterkte 1", "Sterkte 2"],\n' +
  '    "areas_for_improvement": ["Verbeterpunt 1"],\n' +
  '    "sport_specific_notes": "Sport-specifieke opmerkingen"\n' +
  '  },\n' +
  '  "recommendations": [\n' +
  '    {\n' +
  '      "priority": "high|medium|low",\n' +
  '      "category": "voeding|supplementen|lifestyle|training|herstel",\n' +
  '      "title": "Actietitel (max 8 woorden)",\n' +
  '      "description": "Uitleg (2-4 zinnen)"\n' +
  '    }\n' +
  '  ]\n' +
  '}\n\n' +
  'BELANGRIJK:\n' +
  '- Behoud alle specifieke bevindingen uit het deep research rapport\n' +
  '- Lever voor ELKE biomarker en ELKE ratio uit het bronrapport een entry met interpretatie — sla er geen over\n' +
  '- Gebruik exact dezelfde naam voor "name" als in het bronrapport staat\n' +
  '- Sorteer recommendations op prioriteit (high eerst)\n' +
  '- Geef minimaal 5 en maximaal 10 recommendations\n' +
  '- Elk domein moet minstens 1 insight hebben\n' +
  '- Focus op performance optimalisatie, geen medische diagnoses\n' +
  '- Geen exacte getallen in interpretaties';

export function calculateOverallScore(domains: BiomarkerDomain[]): number {
  return scoreFromStatuses(domains.flatMap((d) => d.biomarkers.map((b) => b.status)));
}

export function calculateDomainScores(domains: BiomarkerDomain[]): Record<string, number> {
  return Object.fromEntries(
    domains.map((domain) => [
      domain.name,
      scoreFromStatuses(domain.biomarkers.map((b) => b.status)),
    ])
  );
}

export function buildStructuringConfig(
  researchOutput: string,
  overallScore: number,
  domainScores: Record<string, number>
) {
  const suffix = STRUCTURING_USER_PROMPT_SUFFIX.replace(
    '"overall_score": <getal 0-100>,',
    `"overall_score": ${overallScore},`
  );

  const scoreConstraints =
    '\n\nGEBRUIK EXACT DEZE DOMEIN SCORES (niet aanpassen):\n' +
    Object.entries(domainScores)
      .map(([name, score]) => `- ${name}: ${score}`)
      .join('\n');

  return {
    systemPrompt: STRUCTURING_SYSTEM_PROMPT,
    userPrompt: `Hier is het uitgebreide deep research rapport:\n\n${researchOutput}${suffix}${scoreConstraints}`,
    maxTokens: 8000,
  };
}

/**
 * Server-side annotation: the server is authoritative for the structural
 * skeleton of the report (every domain + every biomarker + every ratio
 * the user has). The AI only contributes prose — domain summaries,
 * insights, and per-biomarker interpretations. We walk the server data
 * and look up the AI's matching interpretation by name, defaulting to an
 * empty string when the AI didn't mention a given biomarker.
 *
 * This guarantees the report always contains every biomarker, regardless
 * of whether the model decided to "summarize" by skipping some.
 *
 * Exact values, units, and reference ranges are intentionally not
 * included — the report stays bucket-only end-to-end so it can be shared
 * or shown over-the-shoulder without leaking concrete measurements.
 */
export function annotateReportWithValues(
  reportData: Record<string, unknown>,
  domains: BiomarkerDomain[],
  ratios: CalculatedRatio[]
): Record<string, unknown> {
  const aiDomainByName = new Map<string, Record<string, unknown>>();
  const aiBiomarkerByName = new Map<string, Record<string, unknown>>();
  const aiRatioByName = new Map<string, Record<string, unknown>>();

  const reportDomains = Array.isArray(reportData.domains) ? reportData.domains : [];
  const reportRatios = Array.isArray(reportData.ratios) ? reportData.ratios : [];

  for (const d of reportDomains) {
    const domain = d as Record<string, unknown>;

    if (typeof domain.name === 'string') {
      aiDomainByName.set(domain.name.toLowerCase(), domain);
    }

    const biomarkers = Array.isArray(domain.biomarkers) ? domain.biomarkers : [];

    for (const b of biomarkers) {
      const item = b as Record<string, unknown>;

      if (typeof item.name === 'string') {
        aiBiomarkerByName.set(item.name.toLowerCase(), item);
      }
    }
  }

  for (const r of reportRatios) {
    const item = r as Record<string, unknown>;

    if (typeof item.name === 'string') {
      aiRatioByName.set(item.name.toLowerCase(), item);
    }
  }

  const pickInterpretation = (item: Record<string, unknown> | undefined): string => {
    if (!item) return '';
    const v = item.interpretation;

    return typeof v === 'string' ? v : '';
  };

  const annotatedDomains = domains.map((d) => {
    const aiDomain = aiDomainByName.get(d.name.toLowerCase()) ?? {};
    const aiInsights = Array.isArray(aiDomain.insights) ? aiDomain.insights : [];
    const aiSummary = typeof aiDomain.summary === 'string' ? aiDomain.summary : '';
    const aiStatus = typeof aiDomain.status === 'string' ? aiDomain.status : null;
    const aiScore = typeof aiDomain.score === 'number' ? aiDomain.score : null;

    return {
      name: d.name,
      score: aiScore,
      status: aiStatus,
      summary: aiSummary,
      insights: aiInsights,
      biomarkers: d.biomarkers.map((b) => {
        const aiHit =
          aiBiomarkerByName.get(b.displayName.toLowerCase()) ??
          aiBiomarkerByName.get(b.name.toLowerCase());

        return {
          name: b.name,
          display_name: b.displayName,
          status: b.status,
          range_bucket: b.bucket,
          interpretation: pickInterpretation(aiHit),
        };
      }),
    };
  });

  const annotatedRatios = ratios.map((r) => {
    const aiHit = aiRatioByName.get(r.name.toLowerCase());

    return {
      name: r.name,
      status: r.status,
      range_bucket: r.bucket,
      sources: r.sources,
      interpretation: pickInterpretation(aiHit),
    };
  });

  return {
    ...reportData,
    domains: annotatedDomains,
    ratios: annotatedRatios,
  };
}
