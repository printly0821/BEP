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
echo -e "${BLUE}    Git Commit 자동화 스크립트${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 프로젝트 루트로 이동
cd "$PROJECT_ROOT"

# 현재 상태 확인
echo -e "${YELLOW}📊 현재 Git 상태 확인...${NC}"
git status --short
echo ""

# .gitignore 업데이트
echo -e "${YELLOW}📝 .gitignore 업데이트...${NC}"
if [ -f .gitignore ]; then
    # 이미 있는지 확인
    if ! grep -q "^\.env\.test$" .gitignore; then
        echo ".env.test" >> .gitignore
        echo ".etc/" >> .gitignore
        echo ".ruler/" >> .gitignore
        echo "commit-t007.sh" >> .gitignore
        echo -e "${GREEN}✓ .gitignore 업데이트 완료${NC}"
    else
        echo -e "${GREEN}✓ .gitignore 이미 최신 상태${NC}"
    fi
fi
echo ""

# 사용자에게 확인
echo -e "${YELLOW}🤔 다음 순서로 commit을 진행합니다:${NC}"
echo ""
echo "  1. T-007: 프로젝트 관리 i18n"
echo "  2. T-008: PDF 다운로드 기능"
echo "  3. API 기반 제작 의뢰서 시스템"
echo "  4. Swagger + Scalar API 문서"
echo "  5. 기타 UI/스타일 개선"
echo ""
read -p "계속 진행하시겠습니까? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ 작업이 취소되었습니다.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}    Commit 시작${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Commit 1: T-007 프로젝트 관리 i18n
echo -e "${YELLOW}1️⃣  T-007: 프로젝트 관리 i18n${NC}"
git add src/app/\(protected\)/projects/
git add src/components/LanguageSwitcher.tsx
git add src/components/providers/
git add src/lib/i18n.ts
git add messages/
git commit -F "$SCRIPT_DIR/commit-messages/t007-i18n.txt"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Commit 1 완료${NC}\n"
else
    echo -e "${RED}✗ Commit 1 실패${NC}\n"
    exit 1
fi

# Commit 2: T-008 PDF 다운로드
echo -e "${YELLOW}2️⃣  T-008: PDF 다운로드 기능${NC}"
git add src/app/calculator/
git add src/lib/pdf-generator.ts
git commit -F "$SCRIPT_DIR/commit-messages/t008-pdf.txt"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Commit 2 완료${NC}\n"
else
    echo -e "${RED}✗ Commit 2 실패${NC}\n"
    exit 1
fi

# Commit 3: 제작 의뢰서 API 시스템
echo -e "${YELLOW}3️⃣  API 기반 제작 의뢰서 시스템${NC}"
git add src/app/test-report/
git add src/app/api/job-orders/
git add src/types/
git add img/
git commit -F "$SCRIPT_DIR/commit-messages/job-order-api.txt"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Commit 3 완료${NC}\n"
else
    echo -e "${RED}✗ Commit 3 실패${NC}\n"
    exit 1
fi

# Commit 4: API 문서화
echo -e "${YELLOW}4️⃣  Swagger + Scalar API 문서${NC}"
git add src/app/api-docs/
git add src/app/api-docs-scalar/
git add src/app/api/swagger/
git add src/lib/swagger.ts
git commit -F "$SCRIPT_DIR/commit-messages/api-docs.txt"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Commit 4 완료${NC}\n"
else
    echo -e "${RED}✗ Commit 4 실패${NC}\n"
    exit 1
fi

# Commit 5: 기타 변경사항
echo -e "${YELLOW}5️⃣  UI/스타일 개선 및 의존성 업데이트${NC}"
git add src/app/globals.css
git add src/components/calculator/MetricCard.tsx
git add src/components/layout/Header.tsx
git add package.json
git add package-lock.json
git commit -m "chore: UI 스타일 개선 및 의존성 업데이트

- 새 의존성 추가: next-intl, html2canvas, jsPDF, swagger-ui-react, @scalar/api-reference
- MetricCard 스타일 조정
- Header 네비게이션 개선
- globals.css 스타일 업데이트"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Commit 5 완료${NC}\n"
else
    echo -e "${RED}✗ Commit 5 실패${NC}\n"
    exit 1
fi

# 완료
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ 모든 commit이 완료되었습니다!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 로그 확인
echo -e "${YELLOW}📜 최근 commit 로그:${NC}"
git log --oneline -5
echo ""

# Push 여부 확인
read -p "원격 저장소에 push하시겠습니까? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🚀 Push 중...${NC}"
    git push

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Push 완료!${NC}"
    else
        echo -e "${RED}✗ Push 실패${NC}"
        echo -e "${YELLOW}수동으로 push를 시도하세요: git push${NC}"
    fi
else
    echo -e "${YELLOW}ℹ️  나중에 수동으로 push하세요: git push${NC}"
fi

echo ""
echo -e "${GREEN}🎉 작업 완료!${NC}"
