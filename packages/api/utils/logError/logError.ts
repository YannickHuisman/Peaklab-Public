/**
 * Log a swallowed/handled error with a stable context label.
 *
 * Much of the data layer degrades gracefully on failure (returning
 * false/null/[] and showing a toast or inline error), which is good UX but
 * historically discarded the underlying error entirely — making production
 * issues undiagnosable. Routing those through one helper keeps the graceful
 * behaviour while ensuring the real error is always visible in the console
 * (and any console-forwarding telemetry).
 */
export function logError(context: string, error: unknown): void {
  console.error(`[${context}]`, error);
}
