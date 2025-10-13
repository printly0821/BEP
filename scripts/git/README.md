# Git Commit 스크립트

이 디렉토리는 Git commit을 자동화하는 스크립트와 메시지를 관리합니다.

## 📁 구조

```
scripts/git/
├── README.md                    # 이 파일
├── commit-analysis.md           # 변경사항 분석
├── commit-all.sh               # 전체 자동 commit
├── commit-messages/            # Commit 메시지 템플릿
│   ├── t007-i18n.txt
│   ├── t008-pdf.txt
│   ├── job-order-api.txt
│   └── api-docs.txt
└── .gitkeep
```

## 🚀 사용 방법

### 방법 1: 전체 자동 Commit (권장)

모든 변경사항을 논리적으로 분리해서 5개의 commit으로 자동 생성:

```bash
# 프로젝트 루트에서 실행
./scripts/git/commit-all.sh
```

**실행 흐름:**
1. 현재 상태 확인
2. .gitignore 자동 업데이트
3. Commit 계획 표시
4. 사용자 확인 (y/n)
5. 5개 commit 순차 실행
6. Push 여부 확인

**Commit 순서:**
1. T-007: 프로젝트 관리 i18n
2. T-008: PDF 다운로드 기능
3. API 기반 제작 의뢰서 시스템
4. Swagger + Scalar API 문서
5. UI/스타일 개선 및 의존성

### 방법 2: 수동 Commit

개별적으로 commit하고 싶다면:

```bash
# 1. T-007 i18n
git add src/app/\(protected\)/projects/
git add src/components/LanguageSwitcher.tsx
git add src/components/providers/
git add src/lib/i18n.ts
git add messages/
git commit -F scripts/git/commit-messages/t007-i18n.txt

# 2. T-008 PDF
git add src/app/calculator/
git add src/lib/pdf-generator.ts
git commit -F scripts/git/commit-messages/t008-pdf.txt

# 3. 제작 의뢰서 API
git add src/app/test-report/
git add src/app/api/job-orders/
git add src/types/
git add img/
git commit -F scripts/git/commit-messages/job-order-api.txt

# 4. API 문서
git add src/app/api-docs/
git add src/app/api-docs-scalar/
git add src/app/api/swagger/
git add src/lib/swagger.ts
git commit -F scripts/git/commit-messages/api-docs.txt

# 5. 기타
git add src/app/globals.css
git add src/components/calculator/MetricCard.tsx
git add src/components/layout/Header.tsx
git add package.json package-lock.json
git commit -m "chore: UI 스타일 개선 및 의존성 업데이트"
```

### 방법 3: 선택적 Commit

특정 기능만 commit하고 싶다면 해당 섹션만 실행:

```bash
# T-007만 commit
git add src/app/\(protected\)/projects/
git add src/components/LanguageSwitcher.tsx
git add src/components/providers/
git add src/lib/i18n.ts
git add messages/
git commit -F scripts/git/commit-messages/t007-i18n.txt
```

## 📝 Commit 메시지 포맷

모든 commit 메시지는 다음 포맷을 따릅니다:

```
<type>(<scope>): <subject>

## 구현 내용
...

## 기술 스택
...

## 관련 파일
...

관련 이슈: T-XXX
```

### Type 종류
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드
- `chore`: 빌드/설정 변경

## ⚠️ 주의사항

### 제외할 파일

다음 파일들은 commit하지 않습니다:
```
.env.test          # 환경 변수
.etc/              # 임시 폴더
.ruler/            # 임시 폴더
commit-t007.sh     # 이전 임시 스크립트
```

이들은 자동으로 `.gitignore`에 추가됩니다.

### Push 전 확인사항

- [ ] 모든 테스트 통과
- [ ] 빌드 에러 없음
- [ ] 민감한 정보 제거
- [ ] Commit 메시지 확인
- [ ] 불필요한 파일 제외

## 🔍 트러블슈팅

### 스크립트 실행 권한 오류

```bash
chmod +x scripts/git/commit-all.sh
```

### Commit 실패

특정 commit이 실패하면:
1. `git status`로 상태 확인
2. 해당 파일이 존재하는지 확인
3. 충돌이 있는지 확인
4. 수동으로 해당 commit만 재시도

### .gitignore 적용 안됨

이미 추적 중인 파일은 제거 필요:
```bash
git rm --cached .env.test
git rm --cached -r .etc/
git rm --cached -r .ruler/
git rm --cached commit-t007.sh
```

### Push 실패

- 원격 저장소 권한 확인
- 브랜치 보호 규칙 확인
- 네트워크 연결 확인

## 📊 Commit 통계

스크립트 실행 후 생성되는 commit:

| # | Type | Scope | 파일 수 | 설명 |
|---|------|-------|---------|------|
| 1 | feat | projects | ~15 | T-007 i18n |
| 2 | feat | calculator | ~5 | T-008 PDF |
| 3 | feat | test | ~20 | 제작 의뢰서 API |
| 4 | feat | api-docs | ~10 | Swagger + Scalar |
| 5 | chore | - | ~5 | UI/의존성 |

**총 commit**: 5개
**총 변경 파일**: ~55개
**추가 라인**: ~10,000+

## 🎯 Best Practices

### Commit 크기
- ✅ 논리적으로 관련된 변경사항만 포함
- ✅ 하나의 기능/수정만 포함
- ❌ 너무 큰 commit (1,000+ 줄)
- ❌ 관련 없는 변경사항 혼합

### Commit 메시지
- ✅ 명확하고 구체적
- ✅ 왜 변경했는지 설명
- ✅ 관련 이슈 번호 포함
- ❌ 모호한 메시지 ("fix", "update")

### Commit 빈도
- ✅ 작은 단위로 자주
- ✅ 기능 완성 시마다
- ❌ 하루 작업을 한 번에
- ❌ 여러 날 작업을 한 번에

## 📚 참고 자료

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)

## 🔄 워크플로우

일반적인 개발 워크플로우:

```bash
# 1. 개발 시작
git checkout -b feature/new-feature

# 2. 작업 진행
# ... 코딩 ...

# 3. Commit (이 스크립트 사용)
./scripts/git/commit-all.sh

# 4. Push
git push origin feature/new-feature

# 5. Pull Request 생성
# GitHub에서 PR 생성

# 6. 리뷰 후 Merge
# main 브랜치에 merge
```

## 💡 팁

### 빠른 상태 확인
```bash
git status --short
git log --oneline -5
```

### Commit 수정
```bash
# 마지막 commit 메시지 수정
git commit --amend

# 마지막 commit에 파일 추가
git add forgotten-file
git commit --amend --no-edit
```

### Commit 취소
```bash
# 마지막 commit 취소 (변경사항 유지)
git reset --soft HEAD~1

# 마지막 commit 취소 (변경사항 삭제)
git reset --hard HEAD~1
```

## 🎉 결론

이 스크립트를 사용하면:
- ✅ 일관된 commit 메시지
- ✅ 논리적인 commit 구조
- ✅ 자동화된 워크플로우
- ✅ 명확한 히스토리

**Happy Committing!** 🚀
