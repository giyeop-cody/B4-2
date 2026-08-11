# B4-2 동료평가 시나리오

## 1. 학습
- 컴포넌트 (화면의 조각, JSX 반환)
- props vs state (부모→자식 vs 내부 데이터)
- useEffect (화면 그려진 후 실행)
- 라우팅 (HashRouter, 6개 라우트)
- 4상태 (StateView 통합)

## 2. 고찰
- "상태를 어디에 둘지" → 상향 배치 (useItems 훅이 소유)
- "언제 리렌더링" → state 바뀌면 해당 컴포넌트+자식

## 3. 시도
- Vite 6 + React 18, pages/5개 + components/8개 + hooks/2개
- HashRouter, Supabase + LocalStorage fallback
- StateView 4상태 통합

## 4. 수정
- BrowserRouter → HashRouter (정적 호스팅)
- children → Outlet (react-router-dom 6)
- Supabase만 → LocalStorage fallback 추가

## 5. 선택과 선정
- HashRouter vs BrowserRouter: HashRouter (100% 동작)
- Supabase vs Firebase: Supabase (PostgreSQL, SQL 재사용)
- StateView 통합 vs 페이지별 if: 통합 (일관성)

## 6. 트러블슈팅
- "목록 보이는데 버튼 안 됨" → children→Outlet
- Supabase 없을 때 크래시 → isSupabaseConfigured fallback
- Vercel 자동 재배포 안 됨 → 수동 Redeploy

## 7. 평가 예상 질문
- 컴포넌트 쪼갠 기준? → 재사용성, 단일 책임
- props vs state? → 부모 전달 vs 내부 관리
- useEffect 실행 시점? → 화면 그려진 후, 의존성 배열
- 전체 흐름? → 라우팅→컴포넌트→상태→이벤트→렌더링
