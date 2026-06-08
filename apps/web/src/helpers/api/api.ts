// API configuration - uses VITE_API_URL from environment
// For local dev: leave VITE_API_URL unset — the Vite proxy handles /api → localhost:3001
// For deployed: set VITE_API_URL to the backend root (e.g. https://backend.railway.app)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  return `${API_BASE_URL}/${cleanPath}`;
};
