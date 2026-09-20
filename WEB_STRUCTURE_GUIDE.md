# React Web Structure Guide

The web starter uses Vite, React 19, TypeScript, React Router, TanStack React
Query, Zustand, axios, Tailwind CSS 4, React Compiler, and nginx.

## Layout

```text
web/src/
  App.tsx
  main.tsx
  index.css
  assets/
  components/
  hooks/
  lib/
    api.ts
    axios.ts
    fetcher.ts
  middlewares/
  pages/
    Home.page.tsx
  store/
  types/
```

Pages correspond to routes. Components hold reusable presentation and layouts.
Hooks own reusable React Query orchestration. `lib` contains configured clients,
session helpers, formatting, and other non-React code.

## Composition and routes

`main.tsx` installs application-wide providers. Add providers here rather than in
individual pages:

```text
StrictMode
  QueryClientProvider
    BrowserRouter
      App
```

Declare routes in `App.tsx`. Once authentication exists, protected pages should
render inside one route wrapper and shared app shell. Put route guards in
`src/middlewares`.

## API state

Use `fetcher<T>()` or a domain hook around it. Call sites use API paths such as
`/projects`; `VITE_API_URI` supplies the origin and `/api/v1` prefix.

React Query owns server data. After mutations, invalidate every query whose
result can change. Use stable domain-based keys, for example:

```ts
['projects']
['projects', projectId]
['projects', projectId, 'activity']
```

Use Zustand only for state the browser owns, such as theme or temporary UI state.

## Cookie authentication

The axios client sends credentials and `X-Client-Type: web`. A cookie-based auth
implementation should:

- keep access and refresh tokens in secure httpOnly cookies
- store only the current user/loading state in Zustand
- restore the session from an API endpoint on page load
- share one refresh request across concurrent `401` responses
- retry each protected request at most once
- exclude public auth calls from refresh retries

This keeps tokens unavailable to browser JavaScript and prevents refresh loops.

## Styling and responsive layout

Tailwind CSS 4 is loaded from `src/index.css`. Define shared theme values as CSS
custom properties and keep layout components responsive from the beginning. Test
at narrow phone widths and desktop widths, especially sticky headers, dialogs,
forms, and bottom navigation.

## Production container

The Dockerfile compiles static assets and serves them with nginx. `nginx.conf`
falls back to `index.html`, which is required for client-side routes opened
directly.

Useful checks:

```bash
npm run lint
npm run build
docker build -t full-stack-template-web .
```
