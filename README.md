# B4-2: 버튼 누르면 화면이 스르륵 바뀌는 요즘 웹사이트 만들기

> **배포 URL**: https://b4-2.vercel.app/
> **GitHub**: https://github.com/giyeop-cody/B4-2

> React 18 + React Router 6 (HashRouter) + Supabase(LocalStorage fallback) 기반 CRUD 웹앱

## 📌 과제 정보

| 항목 | 내용 |
|------|------|
| **과목** | 웹 기초와 프론트엔드 (Web Core & Front-end) |
| **난이도** | ★★☆ (Lv.2) |
| **학습 시간** | 80분 |
| **필수 여부** | 🔵 선택 |
| **과제 번호** | 185011 |

---

## 🚀 실행 방법

### 로컬 실행 (Supabase 없이 LocalStorage fallback)
```bash
npm install
npm run dev
```
> .env 없이도 LocalStorage 기반으로 CRUD가 동작합니다.

### Supabase 연결 시
```bash
cp .env.example .env
# .env에 Supabase URL과 Key 입력
npm run dev
```

### 배포 (Vercel)
```bash
npm run build
# dist/ 폴더 배포
# Vercel 대시보드에서 Environment Variables 등록:
#   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

> **HashRouter 사용**: 정적 호스팅(Vercel, GitHub Pages)에서 클라이언트 사이드 라우팅이 100% 동작하도록 HashRouter를 사용합니다. URL이 `/#/items` 형태가 됩니다.

---

## 🏗️ 프로젝트 구조

```
src/
├── pages/                      ← 라우트 단위 페이지 (5개)
│   ├── ItemListPage.jsx            (/items — 목록 조회 + 삭제)
│   ├── ItemDetailPage.jsx          (/items/:id — 상세 조회 + 삭제)
│   ├── ItemNewPage.jsx             (/items/new — 등록)
│   ├── ItemEditPage.jsx            (/items/:id/edit — 수정)
│   └── NotFoundPage.jsx            (/* — 404 Not Found)
├── components/                 ← 재사용 컴포넌트 (8개)
│   ├── Layout.jsx                  (1. 공통 레이아웃 — 헤더/내용/푸터 통합)
│   ├── LoadingSpinner.jsx          (2. 로딩 공통 UI)
│   ├── ErrorBanner.jsx             (3. 에러 공통 UI)
│   ├── EmptyState.jsx              (4. 빈 데이터 공통 UI)
│   ├── StateView.jsx               (5. 상태 뷰 통합 컴포넌트)
│   ├── ItemCard.jsx                (6. 개별 아이템 카드)
│   ├── ItemForm.jsx                (7. 등록/수정 공용 폼 — 검증 포함)
│   └── ConfirmDialog.jsx           (8. 삭제 확인 모달)
├── hooks/                      ← 커스텀 훅 (2개)
│   ├── useItems.js                 (목록 조회/추가/삭제)
│   └── useItem.js                  (단일 조회/수정)
├── lib/                        ← 설정/유틸 (3개)
│   ├── supabaseClient.js           (Supabase 클라이언트)
│   ├── localDB.js                  (LocalStorage fallback)
│   └── api.js                      (데이터 소스 추상화)
├── App.jsx                     ← 라우팅 정의 (HashRouter, 6개 라우트)
├── main.jsx                    ← 진입점
└── index.css                   ← 전역 스타일
```

