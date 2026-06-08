// Type definitions for styled-components/native
declare module 'styled-components/native' {
  import type { Theme } from '@package/ui';

  export * from 'styled-components/native/dist';
  export { default } from 'styled-components/native/dist';

  export type DefaultTheme = Theme;
}
