/**
 * 책자 제품 전용 타입 정의
 */

/**
 * 표지 종류
 */
export type CoverType =
  | "soft_cover"      // 소프트커버 (일반)
  | "hard_cover"      // 하드커버 (양장)
  | "separate_cover"  // 별도 커버
  | "pvc_cover";      // PVC 커버

/**
 * 코팅 종류
 */
export type CoatingType =
  | "glossy"   // 유광
  | "matte"    // 무광
  | "emboss"   // 엠보
  | "velvet"   // 벨벳
  | "uv";      // UV 코팅

/**
 * 라미네이팅 종류
 */
export type LaminationType =
  | "glossy"   // 유광
  | "matte";   // 무광

/**
 * 제본 방식
 */
export type BindingType =
  | "wireless"        // 무선철 (10-300p)
  | "stapled"         // 중철 (4-32p, 4의 배수)
  | "twin_ring"       // 쌍링 (2-200p)
  | "coil"            // 코일 (2-130p)
  | "thread"          // 실제본 (40-300p)
  | "exposed_thread"  // 노출제본 (20-200p)
  | "lay_flat";       // 누름제본 (20-50p)

/**
 * 인쇄 컬러 모드
 */
export type ColorMode =
  | "bw"      // 흑백
  | "color"   // 컬러
  | "spot"    // 별색
  | "mixed";  // 혼합 (일부만 컬러)

/**
 * 제본 위치
 */
export type BindingPosition =
  | "left"    // 왼쪽
  | "top"     // 위쪽
  | "right";  // 오른쪽

/**
 * 표지 사양
 */
export interface CoverSpecification {
  type: CoverType;                    // 표지 종류
  paper: string;                      // 표지 용지 (예: "아트지", "스노우")
  weight: string;                     // 용지 중량 (예: "250g", "300g")
  printing: "single" | "double";      // 단면/양면
  colorMode: Exclude<ColorMode, "mixed">; // 흑백/컬러/별색
  coating?: CoatingType;              // 코팅
  lamination?: LaminationType;        // 라미네이팅
  foiling?: string;                   // 박 (예: "금박", "은박")
  embossing?: string;                 // 형압
}

/**
 * 내지 사양
 */
export interface InnerSpecification {
  paper: string;                      // 내지 용지 (예: "모조지", "그린라이트")
  weight: string;                     // 용지 중량 (예: "80g", "100g")
  pageCount: number;                  // 내지 페이지 수
  colorMode: ColorMode;               // 흑백/컬러/혼합
  colorPages?: number[];              // 컬러 페이지 번호 (혼합인 경우)
  printMethod?: "digital" | "offset" | "indigo"; // 인쇄 방식
}

/**
 * 제본 사양
 */
export interface BindingSpecification {
  type: BindingType;                  // 제본 방식
  position?: BindingPosition;         // 제본 위치
  color?: string;                     // 제본 색상 (링/코일용)
  ringDiameter?: string;              // 링 직경 (쌍링/코일용)
}

/**
 * 책자 전용 사양
 */
export interface BookletSpecification {
  // 표지 사양
  cover: CoverSpecification;

  // 내지 사양
  inner: InnerSpecification;

  // 제본 정보
  binding: BindingSpecification;

  // 총 페이지 수 (표지 + 내지)
  totalPages: number;

  // 완제품 사이즈
  finishedSize: string; // 예: "A4 (210x297mm)"

  // 펼친 사이즈 (제본 전)
  unfoldedSize?: string; // 예: "A3 (420x297mm)"
}

/**
 * 제본 방식별 제약 조건
 */
export interface BindingConstraints {
  minPages: number;      // 최소 페이지
  maxPages: number;      // 최대 페이지
  pageMultiple?: number; // 페이지 배수 제약 (예: 4의 배수)
  description?: string;  // 설명
}

/**
 * 검증 결과
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * 제본 방식별 제약 조건 데이터
 */
export const BINDING_CONSTRAINTS: Record<BindingType, BindingConstraints> = {
  wireless: {
    minPages: 10,
    maxPages: 300,
    description: "무선철 제본 - 접착제로 표지와 내지를 붙이는 방식"
  },
  stapled: {
    minPages: 4,
    maxPages: 32,
    pageMultiple: 4,
    description: "중철 제본 - 스테이플러로 중앙을 고정하는 방식 (4의 배수)"
  },
  twin_ring: {
    minPages: 2,
    maxPages: 200,
    description: "쌍링 제본 - 2개의 링으로 고정하는 방식"
  },
  coil: {
    minPages: 2,
    maxPages: 130,
    description: "코일 제본 - 나선형 코일로 고정하는 방식"
  },
  thread: {
    minPages: 40,
    maxPages: 300,
    description: "실제본 - 실로 묶는 고급 제본 방식"
  },
  exposed_thread: {
    minPages: 20,
    maxPages: 200,
    description: "노출제본 - 실이 보이도록 제본하는 방식"
  },
  lay_flat: {
    minPages: 20,
    maxPages: 50,
    description: "누름제본 - 180도로 펼쳐지는 제본 방식"
  }
};

/**
 * 표지 용지 옵션
 */
export const COVER_PAPER_OPTIONS = [
  { value: "snow", label: "스노우", weights: ["210g", "240g", "250g", "300g"] },
  { value: "art", label: "아트지", weights: ["180g", "210g", "250g", "300g"] },
  { value: "arte", label: "아르떼", weights: ["210g", "240g", "300g"] },
  { value: "landevu", label: "랑데뷰", weights: ["210g", "240g", "260g", "300g"] },
] as const;

/**
 * 내지 용지 옵션
 */
export const INNER_PAPER_OPTIONS = [
  { value: "green_light", label: "그린라이트", weights: ["70g", "80g", "90g", "100g"] },
  { value: "matte_mozo", label: "무광 모조지", weights: ["80g", "100g", "120g"] },
  { value: "white_mozo", label: "백색 모조지", weights: ["80g", "100g", "120g"] },
  { value: "new_plus", label: "뉴플러스", weights: ["80g", "100g", "120g"] },
] as const;
