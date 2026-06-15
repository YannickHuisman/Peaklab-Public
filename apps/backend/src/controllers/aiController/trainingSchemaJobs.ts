import { randomUUID } from 'node:crypto';

export type TrainingSchemaJobStatus = 'generating' | 'completed' | 'failed';

export interface TrainingSchemaResult {
  performanceTips: unknown;
  aiProvider: string | undefined;
  userId: string;
}

export interface TrainingSchemaJob {
  userId: string;
  status: TrainingSchemaJobStatus;
  result?: TrainingSchemaResult;
  error?: string;
  createdAt: number;
}

/**
 * In-memory store for training-schema generation jobs.
 *
 * Generation is decoupled from the HTTP request (the POST returns 202 and the
 * client polls), so a slow LLM call can no longer be killed by client, proxy,
 * or platform request timeouts. An in-memory map is sufficient because the
 * backend runs a single replica (railway.json), the jobs are short-lived, and
 * the *final* plan is still persisted to the user's performance profile by the
 * client once polled — so nothing durable depends on this store, and no DB
 * change is required.
 */
const jobs = new Map<string, TrainingSchemaJob>();
const JOB_TTL_MS = 15 * 60 * 1000;

function evictExpired(): void {
  const now = Date.now();

  for (const [id, job] of jobs) {
    if (now - job.createdAt > JOB_TTL_MS) jobs.delete(id);
  }
}

export function createTrainingSchemaJob(userId: string): string {
  evictExpired();

  const id = randomUUID();

  jobs.set(id, { userId, status: 'generating', createdAt: Date.now() });

  return id;
}

export function completeTrainingSchemaJob(id: string, result: TrainingSchemaResult): void {
  const job = jobs.get(id);

  if (!job) return;

  job.status = 'completed';
  job.result = result;
}

export function failTrainingSchemaJob(id: string, error: string): void {
  const job = jobs.get(id);

  if (!job) return;

  job.status = 'failed';
  job.error = error;
}

export function getTrainingSchemaJob(id: string): TrainingSchemaJob | undefined {
  return jobs.get(id);
}
