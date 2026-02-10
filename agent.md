# .windsurfrules

# 전역 에이전트
## 0) 목적
이 문서는 이 레포의 **구조/코드 스타일/라우팅/인증(쿠키)/API 호출 규칙**에 맞춰, AI가 새 기능을 만들 때 “기존 코드처럼” 생성하도록 하기 위한 가이드입니다.

## 1) 중요한 전제 (빈 프로젝트에서도 재현 가능해야 함)
`src/app` 아래에 특정 도메인이 아직 없더라도, 아래 규칙만 보고 **디렉토리/파일 뼈대 + 최소 동작 코드**를 생성할 수 있어야 합니다.

- **[원칙]** 기능을 추가할 때는 항상 아래 2가지를 함께 생성합니다.
  - **[라우트 폴더]** `src/app/<route>/...` (App Router 기준)
  - **[컴포넌트 폴더]** `src/components/<route>/...` (UI 재사용 단위)

- **[원칙]** 공통 타입/유틸/훅은 반드시 분리합니다.
  - **[타입]** `src/types/*`
  - **[유틸]** `src/utils/*`
  - **[훅]** `src/hooks/*`

## 2) 이 프로젝트의 큰 구조 (요약)
이 레포는 Next.js **App Router** 기반입니다.

- **라우팅(페이지)**
  - `src/app/**/page.tsx`, `src/app/**/layout.tsx`
  - 전역 레이아웃: `src/app/layout.tsx` + `src/app/RootLayoutContent.tsx` + `src/app/RootLayoutProvider.tsx`
- **컴포넌트(페이지 UI)**
  - `src/components/**` 아래에 라우트 구조와 동일하게 배치
- **API Route (서버에서 쿠키/인증 처리)**
  - `src/app/api/**/route.ts`
  - 쿠키 저장/조회: `src/app/api/cookie/*/route.ts`
  - NextAuth: `src/app/api/auth/[...nextauth]/route.ts`
- **API 호출(클라이언트)**
  - `src/utils/axios.ts`를 통해 호출 (헤더에 `authorization` + `accessToken` 자동 추가)
  - 토큰은 브라우저가 직접 읽지 않고, `/api/cookie/*` API route를 통해 읽고/갱신

## 3) 디렉토리 구조 규칙

### 3.1 `src/app/*` (라우팅 / 페이지)
- `src/app`은 **라우트(주소) 구조가 곧 디렉토리 구조**입니다.
- 라우트별로 최소 생성 구조는 아래를 따릅니다.
  - `src/app/<route>/page.tsx`
  - (필요 시) `src/app/<route>/layout.tsx`
  - (필요 시) `src/app/<route>/loading.tsx`, `error.tsx`, `not-found.tsx`

### 3.2 `src/components/*` (UI 컴포넌트)
- 컴포넌트는 반드시 `src/components` 아래에 작성합니다.
- **라우트 매핑 규칙(필수)**
  - App Router 경로와 동일한 폴더 구조로 컴포넌트를 배치합니다.
  - 예: `src/app/fortune/luck/day/page.tsx` -> `src/components/fortune/luck/day/LuckDay.tsx`
- **쪼개기 규칙(권장)**
  - `page.tsx`에서는 “페이지 조립” 역할만 하도록 하고, 화면의 독립 단위는 컴포넌트로 분리합니다.
  - 예: `FortuneLuckDayIntro.tsx`, `FortuneLuckDayResult.tsx`, `FortuneLuckDayCalendar.tsx`
- **공유 컴포넌트 승격 규칙**
  - 동일 라우트 하위 여러 페이지에서 재사용되면 상위 폴더로 이동합니다.
  - 예: `/src/components/fortune/` 하위로 이동 (여러 `fortune/*` 페이지에서 공통 사용)

