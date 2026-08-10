# 추론 기록 #04: Supabase + LocalStorage 듀얼 모드 설계

## 질문: Supabase를 선택한 이유와 연동 어려움

### Supabase 선택 이유

| 기준 | Supabase | Firebase |
|------|----------|----------|
| DB | PostgreSQL (관계형) | Firestore (문서형) |
| 쿼리 | SQL (select/insert/update/delete) | 전용 API |
| 오픈소스 | ✅ 자체 호스팅 가능 | ❌ |
| 학습 | SQL 지식 재사용 | 전용 쿼리 문법 학습 |

**선택 이유**: PostgreSQL 기반이라 SQL 지식을 그대로 쓸 수 있고, 관계형 데이터에 적합. 과제에서 "복잡한 관계 설계는 필수 아님"이라 했지만, 추후 확장 시 RDB가 유리.

### 연동 어려움 + 해결

**문제 1: 평가 환경에서 Supabase 접근 불가**
- 평가자가 로컬에서 실행할 때 .env가 없으면 앱이 크래시
- 해결: `isSupabaseConfigured` 플래그로 분기 → LocalStorage fallback

**문제 2: 환경 변수 노출 위험**
- Vite는 `VITE_` 접두어가 붙은 변수만 클라이언트에 노출
- 해결: `.env` + `.gitignore` + 배포 시 대시보드에서 별도 등록

**문제 3: Supabase와 LocalDB 인터페이스 불일치**
- Supabase: `{ data, error }` 구조 / LocalDB: 직접 return
- 해결: `lib/api.js`에서 추상화 — 두 데이터 소스를 동일한 인터페이스로 통일

### 듀얼 모드 구조

```
hooks/useItems.js
    ↓ 호출
lib/api.js (추상화 계층)
    ↓ 분기
    ├── Supabase가 설정됨 → supabaseClient.js → Supabase
    └── Supabase 미설정   → localDB.js        → LocalStorage
```

`api.js`가 분기하기 때문에 훅은 데이터 소스를 알 필요가 없다. Supabase를 쓸지 LocalStorage를 쓸지 `api.js` 한 곳에서 결정.

### 응용
- 다른 BaaS로 교체: `api.js`에 새 데이터 소스 추가 + 분기
- 오프라인 지원: LocalDB를 IndexedDB로 교체하여 더 큰 데이터 처리
- 테스트 환경: 테스트 시 항상 LocalDB 사용하도록 강제
