# Git Commit 분석 및 전략

## 📊 현재 변경사항 분석

### 수정된 파일 (Modified)
```
package.json                  - 새 의존성 추가
package-lock.json            - 의존성 잠금 파일
src/app/globals.css          - 스타일 변경
src/components/calculator/MetricCard.tsx
src/components/layout/Header.tsx
```

### 프로젝트 관리 (T-007: i18n)
```
src/app/(protected)/projects/page.tsx
src/app/(protected)/projects/components/ProjectsPageContent.tsx (신규)
src/app/(protected)/projects/components/ProjectCreateDialog.tsx
src/app/(protected)/projects/components/ProjectDetailSheet.tsx
src/app/(protected)/projects/components/ProjectRowActions.tsx
src/app/(protected)/projects/components/ProjectsTable.tsx
src/components/LanguageSwitcher.tsx (신규)
src/components/providers/ (신규)
src/lib/i18n.ts (신규)
messages/ (신규)
```

### PDF 다운로드 (T-008)
```
src/app/calculator/page.tsx
src/app/calculator/components/ActionButtons.tsx
src/app/calculator/components/ReportView.tsx (신규)
src/lib/pdf-generator.ts (신규)
```

### API 기반 제작 의뢰서 시스템
```
src/app/test-report/ (신규)
src/app/api/job-orders/ (신규)
src/types/ (신규)
img/ (신규 - PDF 샘플)
```

### API 문서화
```
src/app/api-docs/ (신규 - Swagger UI)
src/app/api-docs-scalar/ (신규 - Scalar)
src/app/api/swagger/ (신규)
src/lib/swagger.ts (신규)
```

### 테스트/개발 파일
```
.env.test
.etc/
.ruler/
commit-t007.sh
```

## 🎯 Commit 전략

### 옵션 1: 단일 대형 Commit (비추천)
- 장점: 간단함
- 단점: 리뷰 어려움, 롤백 어려움

### 옵션 2: 기능별 분리 Commit (추천)
1. **Commit 1**: T-007 프로젝트 관리 i18n
2. **Commit 2**: T-008 PDF 다운로드 기능
3. **Commit 3**: API 기반 제작 의뢰서 시스템
4. **Commit 4**: API 문서화 (Swagger + Scalar)

### 옵션 3: 세밀한 분리 Commit (가장 이상적)
1. **Commit 1**: feat: T-007 프로젝트 관리 i18n 구현
2. **Commit 2**: feat: T-008 PDF 다운로드 기능 구현
3. **Commit 3**: feat: 제작 의뢰서 API 시스템 구현
4. **Commit 4**: feat: Swagger API 문서 추가
5. **Commit 5**: feat: Scalar API Reference 추가
6. **Commit 6**: chore: 의존성 업데이트 및 설정 파일

## 📝 Commit 메시지 컨벤션

### 형식
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 종류
- **feat**: 새로운 기능
- **fix**: 버그 수정
- **docs**: 문서 변경
- **style**: 코드 포맷팅
- **refactor**: 코드 리팩토링
- **test**: 테스트 코드
- **chore**: 빌드/설정 변경

### 예시
```
feat(projects): T-007 프로젝트 관리 i18n 구현

- next-intl 클라이언트 전용 i18n 구현
- 한국어/영어 메시지 파일 추가
- LanguageSwitcher 컴포넌트 구현
- 모든 프로젝트 관리 페이지 i18n 적용

관련 이슈: T-007
```

## 🚀 권장 Commit 순서

### 1단계: 의존성 (선택사항)
```bash
git add package.json package-lock.json
git commit -m "chore: 새 의존성 추가 (i18n, PDF, API 문서)"
```

### 2단계: T-007 프로젝트 관리 i18n
```bash
git add src/app/(protected)/projects/
git add src/components/LanguageSwitcher.tsx
git add src/components/providers/
git add src/lib/i18n.ts
git add messages/
git commit -F scripts/git/commit-messages/t007-i18n.txt
```

### 3단계: T-008 PDF 다운로드
```bash
git add src/app/calculator/
git add src/lib/pdf-generator.ts
git commit -F scripts/git/commit-messages/t008-pdf.txt
```

### 4단계: 제작 의뢰서 API 시스템
```bash
git add src/app/test-report/
git add src/app/api/job-orders/
git add src/types/
git add img/
git commit -F scripts/git/commit-messages/job-order-api.txt
```

### 5단계: API 문서화
```bash
git add src/app/api-docs/
git add src/app/api-docs-scalar/
git add src/app/api/swagger/
git add src/lib/swagger.ts
git commit -F scripts/git/commit-messages/api-docs.txt
```

### 6단계: 기타 변경사항
```bash
git add src/app/globals.css
git add src/components/calculator/MetricCard.tsx
git add src/components/layout/Header.tsx
git commit -m "style: UI 스타일 및 컴포넌트 개선"
```

## ⚠️ 제외할 파일

다음 파일들은 commit하지 말아야 합니다:
```
.env.test          - 환경 변수 (민감 정보)
.etc/              - 임시 폴더
.ruler/            - 임시 폴더
commit-t007.sh     - 이전 임시 스크립트
```

이들은 `.gitignore`에 추가해야 합니다.

## 🔍 확인 사항

### Commit 전 체크리스트
- [ ] 모든 파일이 올바른 카테고리에 포함됨
- [ ] 민감한 정보가 포함되지 않음
- [ ] Commit 메시지가 명확함
- [ ] 관련된 파일들이 함께 commit됨
- [ ] 테스트 파일은 별도로 처리
- [ ] 문서 파일 포함 (README.md)
