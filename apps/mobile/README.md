# Mobile App

Expo + React Native mobile application.

## Development

```bash
# From root
pnpm --filter mobile dev

# Or from this directory
pnpm dev
```

Then:

- Press `i` for iOS simulator (macOS only)
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your physical device

## Build

Follow [Expo's build documentation](https://docs.expo.dev/build/introduction/).

## Using Shared Packages

This app has access to all shared packages:

```typescript
import { formatName } from '@package/utils';
import { User } from '@package/types';
import { api } from '@package/api';
```

## Scripts

- `pnpm dev` - Start Expo development server
- `pnpm android` - Start on Android
- `pnpm ios` - Start on iOS
- `pnpm web` - Start on web
- `pnpm lint` - Run ESLint
- `pnpm cib` - Full clean reinstall and build

## Tech Stack

- **Expo** - React Native framework
- **React Native** - Mobile UI
- **TypeScript** - Type safety
- **Expo Router** - File-based routing

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)
