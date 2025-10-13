/**
 * 책자 제품 Mock 데이터
 */

import type { JobOrderData } from "@/types/job-order";
import type { BookletSpecification } from "@/types/booklet";

/**
 * 책자 제품의 ProductInfo를 확장한 타입
 */
interface BookletJobOrderData extends Omit<JobOrderData, "product"> {
  product: JobOrderData["product"] & {
    booklet: BookletSpecification;
  };
}

/**
 * 책자 제품 Mock 데이터베이스
 */
export const bookletMockDatabase: Record<string, BookletJobOrderData> = {
  // 1. 무선철 카탈로그
  "booklet-1": {
    documentNumber: "202510-BK-00431",
    orderDate: "2025-10-13",
    clientName: "ABC출판사",
    orderNumber: "BK-8360443",
    ordererName: "김편집",
    deliveryDate: "2025-10-20",
    deliveryMethod: "택배",
    itemCount: "50 권",
    recipientName: "김편집",
    deliveryMemo: "배송 전 연락 부탁드립니다",

    product: {
      productName: "카탈로그",
      companyProductName: "고급 카탈로그 - 무선철 제본",
      productionNumber: "BK-2025-001",
      productionQuantity: "50 권",

      size: "A4",
      finishedSize: "210x297mm",

      specification: {
        productType: "multi",
        printSide: "both",
        pageCount: 204,
        bindingType: "wireless",
      },

      booklet: {
        cover: {
          type: "soft_cover",
          paper: "아트지",
          weight: "250g",
          printing: "double",
          colorMode: "color",
          coating: "matte",
        },
        inner: {
          paper: "모조지",
          weight: "80g",
          pageCount: 200,
          colorMode: "mixed",
          colorPages: [1, 2, 3, 4, 5, 6, 195, 196, 197, 198, 199, 200],
          printMethod: "offset",
        },
        binding: {
          type: "wireless",
          position: "left",
        },
        totalPages: 204,
        finishedSize: "210x297mm",
      },

      images: [
        {
          id: "cover-1",
          url: "/designs/catalog/cover-front.pdf",
          side: "front",
          description: "표지 앞면",
        },
        {
          id: "cover-2",
          url: "/designs/catalog/cover-back.pdf",
          side: "back",
          description: "표지 뒷면",
        },
        {
          id: "inner-1",
          url: "/designs/catalog/inner-pages.pdf",
          pageNumber: 1,
          description: "내지 전체 (200p)",
        },
      ],

      postProcessing: [
        {
          id: "pp-1",
          name: "표지 무광코팅",
          description: "표지 앞뒷면 무광 코팅 처리",
        },
      ],

      note: "앞뒤 6페이지씩만 컬러, 나머지는 흑백 인쇄",
    },

    printDate: "2025년 10월 13일 오후 14:30:00",
    printedBy: "운영자(operator)",
  },

  // 2. 중철 소책자
  "booklet-2": {
    documentNumber: "202510-BK-00532",
    orderDate: "2025-10-14",
    clientName: "디자인스튜디오",
    orderNumber: "BK-8360789",
    ordererName: "박디자인",
    deliveryDate: "2025-10-18",
    deliveryMethod: "퀵서비스",
    itemCount: "200 권",
    recipientName: "박디자인",
    deliveryMemo: "급한 물건입니다",

    product: {
      productName: "소책자",
      companyProductName: "중철 소책자 - 컬러",
      productionNumber: "BK-2025-002",
      productionQuantity: "200 권",

      size: "A5",
      finishedSize: "148x210mm",

      specification: {
        productType: "multi",
        printSide: "both",
        pageCount: 20,
        bindingType: "stapled",
      },

      booklet: {
        cover: {
          type: "soft_cover",
          paper: "스노우",
          weight: "240g",
          printing: "double",
          colorMode: "color",
          coating: "glossy",
        },
        inner: {
          paper: "그린라이트",
          weight: "100g",
          pageCount: 16,
          colorMode: "color",
          printMethod: "digital",
        },
        binding: {
          type: "stapled",
          position: "left",
        },
        totalPages: 20,
        finishedSize: "148x210mm",
      },

      images: [
        {
          id: "cover-1",
          url: "/designs/booklet/cover-front.pdf",
          side: "front",
          description: "표지 앞면",
        },
        {
          id: "cover-2",
          url: "/designs/booklet/cover-back.pdf",
          side: "back",
          description: "표지 뒷면",
        },
        {
          id: "inner-1",
          url: "/designs/booklet/inner-all.pdf",
          pageNumber: 1,
          description: "내지 전체 (16p)",
        },
      ],

      postProcessing: [
        {
          id: "pp-1",
          name: "표지 유광코팅",
          description: "표지 앞면 유광 코팅 처리",
        },
      ],

      note: "전체 컬러 인쇄, 중철 제본 (4의 배수)",
    },

    printDate: "2025년 10월 14일 오전 10:15:00",
    printedBy: "운영자(operator)",
  },

  // 3. 코일 바인딩 매뉴얼
  "booklet-3": {
    documentNumber: "202510-BK-00891",
    orderDate: "2025-10-15",
    clientName: "테크기업",
    orderNumber: "BK-8361024",
    ordererName: "최매니저",
    deliveryDate: "2025-10-22",
    deliveryMethod: "택배",
    itemCount: "30 권",
    recipientName: "최매니저",
    deliveryMemo: "사무실 부재시 경비실에 맡겨주세요",

    product: {
      productName: "사용자 매뉴얼",
      companyProductName: "코일 바인딩 매뉴얼",
      productionNumber: "BK-2025-003",
      productionQuantity: "30 권",

      size: "B5",
      finishedSize: "182x257mm",

      specification: {
        productType: "multi",
        printSide: "both",
        pageCount: 104,
        bindingType: "coil",
      },

      booklet: {
        cover: {
          type: "pvc_cover",
          paper: "PVC 투명",
          weight: "0.3mm",
          printing: "single",
          colorMode: "color",
        },
        inner: {
          paper: "백색 모조지",
          weight: "100g",
          pageCount: 100,
          colorMode: "bw",
          printMethod: "digital",
        },
        binding: {
          type: "coil",
          position: "left",
          color: "검정",
          ringDiameter: "14mm",
        },
        totalPages: 104,
        finishedSize: "182x257mm",
      },

      images: [
        {
          id: "cover-1",
          url: "/designs/manual/cover.pdf",
          side: "front",
          description: "PVC 표지",
        },
        {
          id: "inner-1",
          url: "/designs/manual/pages.pdf",
          pageNumber: 1,
          description: "내지 전체 (100p)",
        },
      ],

      postProcessing: [],

      note: "PVC 투명 표지, 흑백 인쇄, 검정 코일 제본",
    },

    printDate: "2025년 10월 15일 오후 16:20:00",
    printedBy: "운영자(operator)",
  },

  // 4. 양장 하드커버 책
  "booklet-4": {
    documentNumber: "202510-BK-01203",
    orderDate: "2025-10-16",
    clientName: "문예출판사",
    orderNumber: "BK-8361500",
    ordererName: "이편집장",
    deliveryDate: "2025-10-30",
    deliveryMethod: "택배",
    itemCount: "100 권",
    recipientName: "이편집장",
    deliveryMemo: "훼손 주의",

    product: {
      productName: "양장본",
      companyProductName: "고급 양장 하드커버",
      productionNumber: "BK-2025-004",
      productionQuantity: "100 권",

      size: "A5",
      finishedSize: "148x210mm",

      specification: {
        productType: "multi",
        printSide: "both",
        pageCount: 304,
        bindingType: "thread",
      },

      booklet: {
        cover: {
          type: "hard_cover",
          paper: "하드보드 + 아트지",
          weight: "2mm + 180g",
          printing: "single",
          colorMode: "color",
          foiling: "금박",
        },
        inner: {
          paper: "뉴플러스",
          weight: "80g",
          pageCount: 300,
          colorMode: "bw",
          printMethod: "offset",
        },
        binding: {
          type: "thread",
          position: "left",
        },
        totalPages: 304,
        finishedSize: "148x210mm",
      },

      images: [
        {
          id: "cover-1",
          url: "/designs/book/cover.pdf",
          side: "front",
          description: "하드커버 표지",
        },
        {
          id: "inner-1",
          url: "/designs/book/inner-pages.pdf",
          pageNumber: 1,
          description: "내지 전체 (300p)",
        },
      ],

      postProcessing: [
        {
          id: "pp-1",
          name: "표지 금박",
          description: "제목 부분 금박 처리",
        },
        {
          id: "pp-2",
          name: "실제본",
          description: "실로 묶는 고급 제본",
        },
      ],

      note: "하드커버 양장, 표지 금박 처리, 실제본",
    },

    printDate: "2025년 10월 16일 오전 11:00:00",
    printedBy: "운영자(operator)",
  },
};

/**
 * 책자 제품 타입 가드
 */
export function isBookletOrder(order: JobOrderData): order is BookletJobOrderData {
  return (
    order.product.specification.productType === "multi" &&
    "booklet" in order.product
  );
}
