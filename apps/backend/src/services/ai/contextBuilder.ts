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
 * Only includes user profile and performance plan context — never biomarkers.
 */
export function buildChatSystemPrompt(userContext?: Record<string, unknown>): string {
  let prompt =
    'Je bent een deskundige gezondheidsassistent binnen het Peaklab platform, gespecialiseerd in sportprestaties, voeding en herstel. ' +
    'Je geeft altijd antwoord in het Nederlands. ' +
    'Beantwoord UITSLUITEND vragen die betrekking hebben op: gezondheid, sportprestaties, voeding, herstel, supplementen of gerelateerde lifestyle-onderwerpen. ' +
    'Als een gebruiker een vraag stelt die NIET gerelateerd is aan deze onderwerpen, weiger je beleefd maar duidelijk te antwoorden. ' +
    'Zeg dan kort: "Ik kan je alleen helpen met vragen over je gezondheid en sportprestaties. Stel gerust een vraag over die onderwerpen!" ' +
    'Geef nooit direct medisch advies. ' +
    'Als je niet genoeg informatie hebt, vraag dan om meer details. ' +
    'Moedig gebruikers altijd aan om een arts te raadplegen voor persoonlijk medisch advies.';

  if (!userContext) return prompt;

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

/**
 * Format biomarker data into a prompt section.
 */
export function formatBiomarkerContext(userContext: Record<string, unknown>): string {
  const { biomarkers } = userContext as {
    biomarkers?: Array<Record<string, unknown>>;
  };

  if (!Array.isArray(biomarkers) || biomarkers.length === 0) return '';

  const biomarkerLines = biomarkers.map((b) => {
    const flag = b.flag === 'normal' ? 'normal' : b.flag === 'high' ? 'HOOG' : 'LAAG';
    const range =
      b.normalMin !== null && b.normalMax !== null ? ` (ref: ${b.normalMin}-${b.normalMax})` : '';

    return `- ${b.displayName}: ${b.value} ${b.unit || ''}${range} ${flag}`;
  });

  let section = `\n\nBiomarker resultaten van de gebruiker:\n${biomarkerLines.join('\n')}`;

  section +=
    '\n\nGebruik deze biomarker-gegevens om gerichte, persoonlijke antwoorden te geven. Verwijs specifiek naar afwijkende waarden als dat relevant is voor de vraag.';

  return section;
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