### 3.3 `src/utils/*` (프로젝트 공통 유틸)
- 유틸은 기능 단위로 파일 분리합니다. 하나의 `util.ts`로 무한 확장하지 않습니다.
- 이 레포의 핵심 유틸
  - `src/utils/axios.ts`: API 호출 래퍼 (토큰 헤더 자동 추가)
  - `src/utils/cookie.ts`: `/api/cookie/*` 호출 래퍼 (클라이언트에서 토큰 저장/조회)
  - `src/utils/util.ts`: 검증/에러 처리/기타 유틸 (`validateAction`, `axiosErrorHandle` 등)

### 3.4 `src/types/*` (도메인 타입)
- API 응답/도메인 모델은 `src/types`에 정의합니다.
- 파일은 도메인 단위로 분리합니다.
  - 예: `user.ts`, `community.ts`, `subscribe.ts` 등

### 3.5 `src/hooks/*` (폼 입력 훅)
- 폼 입력/마스킹/체크박스 그룹 등 UI 로직은 `src/hooks`에 둡니다.

### 3.6 `src/style/*` (스타일)
- 전역 스타일은 `src/app/layout.tsx`에서 import 하며, 각 페이지에서 임의로 전역 CSS를 늘리지 않습니다.

## 4) Import(alias) 규칙
이 레포는 `tsconfig.json`에 alias가 설정되어 있습니다.

- `@/*` -> `src/*`
- `@components/*` -> `src/components/*`
- `@utils/*` -> `src/utils/*`
- `@types/*` -> `src/types/*`
- `@style/*` -> `src/style/*`

프로젝트 내부 import는 상대경로보다 alias 사용을 선호합니다.

## 5) 코딩 스타일 규칙

- **[필수]** 타입은 반드시 지정합니다.
- **[필수]** 들여쓰기는 4칸을 사용합니다.
- **[필수]** 간결한 주석을 작성합니다. (예: 회원 검색/회원 등록/아이디 중복여부 확인)
- **[필수]** 변수/함수 주석 기준
  - **함수**: 목적/입력/출력을 짧게 설명합니다.
    - 특히 파싱/검증/교환 단위(비즈니스 룰) 같은 “의미가 있는 로직”은 반드시 주석을 답니다.
  - **상수/상태값**: 화면/비즈니스 룰에 영향을 주는 값은 “무엇을 의미하는지”를 주석으로 남깁니다.
    - 예: `luckyUnit = 10` (행운코인 10개 -> 럭키 1개)
  - **복잡한 계산/조건문**: 왜 필요한지(의도)를 한 줄로 설명합니다.
  - **주석 스타일(중요)**
    - 함수 주석은 `//`로만 작성합니다. (`/** ... */`, `/* ... */` 사용하지 않음)
    - 변수 주석은 기본적으로 우측에 작성합니다.
      - 예: `const [text, setText] = useState<string>(''); // 내용`
    - 단, 훅 관련 변수(`useState`, `useReducer`, `useRef` 등)는 기본적으로 **주석을 위에 작성**합니다.
      - 비슷한 훅 변수는 기존 규칙대로 “그룹 주석”으로 묶습니다.
    - 비슷한 변수는 “그룹 주석”을 한 번만 위에 쓰고, 개별 주석은 생략합니다.
      - 예:
        - `// 럭키, 홍실 교환 단위.`
        - `const luckyUnit: number = 10;`
        - `const redThreadUnit: number = 200;`
      - 예(파생값도 동일):
        - `// 교환 입력값(숫자).`
        - `const luckyCoinAmount: number = parseCoinAmount(luckyCoinAmountText);`
        - `const redThreadCoinAmount: number = parseCoinAmount(redThreadCoinAmountText);`
    - 변수명이 너무 길어 우측 주석 때문에 가로 스크롤이 생기면, 주석은 위에 작성합니다.

- **[필수]** 컴포넌트 내부 선언 우선순위
  - 1) 변수/상태/파생값
  - 2) `useEffect`
  - 3) 함수(이벤트 핸들러/헬퍼)

