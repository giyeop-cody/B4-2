# 추론 기록 #06: 전체 데이터 흐름 (라우팅 → 렌더링)

## 질문: 하나의 기능이 동작하기까지 라우팅 → 컴포넌트 → 상태 → 이벤트 → 렌더링이 어떻게 이어지는가?

### 예시: "새 아이템 등록" 기능의 전체 흐름

```
1. 라우팅 (React Router)
   사용자가 "/items/new" 방문
   → App.jsx의 라우트 매칭: { path: 'items/new', element: <ItemNewPage /> }
   → ItemNewPage 컴포넌트 렌더링

2. 컴포넌트 마운트 + 상태 초기화
   ItemNewPage 마운트
   → useItems() 호출 → items, loading, error, addItem 획득
   → useState: submitting = false
   → <ItemForm onSubmit={handleSubmit} submitting={submitting} /> 렌더링

3. 사용자 이벤트 (폼 입력 + 제출)
   사용자가 제목/내용 입력
   → ItemForm 내부 useState: title, content 변경
   → 화면: 입력 필드에 값 표시 (상태 → 렌더링)

   "저장" 버튼 클릭
   → ItemForm.validate() 실행
   → 필수값 비어있으면 errors 상태 설정 → 에러 메시지 표시
   → 검증 통과 시 onSubmit(props) 호출 → ItemNewPage.handleSubmit 실행

4. 비동기 데이터 처리
   handleSubmit:
   → setSubmitting(true) → 버튼 "저장 중…" + disabled
   → addItem(formData) 호출 → useItems의 addItem 실행
   → db.insert(data) → api.js → Supabase or LocalDB

5. 상태 변경 → 화면 변화
   insert 성공:
   → fetchItems() 재호출 → setItems(새 목록) → 목록 데이터 갱신
   → setSubmitting(false)
   → navigate('/items') → 라우팅 이동

   /items 페이지 진입:
   → ItemListPage 마운트 → useItems() → useEffect → fetchItems()
   → loading=true → LoadingSpinner
   → 데이터 수신 → setItems(data) → ItemCard 리스트 렌더링
   → 새로 등록한 아이템이 목록 상단에 표시
```

### 시각화

```
URL: /items/new
  ↓ (라우팅)
ItemNewPage (컴포넌트)
  ↓ (useItems 훅 호출)
useItems (상태: items, loading, error)
  ↓ (useEffect → db.selectAll)
api.js → Supabase/LocalDB
  ↓ (데이터 반환)
setItems(data) → StateView → ItemCard 렌더링 (렌더링)

사용자 입력 → ItemForm (상태: title, content, errors)
  ↓ (제출 이벤트)
handleSubmit → addItem() → db.insert()
  ↓ (insert 성공)
fetchItems() → setItems(갱신) → navigate('/items')
  ↓ (라우팅)
ItemListPage → 새 목록 렌더링
```

### 응용
- 이 흐름은 모든 CRUD 기능에 동일하게 적용:
  - 조회: 라우팅 → 마운트 → useEffect → fetch → 렌더링
  - 수정: 라우팅 → 기존 데이터 로드 → 폼 표시 → 제출 → update → 이동
  - 삭제: 버튼 클릭 → ConfirmDialog → deleteItem → 상태 갱신 → 리렌더링
- 다른 도메인(사용자, 게시판 등)도 동일 패턴으로 구현 가능
