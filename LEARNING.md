# B4-2 학습 노트: 버튼 누르면 화면이 스르륵 바뀌는 요즘 웹사이트 만들기

## 2026-08-14 실증 검사 후 현재 상태

이 문서 아래쪽에는 처음 구현하던 당시의 **React Router 6, 6개 라우트, 8개 컴포넌트, 자동 LocalStorage 대체** 기록이 남아 있다. 과거 시행착오를 지우지 않기 위해 그대로 두되, 현재 코드는 다음처럼 바뀌었다.

- React 18 + React Router 7.18 + HashRouter
- 라우트 8개, 페이지 7개, 재사용 컴포넌트 11개, 훅 3개
- Supabase 원격 모드가 기본이며 LocalStorage는 직접 켠 로컬 학습 모드에서만 사용
- 조회 오류와 등록·수정·삭제 오류 상태 분리
- AuthContext 전역 사용자 상태, 로그인/가입, `/profile` 보호 라우트
- 공개 목록·상세 조회, 로그인 사용자 등록·수정·삭제
- `/items/new`, `/items/:id/edit`, `/profile` 보호 라우트
- `useMemo`, `useCallback`, `React.memo` 적용
- 단위/컴포넌트 28개와 로컬 브라우저 2개 통과
- 배포 익명 권한·로그인 쓰기는 main 배포 뒤 별도로 검사 예정
- 자세한 현재 실행법과 구조는 `README.md`, 문제 해결은 `docs/issues/` 참고

보너스는 과제 원문에서는 선택 사항이지만, 이번 사용자 요청에서는 모두 완료 범위로 정했다.

## 2026-08-14 공개 조회 + 로그인 쓰기 학습

### 1. 인증과 권한은 다른 말이다

- **인증(Auth)**: “이 사람이 누구인가?”를 로그인으로 확인한다.
- **권한(Authorization)**: “이 사람이 이 행동을 해도 되는가?”를 정한다.

처음에는 로그인과 프로필만 있어서 인증은 있었지만 아이템 등록·수정·삭제에는 연결되지 않았다. 그래서 비로그인 사용자도 데이터를 바꿀 수 있었다. 이번에는 인증 결과를 쓰기 권한에 연결했다.

### 2. 한 곳만 막으면 부족하다

| 방어 위치 | 하는 일 | 이것만 있을 때 부족한 점 |
|---|---|---|
| 버튼 숨김 | 비로그인 사용자에게 수정·삭제를 보여주지 않음 | 주소 직접 입력 가능 |
| 보호 라우트 | 등록·수정 주소 직접 접근을 로그인으로 보냄 | API 직접 호출 가능 |
| API 세션 검사 | 앱 코드의 Supabase mutation 전에 세션 확인 | 코드를 거치지 않는 HTTP 요청 가능 |
| 데이터베이스 RLS | Supabase가 최종 허용·거절 | Dashboard에서 실제 적용해야 함 |

따라서 UI → 라우트 → API → RLS를 여러 겹으로 둔다. 앞의 세 겹은 코드로 구현했다. 마지막 RLS는 `supabase/policies-authenticated-writes.sql`에 작성했지만, Dashboard에서 실행하기 전에는 원격 적용 완료가 아니다.

### 3. 선택지와 트레이드오프

| 선택지 | 장점 | 단점 | 결정 |
|---|---|---|---|
| Auth 제거 | 필수 CRUD 시연이 단순함 | 이미 만든 보너스가 사라짐 | 제거하지 않음 |
| 모든 CRUD 공개 | 계정 없이 시연 가능 | 누구나 데이터 훼손 가능 | 공개는 조회만 |
| 로그인 사용자 쓰기 | Auth와 CRUD가 연결되고 안전성 향상 | 평가용 계정이 있어야 원격 쓰기 검사 가능 | 선택 |
| 작성자만 수정·삭제 | 실제 서비스에 더 안전 | `user_id`, 기존 데이터 이관, 소유권 RLS가 필요 | 이번 범위에서 제외 |
| LocalStorage도 로그인 필수 | 규칙이 하나라 단순함 | Supabase 없이 배우는 학습 경로가 막힘 | 명시적 학습 모드만 예외 |

이번 결정은 **원격에서는 누구나 읽고 로그인 사용자만 쓴다**이다. 작성자 소유권은 넣지 않아 로그인 사용자는 모든 아이템을 수정·삭제할 수 있다.

### 4. 정책을 추가만 하면 안 되는 이유

PostgreSQL의 여러 허용 정책은 보통 OR처럼 합쳐진다. 예전 `anon` 쓰기 정책을 둔 채 `authenticated` 정책을 하나 더 만들면, 예전 허용이 계속 살아 있을 수 있다. 그래서 SQL은 `items`의 기존 정책을 확인·제거한 뒤 목적이 분명한 SELECT/INSERT/UPDATE/DELETE 정책을 다시 만든다. 이 과정은 다른 정책도 제거할 수 있어 실행 전 검토와 백업이 필요하다.

### 5. 멘토·학습 동료 페르소나 토론

> 아래는 학습을 위한 가상 검토이며 실제 외부 동료 평가는 아니다.

- **학생 질문:** “버튼만 숨기면 비로그인 사용자가 수정하지 못하나요?”
- **학습 멘토 답:** “아니요. 주소나 API를 직접 호출할 수 있으므로 보호 라우트와 RLS가 필요합니다.”
- **학습 동료 의견:** “익명 조회 검사는 계정 없이 자동화하고, 쓰기 검사는 실제 계정이 있을 때만 따로 실행하면 결과를 과장하지 않을 수 있습니다.”
- **결론:** 배포 E2E를 익명 권한 검사와 로그인 CRUD 검사로 분리했다. 자격 증명은 환경변수로만 받고 Git에 저장하지 않는다.

### 6. 외부 적용 결과

1. 기존 RLS 정책을 조회해 보관한 뒤 안전 적용 SQL을 실행했다.
2. 목표 정책 4개가 생성된 것을 확인했다.
3. 익명 SELECT는 HTTP 200, 익명 INSERT/UPDATE/DELETE는 각각 HTTP 401이었다.
4. PR #23과 안전 보완 PR #24를 main에 병합하고 Vercel Production `success`를 확인했다.
5. 익명 화면 E2E 1/1과 실제 계정의 등록·수정·삭제·프로필·로그아웃 수동 검사가 통과했다.

SQL 파일이 있다는 것과 실제 적용은 다르다는 원칙을 지켰고, 실행 결과가 생긴 뒤에만 완료로 바꿨다. 실제 외부 동료 3인의 평가는 여전히 참여자가 직접 작성해야 하며 임의로 만들지 않는다.

---

## 📖 목차

