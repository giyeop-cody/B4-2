# 2026-08-14 최종 실증 검사표

## 자동 검사

| 검사 | 결과 |
|---|---|
| `npm ci` | 통과 |
| `npm test` | 테스트 파일 10개, 테스트 28개 통과 |
| `npm run test:e2e` | 로컬 브라우저 흐름 2개 통과 |
| `npm run test:e2e:production` | 배포 익명 권한 1개 통과 |
| `npm run build` | 통과 |
| `npm audit --omit=dev` | 취약점 0개 |
| `git diff --check` | 통과 |

## 기능 실증

| 기능 | 검사 방법 | 결과 |
|---|---|---|
| 원격 CREATE | Supabase 검사 행 생성 | 201 통과 |
| 원격 READ | 생성 ID 조회 | 200 통과 |
| 원격 UPDATE | 내용 변경 후 반환 비교 | 200 통과 |
| 원격 DELETE | 검사 행 삭제 | 200 통과 |
| UI CRUD | Playwright 등록→상세→수정→삭제 | 통과 |
| 필터 | 학습 선택 후 다른 카테고리 숨김 | 통과 |
| 보호 라우트 | 비로그인 등록·수정·프로필 → 로그인 | 통과 |
| Not Found | 잘못된 Hash 주소 | 404 화면 통과 |
| 익명 RLS | REST SELECT 및 mutation | SELECT 200, 쓰기 3종 401 |
| 로그인 원격 CRUD | 실제 계정 수동 등록→수정→삭제 | 통과 |
| Auth 공개 설정 | Supabase settings | 이메일/가입 활성, 이메일 확인 필요 |
| Auth Dashboard URL | 프로젝트 소유자 수동 확인 | Production Site URL·Redirect URL 통과 |
| 실제 새 인증 이메일 | 수신 링크 직접 확인 | Production 복귀, localhost 없음 |

원격 검사 행은 검사 직후 삭제했다. 테스트에 실제 키, 로그인 정보, 인증 토큰을 저장하지 않았다.

## 요구사항 최종 대조

| 항목 | 결과 | 근거 |
|---|---|---|
| React 18 이상 | 통과 | React 18.3.1 |
| 5개 이상 라우트 + Not Found | 통과 | 8개 |
| 원격 CRUD | 통과 | Supabase 네 단계 실증 |
| 목록/상세 | 통과 | ItemListPage/ItemDetailPage |
| 폼 검증·오류·제출 중 | 통과 | ItemForm + mutationError |
| 공통 로딩·오류·빈 상태 | 통과 | StateView와 상태 UI |
| 8개 이상 재사용 컴포넌트 | 통과 | 11개 |
| 커스텀 훅 | 통과 | useItems/useItem/useAuth |
| pages/components/hooks/lib | 통과 | context도 추가 분리 |
| 상태 변화 3곳 이상 | 통과 | 필터, 폼, 삭제, 인증, 목록 갱신 |
| 배포·실행 README | 통과 | URL, 설치, 환경변수, 검사 명령 |
| 전역 상태 보너스 | 통과 | AuthContext |
| 성능 보너스 | 통과 | useMemo/useCallback/React.memo |
| 인증 보너스 | 통과 | Supabase Auth + 보호 profile |
| learning/eval 브랜치 | 통과 | 두 브랜치와 문제별 브랜치 원격 push 확인 |
| 학습 동료 페르소나 평가 | 통과 | eval/persona-peer-review.md |
| 실제 외부 동료평가 | 대기 | eval 요청서에 실제 평가자 서명/의견 필요 |

## 배포 후 마지막 확인

2026-08-14 최종 권한·증거 변경까지 main과 Vercel Production에 반영했다.

- 최종 기록 기준 main: `0aee953`
- GitHub Production deployment: `success`
- 배포 첫 화면과 `/#/items`: HTTP 200
- 배포 UI: `Supabase 원격` 배지 확인
- 익명 배포 E2E: 조회, 쓰기 UI 비노출, 등록 로그인 이동 1/1 통과
- 실제 계정: 등록 → 수정 → 삭제 → 프로필 → 로그아웃 통과
- 검사 항목: 삭제 완료(원격에 남기지 않음)
- RLS: 익명 SELECT 200, INSERT/UPDATE/DELETE 401
- 인증 메일: Dashboard Production URL과 실제 새 이메일 복귀 링크 확인
- 원격 브랜치: `main`, `learning`, `eval` 및 문제별 작업 브랜치 확인
- GitHub 이슈: #1~#20과 #22 완료(#21·#23~#25는 Pull Request 번호)

남은 외부 절차는 실제 동료 3인의 직접 평가다.
