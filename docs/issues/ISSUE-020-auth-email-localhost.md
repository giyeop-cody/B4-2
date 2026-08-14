# 이슈 #20: 인증 이메일 확인 주소가 localhost로 생성됨

## 사용자 제보

배포 사이트에서 회원가입했지만 Supabase 인증 이메일의 복귀 주소가 실제 Vercel 주소가 아니라 localhost였다.

## 원인

두 설정이 함께 영향을 준다.

1. 앱의 `signUp()` 요청이 `emailRedirectTo`를 보내지 않았다.
2. Supabase Auth는 값이 없으면 Dashboard의 `Site URL`을 사용하는데, 이 값이 localhost로 설정된 것으로 보인다.

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

## Supabase Dashboard에서 필요한 수정

프로젝트 소유자가 다음을 확인해야 한다.

1. `Authentication → URL Configuration → Site URL`
   - `https://b4-2.vercel.app`
2. `Redirect URLs`
   - `https://b4-2.vercel.app/**`
3. localhost 주소는 로컬 인증 시험이 필요할 때만 별도 허용

Dashboard 관리 권한은 publishable key로 얻을 수 없으므로 코드 저장소에서 대신 변경할 수 없다.

## 검증 상태

- 단위/컴포넌트 테스트: 23개 통과
- 제품 빌드: 통과
- GitHub PR #21: main 병합 완료
- Vercel Production: PR merge commit `85c5b95` 배포 성공
- 배포 회원가입 요청 가로채기: `redirect_to=https://b4-2.vercel.app`
- 배포 요청의 localhost 포함 여부: false
- 검사 요청은 Supabase로 전달하지 않아 계정을 만들지 않음
- 실제 새 인증 메일 링크: Dashboard 설정 반영과 실제 이메일 수신 후 최종 확인 필요
