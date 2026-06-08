# Backend Server

Node.js + TypeScript backend server.

## Development

```bash
# From root
pnpm --filter backend dev

# Or from this directory
pnpm dev
```

## Using Shared Packages

This server has access to all shared packages:

```typescript
import { User } from '@package/types';
import { userSchema } from '@package/schemas';
```

## Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
