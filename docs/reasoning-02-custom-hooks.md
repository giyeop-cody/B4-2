# 추론 기록 #02: 커스텀 훅 분리

## 질문: useItems, useItem, useAuth를 훅으로 분리한 이유는?

### 문제 상황

훅을 분리하지 않았다면, ItemListPage 안에 모든 데이터 로직이 들어갔다:

```jsx
// 분리 전 (안티패턴)
function ItemListPage() {
  const [items, setItems] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // 30줄 이상의 fetch + 에러 처리 로직
  }, [])

  const handleAdd = async (data) => {
    // 20줄 이상의 insert + 갱신 로직
  }

  const handleDelete = async (id) => {
    // 15줄 이상의 delete + 갱신 로직
  }

  // 렌더링 (UI 코드)
  return <div>...</div>
}
```

이렇게 하면:
1. 상세 페이지에서도 단일 아이템 로직이 필요 → 비슷한 코드 중복
2. 데이터 로직이 수정되면 여러 페이지를 다 찾아서 고쳐야 함
3. UI 코드와 데이터 코드가 섞여서 읽기 어려움

### 해결: 훅으로 분리

```jsx
// 분리 후
function ItemListPage() {
  const { items, loading, error, refetch, deleteItem } = useItems()
  // UI 코드만 남음 — 깔끔
  return <div>...</div>
}
```

### 분리 이유 4가지

| # | 이유 | 구체적 효과 |
|---|------|-------------|
| 1 | **재사용성** | 목록 페이지 + 삭제 후 갱신 등 여러 곳에서 동일 훅 사용 |
| 2 | **관심사 분리** | 컴포넌트는 "어떻게 보여줄까", 훅은 "어떻게 가져올까" 각각 집중 |
| 3 | **테스트 용이성** | 훅만 떼어내서 데이터 로직 단위 테스트 가능 (renderHook) |
| 4 | **상태 일원화** | loading/error/data 상태 패턴을 한 곳에서 정의 → 모든 페이지가 동일 패턴 |

### 상태 관리 패턴 (항목 3-3)

데이터 훅은 조회 상태와 변경 상태를 구분한다:

```javascript
const [data, setData] = useState(null)       // 성공
const [loading, setLoading] = useState(true)  // 로딩
const [error, setError] = useState(null)      // 조회 실패
const [mutationError, setMutationError] = useState(null) // 등록·수정·삭제 실패
// 빈 상태: data !== null && data.length === 0 (컴포넌트에서 판단)
```

이 패턴을 훅에 넣었기 때문에, 각 페이지는 `loading ? <Spinner/> : error ? <Error/> : ...` 패턴을 StateView로 일원화할 수 있다.

### 응용
- 다른 도메인 추가 시: `useUsers()`, `usePosts()` 등 동일 패턴으로 훅 생성
- 페이지네이션 필요 시: 훅에 `page`, `perPage` 상태 추가
- 실시간 업데이트: Supabase Realtime 구독 로직을 훅에 추가
