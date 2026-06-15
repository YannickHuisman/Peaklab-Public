import { createContext } from 'react';

import type { AppDataContextType } from '../../types/appData';

export const AppDataContext = createContext<AppDataContextType | undefined>(undefined);
