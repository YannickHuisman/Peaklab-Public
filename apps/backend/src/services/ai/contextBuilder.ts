// Label maps — shared across AI features

export const LIMITATION_LABELS: Record<string, string> = {
  chronic_fatigue: 'Chronische vermoeidheid',
  low_energy: 'Lage energie',
  slow_recovery: 'Langzaam herstel',
  poor_sleep: 'Slechte slaap',
  high_stress: 'Hoge stress',
  mood_swings: 'Stemmingswisselingen',
  joint_pain: 'Pijn in gewrichten',
  frequent_injuries: 'Frequente blessures',
  muscle_pain: 'Spierpijn',
  concentration_problems: 'Concentratieproblemen',
  digestive_issues: 'Spijsverteringsproblemen',
};

export const SPORT_TYPE_LABELS: Record<string, string> = {
  strength: 'Krachttraining',
  endurance: 'Endurance',
  hybrid: 'Hybrid (kracht + cardio)',
  team_sport: 'Teamsport',
  recreational: 'Recreatief',
};

export const NUTRITION_LABELS: Record<string, string> = {
  balanced: 'Gebalanceerd',
  high_protein: 'Hoog Eiwit',
  vegetarian: 'Vegetarisch',
  vegan: 'Veganistisch',
  low_carb: 'Low Carb',
  carnivore: 'Carnivoor',
  minimal_processed: 'Minimaal Bewerkt',
  irregular: 'Onregelmatig',
};

export const RECOVERY_LABELS: Record<string, string> = {
  rest_days: 'Rustdagen',
  stretching_mobility: 'Stretching / Mobiliteit',
  massage_foam_rolling: 'Massage / Foam Rolling',
  sauna_cold: 'Sauna / Koude',
  active_recovery: 'Actief Herstel',
  no_structured_recovery: 'Geen Gestructureerd Herstel',
};

/**
 * Build the base system prompt for the PeakLab health assistant (chatbot).
 * Includes user profile, biomarker range context (bucket-only, no exact
 * values), and performance plan when supplied.
 */
export function buildChatSystemPrompt(userContext?: Record<string, unknown>): string {
  let prompt =
    'Je bent de Peaklab health coach: een deskundige assistent voor sportprestaties, voeding, herstel, supplementen, lifestyle en biomarker-interpretatie. ' +
    'Je geeft altijd antwoord in het Nederlands. ' +
    'Toegestane onderwerpen: bloedwaardes en biomarkers (inclusief uitleg, interpretatie en suggesties), gezondheid, training, voeding, supplementen, slaap, herstel, stress en lifestyle. ' +
    'Vragen over de eigen biomarkers van de gebruiker (bv. "vertel iets over mijn biomarkers") zijn ALTIJD toegestaan — gebruik daarvoor de biomarker-status sectie hieronder. ' +
    'Weiger alleen als de vraag echt buiten dit domein valt (bv. politiek, programmeren, persoonlijke financiën). Zeg dan: "Ik kan je alleen helpen met vragen over je gezondheid en sportprestaties. Stel gerust een vraag over die onderwerpen!" ' +
    'Geef geen harde medische diagnoses, maar wel interpretaties, context en optimalisatie-suggesties. ' +
    'Verwijs naar een arts voor persoonlijke medische beslissingen.';

  if (!userContext) return prompt;

  prompt += formatBiomarkerContext(userContext);
  prompt += formatProfileContext(userContext);
  prompt += formatPerformancePlanContext(userContext);

  return prompt;
}

/**
 * Format user profile data into a prompt section.
 */
