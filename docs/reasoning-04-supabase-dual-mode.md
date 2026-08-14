# 추론 기록 #04: Supabase + 명시적 LocalStorage 학습 모드

## 질문: Supabase를 선택한 이유와 연동 어려움

### Supabase 선택 이유

| 기준 | Supabase | Firebase |
|---|---|---|
| DB | PostgreSQL(관계형) | Firestore(문서형) |
| 쿼리 | SQL 개념 재사용 | 전용 API 학습 |
| 오픈소스 | 자체 호스팅 가능 | Google 서비스 중심 |

PostgreSQL 표가 `id/title/content/category` 구조에 알맞고 이후 SQL 학습과 이어져 Supabase를 골랐다.

## 처음 선택의 문제

처음에는 URL과 Key가 없으면 자동으로 LocalStorage를 사용했다. 로컬 실행이 편하다는 장점이 있었지만,
배포의 환경변수가 빠져도 CRUD가 성공한 것처럼 보여 **원격 DB 필수 조건을 숨길 수 있었다**.

## 비교와 최종 선택

| 선택 | 장점 | 단점 |
|---|---|---|
| Supabase만 사용 | 원격 조건이 분명함 | 인터넷 없는 UI 학습이 어려움 |
| 자동 LocalStorage 대체 | 언제나 화면이 열림 | 원격 실패를 숨김 |
| 명시적 로컬 학습 모드 | 두 목적을 구분 | 환경변수 하나가 늘어남 |

최종적으로 세 번째를 선택했다.

```text
hooks/useItems.js
    ↓
lib/api.js
    ↓
    ├── URL + Key 있음              → Supabase 원격
    ├── VITE_ALLOW_LOCAL_DB=true    → LocalStorage 학습
    └── 둘 다 아님                  → 설정 오류
```

Supabase 설정이 있으면 `VITE_ALLOW_LOCAL_DB=true`여도 원격을 먼저 사용한다. 헤더의 `DataSourceBadge`가 현재 위치를 보여준다.

## 연동 중 해결한 문제

1. `.env*` 전체를 Git에서 제외하고 `.env.example`만 허용했다.
2. `api.js`가 Supabase의 `{ data, error }`를 평범한 반환/throw 방식으로 바꿔 훅이 데이터 소스를 몰라도 되게 했다.
3. 없는 상세는 `.maybeSingle()`로 `null`을 받아 빈 상태로 표현했다.
4. 수정·삭제 대상이 없으면 성공처럼 보이지 않게 오류를 만들었다.
5. 새 `sb_publishable_...` 공개 키 형식도 원격 검사에서 사용할 수 있음을 확인했다.
6. 실제 원격 생성→조회→수정→삭제를 자동 검사하고 검사 행을 삭제했다.

## 인증과 데이터 권한은 다른 문제

Supabase Auth 로그인과 보호 프로필 라우트를 구현했지만, 필수 CRUD는 공개 데모 정책으로 동작한다.
화면 보호만으로 데이터가 보호되지는 않는다. 운영 서비스에서는 사용자별 RLS 정책을 추가해야 한다.
