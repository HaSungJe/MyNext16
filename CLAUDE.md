# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **⚠️ 주의사항**: `npm run` 명령은 반드시 사용자가 직접 실행 (Claude 실행 금지)

## Architecture

Next.js 16 App Router admin panel (Korean UI) using React 19 with TypeScript. React Compiler is enabled (`reactCompiler: true` in `next.config.ts`). `trailingSlash: true` — 모든 URL은 `/`로 끝남 (링크 작성 시 주의). 개발 서버는 Turbopack 사용 (`npm run dev` → port 5000).

### Auth Flow

Auth is JWT-based with httpOnly cookies managed through Next.js API routes (`src/app/api/cookie/`):

- On every route change, `RootLayoutContent` calls `/api/cookie/access` to check auth state
- The server-side API route reads httpOnly cookies and auto-refreshes the access token using the refresh token if near expiry (within 60s)
- Auth state flows down via four React contexts exported from `src/app/RootLayoutProvider.tsx`:
  - `RootLayoutLoadingContext` — whether auth check is still in progress
  - `AccessTokenContext` — `{ accessToken, setAccessToken }`
  - `IsLogin` — boolean login state
  - `UserInfoContext` — `{ userInfo: UserInfoType, getUserInfo: () => void }` — `RootLayoutContent`에서 관리하는 전역 유저 정보 상태를 Context로 공유. `getUserInfo()`를 호출하면 서버에서 최신 유저 정보를 다시 불러옴
- Protected route layouts (`visit/layout.tsx`, `meal/layout.tsx`) consume `IsLogin` and redirect to `/login` if unauthenticated

### Key Patterns

**Validation** (`src/utils/validation.ts`): Form Dtos use `class-validator` decorators. Validation errors are surfaced to the UI via `<span data-type="validation-alert" data-id="fieldName">` elements. Call `validateAction(dto)` before submitting. For nested DTOs use `validateActionChilds(dto, key)` where `key` matches `data-key` on the span. Call `resetValidationError()` to clear all validation error spans.

**Axios wrappers** (`src/utils/axios.ts`): exports `axiosGet/Post/Put/Patch/Delete` — these accept an `AccessType` object `{ accessToken, setAccessToken }` and auto-retry up to 5 times on 401 by refreshing the token. `axiosDelete(access, url, headers?)` — body가 필요한 경우 `headers` 안에 `{ data: body }` 로 전달. `axiosExcelDownload(access, fileName, url)` — Excel 파일 다운로드 전용 함수. `responseType: 'blob'` 로 요청 후 자동으로 링크 클릭 다운로드 처리.

**Axios error handler** (`src/utils/axios-error.ts`): `axiosErrorHandle(error, isReset?)` — call in catch blocks to handle API error responses. Displays `validationError` array from response to matching `<span data-type="validation-alert">` elements, or falls back to `alert(message)`.

**Cookie utilities** (`src/utils/cookie.ts`): (client-side) proxies through Next.js API routes to read/write httpOnly cookies. Never access cookies directly from client components. Exports: `getAccessToken`, `getAccessTokenData`, `checkAuth`, `setAccessToken`, `setRefreshToken`, `deleteToken`, `getSNSAccessToken`, `deleteSNSAccessToken`.

**Query helpers** (`src/utils/util.ts`): `createQueryString(obj)` builds a `?key=val&…` string. Use instead of `URLSearchParams` since `useSearchParams` is unavailable in some script contexts.

**Post (주소검색)** (`src/utils/post.ts`): `searchAddress(zip, addr1)` — 다음 우편번호 팝업을 열어 선택 시 `zip(zonecode)`, `addr1(address)` 콜백을 호출. `searchAddressScriptLoad()` 로 스크립트를 동적 로드.

**Hooks** (`src/hooks/`): 모두 `{ value, onChange, setValue, resetValue }` 반환.
- `useInput(initValue?)` — 문자열 입력
- `useInputNumber(isNumberString, initValue?)` — 정수 입력. `isNumberString=true`면 string 타입으로 저장
- `useInputFloat(isNumberString, initValue?)` — 실수 입력 (소수점 허용)
- `useInputDate(dot, initValue?)` — 날짜 입력. `dot`은 구분자 (예: `'.'`, `'-'`), YYYYMMDD 자동 포맷
- `useInputTime(level, initValue?)` — 시간 입력. `level: 'HOUR' | 'MINUTE' | 'SECOND'` (입력 자리수 제어)
- `useCheckboxGroup(list, key)` — 체크박스 그룹. `{ isAllSelected, selected, toggle, toggleAll }` 반환

**Shared components** (`src/components/`): `Header`, `Pagination`, `Sort` (ASC/DESC 토글, `{ sort, setSort }` props), `Editor` (react-quill-new), `KakaoMap`, `Loading` (react-spinners), `Timer`, `Scripts` (external script loader), `popup/ConfirmPopup` (확인/취소 팝업, `{ title, content, confirm, cancel }` props), and chart wrappers (`BarChart`, `LineChart`, `DonutChart`) using ApexCharts. 여러 페이지에서 재사용되는 컴포넌트만 이 폴더에 배치.

**Page-specific components** (`src/features/`): 특정 페이지/도메인 전용 컴포넌트. 페이지별로 하위 폴더로 구분 (예: `features/visit/reserve/`, `features/login/`). DTO 파일도 해당 feature 폴더 안에 위치.

**목록 페이지 패턴** (`src/features/**/list/`): 검색+정렬+페이지네이션이 있는 목록 페이지의 표준 구현 패턴. `queryString` state를 중간 매개로 사용해 검색 트리거를 통일한다.

```
// 1. 초기값은 URL searchParams에서 읽어 뒤로가기 시 상태 복원
const searchParams = useSearchParams();
const [page, setPage] = useState<string>(searchParams.get('page') ?? '1');
const searchType = useInput(searchParams.get('search_type') ?? 'ALL');

// 2. queryString state — 모든 검색 조건을 하나로 통합
const [queryString, setQueryString] = useState<string>(createQueryString({ page, ... }));

// 3. useEffect 체인
useEffect(() => { search(); }, []);                        // ① 페이지 시작 시 초기 조회
useEffect(() => { setQueryString(createQueryString({...})); }, [page]);        // ② 페이지 변경 → queryString 갱신
useEffect(() => { setQueryString(createQueryString({...})); }, [sort1, sort2]); // ③ 정렬 변경 → queryString 갱신 (정렬 있을 때만)
useEffect(() => { search(); }, [queryString]);              // ④ queryString 변경 → 실제 API 호출

// 4. 검색 버튼 클릭 — page를 1로 초기화하여 queryString 갱신 → ④가 search() 트리거
function action() {
    setQueryString(createQueryString({ page: 1, ...searchConditions }));
}

// 5. 페이지네이션 — movePage에 setPage 직접 전달
<Pagination pagination={pagination} movePage={setPage} />
```

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
| `NEXT_PUBLIC_SERVER_NAME` | 브라우저 탭 타이틀 및 OG 메타 제목 |
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
