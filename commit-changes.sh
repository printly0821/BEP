#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Git Commit & Push Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 변경사항 확인
if [[ -z $(git status -s) ]]; then
    echo -e "${GREEN}✓ Working tree clean - 커밋할 변경사항이 없습니다.${NC}"
    echo ""
    echo -e "${BLUE}최근 커밋:${NC}"
    git log --oneline -3
    exit 0
fi

# 1. Git 상태 확인
echo -e "${YELLOW}[1/6] Git 상태 확인 중...${NC}"
git status
echo ""

# 2. Git diff 통계 확인
echo -e "${YELLOW}[2/6] 변경사항 통계 확인 중...${NC}"
git diff --stat
echo ""

# 3. 최근 커밋 로그 확인
echo -e "${YELLOW}[3/6] 최근 커밋 로그...${NC}"
git log --oneline -5
echo ""

# 4. 변경된 파일 stage
echo -e "${YELLOW}[4/6] 변경사항 staging 중...${NC}"
git add src/types/job-order.ts \
        src/app/api/job-orders/mock-data.ts \
        src/app/test-report/components/JobOrderReportView.tsx
echo -e "${GREEN}✓ 메인 파일 staged${NC}"

# 5. 첫 번째 커밋 (페이지 번호 개선)
# staged된 파일이 있는지 확인
if [[ -z $(git diff --cached --name-only) ]]; then
    echo -e "${YELLOW}[5/6] 커밋할 변경사항 없음 - 건너뜀${NC}"
else
    echo -e "${YELLOW}[5/6] 첫 번째 커밋 생성 중...${NC}"
    git commit -m "$(cat <<'EOF'
fix(report): 책자 페이지 번호 체계 개선 및 전체 페이지 이미지 생성

- pageType 필드 추가 (cover_front, inside, cover_back)
- 책자 페이지 표시 로직 개선: 표지/속지/뒷표지 구분
- ID8(사철 제본 책자) 이미지 15개 → 48개 전체 생성
- 페이지 카운터 수정: specification.pageCount 기준으로 표시
- 이미지 뷰어에서 올바른 페이지 레이블 표시

이전에는 이미지 개수(47)가 페이지로 잘못 표시되었으나,
이제 표지 + 속지(1~46) + 뒷표지로 정확히 구분하여 표시됩니다.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ 첫 번째 커밋 성공${NC}"
    else
        echo -e "${RED}✗ 커밋 실패${NC}"
        exit 1
    fi
fi
echo ""

# .gitignore 업데이트 (이미지 제외)
if ! grep -q "img/" .gitignore; then
    echo -e "${YELLOW}[추가] .gitignore 업데이트 중...${NC}"
    echo "" >> .gitignore
    echo "# Screenshots and temporary images" >> .gitignore
    echo "img/" >> .gitignore
    echo -e "${GREEN}✓ .gitignore 업데이트 완료${NC}"
fi

# 문서 및 카테고리 시스템 stage
echo -e "${YELLOW}[추가] 문서 파일 staging 중...${NC}"
git add .gitignore \
        docs/ \
        src/types/category-mapping.ts \
        src/app/api/job-orders/mock-data-booklet.ts \
        src/lib/booklet-validator.ts \
        src/types/booklet.ts
echo -e "${GREEN}✓ 문서 및 시스템 파일 staged${NC}"
echo ""

# 두 번째 커밋 (문서 추가)
# staged된 파일이 있는지 확인
if [[ -z $(git diff --cached --name-only) ]]; then
    echo -e "${YELLOW}[추가] 커밋할 변경사항 없음 - 건너뜀${NC}"
else
    echo -e "${YELLOW}[추가] 두 번째 커밋 생성 중...${NC}"
    git commit -m "$(cat <<'EOF'
docs: 카테고리 분석 문서 및 매핑 시스템 추가

- 레드프린팅 카테고리 구조 분석 문서 추가
- 카테고리 일관성 보고서 추가
- 제품 카테고리 매핑 시스템 구현 (58개 제품)
- 책자 검증 시스템 추가 (mock-data-booklet, validator)
- .gitignore에 img/ 폴더 추가 (스크린샷 제외)

총 58개 제품의 대분류-중분류-제품명 매핑을 제공하여
제품명 일관성을 유지할 수 있습니다.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ 두 번째 커밋 성공${NC}"
    else
        echo -e "${RED}✗ 커밋 실패${NC}"
        exit 1
    fi
fi
echo ""

# 6. Push to remote
# 푸시할 커밋이 있는지 확인
COMMITS_TO_PUSH=$(git rev-list @{u}..HEAD 2>/dev/null | wc -l)
if [ "$COMMITS_TO_PUSH" -eq 0 ]; then
    echo -e "${YELLOW}[6/6] Push할 커밋 없음 - 이미 최신 상태입니다.${NC}"
else
    echo -e "${YELLOW}[6/6] 원격 저장소에 push 중... ($COMMITS_TO_PUSH개 커밋)${NC}"
    git push origin main

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Push 성공${NC}"
    else
        echo -e "${RED}✗ Push 실패${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ 모든 작업 완료!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}최근 커밋:${NC}"
git log --oneline -3
echo ""
