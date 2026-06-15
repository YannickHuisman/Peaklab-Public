import { apiUrl } from '../../config';
import { getAuthToken } from '../../tokenStore';
import { logError } from '../logError';

const DEFAULT_TIMEOUT_MS = 10_000;

export type AuthenticatedFetchOptions = RequestInit & {
  /**
   * Per-request timeout in milliseconds (default 10s). Pass a larger value for
   * slow endpoints such as AI generation, which routinely exceed the default.
   */
  timeoutMs?: number;
};

export const authenticatedFetch = async (
  url: string,
  options: AuthenticatedFetchOptions = {}
): Promise<Response> => {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...requestInit } = options;
  const headers = new Headers(requestInit.headers);

  if (requestInit.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAuthToken();

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const method = requestInit.method ?? 'GET';

  try {
    const response = await fetch(apiUrl(url), {
      ...requestInit,
      headers,
      credentials: 'include',
      signal: requestInit.signal ?? controller.signal,
    });

    if (response.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    // Surface server-side failures centrally so the many callers that swallow
    // non-OK responses into a graceful fallback don't hide them entirely.
    // 4xx (validation, auth, not-found) are usually expected, so only 5xx is
    // logged here.
    if (response.status >= 500) {
      logError(`API ${method} ${url} → ${response.status}`, response.statusText);
    }

    return response;
  } catch (error) {
    // Network failure or our own timeout abort — these are exactly the errors
    // that otherwise vanish into a `catch { return null }` at the call site.
    const isAbort = error instanceof DOMException && error.name === 'AbortError';
    const abortedByCaller = requestInit.signal?.aborted === true;

    // Skip deliberate caller cancellations (e.g. component unmount); still log
    // our own timeout and all genuine network errors.
    if (!(isAbort && abortedByCaller)) {
      logError(`API ${method} ${url}`, isAbort ? `timed out after ${timeoutMs}ms` : error);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
