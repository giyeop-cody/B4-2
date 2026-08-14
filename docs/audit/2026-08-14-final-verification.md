# 2026-08-14 최종 실증 검사표

## 자동 검사

| 검사 | 결과 |
|---|---|
| `npm ci` | 통과 |
| `npm test` | 테스트 파일 7개, 테스트 20개 통과 |
| `npm run test:e2e` | 브라우저 흐름 2개 통과 |
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
| 보호 라우트 | 비로그인 `/profile` → 로그인 | 통과 |
| Not Found | 잘못된 Hash 주소 | 404 화면 통과 |
| Auth 설정 | Supabase 공개 settings | 이메일/가입 활성, 이메일 확인 필요 |

원격 검사 행은 검사 직후 삭제했다. 테스트에 실제 키나 토큰을 저장하지 않았다.

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
| learning/eval 브랜치 | 진행 중 | learning 완료, eval 최종 평가 정리 전 |
| 실제 외부 동료평가 | 대기 | eval 요청서에 서명/의견 필요 |

## 배포 후 마지막 확인

main push와 Vercel 재배포 뒤 아래를 다시 기록한다.

- 배포 commit과 HTTP 응답
- 배포 번들에 새 로그인/필터 기능 포함 여부
- 배포 Supabase CRUD 재검사
- GitHub learning/eval 브랜치 존재 여부
