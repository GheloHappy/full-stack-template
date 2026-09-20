# Web

Vite 8 and React 19 starter with React Router, TanStack React Query, Zustand,
axios, Tailwind CSS 4, React Compiler, and an nginx production image.

```bash
npm install
cp .env.example .env
npm run dev
```

The sample page performs no API request, so it starts without the backend. Add
calls through `src/lib/fetcher.ts` and keep server state in React Query.

See [`../WEB_STRUCTURE_GUIDE.md`](../WEB_STRUCTURE_GUIDE.md) and
[`AGENTS.md`](AGENTS.md) before adding features.
