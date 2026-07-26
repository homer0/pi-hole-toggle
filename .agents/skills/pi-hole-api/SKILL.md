---
name: pi-hole-api
description: Use when changing Pi-hole API authentication, status retrieval, or DNS blocking behavior in this project.
---

# Pi-hole API Workflow

## Before editing

1. Read `src/config.ts` and `src/client.ts`.
2. Confirm whether the change affects live Pi-hole blocking behavior; ask before changing endpoint semantics, credentials handling, or the `timer: null` behavior.
3. Do not log `PIHOLE_API_APP_PWD`, session IDs, or values from `.env`.

## Implementation rules

- Build Pi-hole URLs through `getApiUrl()` so `PIHOLE_API_URL` normalization remains centralized.
- Preserve the in-memory FTL session flow: authenticate on demand and retry an authenticated request once after `401`.
- Check non-successful HTTP responses with `throwForErrorResponse()` before consuming their bodies.
- Keep local ESM imports using `.js` specifiers.

## Validation

1. Run `bun run types:check`.
2. Run `bun run lint:all` for source changes.
3. Do not exercise enable/disable endpoints against a real Pi-hole unless the user explicitly requests it and provides a safe environment.
