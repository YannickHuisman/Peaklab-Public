import { apiUrl } from '../../config';

const REQUEST_TIMEOUT_MS = 10_000;

export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(apiUrl(url), {
      ...options,
      headers,
      credentials: 'include',
      signal: options.signal ?? controller.signal,
    });

    if (response.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    return response;
  } finally {
    clearTimeout(timeout);
  }
};
