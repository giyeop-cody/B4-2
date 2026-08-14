# B4-2: 버튼 누르면 화면이 스르륵 바뀌는 요즘 웹사이트 만들기

> **배포 URL**: <https://b4-2.vercel.app/#/items>
>
> **GitHub**: <https://github.com/giyeop-cody/B4-2>

React 18, React Router 7, Supabase로 만든 아이템 CRUD SPA다. LocalStorage는 자동 대체가 아니라 인터넷 없는 **로컬 학습 모드**에서만 명시적으로 사용할 수 있다.

## 과제 정보

| 항목 | 내용 |
|---|---|
| 분야 | AI/SW 기초 |
| 구분 | 웹 기초와 프론트엔드 |
| 학습 시간 | 80시간 |
| 핵심 데이터 | 학습 아이템 |
| 백엔드 | Supabase |
| 배포 | Vercel |

## 구현 결과

- 라우트 8개와 Not Found
- 원격 Supabase 기준 목록·상세·등록·수정·삭제
- controlled form, 필수값 검증, 오류, 제출 중 상태
- 공통 로딩·오류·빈 상태 UI
- 페이지 7개, 재사용 컴포넌트 11개, 커스텀 훅 3개
- 전역 사용자 상태(Context)
- `useMemo`, `useCallback`, `React.memo` 성능 학습
- Supabase 이메일 인증과 등록·수정·프로필 보호 라우트
- 공개 목록·상세 조회, 로그인 사용자 등록·수정·삭제
- Vitest/Testing Library 테스트 28개
- Playwright 로컬 브라우저 흐름 2개 + 배포 익명 권한 검사
- 실제 Supabase CRUD 실증 검사 스크립트

## 기술 스택

- React 18.3
- React Router 7.18 (`HashRouter`)
- Supabase JavaScript SDK 2
- Vite 6
- Vitest, React Testing Library, Playwright
- JavaScript와 순수 CSS/inline style

## 실행 방법

### 1. 설치

Node.js 20 이상에서 실행한다.

```bash
npm ci
```

### 2. Supabase 원격 모드

```bash
cp .env.example .env.local
```

`.env.local`의 값을 실제 프로젝트 공개 설정으로 바꾼다.

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
VITE_APP_URL=https://b4-2.vercel.app
VITE_ALLOW_LOCAL_DB=false
```

```bash
npm run dev
```

### 3. LocalStorage 학습 모드

Supabase 없이 UI 흐름만 연습할 때 `.env.local`을 다음 **한 줄만** 작성한다.

```dotenv
VITE_ALLOW_LOCAL_DB=true
```

```bash
npm run dev
```

헤더의 `Supabase 원격`, `LocalStorage 학습`, `데이터 설정 필요` 배지로 현재 저장 위치를 확인할 수 있다. 배포에서는 로컬 학습 모드를 켜면 안 된다.

## 검사 명령

```bash
# 단위/컴포넌트 테스트 28개
npm test

# 로컬 학습 모드 브라우저 테스트 2개
npx playwright install chromium
npx playwright install-deps chromium  # Linux에서 필요한 경우
npm run test:e2e

# 배포 사이트에서 비로그인 조회와 쓰기 UI 차단 검사
npm run test:e2e:production

# 확인된 평가용 로그인 계정이 있을 때만 배포 UI CRUD 검사
PLAYWRIGHT_AUTH_EMAIL='...' PLAYWRIGHT_AUTH_PASSWORD='...' npm run test:e2e:production:write

# 제품 빌드와 의존성 보안
npm run build
npm audit --omit=dev
```

원격 API CRUD는 로그인 세션으로만 검사한다. 검사 행은 끝에 삭제되며 계정 값은 문서나 Git에 저장하지 않는다.

```bash
VERIFY_AUTH_EMAIL='...' VERIFY_AUTH_PASSWORD='...' npm run verify:remote
```

## 라우트

HashRouter를 사용하므로 배포 주소의 경로는 `/#/...` 뒤에 표시된다.

