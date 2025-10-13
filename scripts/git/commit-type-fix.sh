#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 스크립트 디렉토리
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}    Next.js 15 타입 에러 수정 커밋${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 프로젝트 루트로 이동
cd "$PROJECT_ROOT"

# 현재 상태 확인
echo -e "${YELLOW}📊 현재 Git 상태 확인...${NC}"
echo ""
git status --short
echo ""

# 변경사항 요약
echo -e "${YELLOW}📝 커밋할 변경사항:${NC}"
echo ""
echo "  ✓ Next.js 15 동적 라우트 params 타입 수정"
echo "    - src/app/api/job-orders/[id]/route.ts"
echo ""
echo "  ✓ Scalar API Reference 설정 수정"
echo "    - src/app/api-docs-scalar/page.tsx"
echo ""
echo "  ✓ SwaggerUI 타입 정의 추가"
echo "    - package.json, package-lock.json"
echo "    - @types/swagger-ui-react 설치"
echo ""
echo "  ✓ 기타 변경사항"
echo "    - Mock 데이터 분리"
echo "    - API 타입 개선"
echo ""

# diff 미리보기 제안
echo -e "${BLUE}💡 변경사항을 자세히 확인하시려면:${NC}"
echo "   git diff src/app/api/job-orders/[id]/route.ts"
echo "   git diff src/app/api-docs-scalar/page.tsx"
echo ""

# 사용자 확인
read -p "커밋을 진행하시겠습니까? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ 작업이 취소되었습니다.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}    Commit 진행 중...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 모든 변경사항 추가
echo -e "${YELLOW}📦 변경사항 스테이징 중...${NC}"

# 타입 수정 관련 파일
git add src/app/api/job-orders/[id]/route.ts
git add src/app/api-docs-scalar/page.tsx
git add package.json
git add package-lock.json

# Mock 데이터 및 타입 관련 파일
git add src/app/api/job-orders/mock-data.ts
git add src/app/api/job-orders/route.ts
git add src/types/job-order.ts
git add src/types/README.md

# Scripts 및 기타
git add scripts/
git add .gitignore

echo -e "${GREEN}✓ 스테이징 완료${NC}"
echo ""

# 커밋 메시지
COMMIT_MESSAGE="fix: Next.js 15 호환성을 위한 타입 에러 수정

## 주요 변경사항

### 1. Next.js 15 동적 라우트 params 타입 수정
- \`params\`를 \`Promise<{ id: string }>\` 타입으로 변경
- \`await params\`로 비동기 처리 추가
- 파일: src/app/api/job-orders/[id]/route.ts

### 2. Scalar API Reference 설정 수정
- \`module.default\` → \`module.createApiReference\` 사용
- deprecated된 \`spec.content\` 대신 최상위 \`content\` 사용
- 파일: src/app/api-docs-scalar/page.tsx

### 3. SwaggerUI 타입 정의 추가
- \`@types/swagger-ui-react\` 패키지 설치
- SwaggerUI 컴포넌트 타입 에러 해결

### 4. 코드 구조 개선
- Mock 데이터를 별도 파일로 분리 (mock-data.ts)
- API 응답 타입 개선 및 일관성 확보
- 타입 정의 문서화 추가 (src/types/README.md)

## 빌드 결과
✓ 모든 타입 에러 해결
✓ 프로덕션 빌드 성공
✓ 18개 페이지 정적 생성 완료

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 커밋 실행
echo -e "${YELLOW}💾 커밋 생성 중...${NC}"
git commit -m "$COMMIT_MESSAGE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 커밋 완료!${NC}"
    echo ""
else
    echo -e "${RED}✗ 커밋 실패${NC}"
    echo ""
    exit 1
fi

# 완료
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ 커밋이 완료되었습니다!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 로그 확인
echo -e "${YELLOW}📜 최근 커밋 로그:${NC}"
git log --oneline -3
echo ""

# 커밋 내용 확인
echo -e "${YELLOW}📄 방금 생성한 커밋 내용:${NC}"
git log -1 --stat
echo ""

# Push 여부 확인
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
read -p "원격 저장소에 push하시겠습니까? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}🚀 Push 중...${NC}"
    git push

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Push 완료!${NC}"
    else
        echo -e "${RED}✗ Push 실패${NC}"
        echo -e "${YELLOW}💡 수동으로 push를 시도하세요: git push${NC}"
    fi
else
    echo ""
    echo -e "${YELLOW}ℹ️  나중에 수동으로 push하세요:${NC}"
    echo "   git push"
fi

echo ""
echo -e "${GREEN}🎉 작업 완료!${NC}"
echo ""
