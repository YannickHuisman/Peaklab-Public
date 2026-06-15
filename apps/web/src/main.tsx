import { createRoot } from 'react-dom/client';

import { setApiBaseUrl } from '@package/api';

import { App } from './App';
import { API_BASE_URL } from './helpers/api';

import './index.css';

// Configure API base URL for the @package/api module
setApiBaseUrl(API_BASE_URL);

if (import.meta.env.DEV) {
  // Make the active backend obvious in local dev — an unexpected VITE_API_URL
  // (e.g. left pointing at staging) is otherwise easy to miss and looks like
  // "my changes aren't working".
  console.warn(
    `%c[PeakLab] API requests → ${API_BASE_URL || 'Vite proxy → localhost:3001'}`,
    'color:#1F8A4C;font-weight:bold'
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(<App />);
