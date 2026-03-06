# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **⚠️ 주의사항**: `npm run` 명령은 반드시 사용자가 직접 실행 (Claude 실행 금지)

## Architecture

Next.js 16 App Router admin panel (Korean UI) using React 19 with TypeScript. React Compiler is enabled (`reactCompiler: true` in `next.config.ts`).

### Auth Flow

Auth is JWT-based with httpOnly cookies managed through Next.js API routes (`src/app/api/cookie/`):

- On every route change, `RootLayoutContent` calls `/api/cookie/access` to check auth state
- The server-side API route reads httpOnly cookies and auto-refreshes the access token using the refresh token if near expiry (within 60s)
- Auth state flows down via three React contexts exported from `src/app/RootLayoutProvider.tsx`:
  - `RootLayoutLoadingContext` — whether auth check is still in progress
  - `AccessTokenContext` — `{ accessToken, setAccessToken }`
  - `IsLogin` — boolean login state
- Protected route layouts (`visit/layout.tsx`, `meal/layout.tsx`) consume `IsLogin` and redirect to `/login` if unauthenticated

### Key Patterns

**Validation** (`src/utils/validation.ts`): Form Dtos use `class-validator` decorators. Validation errors are surfaced to the UI via `<span data-type="validation-alert" data-id="fieldName">` elements. Call `validateAction(dto)` before submitting. For nested DTOs use `validateActionChilds(dto, key)` where `key` matches `data-key` on the span. Call `resetValidationError()` to clear all validation error spans.

**Axios wrappers** (`src/utils/axios.ts`): exports `axiosGet/Post/Put/Patch/Delete` — these accept an `AccessType` object `{ accessToken, setAccessToken }` and auto-retry up to 5 times on 401 by refreshing the token. `axiosDelete(access, url, headers?)` — body가 필요한 경우 `headers` 안에 `{ data: body }` 로 전달.

**Axios error handler** (`src/utils/axios-error.ts`): `axiosErrorHandle(error, isReset?)` — call in catch blocks to handle API error responses. Displays `validationError` array from response to matching `<span data-type="validation-alert">` elements, or falls back to `alert(message)`.

**Cookie utilities** (`src/utils/cookie.ts`): (client-side) proxies through Next.js API routes to read/write httpOnly cookies. Never access cookies directly from client components. Exports: `getAccessToken`, `getAccessTokenData`, `checkAuth`, `setAccessToken`, `setRefreshToken`, `deleteToken`, `getSNSAccessToken`, `deleteSNSAccessToken`.

**Query helpers** (`src/utils/util.ts`): `createQueryString(obj)` builds a `?key=val&…` string. Use instead of `URLSearchParams` since `useSearchParams` is unavailable in some script contexts.

**Post (주소검색)** (`src/utils/post.ts`): `searchAddress(zip, addr1)` — 다음 우편번호 팝업을 열어 선택 시 `zip(zonecode)`, `addr1(address)` 콜백을 호출. `searchAddressScriptLoad()` 로 스크립트를 동적 로드.

**Hooks** (`src/hooks/`): `useInput`, `useInputNumber`, `useInputFloat`, `useInputDate`, `useInputTime`, `useCheckboxGroup` — all return `{ value, onChange, setValue, resetValue }` for binding to form elements.

**Shared components** (`src/components/`): `Header`, `Pagination`, `Editor` (react-quill-new), `KakaoMap`, `Loading` (react-spinners), `Timer`, `Scripts` (external script loader), and chart wrappers (`BarChart`, `LineChart`, `DonutChart`) using ApexCharts. 여러 페이지에서 재사용되는 컴포넌트만 이 폴더에 배치.

**Page-specific components** (`src/features/`): 특정 페이지/도메인 전용 컴포넌트. 페이지별로 하위 폴더로 구분 (예: `features/visit/reserve/`, `features/login/`). DTO 파일도 해당 feature 폴더 안에 위치.

**Types** (`src/types/`):
- `access.ts` — `AccessTokenContextType`, `accessTokenDecodeType`
- `pagination.ts` — `PaginationType` (백엔드 페이지네이션 응답 형식)
- `user.ts` — `UserInfoType`, `UserInfoContextType`

Import these instead of redefining locally.

### Path Aliases

| Alias | Resolves to |
|-------|-------------|
| `@/*` | `./src/*` |
| `@components/*` | `./src/components/*` |
| `@utils/*` | `./src/utils/*` |
| `@types/*` | `./src/types/*` |
| `@style/*` | `./src/style/*` |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SERVER_URL` | Next.js server URL (default: `http://localhost:5000`) |
| `NEXT_PUBLIC_API_URL` | Backend API base URL (default: `http://localhost:3000`) |
| `NEXT_PUBLIC_JWT_CODE` | JWT secret for client-side token decode |
| `NEXT_PUBLIC_LOCAL_SERVER_PREFIX` | Base path prefix for Nginx reverse proxy |
| `NEXT_PUBLIC_AUTHORIZATION` | Static authorization header sent to backend |
| `NEXT_PUBLIC_LOADING` | Show/hide loading indicator |
| `SERVER_DOMAIN` | Cookie domain (leave unset for localhost) |
| `NEXT_IMAGE_HOSTNAME` / `NEXT_IMAGE_PORT` | Allowed remote image host for `next/image` |

### TypeScript Config Notes

- `experimentalDecorators` and `emitDecoratorMetadata` are enabled (required for `class-validator`)
- `strictNullChecks` is disabled — avoid relying on null-safety checks
- `strictPropertyInitialization` is disabled
