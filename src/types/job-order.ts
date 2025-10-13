/**
 * 제작 의뢰서 API 스키마 정의
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

  // 제품 정보
  productName: string;
  companyProductName: string;
  productSize: string;
  productionNumber: string;
  productionQuantity: string;

  // 비고
  note?: string;

  // 옵션 정보
  options: JobOrderOptions;

  // 출력 정보
  printDate: string;
  printedBy: string;
}

export interface JobOrderApiResponse {
  success: boolean;
  data?: JobOrderData;
  error?: string;
}
