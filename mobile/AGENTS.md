# Mobile Guide

- Keep route files under `src/app` and move reusable logic into `src/core` or
  `src/hooks`.
- Use React Query for remote state, Zustand for small client-owned state,
  SecureStore for secrets, AsyncStorage for preferences, and SQLite for
  structured offline data.
- Keep one configured API client in `src/core/api/client.ts`.
- Import through `@/` instead of long relative paths.
- Keep the NativeWind scan rooted at `src` and import `global.css` only from the
  root Expo layout.
- Generated `ios/` and `android/` directories stay untracked unless a project
  intentionally adopts bare native ownership.

Commands: `npm start`, `npm run android`, `npm run ios`, `npm run web`,
`npm run lint`, and `npm test`.
