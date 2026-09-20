# Web Guide

- Route pages live in `src/pages/` and use `<Name>.page.tsx` names.
- Shared UI and layouts live in `src/components/`.
- Reusable query orchestration lives in `src/hooks/`.
- API, auth-session, configuration, and pure helpers live in `src/lib/`.
- Use the configured `fetcher()` and React Query for API state.
- Use Zustand only for client-owned state such as theme or transient session UI.
- If web auth uses httpOnly cookies, never copy access or refresh tokens into
  local storage or JavaScript state.
- Test both narrow and desktop layouts.

Commands: `npm run dev`, `npm run build`, `npm run lint`, and `npm run preview`.
