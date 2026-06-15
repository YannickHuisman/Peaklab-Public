import type { Request, Response } from 'express';

import { getUserAIContextPreferences } from '../../helpers/userAISettings';
import {
  getActiveProviderName,
  jsonCompletion,
  LIMITATION_LABELS,
  NUTRITION_LABELS,
  RECOVERY_LABELS,
  SPORT_TYPE_LABELS,
} from '../../services/ai';
import type { AuthenticatedRequest } from '../../types';
import {
  completeTrainingSchemaJob,
  createTrainingSchemaJob,
  failTrainingSchemaJob,
  getTrainingSchemaJob,
} from './trainingSchemaJobs';

interface TrainingSchemaBody {
  age?: number;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  primarySportType?: string;
  primaryGoal?: string;
  secondaryGoals?: string[];
  currentLimitations?: Record<string, string[]>;
  sleepHoursPerNight?: number;
  stressLevel?: number;
  dailyCalorieIntake?: number;
  nutritionPatterns?: string[];
  recoveryMethods?: Record<string, Record<string, unknown>>;
  trainingHoursPerWeek?: number;
  highIntensitySessionsPerWeek?: number;
  currentLevelDescription?: string;
  secondaryGoalCurrentLevels?: string[];
}

/**
 * Build the prompt and run the LLM call for the performance tips. Pure of any
 * HTTP concerns so it can run in the background, detached from the request.
 */
async function generatePerformanceTips(
  body: TrainingSchemaBody
): Promise<{ performanceTips: unknown; aiProvider: string | undefined }> {
  const {
    age,
    gender,
    heightCm,
    weightKg,
    primarySportType,
    primaryGoal,
    secondaryGoals,
    currentLimitations,
    sleepHoursPerNight,
    stressLevel,
    dailyCalorieIntake,
    nutritionPatterns,
    recoveryMethods,
    trainingHoursPerWeek,
    highIntensitySessionsPerWeek,
    currentLevelDescription,
  } = body;

  const bmi =
    heightCm && weightKg ? (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1) : 'Niet berekend';

  const allLimitations = currentLimitations
    ? [
        ...(currentLimitations.energy_recovery || []),
        ...(currentLimitations.sleep_stress || []),
        ...(currentLimitations.muscles_joints || []),
        ...(currentLimitations.cognition_digestion || []),
      ]
        .map((l: string) => LIMITATION_LABELS[l] || l)
        .join(', ')
    : 'Geen beperkingen aangegeven';

  const activeRecoveryMethods = recoveryMethods
    ? Object.entries(recoveryMethods as Record<string, Record<string, unknown>>)
        .filter(([, method]) => method.active)
        .map(([key, method]) => {
          const label = RECOVERY_LABELS[key] || key;
          const frequency = method.frequency
            ? ` (${method.frequency === 'rarely' ? 'Zelden' : method.frequency === 'sometimes' ? 'Soms' : 'Regelmatig'})`
            : '';

          return `${label}${frequency}`;
        })
        .join(', ') || 'Geen herstelmethoden geselecteerd'
    : 'Geen herstelmethoden geselecteerd';

  const nutritionPatternsText =
    nutritionPatterns && nutritionPatterns.length > 0
      ? nutritionPatterns.map((p: string) => NUTRITION_LABELS[p] || p).join(', ')
      : 'Niet gespecificeerd';

  const stress = stressLevel ?? 5;
  const stressLabel =
    stress <= 3
      ? 'Laag'
      : stress <= 5
        ? 'Licht'
        : stress <= 7
          ? 'Gemiddeld'
          : stress <= 9
            ? 'Hoog'
            : 'Extreem';

  const activeSecondaryGoals = (secondaryGoals || []).filter((g: string) => g?.trim());
  const secondaryGoalCurrentLevels: string[] = body.secondaryGoalCurrentLevels || [];

  const allGoals: { key: string; goal: string; currentLevel: string }[] = [
    { key: 'primary', goal: primaryGoal ?? '', currentLevel: currentLevelDescription || '' },
    ...activeSecondaryGoals.map((g: string, i: number) => ({
      key: `secondary_${i}`,
      goal: g,
      currentLevel: secondaryGoalCurrentLevels[i] || '',
    })),
  ];

  const goalsSection = allGoals
    .map(
      (g, i) =>
        `${i === 0 ? '**Primair Doel**' : `Secundair Doel ${i}`}: ${g.goal}${g.currentLevel ? `\n  Huidig niveau: ${g.currentLevel}` : ''}`
    )
    .join('\n');

  const goalKeys = allGoals.map((g) => `"${g.key}"`).join(', ');
  const goalExamples = allGoals
    .map(
      (g) => `
    "${g.key}": {
      "goal": "${g.goal}",
      "tips": [
        {
          "id": "tip_${g.key}_0",
          "category": "training",
          "title": "Korte actietitel",
          "description": "Concrete uitleg met specifieke details",
          "source_url": "https://example.com/source"
        }
      ]
    }`
    )
    .join(',');

  const prompt = `Je bent een expert performance coach. Genereer gepersonaliseerde tips per doel voor de volgende gebruiker.

## GEBRUIKERSPROFIEL

- Leeftijd: ${age} jaar | Geslacht: ${gender === 'male' ? 'Man' : gender === 'female' ? 'Vrouw' : 'Anders'}
- Gewicht: ${weightKg ? `${weightKg} kg` : '?'} | Lengte: ${heightCm ? `${heightCm} cm` : '?'} | BMI: ${bmi}
- Sport: ${(primarySportType && SPORT_TYPE_LABELS[primarySportType]) || primarySportType || 'Niet opgegeven'}
- Trainingslast: ${trainingHoursPerWeek || 7} uur/week, ${highIntensitySessionsPerWeek || 2} intensieve sessies
- Slaap: ${sleepHoursPerNight || 7.5}u | Stress: ${stressLevel || 5}/10 (${stressLabel})
- Voeding: ${nutritionPatternsText} | ${dailyCalorieIntake || 2500} kcal/dag
- Herstel: ${activeRecoveryMethods}
- Beperkingen: ${allLimitations}

## DOELEN

${goalsSection}

## OPDRACHT

Genereer voor elk doel (${goalKeys}) exact 8-10 concrete, evidence-based tips. Elke tip heeft:
- Een uniek id (formaat: "tip_[goal_key]_[index]")
- category: één van "training", "voeding", "supplementen", "lifestyle"
- title: korte actietitel (max 8 woorden)
- description: concrete uitleg (2-3 zinnen)
- source_url: optionele wetenschappelijke bron (echte URL of leeg laten)

Verdeel de tips evenwichtig over categorieën. Zorg dat de tips direct toepasbaar zijn voor het specifieke doel.

Antwoord ALLEEN in valid JSON:
{
  "tips_by_goal": {${goalExamples}
  }
}`;

  const [performanceTips, aiProvider] = await Promise.all([
    jsonCompletion({
      systemPrompt:
        'Je bent een ervaren Nederlandse performance coach en persoonlijke trainer. Je geeft altijd antwoord in het Nederlands met concrete, evidence-based aanbevelingen. Je antwoordt alleen in valid JSON format.',
      userPrompt: prompt,
      maxTokens: 3000,
    }),
    getActiveProviderName(),
  ]);

  return { performanceTips, aiProvider };
}

