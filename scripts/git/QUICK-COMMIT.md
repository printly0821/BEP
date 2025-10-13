# 빠른 커밋 가이드

## 오늘 작업한 타입 에러 수정 커밋하기

### 1. 스크립트 실행

```bash
# 프로젝트 루트에서 실행
./scripts/git/commit-type-fix.sh

# 또는 scripts/git 디렉토리에서 실행
cd scripts/git
./commit-type-fix.sh
```

### 2. 스크립트가 하는 일

1. **현재 변경사항 확인**
   - git status로 수정된 파일 목록 표시

2. **변경사항 스테이징**
   - Next.js 15 타입 수정 파일들
   - Scalar API Reference 설정 파일
   - package.json (타입 패키지 추가)
   - Mock 데이터 및 타입 정의

3. **커밋 생성**
   - 자동으로 상세한 커밋 메시지 작성
   - 변경사항 요약 포함
   - Claude Code 크레딧 포함

4. **Push 옵션**
   - 커밋 후 원격 저장소에 push할지 선택 가능

### 3. 수동 커밋 (원하는 경우)

스크립트를 사용하지 않고 직접 커밋하려면:

```bash
# 변경사항 스테이징
git add src/app/api/job-orders/[id]/route.ts
git add src/app/api-docs-scalar/page.tsx
git add package.json package-lock.json
git add src/app/api/job-orders/mock-data.ts
git add src/types/

# 커밋
git commit -m "fix: Next.js 15 호환성을 위한 타입 에러 수정"

# Push
git push
```

## 변경사항 상세 내용

### Next.js 15 동적 라우트 params 타입
```typescript
// Before
{ params }: { params: { id: string } }
const { id } = params;

// After
{ params }: { params: Promise<{ id: string }> }
const { id } = await params;
```

### Scalar API Reference 설정
```typescript
// Before
module.default(container, {
  spec: { content: spec },
  configuration: { ... }
})

// After
module.createApiReference(container, {
  content: spec,
  theme: "default",
  layout: "modern",
})
```

### 추가된 패키지
- `@types/swagger-ui-react`: SwaggerUI 컴포넌트 타입 정의

## 문제 해결

### 스크립트 실행 권한 에러
```bash
chmod +x scripts/git/commit-type-fix.sh
```

### 변경사항 확인
```bash
# 특정 파일의 변경사항 보기
git diff src/app/api/job-orders/[id]/route.ts
git diff src/app/api-docs-scalar/page.tsx

# 모든 변경사항 보기
git diff
```

### 커밋 취소 (로컬에서만)
```bash
# 가장 최근 커밋 취소 (변경사항은 유지)
git reset --soft HEAD~1

# 가장 최근 커밋 취소 (변경사항도 삭제)
git reset --hard HEAD~1
```
