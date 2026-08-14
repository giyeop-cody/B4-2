# ISSUE-022: 공개 조회와 로그인 사용자 쓰기 권한 연결

- 상태: 구현·로컬 검사·원격 이슈 생성 완료 / 원격 RLS·배포 검증 대기
- GitHub Issue: <https://github.com/giyeop-cody/B4-2/issues/22>
- 관련 브랜치: `feature/authenticated-item-writes`
- 관련 PR: 생성 후 URL 기록
- 날짜: 2026-08-14

## 문제

Supabase Auth 로그인·프로필은 구현되어 있었지만 아이템 CRUD 권한과 연결되지 않았다. 원격 배포에서는 비로그인 사용자도 등록·수정·삭제할 수 있었고, 인증 보너스가 핵심 데이터 흐름과 따로 움직였다.

## 목표

- 비로그인 사용자: 목록·상세 조회 가능
- 비로그인 사용자: 등록 CTA 클릭 시 로그인 화면으로 이동
- 비로그인 사용자: 수정·삭제 UI 비노출
- 로그인 사용자: 등록·수정·삭제, 프로필, 로그아웃 가능
- 보호 라우트: `/items/new`, `/items/:id/edit`, `/profile`
- 데이터베이스: 공개 SELECT, `authenticated` INSERT/UPDATE/DELETE
- 작성자별 소유권은 이번 범위에서 제외
- 명시적 LocalStorage 학습 모드는 Supabase 계정 없이 기존 CRUD 연습 유지

## 선택지와 결정

| 선택지 | 장점 | 단점 | 결정 |
|---|---|---|---|
| Auth 제거 | 필수 CRUD 시연이 단순함 | 이미 구현한 보너스와 학습 기록이 사라짐 | 제외 |
| 모든 CRUD 공개 | 계정 없이 검사 쉬움 | 누구나 데이터 변경 가능 | 제외 |
| 공개 조회 + 로그인 쓰기 | 조회 접근성과 쓰기 안전성의 균형 | 실제 계정 기반 E2E가 추가로 필요 | 선택 |
| 작성자 소유권 | 가장 세밀함 | `user_id`, 데이터 이관, 정책 복잡도 증가 | 이번 범위 제외 |

## 구현

- `src/lib/permissions.js`: 로그인 사용자 또는 명시적 LocalStorage 학습 모드의 쓰기 가능 여부 판단
- `src/App.jsx`, `ProtectedRoute.jsx`: 등록·수정·프로필 라우트 보호
- 목록: 익명 CTA를 `로그인 후 등록`으로 표시하고 redirect 포함 로그인 경로 제공
- 목록·상세: 익명 사용자에게 수정·삭제 UI 미제공
- `src/lib/api.js`: Supabase INSERT/UPDATE/DELETE 직전 실제 세션 확인
- `supabase/policies-authenticated-writes.sql`: 공개 SELECT와 authenticated 쓰기 정책
- 배포 E2E: 익명 권한과 로그인 CRUD를 서로 다른 검사로 분리
- 원격 API CRUD 스크립트: 이메일·비밀번호로 얻은 로그인 access token 사용

## 여러 겹으로 막은 이유

1. UI 숨김은 정상 사용자의 실수를 줄인다.
2. 보호 라우트는 주소 직접 입력을 처리한다.
3. API 세션 검사는 앱 코드의 mutation을 한 번 더 막는다.
4. RLS는 직접 HTTP 요청도 데이터베이스에서 최종 거절한다.

앞의 세 단계만으로는 데이터 보안이 완성되지 않는다. RLS SQL을 Dashboard에서 실제 실행해야 한다.

## 트러블슈팅: 기존 공개 정책을 남기면 제한되지 않음

PostgreSQL의 허용 정책은 여러 개가 있으면 OR 방식으로 결합될 수 있다. `authenticated` 쓰기 정책을 추가해도 예전 `anon` 쓰기 정책이 남아 있으면 공개 쓰기가 계속 허용될 수 있다.

### 처리

SQL이 `public.items`의 기존 정책을 먼저 제거하고 목적이 분명한 네 정책을 다시 만들도록 했다. 이 방식은 기존 사용자 정의 정책도 제거할 수 있으므로 Dashboard 실행 전 정책 목록 확인과 검토가 필요하다.

## 로컬 검증

- [x] `npm test`: 10개 파일, 28/28 통과
- [x] `npm run test:e2e`: 로컬 2개 통과, 배포 전용 2개 skip
- [x] `npm run build`: 통과
- [x] `npm audit --omit=dev`: 취약점 0개
- [x] `git diff --check`: 통과

## 외부 작업 체크리스트

다음 항목은 파일 작성만으로 완료되지 않는다.

- [x] GitHub Issue #22 생성 및 이 문서에 URL 기록
- [ ] Supabase Dashboard에서 현재 정책 확인·백업
- [ ] `supabase/policies-authenticated-writes.sql` 실제 실행
- [ ] 익명 SELECT 성공 확인
- [ ] 익명 INSERT/UPDATE/DELETE 거절 확인
- [ ] 확인된 로그인 계정으로 원격 CRUD 확인
- [ ] 기능 브랜치 push 및 PR 생성
- [ ] `learning`에 기능·테스트·학습 문서 병합
- [ ] `eval`에 평가용 요약 병합
- [ ] PR 리뷰 후 main 병합
- [ ] Vercel Production 성공 확인
- [ ] 배포에서 익명 조회·쓰기 UI 차단 확인
- [ ] 배포에서 로그인 CRUD·프로필·로그아웃 확인

## 완료 기준

코드 병합만이 아니라 RLS 적용 증빙, Vercel 배포 성공, 익명 권한 검사, 확인된 계정의 쓰기 검사까지 있어야 전체 완료다. 외부 계정이나 Dashboard 권한이 없어 실행하지 못한 항목은 미완료로 남긴다.
