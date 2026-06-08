/**
 * Centralised helper for the VITE_EXPORT_MOCKS dev-tool.
 * Keeps provider code clean by extracting the mock-export logic.
 *
 * When export mode is on, each call:
 * 1. Attaches data to `window.__EXPORT_MOCKS` (for manual inspection).
 * 2. POSTs the data to the Vite dev-server plugin which writes it to
 *    `public/mockdata/<key>.json` automatically.
 */

export const isExportMode = import.meta.env.VITE_EXPORT_MOCKS === 'true';

/**
 * Attach data to `window.__EXPORT_MOCKS` and persist it to a local
 * mock-data file via the dev-server plugin.  No-ops when export mode is off.
 */
export function exportMock(key: string, data: unknown): void {
  if (!isExportMode) return;

  try {
    console.warn(`EXPORT_MOCK: ${key}`, JSON.stringify(data, null, 2));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;

    w.__EXPORT_MOCKS = w.__EXPORT_MOCKS || {};

    // Support nested keys like "auth.session"
    const parts = key.split('.');
    let target = w.__EXPORT_MOCKS;

    for (let i = 0; i < parts.length - 1; i++) {
      target[parts[i]] = target[parts[i]] || {};
      target = target[parts[i]];
    }
    target[parts[parts.length - 1]] = data;

    // Persist to disk via dev-server plugin
    saveMockToDisk(key, data);
  } catch {
    // ignore serialisation failures
  }
}

/**
 * POST mock data to the Vite dev-server plugin endpoint which writes it to
 * `public/mockdata/<key>.json`.
 */
async function saveMockToDisk(key: string, data: unknown): Promise<void> {
  try {
    const res = await fetch('/__save-mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, data }),
    });

    if (res.ok) {
      const result = await res.json();

      console.warn(`Mock saved: ${result.path}`);
    } else {
      console.warn(`Failed to save mock "${key}":`, res.statusText);
    }
  } catch (err) {
    console.warn(`Could not reach dev-server to save mock "${key}":`, err);
  }
}
