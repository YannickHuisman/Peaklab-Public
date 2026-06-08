# Shared Packages

This directory contains all shared code used across apps.

## Package Structure

Each package follows this structure:

```
package-name/
 index.ts # Main export file (public API)
 package.json # Package configuration
 tsconfig.json # TypeScript configuration
 feature/ # Feature folders
 feature.ts # Implementation
 index.ts # Re-exports
```

## Import Guidelines

**Correct** - Import from package root:

```typescript
import { formatName } from '@package/utils';
import { User } from '@package/types';
```

**Incorrect** - Deep imports are blocked:

```typescript
import { formatName } from '@package/utils/formatName';
```

## Available Packages

- **`@package/api`** - API client and HTTP utilities
- **`@package/schemas`** - Validation schemas (Zod, Yup, etc.)
- **`@package/types`** - Shared TypeScript types and interfaces
- **`@package/utils`** - Utility functions

## Adding New Exports

1. Create your code in the appropriate subfolder
2. Export it from the subfolder's `index.ts`
3. Re-export from the package root `index.ts`
4. Rebuild: `pnpm --filter @package/your-package build`

Example for adding a new util:

```typescript
// packages/utils/capitalize/capitalize.ts
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// packages/utils/capitalize/index.ts
export * from './capitalize';

// packages/utils/index.ts
export * from './formatName';
export * from './capitalize'; // Add this line
```

## Building Packages

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @package/utils build
```

All packages output to their respective `dist/` folders.
