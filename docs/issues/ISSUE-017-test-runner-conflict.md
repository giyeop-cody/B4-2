# 이슈 #17: Vitest가 Playwright E2E 파일까지 실행함

## 발생

E2E 테스트를 `learning`에 합친 뒤 통합 검사에서 `npm test`가 실패했다.
오류는 `Playwright Test did not expect test.beforeEach() to be called here`였다.

## 원인

Vitest와 Playwright가 모두 `*.spec.js` 파일을 기본 검사 대상으로 사용한다.
Vitest가 `e2e/crud-flow.spec.js`를 단위 테스트라고 생각해 불러왔다.

## 선택지

- E2E 파일 이름을 특별하게 변경: 이름 규칙을 계속 기억해야 한다.
- 각 도구의 검색 폴더를 설정: 역할이 분명하고 새 파일에도 적용된다.

두 번째를 골라 Vitest는 `src/**/*.{test,spec}.{js,jsx}`, Playwright는 `e2e`만 읽게 했다.

## 재검사

- `npm test`: 단위/컴포넌트 테스트 20개 통과
- `npm run test:e2e`: 브라우저 테스트 2개 통과
- `npm run build`: 통과
- `npm audit --omit=dev`: 취약점 0개

## 배운 점

도구를 여러 개 쓰면 각 도구가 어떤 파일을 자기 것으로 생각하는지 경계를 정해야 한다.
