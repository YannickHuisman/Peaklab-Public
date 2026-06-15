// API configuration
// This should be set by the consuming app (web/mobile)
let apiBaseUrl = '/api';

export const setApiBaseUrl = (url: string) => {
  apiBaseUrl = url;
};

export const apiUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  return `${apiBaseUrl}/${cleanPath}`;
};
