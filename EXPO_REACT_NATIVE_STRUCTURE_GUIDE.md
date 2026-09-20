# Expo React Native Structure Guide

The mobile starter uses Expo Router, TypeScript, NativeWind, React Query, Zustand,
SecureStore, AsyncStorage, and SQLite. The structure supports a small online app
and can grow into an offline-first app without moving route files later.

## Layout

```text
mobile/src/
  app/
    _layout.tsx
    index.tsx
    (auth)/
    (tabs)/
    (modals)/
  components/
    ui/
    forms/
    <feature>/
  constants/
    config.ts
    theme.ts
  core/
    api/
    auth/
    db/
    sync/
    theme/
    utils/
  hooks/
    auth/
  types/
  global.css
```

Keep `src/app` limited to Expo Router layouts and screens. Screens compose hooks
and components; they should not own database migrations, token persistence, or
sync algorithms.

## App composition

The root `_layout.tsx` imports `global.css` and mounts global providers. Add
providers in this order when needed:

```text
GestureHandlerRootView
  QueryClientProvider
    SQLiteProvider
      RootNavigator
      Global modal hosts
```

Keep signed-in/signed-out routing in the root navigator. Use route groups for
organization: `(auth)`, `(tabs)`, and `(modals)` do not become URL segments.

## State and storage

- React Query: remote/cache state and mutation lifecycle.
- Zustand: small client-owned state and preferences.
- SecureStore: refresh/access tokens and provider API keys.
- AsyncStorage: non-sensitive preferences.
- SQLite: relational offline data and sync metadata.

Do not mirror the same server data across React Query and Zustand. When screens
read from SQLite, use query hooks around repository functions so mutations can
invalidate stable keys.

## API and auth

Configure one axios instance in `src/core/api/client.ts`. It already uses the API
URL exposed by `app.config.ts` and sends `X-Client-Type: mobile`.

A complete auth feature normally contains:

```text
core/auth/auth-store.ts
core/services/auth.service.ts
hooks/auth/useAuth.ts
hooks/auth/useLogin.ts
hooks/auth/useLogout.ts
```

Store tokens with SecureStore. Coordinate cache clearing, local data handling,
provider logout, and navigation in hooks rather than repeating those steps in
screens.

## NativeWind

The required integration is already configured:

- `babel.config.js` enables the NativeWind JSX import source.
- `metro.config.js` points to `src/global.css`.
- `tailwind.config.js` scans all source files.
- `src/app/_layout.tsx` imports the global CSS once.
- `nativewind-env.d.ts` provides TypeScript declarations.

After changing Metro, Babel, Tailwind, or global CSS, restart with:

```bash
npx expo start --clear
```

## Offline sync

For offline-capable domains, give each domain a local repository and a sync
service. Generate UUIDs on the device, mark local mutations pending, soft-delete
rows, and keep per-domain pull watermarks. Serialize sync runs so concurrent
foreground, reconnect, realtime, and post-mutation triggers cannot race.

Wait for active sync work before logout clears session or local state. Realtime
events should request a normal incremental sync rather than carrying canonical row
data.

## Environments and native builds

`app.config.ts` maps `APP_ENV` to development, staging, and production API URLs.
Replace the placeholder domains and application identifiers first.

Google Sign-In, notifications, speech recognition, and other native packages need
native configuration and usually a development build. Add provider credentials
through environment/build secrets and never hardcode production values.

Useful checks:

```bash
npm run lint
npx tsc --noEmit
npx expo export --platform web --clear --output-dir /tmp/mobile-web-export
npx expo export --platform android --clear --output-dir /tmp/mobile-android-export
```