- **[권장]** 커스텀 훅 우선 사용
  - 입력/마스킹/숫자 처리 등 이미 `src/hooks/*`에 커스텀 훅이 있으면, 직접 `useState`로 새로 구현하기보다 **훅을 우선 사용**합니다.
  - 예:
    ```tsx
    import useInputNumber, { UseInputNumberType } from '@/hooks/useInputNumber';

    // 럭키, 홍실 교환 입력값
    const lucky: UseInputNumberType = useInputNumber(false, 0);
    const coin: UseInputNumberType = useInputNumber(false, 0);
    ```

- **[권장]** 비슷한 입력값/상태 주석은 합칩니다.
  - 예: `// 럭키, 홍실 교환 입력값`
  - 개별 주석은 과도하게 늘리지 않습니다.

- **[권장]** 표시용 파생 변수 선언 지양
  - 단순 표시를 위한 값(예: `amount`, `result` 등)을 변수로 과도하게 분리하지 않습니다.
  - 재사용이 많지 않으면 JSX에서 직접 계산하거나, 필요한 최소한의 변수만 둡니다.
  - 예(표시용 값은 JSX에서 직접 계산):
    ```tsx
    <p>
        <span>{(Number(value) * unit).toLocaleString()}</span>개의 행운 코인이
        <span>{Number(value).toLocaleString()}</span>개의 럭키로 교환 됩니다.
    </p>
    ```

- **[권장]** JSX 줄바꿈 스타일
  - `input`, `button` 등은 레포 기존 컴포넌트의 줄바꿈/들여쓰기 스타일을 따라 작성합니다.
  - 예:
    ```tsx
    <input
        type="text"
        id="lucky-coin-amount"
        placeholder="행운코인 개수"
        value={lucky.value}
        onChange={lucky.onChange}
        autoComplete="off"
    />

    <button
        type="button"
        className="btn-set charge-btn btn-primary"
        onClick={() => exchange('LUCKY')}
    >교환
    </button>
    ```

- **[권장]** API 연결이 필요한 함수는 기본 구현을 비워둡니다.
  - UI/레이아웃이 우선일 때, 실제 API 호출은 상위에서 주입하거나(예: `onExchange...`) 추후 연결할 수 있도록 함수 본문을 비워둡니다.
  - 예:
    ```ts
    // 럭키/홍실 교환 실행
    async function exchange(type: 'LUCKY' | 'COIN'): Promise<void> {
        // API를 실제로 연결해야하는 부분은 비어둡니다.
    }
    ```

- **[필수]** 반환 JSX 내 팝업/모달 삽입 규칙
  - 팝업/모달 컴포넌트가 `return` 내부에 삽입될 경우, **상단에 배치**합니다.
  - 삽입된 팝업/모달은 반드시 주석을 답니다.
    - 사용처 주석은 **간결하게** 작성합니다.
      - 예: `{/* 행운 코인 교환소 팝업 */}`
    - 내부 동작(열림/닫힘/검증/비즈니스 룰 등) 설명은 **해당 팝업/모달 컴포넌트 내부**에 작성합니다.

- **[필수]** 영향 범위 최소화(멋대로 삽입 금지)
  - “컴포넌트를 만들어줘” 요청을 받으면 **기본은 컴포넌트 파일만 생성/수정**합니다.
  - 요청받은 컴포넌트를 수정하되, 타 컴포넌트에 임의로 import/렌더링을 하지 않고 추가여부를 묻고 진행합니다.
  - 연결(어느 페이지에 넣을지)이 필요하면, 먼저 사용자에게 **삽입 위치/트리거/노출 조건**을 확인한 뒤 진행합니다.

