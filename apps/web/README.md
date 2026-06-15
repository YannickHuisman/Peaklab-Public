# Web App

React + TypeScript + Vite web application.

## Development

```bash
# From root
pnpm --filter web dev

# Or from this directory
pnpm dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

## Build

```bash
pnpm build
```

## Using Shared Packages

This app has access to all shared packages:

```typescript
import { formatName } from '@package/utils';
import { User } from '@package/types';
import { api } from '@package/api';
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build
- `pnpm cib` - Full clean reinstall and build

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **ESLint** - Code linting

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
