# 이슈 #11: learning 브랜치와 작은 변경 이력이 부족함

## 기준선

- 원격에 `eval`은 있었지만 정확한 이름의 `learning`은 없었다.
- 최초 앱 구현 21개 파일이 한 커밋에 들어 있어 기능별 추적이 어려웠다.
- 기능 브랜치 이름은 있었지만 여러 브랜치가 같은 한 커밋을 가리켰다.

## 지키기로 한 방법

기존 기록을 강제로 다시 쓰면 이미 있는 히스토리를 훼손하므로 과거 커밋은 보존한다.
실증 검사 이후 작업부터 다음 규칙을 적용했다.

1. `learning`에서 학습 결과를 모은다.
2. 문제/기능마다 별도 브랜치를 만든다.
3. 설정, 기능, 테스트, 문서를 각각 작은 커밋으로 남긴다.
4. `--no-ff` merge로 어떤 목적의 브랜치였는지 그래프에 남긴다.
5. `eval`에는 평가표, 검증 결과, 동료 피드백을 둔다.

## 사용한 작업 브랜치

- `fix/security-maintenance`
- `test/automated-verification`
- `fix/remote-data-source`
- `fix/crud-ux`
- `fix/accessibility`
- `feature/auth-global-state`
- `feature/performance-filter`
- `test/e2e-verification`
- `fix/test-runner-isolation`
- `docs/final-learning-record`

## 트레이드오프

작은 커밋과 merge commit 때문에 기록 수가 늘고 그래프가 복잡해진다. 대신 어느 변경에서 문제가 생겼는지 되돌리거나 설명하기 쉽다.

## 남은 확인

- `learning` 원격 push
- 기존 `eval`의 평가 문서를 보존하며 최신 learning 병합
- 최종 main 병합과 배포 commit 확인
