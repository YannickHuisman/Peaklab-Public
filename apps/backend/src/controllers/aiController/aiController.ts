import type { Request, Response } from 'express';

import {
  jsonCompletion,
  LIMITATION_LABELS,
  NUTRITION_LABELS,
  RECOVERY_LABELS,
  SPORT_TYPE_LABELS,
} from '../../services/ai';
import type { AuthenticatedRequest } from '../../types';

export const generateTrainingSchema = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthenticatedRequest;
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
    } = req.body;

    if (!age || !primaryGoal) {
      return res.status(400).json({
        error: 'Missing required fields: age and primaryGoal are required',
      });
    }

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

    const stressLabel =
      stressLevel <= 3
        ? 'Laag'
        : stressLevel <= 5
          ? 'Licht'
          : stressLevel <= 7
            ? 'Gemiddeld'
            : stressLevel <= 9
              ? 'Hoog'
              : 'Extreem';

    const activeSecondaryGoals = (secondaryGoals || []).filter((g: string) => g?.trim());
    const secondaryGoalCurrentLevels: string[] = req.body.secondaryGoalCurrentLevels || [];

    const allGoals: { key: string; goal: string; currentLevel: string }[] = [
      { key: 'primary', goal: primaryGoal, currentLevel: currentLevelDescription || '' },
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
- Sport: ${SPORT_TYPE_LABELS[primarySportType] || primarySportType || 'Niet opgegeven'}
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

    const performanceTips = await jsonCompletion({
      systemPrompt:
        'Je bent een ervaren Nederlandse performance coach en persoonlijke trainer. Je geeft altijd antwoord in het Nederlands met concrete, evidence-based aanbevelingen. Je antwoordt alleen in valid JSON format.',
      userPrompt: prompt,
      maxTokens: 3000,
    });

    res.json({
      success: true,
      performanceTips,
      userId: user.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';

    res.status(500).json({ error: message });
  }
};
