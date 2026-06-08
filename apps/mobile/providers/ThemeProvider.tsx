import React, { ReactNode } from 'react';

import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';

import { theme } from '@package/ui';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
}
