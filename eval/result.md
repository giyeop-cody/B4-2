# 네이토 사전평가 및 재검증 결과 — B4-2

## 2026-08-14 현재 상태

아래 12/15 결과는 2026-08-10의 **과거 실제 사전평가**이며 지우지 않는다. 그 뒤 사용자 요청에 따라 전체 코드를 실증 검사하고 누락을 수정했다.

- 현재 소스: 필수 15항목 근거와 보너스 3항목 구현
- 자동 검사: 단위/컴포넌트 28개, 로컬 브라우저 2개, 배포 익명 권한 1개, 빌드 통과, 취약점 0개
- 실제 Supabase: 공개 조회·로그인 쓰기와 RLS 익명 차단 통과
- 배포 확인: main `0aee953`, Production `success`, `Supabase 원격` 배지
- 추가: AuthContext, 로그인/가입, 등록·수정·프로필 보호, useMemo/useCallback/React.memo
- 학습 동료 페르소나 검토: 필수 15/15와 보너스 근거 확인
- 인증 이메일 localhost 이슈 #20: 코드·Dashboard URL·실제 새 이메일 Production 복귀 확인 완료
- 남은 외부 절차: 외부 동료 3명의 직접 평가

플랫폼 사전평가를 다시 실행하지 않았으므로 새 점수를 실제 사전평가 점수라고 적지 않는다.

## 2026-08-10 실제 사전평가 결과
- **점수**: 12/15 통과 (80%) — old 코드 기준
- **시도**: 3회 (3회 모두 80% 동일)
- **시도 한도 소진**: 3/3
- **평가일**: 2026-08-10
- **dataRegSn**: 4752
- **배포 URL**: https://b4-2.vercel.app/

## 주의: 평가는 old 코드 기준
사전평가 3회 모두 전면 재작성 이전 코드 기준으로 진행됨.
전면 재작성(Vite 6 + React 18 + react-router-dom 6 + HashRouter) 후에는
시도 한도 소진으로 재평가 불가. 다음 평가 주기(8/17~)에 재실행 가능.

## 개선 이력
| 시도 | 점수 | FAIL 수 | 비고 |
|------|------|---------|------|
| 1회차 | 12/15 (80%) | 3개 | 원본 코드 |
| 2회차 | 12/15 (80%) | 3개 | 동일 |
| 3회차 | 12/15 (80%) | 3개 | 동일 (시도 한도 소진) |

## FAIL 항목 (3개) — 동료평가 시 보완

### #5 FAIL — 배포 URL + 환경변수 증빙
- **gap**: 배포 URL 및 배포환경에서의 CRUD 동작 확인 자료 미제출
- **상태**: 배포 완료 (https://b4-2.vercel.app/), README에 URL 명시
- **동료평가 대비**: 배포 URL 구두 설명 + CRUD 실시간 데모 준비

### #10 FAIL — props vs state README 설명
- **gap**: props와 state의 개념적 구분·상태 소유 위치·상향/하향 흐름 설명
- **상태**: README에 "props vs state" 섹션 추가 — AI가 인식하지 못했으나 동료평가자는 확인 가능
- **동료평가 대비**: README "props vs state" 섹션 + docs/reasoning-03-state-flow.md

### #15 FAIL — Supabase 선택 이유 README 설명
- **gap**: Supabase 선택 이유, 연동 어려움, 인증 사용 여부
- **상태**: README에 "Supabase 선택 이유" 섹션 추가 — AI가 인식하지 못했으나 동료평가자는 확인 가능
- **동료평가 대비**: README "Supabase 선택 이유" 섹션 + docs/reasoning-04-supabase-dual-mode.md

## PASS 항목 (12개)
1. ✅ 라우트 + NotFound (6개 라우트)
2. ✅ CRUD 훅 분리 (useItems/useItem)
3. ✅ StateView 공통 상태 UI
4. ✅ 폼 검증 + 에러 + 제출중
6. ✅ 커스텀 훅 분리
7. ✅ 폴더 구조 분리 (pages/components/hooks/lib)
8. ✅ 8개 재사용 컴포넌트
9. ✅ 공통 상태 UI 통일
11. ✅ useEffect 의존성 배열
12. ✅ 로딩/성공/실패 상태 관리
13. ✅ 상태 변경 → 화면 변화 3지점
14. ✅ 라우팅→컴포넌트→상태→이벤트 흐름

## 비고
- 사전평가는 old 코드(Vite 8 + React 19 + react-router-dom 7 + createBrowserRouter) 기준
- 전면 재작성 후(Vite 6 + React 18 + react-router-dom 6 + HashRouter) 시도 한도 소진으로 재평가 불가
- 다음 평가 주기(8/17~)에 재실행 시 15/15 달성 예상 (README에 props/state, Supabase 설명 추가됨)
- 동료평가에서는 평가자가 직접 코드와 문서를 확인하므로 README + docs/ 추론 문서로 충분히 답변 가능