/**
 * Kick off training-schema generation. Returns 202 with a job id immediately
 * and runs the (slow) LLM call in the background, so the request is never held
 * open long enough to hit a client, proxy, or platform timeout. The client
 * polls `getTrainingSchemaJobStatus` for the result.
 */
export const generateTrainingSchema = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;

    const prefs = await getUserAIContextPreferences(user.id);

    if (!prefs.profile) {
      return res.status(400).json({
        error:
          'Profiel-context is uitgeschakeld. Schakel "Profiel" in onder Instellingen → AI-context om performance tips te genereren.',
      });
    }

    const body = req.body as TrainingSchemaBody;

    if (!body.age || !body.primaryGoal) {
      return res.status(400).json({
        error: 'Missing required fields: age and primaryGoal are required',
      });
    }

    const jobId = createTrainingSchemaJob(user.id);

    res.status(202).json({ jobId, status: 'generating' });

    // Detached from the request lifecycle — failures are captured on the job.
    void generatePerformanceTips(body)
      .then(({ performanceTips, aiProvider }) =>
        completeTrainingSchemaJob(jobId, { performanceTips, aiProvider, userId: user.id })
      )
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Internal server error';

        failTrainingSchemaJob(jobId, message);
      });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    if (!res.headersSent) res.status(500).json({ error: message });
  }
};

/**
 * Poll for the result of a training-schema generation job. Scoped to the
 * requesting user so a job id can't be read by anyone else.
 */
export const getTrainingSchemaJobStatus = (req: Request, res: Response) => {
  const { user } = req as AuthenticatedRequest;
  const { jobId } = req.params;
  const job = jobId ? getTrainingSchemaJob(jobId) : undefined;

  if (!job || job.userId !== user.id) {
    return res.status(404).json({ error: 'Job not found' });
  }

  if (job.status === 'completed' && job.result) {
    return res.json({
      success: true,
      status: 'completed',
      performanceTips: job.result.performanceTips,
      aiProvider: job.result.aiProvider,
      userId: job.result.userId,
    });
  }

  if (job.status === 'failed') {
    return res.json({ status: 'failed', error: job.error ?? 'Generatie mislukt' });
  }

  return res.json({ status: 'generating' });
};
