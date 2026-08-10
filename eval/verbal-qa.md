# B4-2 동료평가 대비 완벽 가이드

> 문과 중졸도 이해할 수 있게, 하나도 빠짐없이 정리.

---

## 1. 이 과제가 뭔가요? (한 줄로)

**React로 "버튼 누르면 화면이 스르륵 바뀌는" SPA(싱글 페이지 앱) 웹사이트를 만드는 과제.**

### 쉽게 설명하면

B4-1에서는 순수 JavaScript로 "버튼 누름 → 화면 바뀜"을 직접 구현했다면, B4-2는 **React 프레임워크**로 같은 흐름을 **구조화해서** 만드는 과제입니다.

- B4-1: "원리 이해" (바닥부터 다 만들기)
- B4-2: "구조화" (React로 깔끔하게 만들기)

### 만든 것

**아이템 관리 웹앱** (CRUD):
- 목록 보기 (Read)
- 상세 보기 (Read)
- 새 아이템 등록 (Create)
- 아이템 수정 (Update)
- 아이템 삭제 (Delete)

---

## 2. 과제 요구사항 — 루브릭 기준

### 항목 1: 기능 동작
| # | 요구사항 | 구현 |
|---|---------|------|
| 1-1 | 5개+ 라우트 + 404 페이지 | ✅ 6개 (/, /items, /items/new, /items/:id, /items/:id/edit, *) |
| 1-2 | CRUD 전체 동작 | ✅ 목록/상세/등록/수정/삭제 |
| 1-3 | 로딩/에러/빈 상태 일관 표시 | ✅ StateView 공통 컴포넌트 |
| 1-4 | 폼 검증 + 에러 메시지 + 제출중 | ✅ ItemForm (validate + errors + submitting) |
| 1-5 | 배포 URL에서 CRUD 동작 | ✅ https://b4-2.vercel.app/ (Vercel 수동 재배포 필요) |

### 항목 2: 구조/설계
| # | 요구사항 | 구현 |
|---|---------|------|
| 2-1 | 커스텀 훅 1개+ + 분리 이유 | ✅ useItems, useItem (재사용성/관심사분리/테스트용이성) |
| 2-2 | pages/components/hooks/lib 분리 | ✅ 4개 폴더 |
| 2-3 | 8개+ 재사용 컴포넌트 + 기준 | ✅ Layout, LoadingSpinner, ErrorBanner, EmptyState, StateView, ItemCard, ItemForm, ConfirmDialog |
| 2-4 | 공통 상태 UI 통일 | ✅ StateView가 3개 공통 컴포넌트 통합 |
| 2-5 | 훅 분리 이유 | ✅ README에 4가지 이유 명시 |

### 항목 3: React 개념 이해
| # | 요구사항 | 구현 |
|---|---------|------|
| 3-1 | props vs state 구분 + 상태 위치 | ✅ README "props vs state" 섹션 |
| 3-2 | useEffect 실행 시점 + 의존성 배열 | ✅ docs/reasoning-03-state-flow.md |
| 3-3 | 비동기 상태 처리 | ✅ loading/error/data 3상태 |
| 3-4 | 상태→화면 변화 3군데 | ✅ ①로딩→렌더링 ②폼입력→버튼 ③삭제→목록갱신 |

### 항목 4: 통합 설명
| # | 요구사항 | 구현 |
|---|---------|------|
| 4-1 | 라우팅→컴포넌트→상태→이벤트→렌더링 | ✅ docs/reasoning-06-full-flow.md |
| 4-2 | Supabase 선택 이유 + 어려움 | ✅ README "Supabase 선택 이유" 섹션 |

---

## 3. 작업 진행 순서

### Step 1: 프로젝트 셋업
- Vite 6 + React 18 + react-router-dom 6 설치
- 폴더 구조 생성: pages/, components/, hooks/, lib/

### Step 2: 라우팅 설정
- HashRouter 사용 (정적 호스팅에서 100% 동작)
- 6개 라우트 정의 (목록/상세/등록/수정/404)