export function formatProfileContext(userContext: Record<string, unknown>): string {
  const { profile } = userContext as {
    profile?: Record<string, unknown>;
  };

  if (!profile) return '';

  const parts: string[] = [];

  if (profile.age) parts.push(`Leeftijd: ${profile.age}`);
  if (profile.gender) parts.push(`Geslacht: ${profile.gender}`);
  if (profile.heightCm) parts.push(`Lengte: ${profile.heightCm} cm`);
  if (profile.weightKg) parts.push(`Gewicht: ${profile.weightKg} kg`);
  if (profile.primarySportType) parts.push(`Sport: ${profile.primarySportType}`);
  if (profile.primaryGoal) parts.push(`Doel: ${profile.primaryGoal}`);
  if (profile.sleepHoursPerNight) parts.push(`Slaap: ${profile.sleepHoursPerNight} uur/nacht`);
  if (profile.stressLevel) parts.push(`Stressniveau: ${profile.stressLevel}/10`);
  if (profile.dailyCalorieIntake) parts.push(`Calorie-inname: ${profile.dailyCalorieIntake} kcal`);
  if (profile.trainingHoursPerWeek)
    parts.push(`Training: ${profile.trainingHoursPerWeek} uur/week`);
  if (profile.highIntensitySessionsPerWeek)
    parts.push(`Hoge intensiteit sessies: ${profile.highIntensitySessionsPerWeek}/week`);

  if (Array.isArray(profile.nutritionPatterns) && profile.nutritionPatterns.length > 0) {
    parts.push(`Voedingspatroon: ${(profile.nutritionPatterns as string[]).join(', ')}`);
  }

  if (profile.currentLimitations && typeof profile.currentLimitations === 'object') {
    const lims = profile.currentLimitations as Record<string, string[]>;
    const allLimitations = Object.values(lims).flat().filter(Boolean);

    if (allLimitations.length > 0) {
      parts.push(`Beperkingen: ${allLimitations.join(', ')}`);
    }
  }

  if (parts.length === 0) return '';

  return `\n\nProfiel van de gebruiker:\n${parts.join('\n')}`;
}

const CHAT_BUCKET_LABEL: Record<string, string> = {
  performance_range: 'in performance bereik (optimaal voor sporters)',
  normal_range: 'in normaal referentiebereik',
  out_of_range_high: 'boven het normale bereik',
  out_of_range_low: 'onder het normale bereik',
};

/**
 * Format biomarker context into a prompt section using only the range
 * bucket per biomarker. Exact values, reference ranges, and performance
 * ranges are never disclosed to the AI.
 */
export function formatBiomarkerContext(userContext: Record<string, unknown>): string {
  const { biomarkers } = userContext as {
    biomarkers?: Array<Record<string, unknown>>;
  };

  if (!Array.isArray(biomarkers) || biomarkers.length === 0) return '';

  const grouped = new Map<string, string[]>();

  for (const b of biomarkers) {
    const name = (b.displayName ?? b.display_name ?? b.name) as string | undefined;
    const bucket = b.bucket as string | undefined;
    const category = (b.category as string | undefined) ?? 'Overig';

    if (!name || !bucket) continue;

    const label = CHAT_BUCKET_LABEL[bucket] ?? bucket;
    const line = `  - ${name}: ${label}`;

    const lines = grouped.get(category) ?? [];

    grouped.set(category, lines);
    lines.push(line);
  }

  if (grouped.size === 0) return '';

  const sections = Array.from(grouped.entries())
    .map(([category, lines]) => `${category}:\n${lines.join('\n')}`)
    .join('\n\n');

  return `\n\n=== BIOMARKER STATUS VAN DEZE GEBRUIKER ===
Je hebt toegang tot de actuele biomarker-status van deze gebruiker. Beweer NOOIT dat je geen biomarker-data hebt — die staat hieronder. Verwijs er actief naar wanneer de gebruiker er om vraagt.

Voor privacy zie je alleen de kwalitatieve indeling per biomarker (in welk bereik de waarde valt), niet de exacte getallen. Noem dus nooit cijfers, maar wel de status en wat dat betekent voor sportprestaties, voeding en herstel.

${sections}
=== EINDE BIOMARKER STATUS ===`;
}

/**
 * Format performance plan data into a prompt section.
 */
export function formatPerformancePlanContext(userContext: Record<string, unknown>): string {
  const { performancePlan } = userContext as {
    performancePlan?: Array<{
      goal: string;
      tips: Array<{ category: string; title: string; description: string }>;
    }>;
  };

  if (!Array.isArray(performancePlan) || performancePlan.length === 0) return '';

  const goalSections = performancePlan
    .map((g) => {
      const tipLines = g.tips.map((t) => `  - [${t.category}] ${t.title}: ${t.description}`);

      return `Doel: ${g.goal}\n${tipLines.join('\n')}`;
    })
    .join('\n\n');

  let section = `\n\nHuidig performance plan van de gebruiker:\n${goalSections}`;

  section +=
    '\n\nHoud rekening met dit plan bij het beantwoorden van vragen. Verwijs naar specifieke doelen en aanbevelingen uit het plan wanneer relevant.';

  return section;
}