## 5.1) Next.js 16 기준 간결화 규칙
- **[권장]** 단순 파생값(문자열 -> 숫자 변환, 단순 계산/포맷)은 `useMemo` 없이 **그냥 변수로 계산**합니다.
  - `useMemo`는 연산 비용이 크거나 렌더링마다 계산하면 문제가 되는 경우에만 사용합니다.
  - 예: `const amount: number = parseAmount(text);`
- **[주의]** Server/Client 구분을 명확히 합니다.
  - 브라우저 API를 쓰거나 상태/이펙트를 쓰면 파일 상단에 `'use client';`
  - Next.js Route Handler는 서버 환경이며 `src/app/api/**/route.ts`에 구현합니다.

## 6) API 호출 규칙 (중요)

### 6.1 API 호출은 `src/utils/axios.ts`를 사용
직접 `axios.get/post/...`를 호출하지 말고 아래 함수를 사용합니다.

- `axiosGet(access, url, headers?)`
- `axiosPost(access, url, body, headers?)`
- `axiosPut(access, url, body, headers?)`
- `axiosPatch(access, url, body, headers?)`
- `axiosDelete(access, url, body, headers?)`

이 레이어에서 아래를 보장합니다.
- `accessToken` 헤더 포함 (`access.accessToken`)
- **401 처리**
  - `access.reload === false`이면 `getAccessToken()`으로 accessToken 재조회/재발급 시도
  - accessToken을 받으면 `access.setAccessToken(accessToken)` 호출 후 `access.reload = true`로 바꾸고 **1회 재시도**
  - 재시도 이후에도 401이거나 accessToken을 못 받으면 `access.setAccessToken(null)` 후 토큰 삭제(`deleteToken()`)

호출자는 아래를 지켜야 합니다.
- `authorization` 헤더는 **자동 포함되지 않음**
  - 백엔드가 `authorization`을 요구하면, 호출부에서 `headers`로 직접 전달합니다.
    - 예: `{ authorization: process.env.NEXT_PUBLIC_AUTHORIZATION }`
- `access` 객체는 최소한 아래 형태로 전달합니다.
  - `accessToken`: string
  - `setAccessToken(accessToken: string): void`
  - `reload`: boolean (초기값은 `false`로 두고, 재시도는 1회만 허용)

### 6.2 인증/토큰은 “브라우저 직접 접근 금지” 패턴
토큰은 httpOnly 쿠키에 저장되며, 클라이언트는 쿠키 값을 직접 읽지 않습니다.

- **클라이언트**: `src/utils/cookie.ts`가 `/api/cookie/*`를 호출
- **서버(Route Handler)**: `src/app/api/cookie/*/route.ts`가 `cookies()`로 httpOnly 쿠키를 읽고/설정

### 6.3 토큰 재발급 흐름(Access 자동 갱신)
`GET /api/cookie/access`는 아래 흐름을 가집니다.

- accessToken 쿠키가 있으면 반환
- accessToken이 없으면 refreshToken으로 백엔드 `.../api/v1/common/user/refresh` 호출
- 응답받은 토큰을 쿠키에 재설정 후 accessToken 반환

## 7) API Route(서버) 작성 규칙

### 7.1 위치
- Route Handler는 반드시 `src/app/api/<path>/route.ts`로 작성합니다.

### 7.2 쿠키 설정 규칙(레포 구현 기준)
- `cookies().set()` 사용
- 옵션
  - `httpOnly: true`
  - `sameSite`: `process.env.SERVER_DOMAIN` 존재 여부에 따라 `lax/strict`
  - `secure`: 개발환경 제외 + `x-forwarded-proto` 기반으로 판단
  - `domain`: `process.env.SERVER_DOMAIN ?? undefined`

## 8) 폼 검증/에러 처리 규칙

### 8.1 폼 검증은 `class-validator` 기반
- DTO(클래스)를 만들고, `validateAction(dto)`로 검증합니다.
- 검증 에러는 DOM의 `span[data-type=validation-alert][data-id=<field>]`에 표시하는 패턴을 사용합니다.