### Step 3: 백엔드 연결 (Supabase + LocalStorage 듀얼 모드)
- Supabase: 환경변수 설정 시 사용
- LocalStorage: .env 없어도 동작 (개발/테스트용)
- api.js에서 두 데이터 소스를 통일된 인터페이스로 추상화

### Step 4: 공통 컴포넌트 (8개)
- LoadingSpinner, ErrorBanner, EmptyState → StateView로 통합
- Layout (Outlet 사용), ItemCard, ItemForm, ConfirmDialog

### Step 5: 커스텀 훅 (2개)
- useItems: 목록 조회/추가/삭제 + loading/error 상태 관리
- useItem: 단일 조회/수정

### Step 6: 페이지 구현 (5개)
- ItemListPage, ItemDetailPage, ItemNewPage, ItemEditPage, NotFoundPage
- 각 페이지에서 StateView + 훅 + 컴포넌트 조합

### Step 7: 배포
- Vercel 배포 (HashRouter + vercel.json SPA rewrite)

---

## 4. 진행 중 생긴 문제와 해결

### 문제 1: Vite 8 + React 19 + react-router-dom 7 빌드 실패
- **상황**: Vercel에서 `vite build`가 exit code 127로 실패
- **원인**: Vite 8는 Node.js 22+ 필요, Vercel 기본 Node.js 버전이 낮음
- **해결**: 안정 버전으로 전면 재작성 (Vite 6 + React 18 + react-router-dom 6)
- **판단 기준**: "최신 버전이 항상 좋은가?" → 아니요, 안정성이 더 중요

