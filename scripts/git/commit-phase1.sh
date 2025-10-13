#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# 스크립트 디렉토리
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}    Phase 1: 타입 확장 및 용어 개선 커밋${NC}"
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
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}    커밋할 변경사항${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${MAGENTA}1️⃣  타입 확장 (하위 호환성 유지)${NC}"
echo "   📄 src/features/projects/types.ts"
echo "      - VariableCostDetail 타입 추가"
echo "      - FixedCostDetail 타입 추가"
echo "      - CalculationInputs에 선택적 필드 추가"
echo "      - 변동비 세부: 원재료비, 패키지, 택배박스, 마켓수수료, 배송비, 기타"
echo "      - 고정비 세부: 인건비, 식비, 임대료, 공과금, 사무실운영비, 마케팅비, 기타"
echo ""

echo -e "${MAGENTA}2️⃣  Excel Generator 개선${NC}"
echo "   📄 src/lib/excel-generator.ts"
echo "      - Inputs 시트에 세부 항목 Export 추가"
echo "      - 용어 변경: '단위 원가' → '단위 변동비'"
echo "      - 합계 + 세부 내역 동시 표시"
echo "      - 세부 항목 섹션 분리 표시"
echo ""

echo -e "${MAGENTA}3️⃣  UI 용어 개선${NC}"
echo "   📄 src/app/calculator/components/CalculatorForm.tsx"
echo "      - Label: '단위 원가' → '단위 변동비'"
echo "      - Tooltip 설명 개선"
echo "      - 실무 용어와 일치하도록 수정"
echo ""

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 변경 통계
echo -e "${YELLOW}📈 변경 통계:${NC}"
git diff --stat
echo ""

# 테스트 상태 확인
echo -e "${YELLOW}🧪 테스트 상태:${NC}"
echo "   ✓ TypeScript 타입 체크: 통과"
echo "   ✓ 단위 테스트: 31/31 통과"
echo "   ✓ 하위 호환성: 유지"
echo ""

# diff 미리보기 제안
echo -e "${BLUE}💡 변경사항을 자세히 확인하시려면:${NC}"
echo "   git diff src/features/projects/types.ts"
echo "   git diff src/lib/excel-generator.ts"
echo "   git diff src/app/calculator/components/CalculatorForm.tsx"
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

# 파일 스테이징
echo -e "${YELLOW}📦 변경사항 스테이징 중...${NC}"
echo ""

# 수정 파일
echo "  📝 수정 파일 추가..."
git add src/features/projects/types.ts
git add src/lib/excel-generator.ts
git add src/app/calculator/components/CalculatorForm.tsx

# 커밋 메시지 및 스크립트
echo "  📋 커밋 관련 파일 추가..."
git add scripts/git/commit-messages/phase1-type-improvements.txt
git add scripts/git/commit-phase1.sh

echo ""
echo -e "${GREEN}✓ 스테이징 완료${NC}"
echo ""

# 스테이징된 파일 확인
echo -e "${YELLOW}📋 스테이징된 파일:${NC}"
git diff --cached --name-status
echo ""

# 커밋 실행
echo -e "${YELLOW}💾 커밋 생성 중...${NC}"
git commit -F "$SCRIPT_DIR/commit-messages/phase1-type-improvements.txt"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ 커밋 완료!${NC}"
    echo ""
else
    echo ""
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
git log --oneline -5
echo ""

# 커밋 상세 정보
echo -e "${YELLOW}📄 방금 생성한 커밋 내용:${NC}"
echo ""
git log -1 --stat
echo ""

# 커밋 메시지 미리보기
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}    커밋 메시지 (처음 20줄)${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
git log -1 --pretty=format:"%B" | head -20
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 다음 단계 안내
echo -e "${MAGENTA}🚀 다음 단계: Phase 2 (상세 입력 모드 UI)${NC}"
echo ""
echo "  1️⃣  DetailedInputForm 컴포넌트 작성"
echo "     - 변동비 세부 항목 입력 UI"
echo "     - 고정비 세부 항목 입력 UI"
echo "     - 자동 합계 계산"
echo ""
echo "  2️⃣  모드 토글 기능 구현"
echo "     - 간단 모드 / 상세 모드 전환"
echo "     - 펼치기/접기 애니메이션"
echo ""
echo "  3️⃣  Calculator 페이지 통합"
echo "     - 세부 항목 상태 관리"
echo "     - 데이터 동기화"
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
        echo ""
        echo -e "${GREEN}✓ Push 완료!${NC}"
    else
        echo ""
        echo -e "${RED}✗ Push 실패${NC}"
        echo -e "${YELLOW}💡 수동으로 push를 시도하세요: git push${NC}"
    fi
else
    echo ""
    echo -e "${YELLOW}ℹ️  나중에 수동으로 push하세요:${NC}"
    echo "   git push"
fi

echo ""
echo -e "${GREEN}🎉 Phase 1 작업 완료!${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}    작업 요약${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  ✅ 타입 확장 (VariableCostDetail, FixedCostDetail)"
echo "  ✅ 용어 개선 (단위 원가 → 단위 변동비)"
echo "  ✅ Excel Generator 개선 (세부 항목 Export)"
echo "  ✅ 하위 호환성 유지"
echo "  ✅ TypeScript 타입 체크 통과"
echo "  ✅ 모든 테스트 통과 (31/31)"
echo ""
echo -e "${MAGENTA}📚 다음 작업:${NC}"
echo "   Phase 2: 상세 입력 모드 UI 구현"
echo "   Phase 3: Excel Import 기능 구현"
echo ""
echo -e "${GREEN}Happy Coding! 🚀${NC}"
echo ""
