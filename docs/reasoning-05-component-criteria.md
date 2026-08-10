# 추론 기록 #05: 컴포넌트 분리 기준

## 질문: 8개 재사용 컴포넌트를 어떤 기준으로 나눴는가?

### 분리 기준: 단일 책임 원칙 + 재사용성

각 컴포넌트는 **하나의 명확한 역할**만 갖는다. 역할이 겹치면 분리하고, 겹치지 않으면 합친다.

### 8개 컴포넌트 분석

| # | 컴포넌트 | 역할 | 분리 기준 | 재사용처 |
|---|----------|------|-----------|----------|
| 1 | Layout | 페이지 공통 뼈대 (헤더+내용+푸터) | 모든 페이지가 동일 구조 → 중복 제거 | 모든 페이지 |
| 2 | LoadingSpinner | 로딩 시 회전 애니메이션 | 상태 UI를 일관되게 → 항목 1-3, 2-4 | StateView 내부 |
| 3 | ErrorBanner | 에러 메시지 + 재시도 버튼 | 상태 UI를 일관되게 → 항목 1-3, 2-4 | StateView 내부 |
| 4 | EmptyState | 빈 데이터 안내 + 액션 링크 | 상태 UI를 일관되게 → 항목 1-3, 2-4 | StateView 내부 |
| 5 | StateView | 로딩/에러/빈/정상 4분기 통합 | 상태 분기 로직을 한 곳으로 → 중복 제거 | 모든 페이지 |
| 6 | ItemCard | 1개 아이템 표시 (제목/내용/카테고리) | 목록에서 반복 → 단일 책임 | ItemListPage |
| 7 | ItemForm | 등록/수정 공용 폼 (검증 포함) | 등록과 수정이 동일 폼 → 중복 제거 | NewPage, EditPage |
| 8 | ConfirmDialog | 삭제 확인 모달 | 확인 다이얼로그 패턴 재사용 | ListPage, DetailPage |

### 핵심 설계 결정

**StateView를 만든 이유**:
로딩/에러/빈 상태 분기 코드가 모든 페이지에서 반복되었다:

```jsx
// 분리 전 (모든 페이지에 이 코드가 반복)
if (loading) return <LoadingSpinner />
if (error) return <ErrorBanner message={error} />
if (!data || data.length === 0) return <EmptyState />
return <div>{data.map(...)}</div>
```

이걸 StateView로 통합:

```jsx
// 분리 후 (한 줄)
<StateView loading={loading} error={error} data={data}>
  {(data) => <ItemList data={data} />}
</StateView>
```

**ItemForm을 등록/수정 공용으로 만든 이유**:
등록 폼과 수정 폼은 UI가 동일하고, 차이는 초기값(initialData) 유무뿐이다. props로 initialData를 전달하면 하나의 컴포넌트로 두 용도를 커버.

### 컴포넌트 분리 체크리스트 (응용용)
- [ ] 이 컴포넌트가 2곳 이상에서 쓰이는가? → 재사용성 있음
- [ ] 하나의 역할만 담당하는가? → 단일 책임
- [ ] 다른 컴포넌트와 역할이 겹치지 않는가? → 중복 없음
- [ ] props 인터페이스가 명확한가? → 재사용 가능

### 응용
- 새 도메인 추가 시: ItemCard → UserCard, ItemForm → UserForm 패턴 재사용
- 상태가 더 필요하면: StateView에 `isEmpty` prop 추가하여 커스텀 빈 상태 지원