### 8.2 axios 에러 처리
- API 호출 실패 처리는 `axiosErrorHandle(router, error)`를 사용합니다.
- 주요 처리 규칙
  - `400`: validationError가 있으면 필드 span에 표시, 없으면 `message` alert
  - `401`: 토큰 삭제 후 `/sign/in` 이동
  - `403`: 메시지 alert 후 `/` 이동

## 9) 환경변수/Next 설정 규칙

### 9.1 환경변수(주요 키)
- `NEXT_PUBLIC_API_URL`: 백엔드 API Base URL
- `NEXT_PUBLIC_AUTHORIZATION`: 백엔드가 요구하는 고정 authorization 값(헤더)
- `NEXT_PUBLIC_JWT_CODE`: JWT 서명/검증에 사용하는 시크릿(서버 route에서 사용)
- `NEXT_PUBLIC_SERVER_URL`: `metadataBase` 생성에 사용
- `NEXT_PUBLIC_SERVER_NAME`: 사이트 title/description
- `NEXT_PUBLIC_GA4_ID`: Google Analytics
- `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID`: Google AdSense
- `SERVER_DOMAIN`: 쿠키 domain 설정에 사용(있으면 `sameSite: lax`, 없으면 `strict`)

### 9.2 `next.config.ts` (레포 구현 기준)
- `basePath`: `NEXT_PUBLIC_LOCAL_SERVER_PREFIX` 값으로 설정될 수 있음
- `rewrites`: `basePath`가 설정될 경우 `/<prefix>/* -> /*`로 rewrite
- `images.remotePatterns`: 로컬/외부(S3) 이미지 호스트 패턴을 환경변수로 확장

## 10) 전역 레이아웃/상태 패턴

### 10.1 전역 레이아웃 구성
- `src/app/layout.tsx`
  - 전역 CSS import
  - `metadata`, `viewport` 정의
  - `RootLayoutContent`로 children 래핑
- `src/app/RootLayoutContent.tsx`
  - 라우트 변경 시(`pathname`) 로그인 여부 확인 + 공통 데이터 프리패치
  - 공통 API 호출은 `axiosGet/axiosPost`로 수행
  - 실패 처리 `axiosErrorHandle(router, error)` 사용
- `src/app/RootLayoutProvider.tsx`
  - 전역 Context 제공(로그인/프로필/포인트/알림 등)

### 10.2 레이아웃 데이터 로딩 규칙(권장)
- 공통 데이터가 필요한 경우, 페이지 단에서 중복 호출하지 말고 `RootLayoutContent`에 합류시키거나 Context로 공급합니다.
- Context 값 타입은 `src/types/*`에서 정의된 타입을 사용합니다.

## 11) NextAuth(소셜 로그인) 패턴

### 11.1 위치
- `src/app/api/auth/[...nextauth]/route.ts`

### 11.2 동작 요약
- provider: Naver/Kakao/Google/Apple
- `signIn` callback에서 provider별 프로필을 공통 형태로 정리 후 JWT로 서명
- 서명된 토큰을 `sns` httpOnly 쿠키로 저장
- 이후 소셜 로그인 연동 화면은 `/sign/sns`로 라우팅

## 12) 체크리스트
- [ ] 신규 페이지가 `src/app/<route>`에 생성되었는가?
- [ ] 페이지 UI가 `src/components/<route>`로 분리되었는가?
- [ ] API 호출이 `src/utils/axios.ts`를 통해 이뤄지는가?
- [ ] 토큰 처리가 `src/utils/cookie.ts` + `src/app/api/cookie/*` 패턴을 따르는가?
- [ ] 타입이 `src/types`에 정의/재사용되고 있는가?
- [ ] `axiosErrorHandle`/`validateAction` 패턴을 따르는가?
- [ ] 들여쓰기 4칸/타입 명시/간결 주석 규칙을 지켰는가?