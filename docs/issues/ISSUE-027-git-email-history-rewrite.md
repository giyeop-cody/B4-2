# 이슈 #27: Git commit 이메일 통합을 위한 전체 history rewrite

- 상태: 원격 재작성·검증 완료 / GitHub Contributors 목록 캐시 갱신 대기
- GitHub Issue: <https://github.com/giyeop-cody/B4-2/issues/27>
- 날짜: 2026-08-14
- 목표 작성자: `giyeop-cody <cody.giyeop@gmail.com>`

## 문제

같은 사람의 commit 이메일이 두 개로 나뉘어 GitHub Contributors에 `GiyeopKim1993`과 `giyeop-cody`가 따로 표시됐다.

- 기존 이메일 author commit: 148개
- 목표 이메일 author commit: 24개
- 변경 전 전체 author commit: 172개

GitHub 이슈·PR 26개의 작성자는 이미 모두 `giyeop-cody`였다. 이슈에는 별도 작성자 이메일이 저장되지 않으므로 이슈 작성자를 수정할 작업은 없다.

## 사용자 결정

안전한 `.mailmap` 표시 통합만으로는 GitHub Contributors가 계속 나뉠 수 있다. 사용자는 다음 위험을 확인하고 전체 이력 재작성을 선택했다.

- 모든 원격 브랜치와 태그 대상
- author·committer의 기존 이메일을 목표 이메일로 변경
- GitHub merge committer `GitHub <noreply@github.com>`는 유지
- 모든 영향받는 SHA 변경 허용
- 모든 브랜치 강제 push 허용
- old→new SHA mapping과 복구용 bundle 보관
- 현재 브랜치 문서의 과거 SHA 참조도 새 SHA로 갱신

## 위험과 트레이드오프

| 선택 | 장점 | 단점 |
|---|---|---|
| `.mailmap`만 추가 | SHA와 협업 clone 유지 | GitHub Contributors 통합이 보장되지 않음 |
| 전체 history rewrite | 실제 commit 이메일과 Contributor 귀속 통합 | SHA 변경, force push, 기존 clone 재동기화 필요 |

Contributor 통합을 우선해 전체 재작성을 선택했다.

## 백업

강제 push 전에 원격 전체 mirror를 받아 복구용 bundle을 만들었다.

- 파일: `B4-2-before-email-rewrite.bundle`
- 크기: 약 1.5 MiB
- SHA-256: `223968a9d537c0581c67f90849b146f230a478ea797461c19ebc74b3345607dc`
- 포함: 원격 head 30개, 태그 0개, PR 보존 ref, 전체 history
- `git bundle verify`: 통과
- `git fsck --full`: 통과

bundle은 저장소 밖 작업공간에 보관하고 GitHub에는 올리지 않는다.

## SHA 추적 자료

- `docs/history/2026-08-14-email-rewrite-commit-map.tsv`: 기존 commit 172개의 old→new SHA
- `docs/history/2026-08-14-email-rewrite-branch-map.tsv`: 브랜치 30개의 변경 전·이메일 재작성 후·문서 SHA 갱신 후 tip

SHA mapping 파일의 old SHA는 복구와 감사 목적이므로 의도적으로 남긴다. 일반 문서에 적힌 과거 SHA 92곳은 새 SHA로 바꿨다.

## 로컬 검증

- [x] 기존 이메일 author 148개 확인
- [x] 기존 이메일 committer 148개 확인
- [x] author 172개가 모두 목표 이메일인지 확인
- [x] 일반 committer 167개가 모두 목표 이메일인지 확인
- [x] GitHub merge committer 5개는 noreply 유지
- [x] 기존 이메일 author/committer 0개 확인
- [x] 30개 브랜치 ref mapping 생성
- [x] 24개 브랜치, 92개 일반 문서 SHA 참조 갱신
- [x] `.mailmap`으로 기존 이메일 재유입 표시 방어
- [x] 원격 heads 30개 atomic force-with-lease push
- [x] fresh remote clone의 author/committer 이메일 재검사
- [x] main·learning·eval와 전체 30개 원격 tip 일치 확인
- [x] GitHub Commit API에서 main 141개가 모두 `giyeop-cody`에 연결됨을 확인
- [x] GitHub contributor stats 재계산 결과 `giyeop-cody` 한 명만 확인
- [ ] 일반 Contributors 목록의 이전 캐시 갱신 확인
- [x] 복구 절차와 새 clone 안내

## 원격 검증 결과

- 기존 이메일 author: 0
- 기존 이메일 committer: 0
- 전체 브랜치 author: 목표 이메일 199개
- 일반 committer: 목표 이메일 194개
- GitHub merge committer: noreply 5개 유지
- 원격 head: 30/30 로컬 최종 ref와 일치
- GitHub main Commit API: 141/141 `giyeop-cody <cody.giyeop@gmail.com>` 연결
- GitHub contributor stats: `giyeop-cody` 한 명
- 일반 Contributors API: 이전 두 계정 결과가 캐시에 남아 있어 갱신 대기

GitHub Contributors 집계는 비동기 캐시이므로 commit 자체가 잘못된 상태와 구분한다. 실제 원격 commit과 통계 재계산 결과는 이미 한 계정으로 통합됐다.

## 복구 방법

문제가 생기면 bundle에서 별도 mirror를 만든 뒤 필요한 브랜치를 원래 SHA로 되돌릴 수 있다.

```bash
git clone --mirror B4-2-before-email-rewrite.bundle B4-2-restore.git
cd B4-2-restore.git
git remote add origin https://github.com/giyeop-cody/B4-2.git
# refs-before 기록을 확인한 뒤 필요한 브랜치만 --force-with-lease로 복구한다.
```

무조건 `--mirror`로 GitHub에 push하지 않는다. GitHub 내부 PR ref까지 건드릴 수 있으므로 `refs/heads/*`와 태그만 명시적으로 처리한다.

## 기존 clone 사용자의 조치

SHA가 전부 달라지므로 가장 안전한 방법은 기존 폴더를 보관하고 새로 clone하는 것이다. 작업 중인 변경이 있다면 먼저 patch나 별도 branch로 백업해야 한다.
