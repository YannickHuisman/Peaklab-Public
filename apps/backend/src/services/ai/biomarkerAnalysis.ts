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
    refMin: number | null;
    refMax: number | null;
    perfMin: number | null;
    perfMax: number | null;
  }>;
}

export interface CalculatedRatio {
  name: string;
  value: number | null;
  optimalRange: string;
  interpretation: string;
  biomarker1: string;
  biomarker2: string;
}

export type BiomarkerStatus = 'optimal' | 'good' | 'attention' | 'concern';

/**
 * Group enriched biomarker results by their category (domain).
 */
export function groupBiomarkersByDomain(
  results: EnrichedBiomarkerResult[],
  gender: string | null
): BiomarkerDomain[] {
  const domainMap = new Map<number, BiomarkerDomain>();

  for (const result of results) {
    const bio = result.biomarker;

    if (!bio.category) continue;

    const catId = bio.category.id;

    if (!domainMap.has(catId)) {
      domainMap.set(catId, {
        name: bio.category.name,
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
      refMin,
      refMax,
      perfMin,
      perfMax,
    });
  }

  return Array.from(domainMap.values());
}

/**
 * Assess a biomarker value against reference and performance ranges.
 * Returns: optimal (within performance range), good (within ref range),
 * attention (slightly outside ref), concern (far outside ref).
 */
export function assessBiomarkerStatus(
  value: number,
  refMin: number | null,
  refMax: number | null,
  perfMin: number | null,
  perfMax: number | null
): BiomarkerStatus {
  // If we have performance ranges and the value is within them
  if (perfMin !== null && perfMax !== null && value >= perfMin && value <= perfMax) {
    return 'optimal';
  }

  // If within reference range
  if (refMin !== null && refMax !== null) {
    if (value >= refMin && value <= refMax) {
      return 'good';
    }

    // Calculate how far outside the range
    const range = refMax - refMin;

    if (range > 0) {
      const deviation = value < refMin ? (refMin - value) / range : (value - refMax) / range;

      if (deviation <= 0.2) return 'attention';
    }

    return 'concern';
  }

  return 'good'; // No ranges available, assume good
}

interface RatioDefinition {
  name: string;
  biomarker1: string; // biomarker name (lowercase)
  biomarker2: string;
  optimalRange: string;
  interpretation: string;
}

const RATIO_DEFINITIONS: RatioDefinition[] = [
  {
    name: 'Testosteron / Cortisol',
    biomarker1: 'testosterone',
    biomarker2: 'cortisol',
    optimalRange: '> 0.2',
    interpretation: 'Anabole/katabole balans — lage ratio wijst op overtraining of hoge stress',
  },
  {
    name: 'LDL / HDL',
    biomarker1: 'ldl_cholesterol',
    biomarker2: 'hdl_cholesterol',
    optimalRange: '< 2.5',
    interpretation: 'Cardiovasculair risico — lagere ratio is beter voor hartvaat gezondheid',
  },
  {
    name: 'Totaal Cholesterol / HDL',
    biomarker1: 'total_cholesterol',
    biomarker2: 'hdl_cholesterol',
    optimalRange: '< 4.0',
    interpretation: 'Lipidenprofiel — lagere ratio wijst op een gezonder cardiovasculair profiel',
  },
  {
    name: 'Natrium / Kalium',
    biomarker1: 'sodium',
    biomarker2: 'potassium',
    optimalRange: '28 - 34',
    interpretation: 'Elektrolytenbalans — belangrijk voor spierfunctie en vochthuishouding',
  },
  {
    name: 'Vrij T4 / TSH',
    biomarker1: 'free_t4',
    biomarker2: 'tsh',
    optimalRange: '> 3.5',
    interpretation: 'Schildklierfunctie — lage ratio kan wijzen op subklinische hypothyreoïdie',
  },
  {
    name: 'Neutrofielen / Lymfocyten (NLR)',
    biomarker1: 'neutrophils',
    biomarker2: 'lymphocytes',
    optimalRange: '1.0 - 3.0',
    interpretation: 'Inflammatiemarker — verhoogde NLR wijst op systemische ontsteking of stress',
  },
  {
    name: 'Ureum / Creatinine',
    biomarker1: 'urea',
    biomarker2: 'creatinine',
    optimalRange: '10 - 20',
    interpretation:
      'Nierfunctie en hydratatiestatus — afwijking kan wijzen op dehydratie of nierproblemen',
  },
  {
    name: 'IJzer / Ferritine',
    biomarker1: 'iron',
    biomarker2: 'ferritin',
    optimalRange: '0.2 - 0.6',
    interpretation:
      'IJzermetabolisme — verhouding helpt onderscheid maken tussen types ijzertekort',
  },
  {
    name: 'Triglycerides / HDL',
    biomarker1: 'triglycerides',
    biomarker2: 'hdl_cholesterol',
    optimalRange: '< 1.5',
    interpretation: 'Insulineresistentie marker — hogere ratio geassocieerd met metabole problemen',
  },
];

/**
 * Calculate clinically relevant biomarker ratios from the results.
 * Only includes ratios where both biomarkers are present.
 */
export function calculateRatios(results: EnrichedBiomarkerResult[]): CalculatedRatio[] {
  // Build a lookup map by biomarker name (lowercase)
  const valueMap = new Map<string, number>();

  for (const r of results) {
    valueMap.set(r.biomarker.name.toLowerCase(), r.value);
  }

  const calculatedRatios: CalculatedRatio[] = [];

  for (const def of RATIO_DEFINITIONS) {
    const val1 = valueMap.get(def.biomarker1);
    const val2 = valueMap.get(def.biomarker2);

    if (val1 !== undefined && val2 !== undefined && val2 !== 0) {
      calculatedRatios.push({
        name: def.name,
        value: Math.round((val1 / val2) * 100) / 100,
        optimalRange: def.optimalRange,
        interpretation: def.interpretation,
        biomarker1: def.biomarker1,
        biomarker2: def.biomarker2,
      });
    }
  }

  return calculatedRatios;
}

interface ProfileContext {
  age?: number | null;
  gender?: string | null;
  weightKg?: number | null;
  heightCm?: number | null;
}

/**
 * Build the comprehensive Dutch prompt for the AI deep research report.
 */
export function buildDeepResearchPrompt(
  domains: BiomarkerDomain[],
  ratios: CalculatedRatio[],
  profile: ProfileContext
): string {
  // Format domains
  const domainSections = domains
    .map((domain) => {
      const biomarkerLines = domain.biomarkers
        .map((b) => {
          const rangeStr =
            b.refMin !== null && b.refMax !== null ? `ref: ${b.refMin}-${b.refMax}` : 'geen ref';
          const perfStr =
            b.perfMin !== null && b.perfMax !== null
              ? `perf: ${b.perfMin}-${b.perfMax}`
              : 'geen perf range';

          return `  - ${b.displayName}: ${b.value} ${b.unit || ''} [${rangeStr}, ${perfStr}] → status: ${b.status}`;
        })
        .join('\n');

      return `### ${domain.name}\n${biomarkerLines}`;
    })
    .join('\n\n');

  // Format ratios
  const ratioLines =
    ratios.length > 0
      ? ratios
          .map((r) => `- ${r.name}: ${r.value} (optimaal: ${r.optimalRange}) — ${r.interpretation}`)
          .join('\n')
      : "Geen ratio's beschikbaar (onvoldoende biomarkers voor berekening)";

  // Format profile
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

## GEBRUIKERSPROFIEL
${profileLines || 'Geen profielgegevens beschikbaar'}

## BIOMARKER DATA PER DOMEIN

${domainSections}

## BEREKENDE RATIO'S EN VERBANDEN

${ratioLines}

## OPDRACHT

Genereer een uitgebreid, persoonlijk deep research rapport op basis van bovenstaande data. Het rapport moet:

1. **Niet generiek zijn** — verwijs specifiek naar de waarden, verhoudingen en status van deze gebruiker
2. **Verbanden leggen** — koppel biomarkers aan elkaar (bijv. schildklier + energie, hormonen + herstel)
3. **Performance-gericht zijn** — focus op wat dit betekent voor sportprestaties, niet op medische diagnoses
4. **Gebruik de PeakLab performance ranges** om te bepalen wat optimaal is voor een atleet (niet alleen de lab referentiewaarden)
5. **Concrete actiepunten geven** — geen vage adviezen, maar specifieke stappen

Antwoord ALLEEN in valid JSON met exact dit format:

{
  "executive_summary": "Korte samenvatting van de 3-5 belangrijkste bevindingen (max 200 woorden)",
  "overall_score": <getal 0-100 gebaseerd op hoeveel biomarkers optimaal/goed/attention/concern zijn>,
  "domains": [
    {
      "name": "Domeinnaam",
      "score": <getal 0-100>,
      "status": "optimal|good|attention|concern",
      "summary": "Samenvatting van dit domein voor deze gebruiker (2-3 zinnen)",
      "biomarkers": [
        {
          "name": "biomarker_naam",
          "value": <waarde>,
          "unit": "eenheid",
          "status": "optimal|good|attention|concern",
          "interpretation": "Wat betekent deze waarde specifiek voor deze gebruiker (1-2 zinnen)"
        }
      ],
      "insights": ["Inzicht 1 specifiek voor dit domein", "Inzicht 2"]
    }
  ],
  "ratios": [
    {
      "name": "Ratio naam",
      "value": <berekende waarde>,
      "optimal_range": "optimaal bereik",
      "status": "optimal|good|attention|concern",
      "interpretation": "Wat betekent deze ratio voor deze gebruiker (1-2 zinnen)"
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
- Elk domein moet minstens 1 insight hebben`;
}
