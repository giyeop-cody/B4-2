# B4-2 동료평가 구두 답변

## Q1. 무엇을 만들었나요?

React로 학습 아이템을 원격 Supabase에 등록·조회·수정·삭제하는 SPA를 만들었습니다. 로그인 사용자 Context, 성능 메모이제이션, Supabase Auth 보호 프로필도 보너스로 추가했습니다.

## Q2. 라우트는 몇 개인가요?

`/`, `/items`, `/items/new`, `/items/:id`, `/items/:id/edit`, `/login`, `/profile`, `*`까지 8개입니다. HashRouter라 배포 주소는 `/#/items` 모양입니다.

## Q3. 왜 HashRouter인가요?

Vercel과 정적 호스팅에서 서버가 모든 경로를 index.html로 바꾸지 않아도 동작하기 때문입니다. 일반 주소보다 배포가 단순하지만 URL에 `#`이 보이는 단점이 있습니다.

## Q4. 컴포넌트를 왜 나눴나요?

반복 사용과 한 가지 책임을 기준으로 나눴습니다. 예를 들어 ItemForm은 등록/수정이 공유하고, StateView는 모든 페이지의 로딩·오류·빈 상태를 같은 방식으로 처리합니다. 현재 재사용 컴포넌트는 11개입니다.

## Q5. props와 state 차이는 무엇인가요?

props는 부모가 자식에게 주며 자식이 직접 바꾸지 않는 값입니다. state는 컴포넌트나 훅이 기억하고 setter로 바꾸는 값입니다. `ItemCard`의 `item`은 props, 폼의 `title`은 state입니다.

## Q6. 상태를 어디에 뒀나요?

폼 입력은 ItemForm, 목록은 useItems, 상세는 useItem, 제출·삭제 중은 해당 페이지, 로그인 사용자는 여러 화면이 쓰므로 AuthContext에 뒀습니다. 필요한 가장 가까운 공통 부모나 훅이 상태를 소유하게 했습니다.

## Q7. useEffect는 언제 실행되나요?

렌더링 뒤 실행됩니다. useItems는 고정된 fetchItems가 준비되면 처음 목록을 요청하고, useItem은 URL id가 바뀌면 새 상세를 요청합니다. 의존성 배열은 effect가 사용하는 값을 적어 실행 조건을 나타냅니다.

## Q8. 비동기 네 상태는 어떻게 처리했나요?

loading이면 LoadingSpinner, error면 ErrorBanner, 데이터가 없으면 EmptyState, 있으면 실제 내용을 StateView가 보여줍니다. 저장·삭제 실패는 mutationError로 따로 두어 기존 화면을 없애지 않습니다.

## Q9. 이벤트부터 렌더링까지 예를 들어주세요.

삭제 버튼 → confirmId state 변경 → 대화상자 렌더 → 확인 클릭 → db.remove → Supabase 삭제 → setItems로 배열에서 제거 → React가 카드 목록을 다시 그립니다.

## Q10. Supabase를 왜 골랐나요?

PostgreSQL 기반이라 표와 SQL 학습으로 이어지고 단일 items 표에 잘 맞았습니다. Firebase보다 설정은 낯설었지만 관계형 구조를 익히는 장점이 더 크다고 판단했습니다.

## Q11. LocalStorage는 왜 남겼나요?

인터넷 없는 UI 학습용입니다. 예전 자동 fallback은 원격 실패를 숨겨서 없앴고, 지금은 `VITE_ALLOW_LOCAL_DB=true`를 직접 켠 경우에만 동작합니다. 헤더 배지가 저장 위치를 보여줍니다.

## Q12. 전역 상태 보너스는 무엇인가요?

AuthContext가 user/loading/sessionError와 로그인·가입·로그아웃 함수를 제공합니다. 헤더, 로그인, 프로필, ProtectedRoute가 같은 사용자 상태를 읽습니다.

## Q13. 성능 최적화는 무엇인가요?

필터 결과와 카테고리 개수를 useMemo로 계산하고, ItemCard를 React.memo로 감쌌습니다. 카드에 주는 삭제 함수는 useCallback으로 참조를 고정했습니다. 작은 목록에서는 이득이 작을 수 있어 실제 서비스는 측정이 먼저입니다.

## Q14. 인증과 보호 범위는 어디까지인가요?

Supabase 이메일 로그인/가입을 구현했습니다. 목록·상세는 공개하고 등록·수정·삭제는 로그인 사용자만 할 수 있습니다. `/items/new`, `/items/:id/edit`, `/profile`은 보호 라우트이며, 최종 데이터 권한은 RLS로도 확인했습니다. 이번 범위에서는 작성자별 소유권을 추가하지 않았습니다.

## Q15. 무엇으로 검증했나요?

Vitest/Testing Library 28개, 로컬 Playwright 2개, 배포 익명 E2E 1개, 제품 빌드, npm audit로 검사했습니다. RLS는 익명 조회 200과 쓰기 3종 401, 로그인 사용자의 실제 CRUD로 확인했습니다. 인증 이메일 redirect는 코드·Dashboard URL·실제 새 이메일 Production 복귀까지 확인했습니다. 각 트러블은 docs/issues에 남겼습니다.
