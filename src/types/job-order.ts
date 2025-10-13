/**
 * 제작 의뢰서 API 스키마 정의 (인쇄 산업 맞춤형)
 */

/**
 * 제품 타입
 * - single: 단면 인쇄 (명함 앞면만, 전단지 등)
 * - double: 양면 인쇄 (명함 양면, 리플렛 등)
 * - multi: 다중 페이지 (책자, 팜플렛, 카탈로그 등)
 */
export type ProductType = "single" | "double" | "multi";

/**
 * 인쇄 면 정보
 * - front_only: 앞면만 인쇄
 * - back_only: 뒷면만 인쇄
 * - both: 양면 인쇄
 */
export type PrintSide = "front_only" | "back_only" | "both";

/**
 * 제품 이미지 정보
 */
export interface ProductImage {
  id: string;
  url: string;
  side?: "front" | "back"; // 단면/양면 제품용
  pageNumber?: number; // 다중 페이지 제품용 (1부터 시작)
  description?: string; // 이미지 설명
  width?: number; // 이미지 너비 (픽셀)
  height?: number; // 이미지 높이 (픽셀)
}

/**
 * 후가공 정보
 */
export interface PostProcessing {
  id: string;
  name: string; // 후가공 이름 (예: "UV 코팅", "박", "형압", "귀도리")
  description?: string; // 상세 설명
  images?: ProductImage[]; // 후가공 참고 이미지
  position?: string; // 후가공 위치 (예: "전면", "로고 부분")
}

/**
 * 인쇄 사양
 */
export interface PrintSpecification {
  productType: ProductType; // 제품 타입
  printSide: PrintSide; // 인쇄 면
  pageCount?: number; // 총 페이지 수 (multi 타입인 경우 필수)
  colorFront?: string; // 앞면 도수 (예: "4도", "1도")
  colorBack?: string; // 뒷면 도수 (예: "4도", "1도", "무지")
  paper?: string; // 용지 (예: "랑데뷰 240g", "아트지 150g")
  finishing?: string; // 기본 마무리 (예: "무광코팅", "유광코팅")
  bindingType?: string; // 제책 방식 (다중 페이지용: "중철", "무선철", "양장")
}

/**
 * 제품 정보
 */
export interface ProductInfo {
  // 기본 정보
  productName: string; // 제품명 (예: "2단접지카드", "명함", "카탈로그")
  companyProductName: string; // 업체 상품명
  productionNumber: string; // 제작 번호
  productionQuantity: string; // 제작 수량

  // 규격
  size: string; // 사이즈 (예: "150x100mm", "A4")
  finishedSize?: string; // 완성 사이즈 (재단 후)

  // 인쇄 사양
  specification: PrintSpecification;

  // 이미지
  images: ProductImage[]; // 제품 디자인 이미지

  // 후가공
  postProcessing?: PostProcessing[]; // 후가공 목록

  // 비고
  note?: string;
}

/**
 * 옵션 정보 (기존 호환성 유지)
 */
export interface JobOrderOptions {
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  option5?: string;
  option6?: string;
  option7?: string;
}

/**
 * 제작 의뢰서 데이터
 */
export interface JobOrderData {
  // 문서 정보
  documentNumber: string;

  // 주문 정보
  orderDate: string;
  clientName: string;
  orderNumber: string;
  ordererName: string;

  // 출고 정보
  deliveryDate: string;
  deliveryMethod: string;
  itemCount: string;
  recipientName: string;
  deliveryMemo: string;

  // 제품 정보 (개선됨)
  product: ProductInfo;

  // 옵션 정보 (레거시 지원)
  options?: JobOrderOptions;

  // 출력 정보
  printDate: string;
  printedBy: string;
}

/**
 * API 응답
 */
export interface JobOrderApiResponse {
  success: boolean;
  data?: JobOrderData;
  error?: string;
}

/**
 * 목록 조회용 요약 데이터
 */
export interface JobOrderSummary {
  id: string;
  documentNumber: string;
  orderNumber: string;
  clientName: string;
  orderDate: string;
  productName: string;
  productType: ProductType;
  status?: "pending" | "in_progress" | "completed" | "shipped";
}

// ========================================
// 타입 가드 및 유틸리티
// ========================================

/**
 * 단면 제품인지 확인
 */
export function isSingleSided(product: ProductInfo): boolean {
  return product.specification.productType === "single";
}

/**
 * 양면 제품인지 확인
 */
export function isDoubleSided(product: ProductInfo): boolean {
  return product.specification.productType === "double";
}

/**
 * 다중 페이지 제품인지 확인
 */
export function isMultiPage(product: ProductInfo): boolean {
  return product.specification.productType === "multi";
}

/**
 * 앞면 이미지 필터링
 */
export function getFrontImages(images: ProductImage[]): ProductImage[] {
  return images.filter((img) => img.side === "front");
}

/**
 * 뒷면 이미지 필터링
 */
export function getBackImages(images: ProductImage[]): ProductImage[] {
  return images.filter((img) => img.side === "back");
}

/**
 * 페이지별 이미지 필터링
 */
export function getPageImages(
  images: ProductImage[],
  pageNumber: number
): ProductImage[] {
  return images.filter((img) => img.pageNumber === pageNumber);
}

/**
 * 모든 페이지 번호 추출
 */
export function getAllPageNumbers(images: ProductImage[]): number[] {
  const pageNumbers = images
    .filter((img) => img.pageNumber !== undefined)
    .map((img) => img.pageNumber as number);
  return Array.from(new Set(pageNumbers)).sort((a, b) => a - b);
}
