# Repository Guide

## Applications

- `api-nest/` is the NestJS API. It owns validation, authorization, persistence,
  and the public HTTP contract.
- `mobile/` is the Expo app. Keep routes thin and put reusable logic under
  `src/core` and `src/hooks`.
- `web/` is the Vite React app. Use React Query for server state and Zustand for
  small client-owned state.

## Shared rules

- Never commit `.env` files, secrets, generated native folders, build output, or
  dependencies.
- Keep API field names and error shapes consistent across both clients.
- Add a feature vertically: database model and API module first, then shared
  client types/services, then screens.
- Use the local `AGENTS.md` and structure guide in each application before making
  structural changes.
- Run the affected application's build/type check and lint command before
  committing.