1. [초심자를 위한 용어집](#1-초심자를-위한-용어집)
2. [과제 해석 및 분석](#2-과제-해석-및-분석)
3. [과제를 진행하기 위한 기초](#3-과제를-진행하기-위한-기초)
4. [각 기초를 익히기 위한 간단한 체험 예제](#4-각-기초를-익히기-위한-간단한-체험-예제)
5. [과제를 작게 쪼개기: 잡 → 워크 → 워크플로우](#5-과제를-작게-쪼개기-잡--워크--워크플로우)
6. [워크플로우별 트레이드오프, 이슈, 트러블슈팅](#6-워크플로우별-트레이드오프-이슈-트러블슈팅)
7. [과제 완료 후 학습한 내용 정리](#7-과제-완료-후-학습한-내용-정리)

---

## 1. 초심자를 위한 용어집

> "이 단어들이 전부 외계어처럼 보여도 괜찮습니다. 하나씩, 일상어로 풀어 설명합니다."

### 🌐 웹 사이트의 기본

| 용어 | 쉬운 설명 | 비유 |
|------|-----------|------|
| **HTML** | 웹 페이지의 뼈대. 글자, 그림, 버튼이 어디에 놓일지 정하는 문서 | 건물의 골조 |
| **CSS** | 웹 페이지의 외형. 색깔, 크기, 위치 등을 꾸며주는 규칙 | 건물의 인테리어 |
| **JavaScript (JS)** | 웹 페이지에 움직임을 넣는 프로그램. 버튼 클릭 → 화면 변화 같은 동작 | 건물의 전기/수도 |
| **프론트엔드** | 사용자가 브라우저에서 보는 화면 쪽 | 식당의 홀 (손님이 앉는 곳) |
| **백엔드** | 사용자가 보지 못하는 서버 쪽. 데이터를 저장하고 처리 | 식당의 주방 |

### ⚛️ React 관련

| 용어 | 쉬운 설명 | 비유 |
|------|-----------|------|
| **React** | 페이스북이 만든 웹 화면 만들기 도구. 화면을 작은 조각(컴포넌트)으로 나눠서 조립 | 레고 블록으로 집 짓기 |
| **컴포넌트** | 화면의 작은 조각 하나. 버튼 하나도 컴포넌트, 페이지 전체도 컴포넌트 | 레고 블록 한 개 |
| **JSX** | JavaScript 안에 HTML을 쓸 수 있게 해주는 문법. React 화면을 만들 때 사용 | 한국어와 영어를 섞어 쓰는 문장 |
| **props** | 부모 컴포넌트가 자식 컴포넌트에게 넘겨주는 데이터. 자식은 받기만 하고 수정 불가 | 부모가 아이에게 용돈을 주는 것 (아이는 받기만 함) |
| **state** | 컴포넌트가 스스로 가지고 있는 데이터. 바뀌면 화면이 자동으로 갱신 | 아이의 저금통 (스스로 넣고 뺄 수 있음) |
| **useState** | state를 만드는 React 도구. `const [값, 값을바꾸는함수] = useState(초기값)` | 저금통을 하나 만드는 것 |
| **useEffect** | "화면이 처음 그려졌을 때" 또는 "특정 값이 바뀌었을 때" 무언가를 실행하는 도구 | 식당 문을 열었을 때 자동으로 불이 켜지는 스위치 |
| **커스텀 훅 (Custom Hook)** | 개발자가 직접 만드는 재사용 도구. `use~`로 시작하는 이름을 씀 | 자주 쓰는 요리 레시피를 한 번에 쓸 수 있게 정리해 둔 것 |

### 🛣️ 라우팅 관련

| 용어 | 쉬운 설명 | 비유 |
|------|-----------|------|
| **라우팅** | 주소(URL)에 따라 다른 화면을 보여주는 것 | 건물에서 층별 안내판 (3층 → 식당, 4층 → 사무실) |
| **SPA (Single Page Application)** | 페이지를 새로고침하지 않고 화면만 부드럽게 바꾸는 웹사이트 | 책을 넘기지 않고 같은 페이지에서 내용만 바뀌는 전자책 |
| **React Router** | React에서 라우팅을 해주는 도구 | 건물의 엘리베이터 버튼 |
| **HashRouter** | 주소에 `#`을 붙여 라우팅하는 방식. 정적 호스팅에서 100% 동작 | `example.com/#/items`처럼 # 뒤로 주소를 숨기는 방식 |
| **BrowserRouter** | `#` 없이 깔끔한 주소를 쓰는 방식. 서버 설정이 필요 | `example.com/items`처럼 깔끔하지만 서버 도움이 필요 |
| **Outlet** | 부모 라우트가 자식 라우트를 그릴 위치를 표시하는 표식 | 건물 복도에 "이 자리에 사무실이 들어옵니다"라고 표시한 자리 |

### 💾 데이터 관련

| 용어 | 쉬운 설명 | 비유 |
|------|-----------|------|
| **CRUD** | 데이터의 4가지 기본 행동: Create(만들기), Read(읽기), Update(수정), Delete(삭제) | 가계부의 4가지 행동: 새 항목 쓰기, 읽기, 고치기, 지우기 |
| **API** | 프로그램끼리 대화하는 창구. 데이터를 요청하고 받는 규칙 | 은행 창구 (요청 → 처리 → 결과 전달) |
| **BaaS (Backend as a Service)** | 백엔드를 대신 만들어주는 서비스. 서버를 직접 짜지 않아도 데이터 저장 가능 | 풀서비스 주택 (직접 지을 필요 없이 입주만 하면 됨) |
| **Supabase** | 오픈소스 BaaS. PostgreSQL 데이터베이스 + API를 한 번에 제공 | 데이터를 넣으면 자동으로 API까지 만들어주는 창고 |
| **LocalStorage** | 브라우저 안에 데이터를 저장하는 작은 공간. 서버 없이도 데이터 보존 가능 | 브라우저 안의 작은 서랍 (꺼도 데이터가 남아 있음) |
| **비동기 (async/await)** | "데이터를 가져오는 동안 다른 일을 하라"는 지시. 기다리는 동안 화면 멈춤 방지 | 음식점에서 주문 후 기다리는 동안 폰을 보는 것 |
| **로딩 / 에러 / 빈 상태** | 데이터를 가져오는 동안(로딩), 실패했을 때(에러), 데이터가 없을 때(빈) 각각 보여주는 화면 | 배달 앱: "주문 중..." → "배달 완료" / "주문 실패" / "주문 내역 없음" |

### 🔧 개발 도구

| 용어 | 쉬운 설명 | 비유 |
|------|-----------|------|
| **Vite** | React 프로젝트를 빠르게 만들고 실행해주는 도구 | 공장의 자동 조립 라인 (빠르게 제품을 만듦) |
| **npm** | JavaScript 패키지(도구)를 설치하고 관리하는 시스템 | 앱스토어 (필요한 도구를 검색해서 설치) |
| **번들링** | 여러 개의 파일을 하나로 묶어서 브라우저가 빠르게 읽을 수 있게 만드는 작업 | 여러 장의 문서를 한 권의 책으로 제본하는 것 |
| **환경변수 (.env)** | 비밀번호 같은 민감 정보를 코드 밖에 따로 저장하는 파일 | 금고 (코드에는 금고 번호가 없고, 금고 안에만 비밀이 있음) |
| **배포 (Deploy)** | 만든 웹사이트를 인터넷에 올려서 누구나 접속할 수 있게 하는 것 | 연극을 무대에서 공연하는 것 (연습 → 실제 공연) |

---

## 2. 과제 해석 및 분석

> "이 과제가 도대체 뭘 만들라는 건지, 처음부터 끝까지 풀어서 설명합니다."

### 2.1 한 줄 요약

**React로 "목록 → 상세 → 등록 → 수정 → 삭제"가 되는 웹사이트를 만들고, 인터넷에 배포하라.**

### 2.2 과제가 원하는 것

이 과제는 B4-1(순수 HTML/CSS/JS로 만든 웹사이트)의 다음 단계입니다. B4-1에서는 "버튼 누름 → 상태 바뀜 → 화면 바뀜" 흐름을 배웠다면, 이번에는 그 흐름을 **React라는 프레임워크로 구조화**하는 것이 목표입니다.

```
B4-1 (이전 과제)                    B4-2 (이번 과제)
─────────────────                   ─────────────────
순수 HTML/CSS/JS                     React 프레임워크
화면 하나에 다 넣음                   컴포넌트로 분리
직접 DOM 조작                         state로 자동 렌더링
페이지 전환 = 새로고침                SPA (새로고침 없음)
데이터 = 메모리/로컬                   BaaS (Supabase/Firebase)
```

### 2.3 반드시 해야 하는 것 (필수)

| # | 요구사항 | 왜 필요한가? |
|---|---------|-------------|
| 1 | **React 기반으로 구현** | React의 컴포넌트/상태/이벤트/비동기 렌더링 학습이 목표 |
| 2 | **최소 5개 라우트** | 페이지 분리와 라우팅 개념 학습 |
| 3 | **CRUD 전부 동작** | 데이터의 생성/조회/수정/삭제 전체 사이클 경험 |
| 4 | **로딩/에러/빈 상태 처리** | 비동기 데이터 처리의 현실적 경험 |
| 5 | **페이지/컴포넌트/훅 분리** | 구조적 설계 능력 학습 |
| 6 | **최소 8개 재사용 컴포넌트** | 컴포넌트 분리 기준 설명 능력 |
| 7 | **최소 1개 커스텀 훅** | 로직 분리 이유 설명 능력 |
| 8 | **Supabase 또는 Firebase 사용** | BaaS 연동 경험 |
| 9 | **배포된 URL에서 CRUD 동작** | 실제 서비스 경험 |
| 10 | **API Key를 .env에 저장** | 보안 기본 습관 |

### 2.4 선택 사항 (안 해도 됨)

| 항목 | 비고 |
|------|------|
| TypeScript | 가산점 없음 |
| UI 고퀄리티 | "React 구조와 데이터 흐름"이 우선 |
| 반응형 디자인 | 선택 사항 |
| 백엔드 고급 기능 (RLS, 권한) | "필수 아님"으로 명시 |
| 인증 | 보너스로 Supabase 이메일 인증과 보호 라우트 구현 |

### 2.5 평가 기준 (루브릭) 분석

| 항목 | 무엇을 보는가 | 우리가 대비한 것 |
|------|-------------|-----------------|
| **기능 동작** | 5개 라우트, CRUD, 상태 처리, 폼 검증, 배포 URL | 8개 라우트, 원격 CRUD, StateView 통일, ItemForm 검증, Vercel 배포 |
| **구조/설계** | 폴더 분리, 8개 컴포넌트, 커스텀 훅, 분리 이유 | pages/components/hooks/context/lib 분리, 11개 컴포넌트, 3개 훅, 분리 이유 문서화 |
| **React 개념 이해** | props vs state, useEffect, 비동기 상태, 데이터 흐름 | README에 props/state 비교, useEffect 설명, 데이터 흐름도 |
| **통합 설명** | 전체 흐름, BaaS 선택 이유 | README에 전체 흐름 + Supabase 선택 이유 + 연동 어려움 |

### 2.6 핵심 도전: "이벤트 → 상태 → 렌더링" 흐름

이 과제의 핵심은 다음 흐름을 React로 구현하는 것입니다:

```
사용자가 버튼을 누른다 (이벤트)
    ↓
state가 바뀐다 (상태 변경)
    ↓
API를 호출한다 (비동기 데이터 처리)
    ↓
화면이 자동으로 바뀐다 (렌더링)
```

예시: "삭제" 버튼을 누르면
1. **이벤트**: 삭제 버튼 클릭 → ConfirmDialog에서 "확인" 클릭
2. **상태 변경**: `deleteItem(id)` 호출 → items 배열에서 해당 아이템 제거
3. **API 호출**: `db.remove(id)` → Supabase/LocalStorage에서 삭제
4. **렌더링**: items가 바뀌었으니 React가 자동으로 목록 화면을 다시 그림

---

## 3. 과제를 진행하기 위한 기초

> "이 과제를 하려면 무엇을 알아야 하는지, 그리고 그것이 왜 필요한지 설명합니다."

### 3.1 기초 1: React 컴포넌트의 개념

**무엇을 아야 하나?** 화면을 작은 조각(컴포넌트)으로 나누는 방법

**왜 필요한가?** React의 핵심은 "화면 = 컴포넌트의 조합"입니다. 버튼 하나, 카드 하나, 페이지 하나 — 전부 컴포넌트입니다. 이 개념 없이는 React 코드를 이해할 수 없습니다.

**핵심 개념:**
- 컴포넌트는 **함수**입니다. 입력(props)을 받아서 화면(JSX)을 반환합니다.
- 컴포넌트 안에 컴포넌트를 넣을 수 있습니다 (조립).
- 같은 컴포넌트를 여러 번 재사용할 수 있습니다.

```
App (최상위 컴포넌트)
├── Layout (공통 틀)
│   ├── Header (상단 메뉴)
│   └── Outlet (여기에 페이지가 들어옴)
│       └── ItemListPage (목록 페이지)
│           ├── StateView (상태 처리)
│           │   └── ItemCard (개별 카드) × N개
│           └── ConfirmDialog (삭제 확인)
```

### 3.2 기초 2: State와 Props의 구분

**무엇을 아야 하나?** state(내부 데이터)와 props(외부에서 받은 데이터)의 차이

**왜 필요한가?** 데이터가 어디서 오는지, 누가 바꿀 수 있는지를 알아야 화면이 왜 바뀌는지 이해할 수 있습니다. 평가에서도 "props와 state의 차이"를 직접 묻습니다.

**핵심 개념:**

| 구분 | State | Props |
|------|-------|-------|
| 누가 만드나? | 컴포넌트 본인 | 부모 컴포넌트 |
| 바꿀 수 있나? | O (setState로) | X (읽기 전용) |
| 바뀌면? | 화면이 자동 갱신 | 부모가 다시 전달 |
| 비유 | 내 저금통 | 부모가 준 용돈 |

**본 프로젝트 예시:**
- `useItems()` 훅 안의 `items`, `loading`, `error` → **state** (훅이 직접 관리)
- `<ItemCard item={item} onDelete={handleDelete} />` → `item`, `onDelete`는 **props** (부모가 전달)

### 3.3 기초 3: 비동기 데이터 처리

**무엇을 아야 하나?** 데이터를 가져오는 동안 화면이 멈추지 않게 하는 방법

**왜 필요한가?** Supabase에서 데이터를 가져오려면 시간이 걸립니다. 그동안 사용자에게 "로딩 중"이라고 알려주지 않으면 빈 화면만 보이고, "고장 났나?"라고 생각합니다.

**핵심 개념: 4가지 상태**

```
데이터 요청 시작
    ↓
┌─ 로딩 (아직 데이터 안 옴 → "불러오는 중...")
│
├─ 성공 → 데이터 있음 → 정상 화면
│       → 데이터 없음 → 빈 상태 ("표시할 데이터가 없습니다")
│
└─ 실패 → 에러 ("요청에 실패했습니다. 다시 시도하세요.")
```

**본 프로젝트의 구현:** 모든 페이지가 `StateView` 컴포넌트를 통해 이 4가지 상태를 일관되게 처리합니다.

### 3.4 기초 4: 라우팅 (페이지 전환)

**무엇을 아야 하나?** 주소(URL)에 따라 다른 화면을 보여주는 방법

**왜 필요한가?** "목록 페이지", "상세 페이지", "등록 페이지"를 주소로 구분해야 합니다. React Router는 이것을 담당합니다.

**핵심 개념:**
- `<Route path="/items" element={<ItemListPage />}>` → 주소가 `/items`면 목록 페이지를 보여줌
- `<Route path="/items/:id" element={<ItemDetailPage />}>` → `:id`는 변수 (예: `/items/123` → 123번 아이템 상세)
- `<Route path="*" element={<NotFoundPage />}>` → 없는 주소면 404 페이지
- 중첩 라우트: 부모 Route 안에 자식 Route를 넣고, 부모에 `<Outlet />`을 두면 자식이 그 자리에 그려짐

### 3.5 기초 5: 커스텀 훅 (로직 분리)

**무엇을 아야 하나?** 데이터 처리 로직을 컴포넌트에서 빼내어 재사용 가능하게 만드는 방법

**왜 필요한가?** "목록 불러오기, 추가하기, 삭제하기" 로직이 여러 페이지에서 필요합니다. 이 로직을 매 페이지마다 복사하면 코드가 중복됩니다. 커스텀 훅으로 한 번 만들어두면 여러 페이지에서 재사용할 수 있습니다.

**핵심 개념:**
- `use~`로 시작하는 함수 = 커스텀 훅
- 컴포넌트 안의 useState/useEffect 로직을 밖으로 빼낸 것
- 여러 컴포넌트에서 같은 훅을 호출하면 **각각 독립적인 state**를 가짐

**본 프로젝트의 훅:**
- `useItems()`: 목록 조회, 추가, 삭제 로직 → 목록 페이지에서 사용
- `useItem(id)`: 단일 조회, 수정, 삭제 로직 → 상세/수정 페이지에서 사용
- `useAuth()`: Context의 로그인 사용자와 인증 함수를 안전하게 사용

### 3.6 기초 6: BaaS 연동과 명시적 로컬 학습 모드

**무엇을 아야 하나?** 외부 서비스(Supabase)를 연동하고, 원격 모드와 로컬 연습 모드를 분명히 나누는 방법

**왜 필요한가?** 과제는 원격 CRUD가 필수이므로 `.env` 누락을 LocalStorage 성공으로 숨기면 안 됩니다. 대신 인터넷 없는 학습에서는 `VITE_ALLOW_LOCAL_DB=true`를 직접 설정해 LocalStorage를 사용합니다.

**핵심 개념:**
- `dataSource`: `supabase`, `local`, `missing` 중 현재 모드를 표시
- `lib/api.js`: 명시적으로 선택된 데이터 소스만 사용
- 같은 인터페이스(`selectAll`, `insert`, `update`, `remove`)로 두 가지 데이터 소스를 통일
- 설정이 빠지면 이해할 수 있는 오류를 표시

---

## 4. 각 기초를 익히기 위한 간단한 체험 예제

> "이론만 읽으면 잊어버립니다. 직접 타이핑해 보면 남습니다."

### 4.1 체험 1: 컴포넌트 만들기 (기초 1)

**목표:** 화면의 작은 조각(컴포넌트)을 하나 만들어 본다.

```jsx
// Greeting.jsx — 이름을 받아서 인사하는 컴포넌트
function Greeting({ name }) {
  return <h1>안녕하세요, {name}님!</h1>
}

// 사용법
<Greeting name="홍길동" />  // → "안녕하세요, 홍길동님!"
<Greeting name="김철수" />  // → "안녕하세요, 김철수님!"
```

**체험 포인트:**
- `name`은 props (부모가 전달, 이 컴포넌트는 받기만 함)
- 같은 컴포넌트를 다른 이름으로 여러 번 쓸 수 있음
- `{name}`처럼 중괄호 안에 변수를 넣으면 화면에 값이 표시됨

### 4.2 체험 2: State로 카운터 만들기 (기초 2)

**목표:** 버튼을 누르면 숫자가 올라가는 것을 만들어 본다.

```jsx
// Counter.jsx — 버튼 누르면 숫자 증가
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)  // count = 0에서 시작

  return (
    <div>
      <p>현재 숫자: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

**체험 포인트:**
- `count`는 state (이 컴포넌트가 직접 관리)
- `setCount(count + 1)`로 state를 바꾸면 React가 자동으로 화면을 다시 그림
- "버튼 클릭(이벤트) → state 변경 → 화면 갱신(렌더링)" 흐름이 여기서 이미 등장

### 4.3 체험 3: 비동기 데이터 불러오기 (기초 3)

**목표:** 데이터를 가져오는 동안 "로딩 중"을 표시해 본다.

```jsx
// UserList.jsx — JSONPlaceholder에서 사용자 목록 가져오기
import { useState, useEffect } from 'react'

function UserList() {
  const [users, setUsers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => { setUsers(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])  // [] = 화면 처음 그려질 때 한 번만 실행

  if (loading) return <p>불러오는 중...</p>
  if (error) return <p>에러: {error}</p>
  if (!users || users.length === 0) return <p>데이터가 없습니다.</p>

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  )
}
```

**체험 포인트:**
- 4가지 상태: loading → 성공(데이터 있음/없음) → 에러
- `useEffect(() => {...}, [])`: 화면이 처음 그려졌을 때 실행
- 이 패턴이 본 프로젝트의 `useItems()` 훅과 `StateView` 컴포넌트의 기초가 됨

### 4.4 체험 4: 라우팅 설정하기 (기초 4)

**목표:** 주소에 따라 다른 화면을 보여주는 것을 만들어 본다.

```jsx
// App.jsx — 두 개의 페이지를 라우팅
import { HashRouter, Routes, Route, Link } from 'react-router-dom'

function Home() { return <h1>홈 페이지</h1> }
function About() { return <h1>소개 페이지</h1> }

function App() {
  return (
    <HashRouter>
      <nav>
        <Link to="/">홈</Link>
        <Link to="/about">소개</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </HashRouter>
  )
}
```

**체험 포인트:**
- `HashRouter`: 주소가 `/#/about` 형태가 됨 (정적 호스팅에서 안전)
- `Link to="/about"`: 클릭하면 주소가 바뀌고 화면이 전환됨 (새로고침 없음)
- 본 프로젝트는 이 구조를 확장하여 8개 라우트 + 중첩 라우트(Outlet)를 사용

### 4.5 체험 5: LocalStorage로 데이터 저장하기 (기초 6)

**목표:** 브라우저에 데이터를 저장하고 불러온다.

```jsx
// NotePad.jsx — LocalStorage에 메모 저장
import { useState, useEffect } from 'react'

function NotePad() {
  const [text, setText] = useState('')

  // 화면 처음 그려질 때 저장된 메모 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('my-note')
    if (saved) setText(saved)
  }, [])

  // 타이핑할 때마다 저장
  function handleChange(e) {
    setText(e.target.value)
    localStorage.setItem('my-note', e.target.value)
  }

  return <textarea value={text} onChange={handleChange} />
}
```

**체험 포인트:**
- `localStorage.getItem(key)`: 저장된 값 읽기
- `localStorage.setItem(key, value)`: 값 저장
- 새로고침해도 데이터가 남아 있음
- 본 프로젝트의 `lib/localDB.js`가 이 방식을 CRUD로 확장한 것

### 4.6 체험 6: 커스텀 훅 만들기 (기초 5)

**목표:** 데이터 로직을 컴포넌트에서 빼내어 재사용 가능하게 만든다.

```jsx
// useLocalStorage.js — LocalStorage 기반 state를 만드는 커스텀 훅
import { useState, useEffect } from 'react'

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])  // value가 바뀔 때마다 저장

  return [value, setValue]
}

// 사용법 — 어떤 컴포넌트에서든 재사용 가능
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      현재 테마: {theme}
    </button>
  )
}
```

**체험 포인트:**
- `use~`로 시작하는 함수 = 커스텀 훅
- useState + useEffect 로직을 하나로 묶어서 재사용
- 본 프로젝트의 `useItems()`, `useItem()`이 바로 이 패턴의 실제 적용

---

## 5. 과제를 작게 쪼개기: 잡 → 워크 → 워크플로우

> "큰 산을 한 번에 오르지 말고, 캠프 → 베이스캠프 → 정상으로 나누듯이, 과제도 잡(Job) → 워크(Work) → 워크플로우(Workflow)로 나눕니다."

### 5.1 쪼개기 원칙

```
과제 (전체)
  └── 잡 (Job): 큰 단위의 작업. "이 잡이 끝나면 의미 있는 결과물이 나온다"
       └── 워크 (Work): 잡 안의 작은 단위. "이 워크가 끝나면 한 가지가 완성된다"
            └── 워크플로우 (Workflow): 워크를 실행하는 구체적 순서
```

### 5.2 전체 잡 분해도

```
과제: React CRUD 웹앱 만들기
│
├── Job 1: 프로젝트 기반 잡기 (Setup)
├── Job 2: 라우팅 뼈대 만들기 (Routing)
├── Job 3: 재사용 컴포넌트 만들기 (Components)
├── Job 4: 데이터 로직 훅 만들기 (Hooks)
├── Job 5: 데이터 소스 연결하기 (Data Layer)
├── Job 6: 페이지 조립하기 (Pages)
├── Job 7: 배포하기 (Deploy)
└── Job 8: 문서화 및 평가 대비 (Docs)
```

### 5.3 각 잡별 워크 분해

#### Job 1: 프로젝트 기반 잡기 (Setup)

| 워크 | 내용 | 워크플로우 |
|------|------|-----------|
| W1-1 | Vite 프로젝트 생성 | `npm create vite@latest b4-2 -- --template react` → 폴더 구조 확인 |
| W1-2 | 의존성 설치 | `npm install` + `npm install react-router-dom @supabase/supabase-js` |
| W1-3 | 폴더 구조 만들기 | `mkdir src/pages src/components src/hooks src/lib` |
| W1-4 | 환경 설정 | `.env.example`, `.gitignore`, `vite.config.js`, `vercel.json` 작성 |

#### Job 2: 라우팅 뼈대 만들기 (Routing)

| 워크 | 내용 | 워크플로우 |
|------|------|-----------|
| W2-1 | HashRouter 설정 | `App.jsx`에 `<HashRouter>` 래핑 |
| W2-2 | 6개 라우트 정의 | `/`, `/items`, `/items/new`, `/items/:id`, `/items/:id/edit`, `*` |
| W2-3 | 중첩 라우트 + Outlet | 부모 `<Layout>` 안에 자식 라우트, `<Outlet />` 배치 |
| W2-4 | 404 페이지 | `NotFoundPage.jsx` 작성 |

#### Job 3: 재사용 컴포넌트 만들기 (Components)

| 워크 | 내용 | 워크플로우 |
|------|------|-----------|
| W3-1 | Layout 컴포넌트 | 헤더(네비게이션) + Outlet + 푸터 |
| W3-2 | 상태 컴포넌트 3종 | LoadingSpinner, ErrorBanner, EmptyState |
| W3-3 | StateView 통합 | 위 3개를 하나로 묶어 4분기 분기 처리 |
| W3-4 | ItemCard | 개별 아이템 카드 (제목, 내용, 카테고리, 삭제 버튼) |
| W3-5 | ItemForm | 등록/수정 공용 폼 + 필수값 검증 |
| W3-6 | ConfirmDialog | 삭제 확인 모달 |

#### Job 4: 데이터 로직 훅 만들기 (Hooks)

| 워크 | 내용 | 워크플로우 |
|------|------|-----------|
| W4-1 | useItems 훅 | 목록 조회(fetchAll), 추가(addItem), 삭제(deleteItem) + loading/error state |
| W4-2 | useItem 훅 | 단일 조회(fetchById), 수정(updateItem) + loading/error state |
| W4-3 | refetch 함수 | 에러 발생 시 "다시 시도" 버튼용 재요청 함수 노출 |

#### Job 5: 데이터 소스 연결하기 (Data Layer)

| 워크 | 내용 | 워크플로우 |
|------|------|-----------|
| W5-1 | supabaseClient | Supabase 클라이언트 생성 + `isSupabaseConfigured` 플래그 |
| W5-2 | localDB | LocalStorage 기반 CRUD (selectAll, selectById, insert, update, remove) |
| W5-3 | api.js 추상화 | Supabase/LocalDB 중 어느 것을 쓸지 분기 + 통일된 인터페이스 |

#### Job 6: 페이지 조립하기 (Pages)

| 워크 | 내용 | 워크플로우 |
|------|------|-----------|
| W6-1 | ItemListPage | useItems 호출 → StateView → ItemCard 목록 → ConfirmDialog |
| W6-2 | ItemDetailPage | useItem 호출 → StateView → 상세 정보 → 삭제/수정 버튼 |
| W6-3 | ItemNewPage | ItemForm + addItem → 성공 시 목록으로 이동 |
| W6-4 | ItemEditPage | useItem으로 기존 데이터 로드 → ItemForm + updateItem → 성공 시 상세로 이동 |
| W6-5 | NotFoundPage | 404 메시지 + 홈으로 돌아가기 링크 |

#### Job 7: 배포하기 (Deploy)

| 워크 | 내용 | 워크플로우 |
|------|------|-----------|
| W7-1 | 빌드 확인 | `npm run build` → `dist/` 폴더 생성 확인 |
| W7-2 | Vercel 배포 | GitHub 레포 연결 → 자동 빌드 → 배포 URL 획득 |
| W7-3 | 환경변수 등록 | Vercel 대시보드에서 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 등록 |
| W7-4 | 동작 확인 | 배포 URL에서 CRUD 전부 테스트 |

#### Job 8: 문서화 및 평가 대비 (Docs)

| 워크 | 내용 | 워크플로우 |
|------|------|-----------|
| W8-1 | README 작성 | 구조, 라우트, 훅, 상태 처리, props/state, Supabase 선택 이유 |
| W8-2 | reasoning 문서 | docs/에 6개 설계 근거 문서 작성 |
| W8-3 | eval 가이드 | 사전평가 결과 + 동료평가 예상 질문 정리 |

### 5.4 워크플로우 실행 순서 (의존성 그래프)

```
Job 1 (Setup)
  ↓
Job 5 (Data Layer) ← Job 2 (Routing)은 병렬 가능
  ↓                    ↓
Job 4 (Hooks)        Job 3 (Components)
  ↓                    ↓
  └─────── Job 6 (Pages) ───────┘
              ↓
         Job 7 (Deploy)
              ↓
         Job 8 (Docs)
```

> **왜 이 순서인가?** 데이터 소스(5)와 라우팅(2)을 먼저 만들어야, 훅(4)과 컴포넌트(3)가 올바르게 동작합니다. 훅과 컴포넌트가 있어야 페이지(6)를 조립할 수 있습니다. 페이지가 있어야 배포(7)할 수 있고, 배포가 있어야 문서(8)에 배포 URL을 쓸 수 있습니다.

---

## 6. 워크플로우별 트레이드오프, 이슈, 트러블슈팅

> "길을 걷다 보면 갈림길을 만납니다. 왜 이 길을 선택했는지, 다른 길은 왜 포기했는지, 그리고 길에서 넘어졌을 때 어떻게 일어났는지를 기록합니다."

### 6.1 Job 2 (라우팅): HashRouter vs BrowserRouter

#### 🤔 선택의 기로

| 기준 | HashRouter | BrowserRouter |
|------|-----------|---------------|
| 주소 형태 | `/#/items` | `/items` (깔끔함) |
| 정적 호스팅 | ✅ 100% 동작 | ❌ 서버 설정 필요 (fallback) |
| Vercel | ✅ 추가 설정 불필요 | rewrites 규칙 필요 |
| GitHub Pages | ✅ 100% 동작 | ❌ 404 문제 (새로고침 시) |

#### ✅ 선택: HashRouter

**이유:** 본 과제는 Vercel + GitHub Pages에 배포합니다. BrowserRouter는 서버가 "모든 주소를 index.html로 보내라"는 설정(fallback)이 필요하지만, 정적 호스팅에서는 이 설정이 까다롭습니다. HashRouter는 `#` 뒤의 주소를 브라우저가 처리하므로 서버 도움 없이 100% 동작합니다.

#### ⚖️ 트레이드오프

- **포기한 것:** 깔끔한 주소 (`/items` vs `/#/items`)
- **얻은 것:** 배포 환경에서 라우팅이 100% 동작하는 보장
- **판단:** "미적으로 깔끔한 주소"보다 "어디서든 동작하는 안정성"이 과제 목표에 부합

---

### 6.2 Job 2 (라우팅): Layout에서 `children` vs `<Outlet />` — 🔥 트러블슈팅

#### 🐛 발생한 문제

배포 후 사용자가 "목록은 보이는데 버튼 클릭이 안 됨"이라고 보고.

#### 🔍 원인 분석

React Router 6에서 중첩 라우트를 사용할 때, 부모 컴포넌트가 자식 라우트를 렌더링하려면 `<Outlet />` 컴포넌트를 사용해야 합니다. 기존 코드에서는 `{children}`을 사용하고 있었는데, React Router 6의 중첩 라우트는 `children`이 아닌 `<Outlet />`을 통해 자식을 그립니다.

**잘못된 코드 (수정 전):**
```jsx
// Layout.jsx (수정 전)
function Layout({ children }) {
  return (
    <div>
      <header>...</header>
      <main>{children}</main>  {/* ← React Router 6에서는 작동 안 함 */}
    </div>
  )
}
```

**수정된 코드 (수정 후):**
```jsx
// Layout.jsx (수정 후)
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <header>...</header>
      <main><Outlet /></main>  {/* ← React Router 6의 올바른 방법 */}
    </div>
  )
}
```

#### 💡 교훈

- React Router 5 → 6으로 바뀌면서 중첩 라우트 렌더링 방식이 완전히 바뀜
- `children`은 일반적인 React 컴포넌트 합성에 쓰는 것이고, `<Outlet />`은 React Router의 라우트 합성에 쓰는 것
- "화면이 보이지만 클릭이 안 된다" → 렌더링은 됐지만 이벤트 핸들러가 연결되지 않은 것 → Outlet이 없어서 실제로는 자식 라우트가 렌더링되지 않았음

---

### 6.3 Job 5 (데이터 소스): Supabase vs Firebase

#### 🤔 선택의 기로

| 기준 | Supabase | Firebase |
|------|---------|----------|
| 데이터베이스 | PostgreSQL (관계형) | Firestore (문서형) |
| 쿼리 방식 | SQL (표준) | 전용 메서드 (학습 필요) |
| 오픈소스 | ✅ 자체 호스팅 가능 | ❌ Google 종속 |
| SDK 크기 | 작음 | 큼 |

#### ✅ 선택: Supabase

**이유:**
1. PostgreSQL 기반 → SQL 지식을 그대로 재사용 가능
2. 관계형 데이터(items 테이블에 id, title, content, category)가 RDB에 적합
3. 오픈소스 → 벤더 종속 위험 적음
4. `@supabase/supabase-js` 한 패키지로 모든 기능 제공

#### ⚖️ 트레이드오프

- **포기한 것:** Firebase의 더 큰 커뮤니티와 풍부한 튜토리얼
- **얻은 것:** SQL 기반의 익숙한 데이터 모델, 오픈소스 유연성
- **판단:** 과제의 데이터 구조(단일 테이블 CRUD)가 관계형에 더 적합

---

### 6.4 Job 5 (데이터 소스): 자동 Fallback을 명시적 학습 모드로 수정 — 🐛 이슈

#### 🐛 발생한 문제

처음에는 `.env`가 없으면 LocalStorage로 자동 전환했다. 앱은 열리지만 필수인 원격 CRUD 실패를 숨기는 새 문제가 생겼다.

#### 🔍 원인 분석

개발 편의와 제출 조건을 같은 규칙으로 처리한 것이 원인이었다. 평가 환경에서는 원격 설정이 빠지면 성공처럼 보이지 말고 오류를 분명히 알려야 한다.

#### 💡 해결책: 명시적 3가지 모드

```
컴포넌트/훅 (useItems)
    ↓ 호출
api.js (추상화 계층 — 어디서 데이터를 가져올지 결정)
    ↓ 분기
    ├── URL + Key 있음                     → Supabase 호출
    ├── VITE_ALLOW_LOCAL_DB == true         → LocalDB 호출
    └── 둘 다 아님                          → 설정 오류 표시
```

**구조:**
1. `dataSource.js`: 원격, 로컬 학습, 설정 누락을 구분
2. `localDB.js`: LocalStorage 기반 CRUD (Supabase 인터페이스와 동일)
3. `api.js`: 선택된 소스만 호출하고 설정 누락은 오류 처리

#### ⚖️ 트레이드오프

- **포기한 것:** 설정 없이도 성공 화면이 뜨는 편리함
- **얻은 것:** 원격 실패를 숨기지 않으면서 로컬 연습은 유지
- **판단:** 배포는 Supabase가 필수, LocalStorage는 직접 켠 학습 모드로만 제한

---

### 6.5 Job 4 (훅): State를 훅으로 분리 vs 컴포넌트 안에 두기

#### 🤔 선택의 기로

| 기준 | 훅으로 분리 | 컴포넌트 안에 |
|------|-----------|-------------|
| 재사용성 | ✅ 여러 페이지에서 재사용 | ❌ 매 페이지에 복사 |
| 관심사 분리 | ✅ UI와 데이터 로직 분리 | ❌ 한 파일에 섞임 |
| 테스트 | ✅ 로직만 독립 테스트 | ❌ UI와 엮여 있어 어려움 |
| 코드량 | 약간 증가 (별도 파일) | 적음 |

#### ✅ 선택: 훅으로 분리

**이유:**
1. `useItems()`를 목록 페이지뿐 아니라 삭제 후 갱신 등 여러 곳에서 재사용
2. 컴포넌트는 "화면 그리기"에만 집중, 훅은 "데이터 처리"에만 집중
3. loading/error/data 상태를 한 곳에서 일원화 관리

#### ⚖️ 트레이드오프

- **포기한 것:** 간단한 코드 (컴포넌트 하나에 다 넣으면 더 짧음)
- **얻은 것:** 재사용성, 관심사 분리, 테스트 용이성
- **판단:** 과제에서 "커스텀 훅 분리 이유 설명"을 평가 항목으로 요구 → 분리가 필수

---

### 6.6 Job 3 (컴포넌트): StateView로 상태 처리 통합 vs 각 페이지마다 if문

#### 🤔 선택의 기로

**방식 A: 각 페이지마다 if문**
```jsx
// 매 페이지마다 이 코드 반복
if (loading) return <Spinner />
if (error) return <ErrorBanner />
if (!data || data.length === 0) return <EmptyState />
return <ActualContent />
```

**방식 B: StateView 통합 컴포넌트**
```jsx
// 한 번 만들고, 모든 페이지에서 재사용
<StateView loading={loading} error={error} data={data} onRetry={refetch}>
  {(data) => <ActualContent data={data} />}
</StateView>
```

#### ✅ 선택: StateView 통합 (방식 B)

**이유:**
1. 평가 항목 "로딩/에러/빈 상태 UI가 공통 컴포넌트로 통일"을 만족
2. 모든 페이지에서 일관된 상태 처리 (어떤 페이지든 같은 UX)
3. 상태 처리 로직이 한 곳에 집중 → 유지보수 용이

#### ⚖️ 트레이드오프

- **포기한 것:** 각 페이지에서 세밀한 상태 처리 커스터마이징
- **얻은 것:** 일관성, 재사용성, 평가 기준 충족
- **판단:** 과제에서 "일관된 방식"을 명시적으로 요구 → 통합이 정답

---

### 6.7 Job 7 (배포): Vercel 자동 재배포 안 됨 — 🔥 트러블슈팅

#### 🐛 발생한 문제

GitHub에 push해도 Vercel이 자동으로 재배포하지 않음. Outlet 수정(커밋 0a8a22a)이 Vercel 배포에 반영되지 않음.

#### 🔍 원인 분석

Vercel이 GitHub push 이벤트를 감지하지 못하는 상황. GitHub Webhook이 끊어졌거나 Vercel의 Git 연동이 꼬인 것으로 추정.

#### 💡 해결책

Vercel 대시보드에서 **수동 Redeploy** 실행:
1. Vercel 대시보드 → 프로젝트 → Deployments
2. 최신 배포 옆 "..." 메뉴 → Redeploy
3. "Use existing Build Cache" 체크 해제 → 새로 빌드
4. 배포 완료 후 CRUD 동작 확인

#### ⚖️ 트레이드오프

- **포기한 것:** 자동 배포의 편리함 (push만 하면 끝)
- **얻은 것:** 수동 제어 (원할 때만 배포)
- **교훈:** 배포 자동화에 의존하지 말고, 수동 재배포 방법도 알아둘 것

---

### 6.8 Job 7 (배포): GitHub Pages에서 JS 404 — 🔥 트러블슈팅

#### 🐛 발생한 문제

GitHub Pages 배포 후 JavaScript 파일이 404로 로드되지 않아 화면이 하얗게 나옴. `raw.githubusercontent.com`에서는 파일이 정상적으로 200 응답하지만, GitHub Pages CDN에서는 404.

#### 🔍 원인 분석

GitHub Pages의 CDN 캐시 문제. 파일은 `gh-pages` 브랜치에 정상 업로드되었지만, CDN이 캐시한 예전 상태를 계속 반환.

#### 💡 시도한 해결책

1. `gh-pages` 브랜치 강제 푸시 → CDN 캐시 무효화 기대 → 실패
2. 파일명에 해시 추가 (Vite 기본 동작) → 해시가 안 바뀌어 캐시 갱신 안 됨
3. Vercel을 주 배포로 전환 → GitHub Pages는 보조용으로 유지

#### ⚖️ 트레이드오프

- **포기한 것:** GitHub Pages에서의 안정적 동작
- **얻은 것:** Vercel에서의 안정적 동작 (주 배포 URL 사용)
- **교훈:** 무료 CDN의 캐시 문제는 개발자가 통제하기 어려움 → 대안 배포 채널 확보 필수

---

## 7. 과제 완료 후 학습한 내용 정리

> "과제를 끝내고 나서, 무엇을 알게 되었는지, 무엇이 바뀌었는지 정리합니다."

### 7.1 배운 것: React의 사고방식

**과제 전:** "화면을 어떻게 꾸밀까?" (HTML/CSS 중심)
**과제 후:** "화면을 어떤 컴포넌트로 쪼갤까? 데이터는 어떻게 흐를까?" (컴포넌트 + 데이터 흐름 중심)

React의 핵심은 "화면을 컴포넌트로 쪼개고, state가 바뀌면 화면이 자동으로 갱신되는 것"입니다. 이 과제를 하면서 그 흐름을 처음부터 끝까지 경험했습니다.

### 7.2 배운 것: 데이터 흐름의 전체 사이클

```
사용자 이벤트 (버튼 클릭, 폼 제출)
    ↓
이벤트 핸들러 실행 (onClick, onSubmit)
    ↓
커스텀 훅 호출 (useItems.addItem, useItem.updateItem)
    ↓
api.js 분기 (Supabase vs LocalDB)
    ↓
데이터 소스 처리 (DB 저장/수정/삭제)
    ↓
state 갱신 (setItems, setItem)
    ↓
React 자동 재렌더링 (화면 갱신)
    ↓
사용자가 결과 확인
```

이 흐름을 **한 줄 한 줄 추적**할 수 있게 되었습니다. "버튼을 눌렀는데 왜 화면이 바뀌지?"라는 질문에, "이벤트 → 훅 → API → state → 렌더링" 순서로 설명할 수 있습니다.

### 7.3 배운 것: 구조적 설계의 중요성

| 원칙 | 이 과제에서의 적용 |
|------|------------------|
| **관심사 분리** | UI(컴포넌트) / 데이터 로직(훅) / 데이터 소스(lib)를 분리 |
| **재사용성** | StateView, ItemForm 등을 여러 페이지에서 재사용 |
| **일관성** | 모든 페이지에서 같은 상태 처리 패턴 (로딩/에러/빈/정상) |
| **추상화** | api.js로 Supabase/LocalDB의 차이를 감춤 |

### 7.4 배운 것: 배포와 환경의 현실

- **로컬에서 되는데 배포에서 안 됨**: HashRouter vs BrowserRouter, CDN 캐시, 환경변수
- **자동화에 의존하지 말 것**: Vercel 자동 배포가 안 될 수도 있음 → 수동 재배포 방법 숙지
- **대안을 가질 것**: Vercel이 안 되면 GitHub Pages, 그것도 안 되면 다른 서비스

### 7.5 배운 것: 보안 기본 습관

- API Key는 **절대** 코드에 직접 쓰지 않음 → `.env`에 저장
- `.env`는 `.gitignore`에 추가 → GitHub에 푸시하지 않음
- 배포 시 대시보드에서 환경변수 별도 등록 → 코드와 분리

### 7.6 핵심 인사이트 3가지

1. **"화면 = state의 거울"**: state가 바뀌면 화면이 자동으로 바뀐다. 직접 DOM을 조작할 필요가 없다. 이것이 React가 순수 JS보다 편리한 이유다.

2. **"추상화는 경계를 만든다"**: api.js로 Supabase와 LocalStorage의 사용법을 통일하되, 원격 실패가 자동으로 로컬 성공으로 바뀌지 않게 모드를 분명히 했다.

3. **"배포는 개발의 절반"**: 아무리 좋은 코드를 짜도 배포가 안 되면 사용자가 볼 수 없다. 배포 환경의 특성(정적 호스팅, CDN 캐시, 환경변수)을 처음부터 고려해야 한다.

### 7.7 다음 단계로 나아가기 위한 메모

| 주제 | 이 과제에서 | 다음에 배울 것 |
|------|-----------|---------------|
| 상태 관리 | useState + AuthContext | 상태가 커질 때 Context 분리 또는 전용 도구 검토 |
| 데이터 패칭 | useEffect + fetch | React Query, SWR (캐싱, 재시도 자동화) |
| 타입 안정성 | JavaScript | TypeScript (컴파일 타임 에러 검출) |
| 스타일링 | 인라인 스타일 | Tailwind CSS, CSS Modules |
| 테스트 | 단위 28개 + 로컬 E2E 2개 + 배포 권한/쓰기 E2E 분리 | CI 자동 실행과 더 많은 실패 경로 |
| 인증·권한 | Supabase 이메일 Auth + 공개 조회/로그인 쓰기 | 사용자별 소유권 RLS와 OAuth |

---

> *이 학습 노트는 Codyssey AI/SW 기초 과정 B4-2 과제를 수행하며 학습한 내용을 정리한 것입니다.*
