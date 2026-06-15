import { authenticatedFetch } from '@package/api';

export interface ChatUserContext {
  profile?: {
    age?: number | null;
    gender?: string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    primarySportType?: string | null;
    primaryGoal?: string;
    primaryGoalTimelineMonths?: number | null;
    secondaryGoals?: string[];
    sleepHoursPerNight?: number;
    stressLevel?: number;
    dailyCalorieIntake?: number;
    nutritionPatterns?: string[];
    trainingHoursPerWeek?: number;
    highIntensitySessionsPerWeek?: number;
    currentLimitations?: Record<string, string[]>;
    recoveryMethods?: Record<string, unknown>;
    currentLevelDescription?: string;
    secondaryGoalCurrentLevels?: string[];
  };
  biomarkers?: Array<{
    name: string;
    displayName: string;
    bucket: 'performance_range' | 'normal_range' | 'out_of_range_high' | 'out_of_range_low';
    category?: string;
  }>;
  performancePlan?: Array<{
    goal: string;
    tips: Array<{ category: string; title: string; description: string }>;
  }>;
}

export async function* streamChatMessage(
  message: string,
  userContext?: ChatUserContext,
  conversationHistory?: Array<{ role: string; content: string }>
): AsyncGenerator<string> {
  const response = await authenticatedFetch('/api/llm/chat', {
    method: 'POST',
    body: JSON.stringify({ message, userContext, conversationHistory }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();

  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          if (data === '[DONE]') break;

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;

            if (content) yield content;
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
