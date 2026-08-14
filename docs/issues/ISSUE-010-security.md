# 이슈 #10: 의존성 취약점과 환경파일 제외 패턴 부족

## 재현

- `npm audit --omit=dev`에서 React Router 관련 중간 위험도 2건이 나왔다.
- `git check-ignore .env.production` 결과가 제외되지 않음으로 나왔다.

## 원인

- `package.json`의 React Router 범위가 취약점이 남은 6 버전을 선택했다.
- `.gitignore`가 `.env`와 `.env.local` 두 이름만 적어서 다른 환경 파일 이름을 놓쳤다.

## 선택과 트레이드오프

| 선택 | 장점 | 단점 |
|---|---|---|
| React Router 6 유지 | 기존 설명과 버전이 같음 | 알려진 보안 문제를 남김 |
| React Router 7의 수정 버전 사용 | 보안 검사 통과, 기존 Routes API도 동작 | 묶음 파일이 약 16KB 커지고 버전 설명 수정 필요 |

보안 문제를 남기지 않는 편이 더 중요하여 React Router 7.18.2를 선택했다. React는 과제 조건에 맞게 18을 유지했다.

환경파일은 `.env.*`를 모두 제외하고 값이 없는 `.env.example`만 예외로 허용했다.

## 해결 커밋

- `fix(deps): React Router 보안 취약점 해결`
- `security(env): 모든 실제 환경변수 파일 Git 제외`

## 재검사

- `npm audit --omit=dev`: 취약점 0개
- `npm run build`: 통과
- `.env`, `.env.local`, `.env.production`, `.env.test`: 모두 제외
- `.env.example`: 추적 가능
