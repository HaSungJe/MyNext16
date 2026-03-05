# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (runs on port 5000 with Turbopack)
npm run dev

# Build
npm run build

# Lint
npm run lint
```

No test framework is configured.

## Path Aliases

Defined in `tsconfig.json`:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@utils/*` → `src/utils/*`
- `@types/*` → `src/types/*`
- `@style/*` → `src/style/*`

## Architecture Overview

This is a Next.js 16 (App Router) project with React 19. The app is in Korean and communicates with a separate NestJS backend (`NEXT_PUBLIC_API_URL`).

### Auth Flow

Authentication uses **httpOnly cookies** managed via Next.js Route Handlers (not middleware):

1. **`/api/cookie/access`** — GET: returns/refreshes accessToken; POST: stores accessToken
2. **`/api/cookie/refresh`** — stores refreshToken
3. **`/api/cookie/logout`** — deletes both tokens
4. **`/api/cookie/sns`** — SNS login token management

The client never reads cookies directly. `src/utils/cookie.ts` provides `getAccessToken()`, `setAccessToken()`, `setRefreshToken()`, `deleteToken()` etc., which call these route handlers via axios.

### Global State (Context)

`RootLayoutContent` (client component) runs on every route change, calls `getAccessToken()`, and provides three contexts via `RootLayoutProvider`:
- `RootLayoutLoadingContext` — boolean, true while auth check is in progress
- `AccessTokenContext` — `{ accessToken, setAccessToken }`
- `IsLogin` — boolean

### Protected Routes

Layouts that require auth (e.g. `src/app/dashboard/layout.tsx`, `src/app/board/layout.tsx`) consume `RootLayoutLoadingContext` and `IsLogin` from context. While loading they show `<Loading />`, and redirect to `/login` if not authenticated.

### API Calls

`src/utils/axios.ts` exports `axiosGet`, `axiosPost`, `axiosPut`, `axiosPatch`, `axiosDelete`. All accept an `AccessType` object `{ accessToken, setAccessToken }` and automatically retry up to 5 times on 401 by refreshing the token via `getAccessToken()`.

All API requests include two custom headers: `authorization` (`NEXT_PUBLIC_AUTHORIZATION`) and `accessToken`.

### Validation

Form validation uses `class-validator` DTOs (see `src/app/login/dto.ts`). `validateAction(dto)` in `src/utils/util.ts` validates and renders errors into `<span data-type="validation-alert" data-id="{fieldName}">` elements in the DOM. `axiosErrorHandle(router, error)` handles API errors: 400 maps validation errors to spans, 401 redirects to `/login`, 403 redirects to `/`.

### Environment Variables

Key variables (see `.env`):
- `NEXT_PUBLIC_SERVER_URL` — this Next.js app's own URL (used for internal API route calls)
- `NEXT_PUBLIC_API_URL` — backend NestJS API base URL
- `NEXT_PUBLIC_JWT_CODE` — JWT decode secret
- `NEXT_PUBLIC_AUTHORIZATION` — static authorization header value for backend
- `SERVER_DOMAIN` — cookie domain (optional; affects sameSite/domain settings)
