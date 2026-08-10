# 추론 기록 #03: 상태 변경 → 화면 변화 흐름

## 질문: 상태 변경이 화면 변화로 이어지는 지점을 3군데 이상 설명하라

### 지점 ①: 로딩 → 데이터 수신 → 리스트 렌더링

**위치**: `useItems.js` + `ItemListPage.jsx`

```
훅 마운트 (useEffect)
  → setLoading(true)          ← 상태 변경 1
  → 화면: LoadingSpinner 표시

데이터 수신 (db.selectAll 완료)
  → setItems(data)            ← 상태 변경 2
  → setLoading(false)         ← 상태 변경 3
  → 화면: ItemCard 리스트 렌더링
```

코드에서 짚을 수 있는 지점:
- `useItems.js`: `setItems(data)` — null → array로 변경되면 StateView가 children을 렌더링
- `ItemListPage.jsx`: `<StateView>`가 `data`를 받아 `data.map(item => <ItemCard>)` 실행

### 지점 ②: 폼 입력 → 필수값 검증 → 버튼 활성화

**위치**: `ItemForm.jsx`

```
사용자가 제목 입력
  → setTitle(e.target.value)   ← 상태 변경
  → validate() 실행
  → errors.title = null         ← 상태 변경 (에러 해제)
  → 화면: 입력 필드 테두리 정상색으로 변경 + 에러 메시지 사라짐

제출 버튼 클릭
  → setSubmitting(true)         ← 상태 변경
  → 화면: 버튼 텍스트 "저장" → "저장 중…" + disabled
```

### 지점 ③: 삭제 → 목록 즉시 갱신

**위치**: `useItems.js` deleteItem + `ItemListPage.jsx`

```
ConfirmDialog에서 "삭제" 클릭
  → deleteItem(id) 호출
  → db.remove(id) 완료
  → setItems(prev => prev.filter(...))  ← 상태 변경
  → 화면: 해당 ItemCard가 목록에서 즉시 사라짐 (리렌더링)
```

### 지점 ④ (보너스): 에러 발생 → 에러 메시지 표시

**위치**: 모든 훅

```
API 호출 실패
  → setError(e.message)         ← 상태 변경
  → setLoading(false)
  → 화면: StateView가 ErrorBanner 렌더링 + "다시 시도" 버튼
```

### props vs state 정리 (항목 3-1)

| 개념 | 정의 | 본 프로젝트 예시 |
|------|------|------------------|
| **props** | 부모 → 자식으로 전달하는 읽기 전용 데이터 | `<ItemCard item={item} onDelete={setConfirmId} />` — item, onDelete는 props |
| **state** | 컴포넌트 내부에서 관리하는 변경 가능한 데이터 | `useItems()` 내부의 items, loading, error — 컴포넌트가 직접 변경 |

상태를 어디에 두었는가:
- **목록 데이터**: `useItems` 훅 (ItemListPage가 호출)
- **단일 아이템**: `useItem` 훅 (ItemDetailPage, ItemEditPage가 호출)
- **폼 입력값**: `ItemForm` 내부 useState (title, content, category, errors)
- **삭제 확인 모달**: `ItemListPage` / `ItemDetailPage`의 useState (confirmId, confirmOpen)
- **제출 중 상태**: 각 페이지의 useState (submitting)

### useEffect 실행 시점 + 의존성 배열 (항목 3-2)

```javascript
// useItems.js
useEffect(() => {
  fetchItems()
}, [fetchItems])  // ← 의존성 배열
```

- **실행 시점**: 컴포넌트 마운트 시 1회 + `fetchItems`가 변경될 때
- **의존성 배열 역할**: 배열 내 값이 변경될 때만 effect 재실행
- `fetchItems`는 `useCallback`으로 메모이제이션 → 의존성이 변경되지 않으면 1회만 실행
- 빈 배열 `[]`이면 마운트 시 1회만 실행 (여기서는 fetchItems를 넣어 안전하게)

### 응용
- 이 4지점 패턴은 모든 React CRUD 앱에 공통으로 적용
- 상태를 "어디에 둘까" 고민될 때: "누가 이 데이터를 쓰는가?" → 가장 가까운 공통 부모 또는 훅
