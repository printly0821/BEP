# 🚀 Quick Start: Git Commit

## 📋 현재 변경사항 요약

총 **5개의 주요 기능**이 구현되었습니다:

1. **T-007**: 프로젝트 관리 i18n (한국어/영어)
2. **T-008**: PDF 다운로드 기능
3. **API 시스템**: 제작 의뢰서 동적 리포트
4. **API 문서**: Swagger UI + Scalar
5. **기타**: UI 개선 및 의존성 업데이트

## ⚡ 빠른 실행

### 한 번에 모두 Commit

```bash
./scripts/git/commit-all.sh
```

이 명령어 하나로:
- ✅ .gitignore 자동 업데이트
- ✅ 5개 commit 자동 생성
- ✅ Push 여부 선택 가능

### 실행 결과

```
✓ Commit 1: T-007 프로젝트 관리 i18n
✓ Commit 2: T-008 PDF 다운로드 기능
✓ Commit 3: API 기반 제작 의뢰서 시스템
✓ Commit 4: Swagger + Scalar API 문서
✓ Commit 5: UI/스타일 개선 및 의존성
```

## 📝 각 Commit 내용

### 1️⃣ T-007: 프로젝트 관리 i18n
- next-intl 클라이언트 전용 구현
- 한국어/영어 메시지 파일
- LanguageSwitcher 컴포넌트
- 모든 프로젝트 페이지 i18n 적용

**파일**: ~15개
**라인**: ~800+

### 2️⃣ T-008: PDF 다운로드
- html2canvas + jsPDF
- ReportView 컴포넌트
- A4 크기 고해상도 PDF
- OKLCH 에러 해결

**파일**: ~5개
**라인**: ~600+

### 3️⃣ 제작 의뢰서 API 시스템
- RESTful API (GET, POST)
- Mock 데이터베이스 (3개 샘플)
- 실제 바코드/QR코드 생성
- 동적 리포트 렌더링
- PDF 다운로드 지원

**파일**: ~20개
**라인**: ~2,000+

### 4️⃣ API 문서화
- Swagger UI
- Scalar API Reference
- OpenAPI 3.0 스펙
- 완전한 API 문서

**파일**: ~10개
**라인**: ~1,500+

### 5️⃣ 기타 개선
- UI 스타일 업데이트
- 의존성 추가
- 컴포넌트 개선

**파일**: ~5개
**라인**: ~100+

## 🎯 실행 순서

### Step 1: 상태 확인

```bash
git status
```

### Step 2: 스크립트 실행

```bash
cd /mnt/d/Dev/BEP
./scripts/git/commit-all.sh
```

### Step 3: 확인

- 스크립트가 각 단계를 안내합니다
- `y`를 입력하여 진행
- commit 완료 후 로그 확인

### Step 4: Push (선택)

- 스크립트가 물어볼 때 `y` 입력
- 또는 나중에 수동으로: `git push`

## ✅ Commit 전 체크리스트

- [x] .gitignore 업데이트됨
- [x] 테스트 파일 제외됨
- [x] 민감 정보 제거됨
- [x] Commit 메시지 준비됨
- [x] 모든 파일 카테고리 분류됨

## 📚 상세 문서

더 자세한 내용은 다음 문서를 참고하세요:

- `scripts/git/README.md`: 전체 가이드
- `scripts/git/commit-analysis.md`: 변경사항 분석
- `scripts/git/commit-messages/`: Commit 메시지 템플릿

## 🔍 트러블슈팅

### 스크립트 실행 권한 오류

```bash
chmod +x scripts/git/commit-all.sh
```

### Commit 실패

특정 파일이 없다면:
1. 해당 파일 확인
2. 수동으로 commit 재시도

### Push 실패

- 브랜치 확인: `git branch`
- 원격 저장소 확인: `git remote -v`
- 권한 확인

## 💡 팁

### 특정 기능만 Commit

T-007만 commit하고 싶다면:

```bash
git add src/app/\(protected\)/projects/
git add src/components/LanguageSwitcher.tsx
git add src/components/providers/
git add src/lib/i18n.ts
git add messages/
git commit -F scripts/git/commit-messages/t007-i18n.txt
```

### Commit 확인

```bash
git log --oneline -5
git show HEAD
```

### Commit 취소

```bash
# 마지막 commit 취소 (변경사항 유지)
git reset --soft HEAD~1
```

## 🎉 완료 후

모든 commit이 완료되면:

1. ✅ 5개의 논리적으로 분리된 commit
2. ✅ 명확한 히스토리
3. ✅ 쉬운 리뷰
4. ✅ 필요시 개별 롤백 가능

**이제 자신 있게 Push하세요!** 🚀