| # | 라우트 | 화면/기능 |
|---:|---|---|
| 1 | `/` | 목록(index) |
| 2 | `/items` | 공개 목록·카테고리 필터, 로그인 사용자만 쓰기 메뉴 |
| 3 | `/items/new` | 로그인 사용자 등록 폼(보호) |
| 4 | `/items/:id` | 공개 상세, 로그인 사용자만 수정·삭제 |
| 5 | `/items/:id/edit` | 로그인 사용자 수정 폼(보호) |
| 6 | `/login` | Supabase 로그인/회원가입, 원래 경로 복귀 |
| 7 | `/profile` | 로그인 사용자 보호 화면 |
| 8 | `*` | 404 Not Found |

`https://b4-2.vercel.app/items`가 아니라 `https://b4-2.vercel.app/#/items`가 정식 목록 주소다. HashRouter는 새로고침 서버 설정이 단순하지만 URL에 `#`이 생기는 단점이 있다.

## 프로젝트 구조

```text
src/
├── pages/                 # URL 단위 화면 7개
│   ├── ItemListPage.jsx
│   ├── ItemDetailPage.jsx
│   ├── ItemNewPage.jsx
│   ├── ItemEditPage.jsx
│   ├── LoginPage.jsx
│   ├── ProfilePage.jsx
│   └── NotFoundPage.jsx
├── components/            # 재사용 UI 11개
│   ├── Layout.jsx
│   ├── StateView.jsx
│   ├── LoadingSpinner.jsx
│   ├── ErrorBanner.jsx
│   ├── EmptyState.jsx
│   ├── ItemCard.jsx
│   ├── ItemForm.jsx
│   ├── ConfirmDialog.jsx
│   ├── DataSourceBadge.jsx
│   ├── CategoryFilter.jsx
│   └── ProtectedRoute.jsx
├── hooks/                 # 화면에서 분리한 React 로직 3개
│   ├── useItems.js
│   ├── useItem.js
│   └── useAuth.js
├── context/
│   └── AuthContext.jsx    # 로그인 사용자 전역 상태
├── lib/                   # 데이터와 외부 서비스
│   ├── api.js
│   ├── dataSource.js
│   ├── localDB.js
│   ├── permissions.js        # 조회·쓰기 권한 판단
│   └── supabaseClient.js
├── test/setup.js
├── App.jsx
└── main.jsx

e2e/                      # Playwright 브라우저 테스트
scripts/                  # 실제 Supabase CRUD 검사
```

### 폴더를 나눈 기준

- `pages`: 하나의 URL에 대응한다.
- `components`: 여러 화면에서 다시 쓰거나 한 가지 UI 책임을 가진다.
- `hooks`: 조회·변경·인증처럼 상태를 다루는 React 로직이다.
- `context`: 멀리 떨어진 컴포넌트도 함께 쓰는 로그인 사용자 상태다.
- `lib`: Supabase, LocalStorage처럼 React 화면과 무관한 데이터 코드다.

## 상태와 데이터 흐름

### props와 state

- **props**: 부모가 자식에게 내려주는 읽기 전용 값이다. `ItemCard`의 `item`, `onDelete`가 예다.
- **state**: 컴포넌트가 기억하고 변경하는 값이다. 폼의 `title`, 목록의 `items`, 삭제창의 `confirmId`가 예다.

| 상태 | 소유 위치 | 이유 |
|---|---|---|
| 목록, 조회 로딩/오류 | `useItems` | 목록 데이터 요청을 한곳에서 관리 |
| 상세, 조회 로딩/오류 | `useItem` | 상세와 수정이 같은 로직 사용 |
| 폼 입력 | `ItemForm` | 폼 안에서만 즉시 필요 |
| 제출/삭제 중 | 각 페이지 | 해당 사용자 행동을 페이지가 조정 |
| 로그인 사용자 | `AuthContext` | 헤더·로그인·프로필·보호 라우트가 공유 |

자식 폼은 입력 결과를 `onSubmit` callback으로 부모에게 올리고, 부모는 저장 결과를 다시 props와 라우팅으로 화면에 반영한다.

### useEffect

