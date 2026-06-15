import { createContext } from 'react';

import type { DataContextType } from '../../types/data';

export const DataContext = createContext<DataContextType | undefined>(undefined);
