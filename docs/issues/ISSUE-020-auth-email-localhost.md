# 이슈 #20: 인증 이메일 확인 주소가 localhost로 생성됨

- 상태: 완료
- GitHub Issue: <https://github.com/giyeop-cody/B4-2/issues/20>
- 코드 수정 PR: <https://github.com/giyeop-cody/B4-2/pull/21>
- 최종 수동 확인: 2026-08-14

## 사용자 제보

배포 사이트에서 회원가입했지만 Supabase 인증 이메일의 복귀 주소가 실제 Vercel 주소가 아니라 localhost였다.

## 원인

두 설정이 함께 영향을 준다.

1. 앱의 `signUp()` 요청이 `emailRedirectTo`를 보내지 않았다.
2. Supabase Auth는 값이 없으면 Dashboard의 `Site URL`을 사용하는데, 이 값이 localhost로 설정된 것으로 보였다.

## 선택지

| 선택 | 장점 | 단점 |
|---|---|---|
| Dashboard Site URL만 변경 | 설정이 단순함 | Preview/다른 실행 환경이 기본값에 계속 의존 |
| 코드에서 redirect만 지정 | 실행 중인 앱 주소를 명시 | 주소가 Redirect URLs에 없으면 Supabase가 거절하거나 Site URL 사용 가능 |
| 코드와 Dashboard 모두 수정 | 동작과 허용 정책이 일치 | 두 곳을 확인해야 함 |

세 번째 방법을 선택했다.

## 코드 수정

- `VITE_APP_URL=https://b4-2.vercel.app` 설정 지원
- 값이 없으면 `window.location.origin` 사용
- `signUp.options.emailRedirectTo`로 실제 앱 Origin 전달
- HashRouter와 Supabase 토큰 hash의 충돌을 피하려고 `/#/login`은 넣지 않음
- localhost보다 배포 Origin이 우선되는 단위 테스트 3개 추가

## Supabase Dashboard 최종 확인

프로젝트 소유자가 다음 값을 직접 확인했다.

1. `Authentication → URL Configuration → Site URL`
   - `https://b4-2.vercel.app`
2. `Redirect URLs`
   - `https://b4-2.vercel.app/**`
3. localhost 주소는 로컬 인증 시험이 필요할 때만 별도로 사용

Dashboard 관리 권한은 publishable key로 얻을 수 없으므로 프로젝트 소유자가 수동으로 확인했다.

## 검증 결과

- 코드 수정 당시 단위/컴포넌트 테스트: 23개 통과
- 최종 회귀 단위/컴포넌트 테스트: 28개 통과
- 제품 빌드: 통과
- GitHub PR #21: main 병합 완료
- Vercel Production: PR merge commit `85c5b95` 배포 성공
- 배포 회원가입 요청 가로채기: `redirect_to=https://b4-2.vercel.app`
- 배포 요청의 localhost 포함 여부: false
- 가로채기 검사는 요청을 Supabase로 전달하지 않아 계정을 만들지 않음
- Dashboard Site URL과 Redirect URLs: 프로젝트 소유자 최종 확인 완료
- 실제 새 인증 이메일: 수신 완료
- 실제 이메일 복귀 링크: `https://b4-2.vercel.app` Production으로 이동하고 localhost로 이동하지 않음을 사용자 수동 확인

## 완료 판단

코드의 redirect, 실제 배포 요청, Dashboard 허용 URL, 실제 새 인증 이메일의 복귀 주소를 모두 확인했다. 따라서 localhost 인증 이메일 문제를 완료로 종료한다. 실제 계정 주소나 인증 토큰은 문서에 기록하지 않는다.
