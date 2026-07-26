# Project Agent Instructions

## Quick context

- Bun/Elysia web app that displays and changes Pi-hole DNS blocking through the Pi-hole API.
- Server entry point: `src/index.tsx`; UI is server-rendered from `src/ui/` and enhanced with vendored HTMX at `public/vendor/htmx.js`.

## Project-specific gotchas

- The app refuses to start without `PIHOLE_API_APP_PWD` and `PIHOLE_API_URL`; copy `.env.example` for local setup. Never commit `.env` or credentials.
- Pi-hole API requests authenticate with an in-memory FTL session ID and retry once after a `401`; preserve this behavior when modifying API calls.
- API URLs are normalized in `src/config.ts`; build API paths through the existing `getApiUrl()` helper in `src/client.ts`.
- The blocking endpoints intentionally send `{ blocking, timer: null }`; do not introduce a timer unless the requested behavior changes.

## Commands that matter

- `bun run dev` starts the server with watch mode.
- `bun run types:check` runs TypeScript without emitting files.
- `bun run lint:all` lints the entire project. `bun run lint` runs `lint-staged`, so it is intended for staged-file checks.
- `bun run docker:build` builds the production image. It uses `bun install --frozen-lockfile`.
- The pre-push hook runs `bun run types:check && bun run test`; the current `test` script is only a placeholder echo command.

## Conventions that are easy to miss

- TypeScript uses ESM and imports local modules with `.js` specifiers.
- JSX uses Elysia HTML factories configured in `tsconfig.json`, not React runtime components.
- ESLint uses `@homer0/eslint-plugin` with Prettier; `public/vendor/**` is excluded from linting.
- Use two-space indentation and LF line endings as defined in `.editorconfig`.

## Safety rules

- Treat Pi-hole enable/disable behavior as a production-affecting operation: do not alter endpoint semantics or credentials handling without explicit user approval.
- Do not edit vendored `public/vendor/htmx.js` unless explicitly requested.
