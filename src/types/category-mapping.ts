/**
 * 인쇄 제품 카테고리 매핑
 * 레드프린팅 카테고리 구조 기반
 *
 * 참고: docs/redprinting-category-analysis.md
 */

export interface CategoryMapping {
  /** 대분류 */
  mainCategory: string;
  /** 중분류 */
  subCategory: string;
  /** 제품명 (소분류) */
  productName: string;
  /** 제품 설명 */
  description?: string;
}

/**
 * 인쇄 제품 카테고리 데이터베이스
 */
export const CATEGORY_MAPPING: Record<string, CategoryMapping> = {
  // ========================================
  // 1. 명함 (Business Cards)
  // ========================================
  일반명함: {
    mainCategory: "명함",
    subCategory: "일반 명함",
    productName: "일반 명함",
    description: "기본형 명함",
  },
  화이트인쇄명함: {
    mainCategory: "명함",
    subCategory: "일반 명함",
    productName: "화이트인쇄 컬러명함",
    description: "검은색/어두운 용지에 흰색 인쇄",
  },
  고급지명함: {
    mainCategory: "명함",
    subCategory: "일반 명함",
    productName: "고급지 명함",
    description: "프리미엄 용지 사용",
  },
  "2단명함": {
    mainCategory: "명함",
    subCategory: "접지 명함",
    productName: "2단 명함",
    description: "2단 접지형 명함",
  },
  "3단명함": {
    mainCategory: "명함",
    subCategory: "접지 명함",
    productName: "3단 명함",
    description: "3단 접지형 명함",
  },
  엠보싱명함: {
    mainCategory: "명함",
    subCategory: "프리미엄 명함",
    productName: "엠보싱 명함",
    description: "양각/음각 가공",
  },
  박형압명함: {
    mainCategory: "명함",
    subCategory: "프리미엄 명함",
    productName: "박/형압 명함",
    description: "금박, 은박 등 포일 가공",
  },
  레이저커팅명함: {
    mainCategory: "명함",
    subCategory: "프리미엄 명함",
    productName: "레이저커팅 명함",
    description: "정밀 레이저 컷팅",
  },

  // ========================================
  // 2. 홍보물 (Promotional Materials)
  // ========================================
  리플렛: {
    mainCategory: "홍보물",
    subCategory: "홍보",
    productName: "리플렛",
    description: "접지형 홍보물",
  },
  일반전단: {
    mainCategory: "홍보물",
    subCategory: "홍보",
    productName: "일반전단",
    description: "전단지",
  },
  종이포스터: {
    mainCategory: "홍보물",
    subCategory: "포스터",
    productName: "종이 포스터",
    description: "일반 종이 포스터",
  },
  대형포스터: {
    mainCategory: "홍보물",
    subCategory: "포스터",
    productName: "대형 종이포스터(A1)",
    description: "A1 사이즈 대형 포스터",
  },

  // ========================================
  // 3. 스티커 (Stickers)
  // ========================================
  원형판스티커: {
    mainCategory: "스티커",
    subCategory: "판스티커",
    productName: "원형 판스티커",
    description: "원형 낱장 스티커",
  },
  사각판스티커: {
    mainCategory: "스티커",
    subCategory: "판스티커",
    productName: "사각 판스티커",
    description: "사각 낱장 스티커",
  },
  에폭시스티커: {
    mainCategory: "스티커",
    subCategory: "프리미엄 스티커",
    productName: "에폭시 스티커",
    description: "에폭시 코팅",
  },

  // ========================================
  // 4. 스테이셔너리 (Stationery)
  // ========================================
  포토카드: {
    mainCategory: "스테이셔너리",
    subCategory: "카드/엽서",
    productName: "포토카드",
    description: "사진 인화 카드",
  },
  일반카드: {
    mainCategory: "스테이셔너리",
    subCategory: "카드/엽서",
    productName: "일반카드",
    description: "일반 카드",
  },
  "2단접지카드": {
    mainCategory: "스테이셔너리",
    subCategory: "카드/엽서",
    productName: "2단 접지 카드",
    description: "2단 접지형 엽서카드",
  },
  투명카드: {
    mainCategory: "스테이셔너리",
    subCategory: "카드/엽서",
    productName: "투명카드",
    description: "투명 PET 카드",
  },
  PVC커버노트: {
    mainCategory: "스테이셔너리",
    subCategory: "노트",
    productName: "PVC커버 노트",
    description: "PVC 커버 노트",
  },
  스케줄러: {
    mainCategory: "스테이셔너리",
    subCategory: "노트",
    productName: "스케줄러",
    description: "다이어리/플래너",
  },

  // ========================================
  // 5. 책의 완성 (Book Production)
  // ========================================
  무선제본책자: {
    mainCategory: "책의 완성",
    subCategory: "윤전 책자",
    productName: "무선 제본 책자",
    description: "무선 제본 방식 책자",
  },
  무선책자컬러: {
    mainCategory: "책의 완성",
    subCategory: "윤전 책자",
    productName: "무선 책자(컬러)",
    description: "컬러 무선 제본",
  },
  무선책자흑백: {
    mainCategory: "책의 완성",
    subCategory: "윤전 책자",
    productName: "무선 책자(흑백)",
    description: "흑백 무선 제본",
  },
  스프링제본책자: {
    mainCategory: "책의 완성",
    subCategory: "윤전 책자",
    productName: "스프링 제본 책자",
    description: "스프링 제본 방식 책자",
  },
  스프링책자컬러: {
    mainCategory: "책의 완성",
    subCategory: "윤전 책자",
    productName: "스프링 책자(컬러)",
    description: "컬러 스프링 제본",
  },
  스프링책자흑백: {
    mainCategory: "책의 완성",
    subCategory: "윤전 책자",
    productName: "스프링 책자(흑백)",
    description: "흑백 스프링 제본",
  },
  트윈링책자컬러: {
    mainCategory: "책의 완성",
    subCategory: "윤전 책자",
    productName: "트윈링 책자(컬러)",
    description: "컬러 트윈링 제본",
  },
  트윈링책자흑백: {
    mainCategory: "책의 완성",
    subCategory: "윤전 책자",
    productName: "트윈링 책자(흑백)",
    description: "흑백 트윈링 제본",
  },
  중철제본책자: {
    mainCategory: "책의 완성",
    subCategory: "윤전 책자",
    productName: "중철 제본 책자",
    description: "중철 제본 방식 책자 (스테이플러)",
  },
  중철책자컬러: {
    mainCategory: "책의 완성",
    subCategory: "윤전 책자",
    productName: "중철 책자(컬러)",
    description: "컬러 중철 제본",
  },
  중철책자흑백: {
    mainCategory: "책의 완성",
    subCategory: "윤전 책자",
    productName: "중철 책자(흑백)",
    description: "흑백 중철 제본",
  },
  사철제본책자: {
    mainCategory: "책의 완성",
    subCategory: "윤전 책자",
    productName: "사철 제본 책자",
    description: "사철 제본 방식 책자 (실로 묶음)",
  },
  사철책자컬러: {
    mainCategory: "책의 완성",
    subCategory: "윤전 책자",
    productName: "사철 책자(컬러)",
    description: "컬러 사철 제본",
  },
  사철책자흑백: {
    mainCategory: "책의 완성",
    subCategory: "윤전 책자",
    productName: "사철 책자(흑백)",
    description: "흑백 사철 제본",
  },
  윤전인쇄책자: {
    mainCategory: "책의 완성",
    subCategory: "윤전 책자",
    productName: "윤전 인쇄 책자",
    description: "윤전 인쇄 방식 책자",
  },
  토너잉크젯책자: {
    mainCategory: "책의 완성",
    subCategory: "토너/잉크젯 책자",
    productName: "토너/잉크젯 책자",
    description: "토너 또는 잉크젯 인쇄 책자",
  },
  특가트윈링책자: {
    mainCategory: "책의 완성",
    subCategory: "토너/잉크젯 책자",
    productName: "특가 트윈링 책자",
    description: "특가 트윈링 제본",
  },
  독립출판: {
    mainCategory: "책의 완성",
    subCategory: "용도별 책자",
    productName: "독립출판/개인 책자",
    description: "1인 출판, 개인 문집",
  },
  브로셔카탈로그: {
    mainCategory: "책의 완성",
    subCategory: "용도별 책자",
    productName: "브로셔/카탈로그",
    description: "회사 소개서, 제품 카탈로그",
  },
  제안서보고서: {
    mainCategory: "책의 완성",
    subCategory: "용도별 책자",
    productName: "제안서/보고서/학술서",
    description: "기업 제안서, 연구 보고서",
  },

  // ========================================
  // 6. 스탬프 (Stamps)
  // ========================================
  자동스탬프: {
    mainCategory: "스탬프",
    subCategory: "잉크충전 스탬프",
    productName: "자동스탬프",
    description: "자동 스탬프",
  },
  나무스탬프: {
    mainCategory: "스탬프",
    subCategory: "나무 스탬프",
    productName: "원목 스탬프",
    description: "원목 도장",
  },

  // ========================================
  // 7. 가게 용품 (Store Supplies)
  // ========================================
  풀프린팅텀블러: {
    mainCategory: "가게 용품",
    subCategory: "텀블러",
    productName: "풀프린팅 텀블러",
    description: "전면 인쇄 텀블러",
  },
  프리미엄텀블러: {
    mainCategory: "가게 용품",
    subCategory: "텀블러",
    productName: "프리미엄 텀블러",
    description: "프리미엄 재질 텀블러",
  },

  // ========================================
  // 8. 패브릭/잡화 (Fabric & Miscellaneous)
  // ========================================
  쿠션: {
    mainCategory: "패브릭/잡화",
    subCategory: "패브릭 소품",
    productName: "쿠션",
    description: "커스텀 쿠션",
  },
  파우치: {
    mainCategory: "패브릭/잡화",
    subCategory: "파우치",
    productName: "파우치",
    description: "화장품 파우치, 필통",
  },

  // ========================================
  // 9. 의류/가방 (Apparel & Bags)
  // ========================================
  길단티셔츠: {
    mainCategory: "의류/가방",
    subCategory: "길단 티셔츠",
    productName: "길단 티셔츠",
    description: "길단(Gildan) 브랜드 티셔츠",
  },
  단체티: {
    mainCategory: "의류/가방",
    subCategory: "단체티",
    productName: "단체티",
    description: "단체복, 행사티",
  },
  에코백: {
    mainCategory: "의류/가방",
    subCategory: "가방",
    productName: "에코백",
    description: "에코백, 캔버스백",
  },

  // ========================================
  // 10. 라이프 (Lifestyle)
  // ========================================
  글라스범퍼케이스: {
    mainCategory: "라이프",
    subCategory: "폰케이스",
    productName: "글라스 범퍼케이스",
    description: "강화유리 범퍼 폰케이스",
  },
  에폭시범퍼케이스: {
    mainCategory: "라이프",
    subCategory: "폰케이스",
    productName: "에폭시 범퍼케이스",
    description: "에폭시 코팅 범퍼 폰케이스",
  },
  아크릴키링: {
    mainCategory: "라이프",
    subCategory: "키링",
    productName: "아크릴 키링",
    description: "아크릴 열쇠고리",
  },

  // ========================================
  // 11. 대형 실사 출력 (Large Format Printing)
  // ========================================
  현수막: {
    mainCategory: "대형 실사 출력",
    subCategory: "현수막",
    productName: "현수막",
    description: "일반 현수막",
  },
  일반현수막: {
    mainCategory: "대형 실사 출력",
    subCategory: "현수막",
    productName: "일반 현수막",
    description: "일반 현수막",
  },
  텐트천현수막: {
    mainCategory: "대형 실사 출력",
    subCategory: "현수막",
    productName: "텐트천 현수막",
    description: "텐트천 재질 현수막",
  },
  X배너: {
    mainCategory: "대형 실사 출력",
    subCategory: "배너",
    productName: "X배너",
    description: "X형 배너 거치대",
  },
  롤업배너: {
    mainCategory: "대형 실사 출력",
    subCategory: "배너",
    productName: "롤업배너",
    description: "롤업형 배너",
  },

  // ========================================
  // 12. 성수동 사진관 (Seongsu Photo Studio)
  // ========================================
  일반사진인화: {
    mainCategory: "성수동 사진관",
    subCategory: "사진인화",
    productName: "일반 사진인화",
    description: "일반 규격 사진",
  },
  소프트커버포토북: {
    mainCategory: "성수동 사진관",
    subCategory: "포토북",
    productName: "소프트커버 포토북",
    description: "소프트 커버 제본",
  },
  하드커버포토북: {
    mainCategory: "성수동 사진관",
    subCategory: "포토북",
    productName: "하드커버 포토북",
    description: "하드 커버 제본",
  },
};

