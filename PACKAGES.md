# Package Inventory

The package manifests mirror the current `api-nest`, `mobile`, and `web` setups
from the reference project. This file explains why the less obvious packages are
present. Versions remain pinned in each application's `package.json` and lockfile.

## API (`api-nest`)

| Area | Packages |
| --- | --- |
| Nest runtime | `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `reflect-metadata`, `rxjs` |
| Configuration and validation | `@nestjs/config`, `class-transformer`, `class-validator` |
| Database | `prisma`, `@prisma/client`, `@prisma/adapter-pg` |
| Auth and security | `@nestjs/jwt`, `@nestjs/throttler`, `bcrypt`, `jose`, `cookie-parser`, `google-auth-library` |
| Realtime | `@nestjs/websockets`, `@nestjs/platform-ws`, `ws` |
| External services | `@anthropic-ai/sdk`, `@google/generative-ai`, `openai`, `resend` |
| Tooling and tests | Nest CLI/schematics/testing, Jest, Supertest, ESLint, Prettier, TypeScript, `ts-jest`, `ts-node`, and their type packages |

AI, mail, OAuth, and WebSocket packages are installed so a new project can adopt
the reference integrations without rebuilding its dependency baseline. Remove a
group if the resulting application will not use it.

## Mobile (`mobile`)

| Area | Packages |
| --- | --- |
| Runtime/navigation | Expo, React Native, Expo Router, React Navigation tabs, screens, safe area, gesture handler, Reanimated, Worklets, keyboard controller |
| Styling/UI | NativeWind, Tailwind CSS 3, Expo UI, vector icons, blur, glass effect, gradients, images, SVG, masked view, Geist and Inter fonts |
| Data/forms/state | TanStack React Query, Zustand, axios, React Hook Form, Hook Form resolvers, Zod |
| Local/offline | Expo SQLite, SecureStore, AsyncStorage, NetInfo, Crypto, File System |
| Device features | notifications, localization, device info, haptics, linking, sharing, web browser, symbols, system UI, speech recognition, date/time picker, Google Sign-In |
| Tooling/tests | Expo Babel preset, Expo ESLint config, Jest Expo, TypeScript, Prettier, Tailwind formatter, `cross-env` |

Several packages require a development build and will not work in Expo Go. Add
their app-plugin configuration only when the corresponding feature is enabled.

## Web (`web`)

| Area | Packages |
| --- | --- |
| Runtime | React 19, React DOM, React Router |
| Data/state | TanStack React Query, axios, Zustand |
| Styling | Tailwind CSS 4 and its Vite plugin |
| Optional UI/data | Leaflet and React Spinners |
| Build/tooling | Vite 8, TypeScript, React Compiler, Rolldown Babel plugin, Oxlint, React/Node/Leaflet types |

Leaflet is retained from the reference setup for map-based projects. It can be
removed when a project has no location features.

## Updating dependencies

Update one application at a time, run its build and lint commands, then regenerate
the root lockfile with `npm install`. For Expo packages, prefer `npx expo install`
so native package versions remain compatible with the active Expo SDK.