### 문제 2: createBrowserRouter가 정적 호스팅에서 안 됨
- **상황**: Vercel/GitHub Pages에서 /items 경로 접근 시 404
- **원인**: createBrowserRouter는 서버 사이드 라우팅이 필요한데, 정적 호스팅은 지원 안 함
- **해결**: HashRouter로 변경 (URL이 #/items 형태가 되지만 정적 호스팅에서 100% 동작)
- **판단 기준**: "URL이 예쁜 게 중요한가, 작동하는 게 중요한가?" → 작동이 우선

### 문제 3: Layout에서 children을 써서 버튼 클릭이 안 됨
- **상황**: 목록은 보이는데 "+ 새 아이템" 버튼을 눌러도 화면이 안 바뀜
- **원인**: react-router-dom 6에서 중첩 Route의 자식을 렌더링하려면 `<Outlet />`이 필요한데, `children`을 사용함
- **해결**: Layout을 children → Outlet으로 수정
- **판단 기준**: "공식 문서를 확인하자" → react-router-dom 6 문서에서 Outlet 사용 확인

### 문제 4: Supabase 연결 없이도 동작해야 함
- **상황**: 평가 환경에서 .env가 없으면 앱이 크래시
- **해결**: LocalStorage fallback 모드 구현 — Supabase가 설정되지 않으면 자동으로 LocalStorage 사용
- **판단 기준**: "평가자가 .env를 설정할 것인가?" → 안 할 가능성이 높음, 자동 fallback 필수

### 문제 5: GitHub Pages CDN 캐시 문제
- **상황**: gh-pages에 파일을 올려도 JS가 404로 캐시됨
- **원인**: GitHub Pages CDN이 이전 404 응답을 캐시해서 새 파일이 와도 404 반환
- **해결**: Vercel 배포로 전환 (파일명이 content hash 기반이라 캐시 문제 없음)
- **판단 기준**: "어디에 배포할 것인가?" → Vercel이 더 안정적

---

## 5. 선택의 기로 — 비교 및 선정 이유

### 선택 1: 라우터 타입

| 옵션 | 설명 | 장점 | 단점 |
|------|------|------|------|
| **HashRouter** (선택) | URL에 # 사용 (#/items) | 정적 호스팅에서 100% 동작 | URL이 예쁘지 않음 |
| BrowserRouter | 일반 URL (/items) | URL이 깔끔 | 서버 설정 필요 (정적 호스팅에서 404) |
| createBrowserRouter | React Router 7 신기능 | 최신 기능 | 정적 호스팅 미지원 |

**선정 이유**: Vercel/GitHub Pages 등 정적 호스팅에서 확실하게 동작해야 함. HashRouter는 어떤 호스팅에서든 작동.

**트레이드오프**: URL에 #이 들어가서 예쁘지 않음. 하지만 "작동하지 않는 예쁜 URL"보다 "작동하는 # URL"이 낫다.

### 선택 2: 백엔드 (BaaS)

| 옵션 | 설명 | 장점 | 단점 |
|------|------|------|------|
| **Supabase** (선택) | PostgreSQL 기반 BaaS | SQL 지식 재사용, 오픈소스 | 학습 곡선 |
| Firebase | Google BaaS | 설정 간단 | 전용 쿼리 문법, 벤더 종속 |

**선정 이유**: PostgreSQL 기반이라 SQL 지식을 그대로 쓸 수 있고, 관계형 데이터에 적합. 과제에서 "복잡한 관계 설계는 필수 아님"이지만 추후 확장 시 RDB가 유리.

**감내**: Supabase 설정이 Firebase보다 약간 복잡. 하지만 학습 가치가 더 큼.

### 선택 3: 상태 처리 방식

| 옵션 | 설명 | 장점 | 단점 |
|------|------|------|------|
| **StateView 통합** (선택) | 로딩/에러/빈/정상을 하나의 컴포넌트에서 분기 | 중복 제거, 일관성 | 컴포넌트가 약간 복잡 |
| 각 페이지에 직접 분기 | if(loading) return ... if(error) return ... | 단순 | 코드 중복 |

**선정 이유**: 모든 페이지에서 동일한 로딩/에러/빈 UI를 보여주려면, 분기 로직을 한 곳에 모아야 함. StateView가 그 역할.

**트레이드오프**: StateView 컴포넌트를 이해해야 함. 하지만 중복 제거가 더 큰 이익.

### 선택 4: 커스텀 훅 분리 여부

| 옵션 | 설명 | 장점 | 단점 |
|------|------|------|------|
| **훅으로 분리** (선택) | useItems/useItem 별도 파일 | 재사용, 관심사 분리 | 파일 수 증가 |
| 페이지 내부에 직접 작성 | useState/useEffect를 페이지에 직접 | 파일 수 적음 | 중복, 수정 시 여러 곳 변경 |

**선정 이유**: 목록 페이지와 상세 페이지에서 같은 데이터 로직이 필요. 훅으로 분리하면 한 곳에서 관리.

**감내**: 파일이 하나 더 생김. 하지만 유지보수성이 훨씬 좋음.

---

## 6. 사전평가 결과 및 동료평가 대비

### 사전평가: 12/15 (80%) — 시도 3/3 소진

### FAIL 3개 → 동료평가 대비

| # | FAIL 항목 | 보완 상태 | 평가 시 답변 |
|---|-----------|-----------|-------------|
| #5 | 배포 URL | ✅ https://b4-2.vercel.app/ | 배포 URL 열어서 CRUD 실시간 데모 |
| #10 | props vs state | ✅ README에 섹션 추가 | README "props vs state" 섹션 보여주기 |
| #15 | Supabase 선택 이유 | ✅ README에 섹션 추가 | README "Supabase 선택 이유" 섹션 보여주기 |

---

## 7. 평가 시 예상 질문과 답변

### Q1. "라우팅 → 컴포넌트 → 상태 → 이벤트 → 렌더링 흐름을 설명해주세요"
**답**: "새 아이템 등록"을 예로 들면:
1. **라우팅**: 사용자가 /items/new 접속 → ItemNewPage 렌더링
2. **컴포넌트**: ItemNewPage가 useItems 훅 호출 → ItemForm 렌더링
3. **상태**: 사용자가 폼 입력 → ItemForm 내부 useState로 title/content 변경
4. **이벤트**: "저장" 버튼 클릭 → validate() → onSubmit 호출
5. **렌더링**: addItem() → db.insert() → fetchItems() → setItems() → 목록 페이지로 이동

### Q2. "props와 state의 차이가 뭔가요?"
**답**: 
- **props**는 부모가 자식에게 전달하는 읽기 전용 데이터. 예: `<ItemCard item={item} onDelete={setConfirmId} />`에서 item과 onDelete는 props
- **state**는 컴포넌트 내부에서 관리하는 변경 가능한 데이터. 예: useItems 훅 내부의 items, loading, error

### Q3. "왜 HashRouter를 썼나요?"
**답**: 정적 호스팅(Vercel, GitHub Pages)에서 BrowserRouter는 서버 설정이 필요한데, HashRouter는 # 이후의 경로를 클라이언트에서만 처리하므로 서버 설정 없이 100% 동작합니다. URL에 #이 들어가지만, "작동하지 않는 예쁜 URL"보다 "작동하는 # URL"이 낫다고 판단했습니다.

### Q4. "커스텀 훅을 왜 분리했나요?"
**답**: 4가지 이유가 있습니다:
1. **재사용성**: 목록 페이지와 삭제 후 갱신 등 여러 곳에서 동일 데이터 로직 필요
2. **관심사 분리**: 컴포넌트는 "어떻게 보여줄까", 훅은 "어떻게 가져올까" 분리
3. **테스트 용이성**: 데이터 로직만 독립적으로 테스트 가능
4. **상태 일원화**: loading/error/data 상태를 한 곳에서 관리

### Q5. "useEffect가 언제 실행되나요?"
**답**: 컴포넌트가 마운트될 때(처음 화면에 나타날 때) 1회 실행되고, 의존성 배열의 값이 변경될 때 재실행됩니다. useItems에서는 `[fetchItems]`를 의존성으로 넣었고, fetchItems는 useCallback으로 메모이제이션해서 불필요한 재실행을 막았습니다.

### Q6. "8개 컴포넌트를 어떤 기준으로 나눴나요?"
**답**: 단일 책임 원칙과 재사용성 기준입니다:
- Layout: 모든 페이지 공통 뼈대 → 중복 제거
- LoadingSpinner/ErrorBanner/EmptyState: 상태 UI를 일관되게 → 모든 페이지에서 동일 UX
- StateView: 로딩/에러/빈/정상 4분기를 하나로 통합 → 분기 로직 중복 제거
- ItemCard: 목록에서 반복 → 단일 책임 (1개 아이템 표시)
- ItemForm: 등록/수정에서 동일 폼 → 코드 중복 제거
- ConfirmDialog: 삭제 확인 → 재사용 가능한 모달

### Q7. "Supabase를 왜 선택했나요?"
**답**: 4가지 이유:
1. PostgreSQL 기반 — SQL 지식을 그대로 재사용 가능
2. 오픈소스 — 자체 호스팅 가능, 벤더 종속 위험 적음
3. 관계형 데이터 — items 테이블 구조가 RDB에 적합
4. JavaScript SDK — 한 패키지로 모든 기능

연동 시 어려움: 평가 환경에서 .env가 없으면 앱이 크래시하는 문제 → LocalStorage fallback으로 해결

### Q8. "로딩/에러/빈 상태를 어떻게 처리했나요?"
**답**: StateView 공통 컴포넌트로 모든 페이지에서 동일하게 처리합니다:
- loading → LoadingSpinner (스피너 + "불러오는 중…")
- error → ErrorBanner (⚠️ + 에러 메시지 + "다시 시도" 버튼)
- 빈 데이터 → EmptyState (📭 + "표시할 데이터가 없습니다.")
- 정상 → children으로 실제 콘텐츠 렌더링

### Q9. "상태 변경이 화면 변화로 이어지는 지점을 3군데 설명해주세요"
**답**:
1. **로딩 → 데이터 수신**: useItems에서 setItems(data) → StateView가 ItemCard 리스트 렌더링
2. **폼 입력 → 버튼 활성화**: ItemForm에서 setTitle(e.target.value) → 입력 필드에 값 표시, 에러 해제
3. **삭제 → 목록 갱신**: deleteItem(id) → setItems(prev => prev.filter(...)) → 해당 ItemCard가 즉시 사라짐

### Q10. "배포 URL에서 CRUD가 동작하나요?"
**답**: 네, https://b4-2.vercel.app/에서 동작합니다. Supabase 환경변수가 없으면 LocalStorage fallback으로 CRUD가 동작합니다. Vercel 대시보드에서 수동 재배포 후 최신 코드가 반영됩니다.