### 폴더 분리 이유 (항목 2-2)
- **pages/**: 라우트 단위 — 각 파일이 하나의 URL에 대응
- **components/**: 재사용 단위 — 여러 페이지에서 공유하는 UI 조각
- **hooks/**: 로직 단위 — 데이터 처리 로직을 UI에서 분리
- **lib/**: 설정 단위 — 외부 서비스 클라이언트 및 유틸

### 컴포넌트 분리 기준 (항목 2-3)
| 컴포넌트 | 분리 기준 |
|----------|-----------|
| Layout | 모든 페이지 공통 레이아웃 (헤더+내용+푸터) → 중복 제거 |
| LoadingSpinner | 로딩 상태 → 모든 페이지에서 일관된 UX (항목 2-4) |
| ErrorBanner | 에러 상태 → 모든 페이지에서 일관된 UX (항목 2-4) |
| EmptyState | 빈 데이터 → 모든 페이지에서 일관된 UX (항목 2-4) |
| StateView | 로딩/에러/빈/정상 4분기 통합 → 상태 분기 중복 제거 |
| ItemCard | 목록에서 반복 렌더링 → 단일 책임 (1개 아이템 표시) |
| ItemForm | 등록/수정에서 동일한 폼 → 코드 중복 제거 + 검증 포함 |
| ConfirmDialog | 삭제 전 확인 → 재사용 가능한 모달 패턴 |

---

## 🗺️ 라우트 (6개, 항목 1-1)

| # | 라우트 | 페이지 | 기능 |
|---|--------|--------|------|
| 1 | `/` | ItemListPage | 목록 (index 라우트) |
| 2 | `/items` | ItemListPage | 목록 조회 (R) |
| 3 | `/items/new` | ItemNewPage | 등록 (C) |
| 4 | `/items/:id` | ItemDetailPage | 상세 조회 (R) |
| 5 | `/items/:id/edit` | ItemEditPage | 수정 (U) |
| 6 | `*` | NotFoundPage | 404 Not Found |

> 삭제(D)는 목록 페이지와 상세 페이지에서 ConfirmDialog를 통해 수행

---

## 🧩 커스텀 훅 분리 이유 (항목 2-1, 2-5)

### useItems() — 목록 조회/추가/삭제
1. **재사용성**: 목록 페이지와 삭제 후 갱신 등 여러 곳에서 동일 데이터 로직 필요
2. **관심사 분리**: UI(컴포넌트)와 데이터 로직(훅) 분리 → 컴포넌트는 렌더링에 집중
3. **테스트 용이성**: 데이터 로직만 독립적으로 테스트 가능
4. **상태 관리 일원화**: loading/error/data 상태를 한 곳에서 관리

### useItem() — 단일 조회/수정
- 상세 페이지와 수정 페이지에서 공통으로 사용하는 단일 아이템 로직

---

## 🔄 상태 처리 패턴 (항목 1-3, 2-4, 3-3)

모든 페이지에서 `StateView` 공통 컴포넌트를 통해 일관된 상태 처리:

```jsx
<StateView loading={loading} error={error} data={data} onRetry={refetch}>
  {(data) => <ItemList data={data} />}
</StateView>
```

| 상태 | 컴포넌트 | 표시 |
|------|----------|------|
| 로딩 | LoadingSpinner | 스피너 + "불러오는 중…" |
| 에러 | ErrorBanner | ⚠️ + 에러 메시지 + 다시 시도 버튼 |
| 빈 데이터 | EmptyState | 📭 + "표시할 데이터가 없습니다." |
| 정상 | children | 실제 콘텐츠 |

---

## 🛡️ 보안

- `.env` 파일에 API Key 저장
- `.gitignore`에 `.env` 포함
- GitHub에 API Key 푸시하지 않음
- 배포 시 Vercel 대시보드에서 Environment Variables 별도 등록

---

## 📖 평가 답변 준비: props vs state (항목 3-1)

### 개념 구분

| 개념 | 정의 | 변경 가능성 | 본 프로젝트 예시 |
|------|------|-------------|------------------|
| **props** | 부모 → 자식으로 전달하는 데이터 | 읽기 전용 (자식이 변경 불가) | `<ItemCard item={item} onDelete={setConfirmId} />` — item, onDelete는 부모가 전달한 props |
| **state** | 컴포넌트 내부에서 관리하는 데이터 | 변경 가능 (setState로 변경) | `useItems()` 내부의 `items`, `loading`, `error` — 훅이 직접 관리 |

### 상태 소유 위치 (데이터 흐름 규칙)

| 상태 종류 | 소유 위치 | 이유 |
|-----------|-----------|------|
| 목록 데이터 (items) | `useItems` 훅 | 여러 페이지에서 공유 + 데이터 로직 집중 |
| 단일 아이템 (item) | `useItem` 훅 | 상세/수정 페이지에서 공유 |
| 폼 입력값 (title, content) | `ItemForm` 컴포넌트 | 해당 컴포넌트 내부에서만 사용 |
| 삭제 확인 (confirmId) | `ItemListPage` / `ItemDetailPage` | 해당 페이지에서만 사용 |
| 제출 중 (submitting) | 각 페이지 컴포넌트 | 페이지별 독립 관리 |

### 데이터 흐름 방향

```
부모 (page)                자식 (component)
  │                          │
  │ ──── props (하향) ────→ │  item, onSubmit, submitting
  │                          │
  │ ←── callback (상향) ──── │  onSubmit(), onDelete()
  │                          │
  state는 훅 또는 컴포넌트 내부에서 관리
```

---

## 📖 평가 답변 준비: Supabase 선택 이유 + 연동 (항목 4-2)

### Supabase를 선택한 이유

1. **PostgreSQL 기반**: SQL 지식을 그대로 재사용 가능. Firebase의 전용 쿼리 문법을 새로 배울 필요 없음
2. **오픈소스**: 자체 호스팅 가능하여 벤더 종속 위험 적음
3. **관계형 데이터**: items 테이블에 id, title, content, category, created_at 구조가 RDB에 적합
4. **JavaScript SDK**: `@supabase/supabase-js` 한 패키지로 모든 기능 제공

### 연동 시 겪은 어려움과 해결

| 문제 | 해결 |
|------|------|
| 평가 환경에서 .env 없으면 앱 크래시 | `isSupabaseConfigured` 플래그로 LocalStorage fallback 자동 전환 |
| Supabase와 LocalDB 인터페이스 불일치 | `lib/api.js`에서 추상화 — `{ data, error }` 구조를 통일된 인터페이스로 래핑 |
| 환경 변수 노출 위험 | `VITE_` 접두어 + `.gitignore` + 배포 시 대시보드 별도 등록 |
| RLS(Row Level Security) 설정 | 과제에서 "고급 기능은 필수 아님" → 기본 정책만 설정 |

### 인증 사용 여부

본 프로젝트에서는 **인증을 사용하지 않음**. 과제 요구사항이 CRUD + 라우팅 + 상태 관리에 집중되어 있고, "백엔드 고급 기능(권한/RLS/Rules)은 필수가 아님"으로 명시되어 있기 때문.

### Supabase 설정 방법

```sql
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT '일반',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON items FOR ALL USING (true);
```
