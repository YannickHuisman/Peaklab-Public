import { createContext } from 'react';

import type { DeepResearchInternalContextType } from '../../types/deepResearch';

export const DeepResearchContext = createContext<DeepResearchInternalContextType | undefined>(
  undefined
);