`useItems`는 컴포넌트가 처음 나타날 때 `useEffect`로 목록을 요청한다. 의존성 배열의 `fetchItems` 참조가 바뀔 때 다시 실행된다. `fetchItems`는 `useCallback`으로 참조를 고정해 이유 없는 반복 요청을 막는다. `useItem`은 URL의 `id`가 바뀌면 새 상세 데이터를 요청한다.

### 공통 비동기 상태

`StateView`의 판단 순서는 다음과 같다.

1. `loading` → `LoadingSpinner`
2. `error` → `ErrorBanner`
3. 데이터 없음 → `EmptyState`
4. 데이터 있음 → 실제 자식 화면

조회 상태와 CRUD 변경 상태를 분리했다. 수정 중에는 폼을 없애지 않고 버튼에 `저장 중…`을 표시하며, 실패하면 폼 안에 오류가 남는다.

## 상태 변경 → 화면 변경 예시

1. 카테고리 선택 → `category` 변경 → `useMemo` 필터 결과와 카드 목록 변경
2. 폼 입력 → `title/content` 변경 → controlled input 값과 검증 메시지 변경
3. 삭제 확인 → `deleting` 변경 → 대화상자 버튼이 `삭제 중…`으로 바뀌고 잠김
4. 로그인/로그아웃 → Context의 `user` 변경 → 헤더 링크와 보호 라우트 변경
5. 원격 삭제 성공 → `items` 배열에서 제거 → 카드가 화면에서 사라짐

## Supabase 선택과 설정

### 선택 이유

- PostgreSQL 기반이라 표 구조와 SQL을 배울 수 있다.
- JavaScript SDK로 React에서 직접 비동기 요청을 연습할 수 있다.
- Firebase보다 관계형 표 구조가 익숙하다고 판단했다.

### 최소 테이블 예시

```sql
create table public.items (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  category text default '일반',
  created_at timestamptz default now()
);
```

목표 권한은 **누구나 SELECT, 로그인한 `authenticated` 사용자만 INSERT/UPDATE/DELETE**다. `supabase/policies-authenticated-writes.sql`을 Supabase Dashboard의 SQL Editor에서 실행하면 기존 공개 쓰기 정책을 제거하고 목표 정책을 만든다. 실행 전 파일 첫머리의 조회로 현재 정책을 보관한다. 변경은 transaction 안에서 실행되어 중간 오류가 나면 함께 되돌아가며, 마지막 조회 결과 네 행을 확인한다. PostgreSQL 정책은 허용 정책끼리 OR로 결합되므로 기존 공개 쓰기 정책을 남겨두면 로그인 제한이 되지 않는다.

SQL 파일을 Git에 추가한 것과 실제 원격 데이터베이스에 적용한 것은 다르다. 2026-08-14 프로젝트 소유자가 기존 정책을 보관하고 SQL을 실행해 목표 정책 네 개를 확인했다. 이어서 익명 SELECT는 HTTP 200, 익명 INSERT/UPDATE/DELETE는 각각 HTTP 401임을 외부 REST API로 확인했다. 이번 과제는 작성자별 소유권까지 추가하지 않아 로그인 사용자는 모든 아이템을 수정·삭제할 수 있다.

### 연동 중 배운 점

- 환경변수가 없을 때 LocalStorage로 자동 성공시키면 원격 설정 실패를 숨긴다.
- 조회용 `loading/error`와 저장·삭제용 상태를 나눠야 폼이 사라지지 않는다.
- 없는 상세는 `.maybeSingle()`, 반드시 한 행이 필요한 생성은 `.single()`이 알맞다.
- 새 Supabase 공개 키는 예전 JWT뿐 아니라 `sb_publishable_...` 형식도 있다.

## 인증 보너스의 범위

Supabase 이메일 로그인/가입과 전역 사용자 Context를 구현했다. 원격 모드에서 `/items/new`, `/items/:id/edit`, `/profile`은 보호 라우트다. 비로그인 사용자는 목록·상세를 조회할 수 있지만 등록 CTA를 누르면 로그인으로 이동하고 수정·삭제 메뉴는 보이지 않는다. 명시적으로 켠 LocalStorage 학습 모드는 Supabase 계정 없이 CRUD 흐름을 연습할 수 있다. 2026-08-14 공개 Auth 설정 검사에서 이메일 제공자와 회원가입이 활성화됐고, 가입 뒤 이메일 확인이 필요한 상태임을 확인했다.