/**
 * 제품명으로 카테고리 정보 조회
 */
export function getCategoryByProductName(productName: string): CategoryMapping | undefined {
  // 공백 제거 후 검색
  const normalizedName = productName.replace(/\s+/g, "");

  // 정확히 일치하는 키 찾기
  const exactMatch = CATEGORY_MAPPING[normalizedName];
  if (exactMatch) return exactMatch;

  // 부분 일치 검색
  for (const [key, value] of Object.entries(CATEGORY_MAPPING)) {
    if (value.productName === productName) {
      return value;
    }
  }

  return undefined;
}

/**
 * 대분류로 필터링
 */
export function getCategoriesByMainCategory(mainCategory: string): CategoryMapping[] {
  return Object.values(CATEGORY_MAPPING).filter(
    (cat) => cat.mainCategory === mainCategory
  );
}

/**
 * 중분류로 필터링
 */
export function getCategoriesBySubCategory(subCategory: string): CategoryMapping[] {
  return Object.values(CATEGORY_MAPPING).filter(
    (cat) => cat.subCategory === subCategory
  );
}

/**
 * 모든 대분류 목록
 */
export const MAIN_CATEGORIES = [
  "명함",
  "홍보물",
  "스티커",
  "스테이셔너리",
  "책의 완성",
  "스탬프",
  "가게 용품",
  "패브릭/잡화",
  "의류/가방",
  "라이프",
  "대형 실사 출력",
  "성수동 사진관",
] as const;

export type MainCategory = (typeof MAIN_CATEGORIES)[number];
