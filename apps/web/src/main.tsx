import { createRoot } from 'react-dom/client';

import { setApiBaseUrl } from '@package/api';

import { App } from './App';
import { API_BASE_URL } from './helpers/api';

import './index.css';

// Configure API base URL for the @package/api module
setApiBaseUrl(API_BASE_URL);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(<App />);