회원가입 요청은 `VITE_APP_URL`을 `emailRedirectTo`로 전달한다. 값이 없으면 현재 브라우저 Origin을 사용한다. Supabase가 인증 토큰을 URL hash에 붙일 수 있고 앱도 HashRouter를 사용하므로 `/#/login` 경로는 넣지 않고 `https://b4-2.vercel.app` Origin만 사용한다.

2026-08-14 프로젝트 소유자가 Supabase Dashboard의 다음 값을 최종 확인했다.

1. `Authentication → URL Configuration → Site URL`: `https://b4-2.vercel.app`
2. `Redirect URLs`: `https://b4-2.vercel.app/**` 허용
3. localhost 주소는 로컬 인증 메일을 시험할 때만 별도 사용

실제 새 인증 이메일도 수신해 링크가 localhost가 아니라 `https://b4-2.vercel.app` Production으로 복귀하는 것을 확인했다.

코드의 `emailRedirectTo`가 허용 목록에 없으면 Supabase가 Dashboard의 Site URL로 돌아갈 수 있다. 프론트엔드 UI·보호 라우트·API 세션 검사는 실수와 정상 화면 접근을 막는 여러 겹의 방어다. 개발자 도구나 직접 HTTP 요청까지 막는 최종 데이터 권한은 위 RLS를 실제 원격 DB에 적용해 확인했다.

## 성능 보너스의 범위

- `useMemo`: 필터 결과와 카테고리 개수
- `React.memo`: 같은 props의 `ItemCard`
- `useCallback`: 카드에 전달하는 삭제 함수 참조

작은 목록에서는 메모 확인 비용이 더 클 수 있다. 실제 서비스에서는 React Profiler로 측정한 뒤 적용해야 한다.

## 배포

Vercel 프로젝트에 다음 환경변수를 등록한다.

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL=https://b4-2.vercel.app`
- `VITE_ALLOW_LOCAL_DB=false`

배포 순서는 다음과 같다.

1. `supabase/policies-authenticated-writes.sql`의 위험 범위와 기존 정책 이름을 확인한 뒤 Dashboard SQL Editor에서 실행한다.
2. 정책 조회 SQL 결과와 익명 SELECT 성공·익명 mutation 거절을 확인한다.
3. main 브랜치를 Vercel에 배포한다.
4. `/#/items`에서 익명 목록·상세, 등록 CTA의 로그인 이동, 수정·삭제 비노출을 검사한다.
5. 확인된 평가용 계정이 있을 때 로그인 등록·수정·삭제와 프로필·로그아웃을 검사한다.

2026-08-14 위 다섯 단계를 완료했다. 배포 익명 E2E 1/1, 익명 REST 권한 4개 요청, 실제 계정의 등록·수정·삭제·프로필·로그아웃 수동 검사가 통과했다. 이슈 #20의 Dashboard 인증 URL과 새 인증 이메일의 실제 Production 복귀 링크도 최종 확인했다.

## 보안

- `.env`, `.env.*`는 Git에서 제외하고 `.env.example`만 허용한다.
- 토큰, 세션 ID, 실제 Supabase 설정값을 코드·문서·커밋에 넣지 않는다.
- `npm audit --omit=dev` 결과: 취약점 0개(2026-08-14 검사).
- 공개된 GitHub 토큰과 웹 세션은 즉시 폐기·재발급해야 한다.

## 학습·이슈·평가 기록

- [LEARNING.md](LEARNING.md): 기초 학습과 과거 진행 기록
- [실증 검사](docs/audit/2026-08-14-requirements-audit.md)
- [이슈 목록](docs/issues/README.md)
- [멘토·학습 동료 페르소나 검토](docs/mentoring/2026-08-14-first-review.md)
- `eval/`: 사전평가와 동료평가 준비/결과
