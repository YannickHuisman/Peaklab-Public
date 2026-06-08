import { authenticatedFetch as coreAuthenticatedFetch } from '@package/api';

const OFFLINE_MOCK_ROUTES: Array<[(url: string) => boolean, (url: string) => string]> = [
  [(url) => url.replace(/\/$/, '') === '/api/auth/session', () => '/mockdata/auth/session.json'],
  [(url) => url.replace(/\/$/, '') === '/api/auth/profile', () => '/mockdata/auth/profile.json'],
  [(url) => url.startsWith('/api/auth/admin/users'), () => '/mockdata/users.json'],
  [
    (url) => url.startsWith('/api/admin/users/'),
    (url) => `/mockdata/user-${url.split('/').pop() || 'unknown'}.json`,
  ],
  [
    (url) => url.replace(/\/$/, '') === '/api/biomarkers/admin/all',
    () => '/mockdata/biomarkersAdminAll.json',
  ],
  [
    (url) => url.replace(/\/$/, '') === '/api/biomarkers/categories',
    () => '/mockdata/biomarkerCategories.json',
  ],
];

async function fetchOfflineMock(url: string): Promise<Response | null> {
  for (const [match, resolve] of OFFLINE_MOCK_ROUTES) {
    if (match(url)) return fetch(resolve(url));
  }

  const fallbackPath = `/mockdata${url.replace(/^\/api/, '')}.json`;
  const resp = await fetch(fallbackPath);
  const ct = resp.headers.get('content-type') || '';

  if (resp.ok && ct.includes('application/json')) return resp;

  return null;
}

export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const isOffline = import.meta.env.VITE_OFFLINE === 'true';

  if (isOffline) {
    try {
      const mock = await fetchOfflineMock(url);

      if (mock) return mock;
    } catch (err) {
      console.warn('Offline mock fetch failed for', url, err);
    }
  }

  return coreAuthenticatedFetch(url, options);
};
