# 제작 의뢰서 API 타입 정의

인쇄 산업에 특화된 제작 의뢰서 API 스키마입니다.

## 📋 주요 타입

### ProductType (제품 타입)

```typescript
type ProductType = "single" | "double" | "multi";
```

- **single**: 단면 인쇄 (전단지, 포스터, 스티커 등)
- **double**: 양면 인쇄 (명함 양면, 2단 접지 등)
- **multi**: 다중 페이지 (책자, 카탈로그, 팜플렛 등)

### PrintSide (인쇄 면)

```typescript
type PrintSide = "front_only" | "back_only" | "both";
```

- **front_only**: 앞면만 인쇄
- **back_only**: 뒷면만 인쇄
- **both**: 양면 인쇄

### ProductImage (제품 이미지)

```typescript
interface ProductImage {
  id: string;              // 고유 ID
  url: string;             // 이미지 URL
  side?: "front" | "back"; // 앞면/뒷면 (단면/양면 제품용)
  pageNumber?: number;     // 페이지 번호 (다중 페이지 제품용)
  description?: string;    // 이미지 설명
  width?: number;          // 너비 (픽셀)
  height?: number;         // 높이 (픽셀)
}
```

### PostProcessing (후가공)

```typescript
interface PostProcessing {
  id: string;
  name: string;           // 후가공 이름 (예: "UV 코팅", "금박", "형압")
  description?: string;   // 상세 설명
  images?: ProductImage[]; // 후가공 참고 이미지
  position?: string;      // 후가공 위치
}
```

## 🎯 사용 예시

### 1. 양면 명함

```typescript
const businessCard: JobOrderData = {
  documentNumber: "202510-BIZ-00431_00",
  // ... 기본 정보 ...
  product: {
    productName: "명함",
    productionQuantity: "500 매",
    size: "90x50mm",
    specification: {
      productType: "double",  // 양면
      printSide: "both",      // 앞면+뒷면
      colorFront: "4도",
      colorBack: "4도",
      paper: "스노우화이트 300g",
    },
    images: [
      {
        id: "img_front",
        url: "/images/card-front.jpg",
        side: "front",  // 앞면
        description: "명함 앞면",
      },
      {
        id: "img_back",
        url: "/images/card-back.jpg",
        side: "back",   // 뒷면
        description: "명함 뒷면",
      },
    ],
    postProcessing: [
      {
        id: "post_1",
        name: "UV 코팅",
        position: "앞면 전체",
      },
    ],
  },
};
```

### 2. 단면 포스터

```typescript
const poster: JobOrderData = {
  documentNumber: "202510-POS-00123_00",
  // ... 기본 정보 ...
  product: {
    productName: "포스터",
    productionQuantity: "50 매",
    size: "A1 (594x841mm)",
    specification: {
      productType: "single",    // 단면
      printSide: "front_only",  // 앞면만
      colorFront: "4도",
      paper: "아트지 200g",
    },
    images: [
      {
        id: "img_poster",
        url: "/images/poster-design.jpg",
        side: "front",  // 앞면만
        description: "포스터 디자인",
      },
    ],
  },
};
```

### 3. 카탈로그 (다중 페이지)

```typescript
const catalog: JobOrderData = {
  documentNumber: "202510-CAT-00999_00",
  // ... 기본 정보 ...
  product: {
    productName: "카탈로그",
    productionQuantity: "100 부",
    size: "A4 (210x297mm)",
    specification: {
      productType: "multi",  // 다중 페이지
      printSide: "both",
      pageCount: 32,         // 32페이지
      colorFront: "4도",
      colorBack: "4도",
      paper: "표지: 아트지 250g / 내지: 아트지 150g",
      bindingType: "무선철",
    },
    images: [
      {
        id: "img_cover",
        url: "/images/cover.jpg",
        pageNumber: 1,  // 페이지 번호
        description: "표지",
      },
      {
        id: "img_page2",
        url: "/images/page-2-3.jpg",
        pageNumber: 2,
        description: "내지 2-3페이지",
      },
      // ... 더 많은 페이지
    ],
    postProcessing: [
      {
        id: "post_binding",
        name: "무선철 제책",
        position: "제책",
      },
      {
        id: "post_coating",
        name: "표지 코팅",
        position: "표지",
      },
    ],
  },
};
```

### 4. 고급 후가공 제품

```typescript
const premiumPackage: JobOrderData = {
  documentNumber: "202510-PKG-00555_00",
  // ... 기본 정보 ...
  product: {
    productName: "고급 패키지",
    productionQuantity: "500 개",
    size: "150x150x50mm",
    specification: {
      productType: "single",
      printSide: "front_only",
      colorFront: "4도",
      paper: "골판지 E골 + 아트지 합지",
    },
    images: [
      {
        id: "img_design",
        url: "/images/package-design.jpg",
        side: "front",
        description: "패키지 전개도",
      },
    ],
    postProcessing: [
      {
        id: "post_1",
        name: "금박",
        description: "로고 부분 금박 처리",
        position: "로고",
        images: [
          {
            id: "post_img_1",
            url: "/images/gold-foil-sample.jpg",
            description: "금박 샘플",
          },
        ],
      },
      {
        id: "post_2",
        name: "형압",
        description: "엠보싱 처리",
        position: "브랜드명",
      },
      {
        id: "post_3",
        name: "톰슨",
        description: "톰슨 칼선 가공",
        position: "전개도",
        images: [
          {
            id: "post_img_3",
            url: "/images/die-cut-template.jpg",
            description: "톰슨 도면",
          },
        ],
      },
    ],
  },
};
```

## 🛠️ 유틸리티 함수

### 제품 타입 확인

```typescript
import { isSingleSided, isDoubleSided, isMultiPage } from "@/types/job-order";

if (isSingleSided(product)) {
  // 단면 제품 처리
}

if (isDoubleSided(product)) {
  // 양면 제품 처리
}

if (isMultiPage(product)) {
  // 다중 페이지 제품 처리
  const pageCount = product.specification.pageCount;
}
```

### 이미지 필터링

```typescript
import {
  getFrontImages,
  getBackImages,
  getPageImages,
  getAllPageNumbers,
} from "@/types/job-order";

// 앞면 이미지만 가져오기
const frontImages = getFrontImages(product.images);

// 뒷면 이미지만 가져오기
const backImages = getBackImages(product.images);

// 특정 페이지 이미지 가져오기
const page1Images = getPageImages(product.images, 1);

// 모든 페이지 번호 가져오기
const allPages = getAllPageNumbers(product.images);
// [1, 2, 3, 4, ...]
```

## 📊 데이터 구조 요약

```
JobOrderData
├── documentNumber
├── 주문 정보 (orderDate, clientName, orderNumber, ordererName)
├── 출고 정보 (deliveryDate, deliveryMethod, itemCount, recipientName, deliveryMemo)
├── product: ProductInfo
│   ├── 기본 정보 (productName, productionNumber, productionQuantity)
│   ├── 규격 (size, finishedSize)
│   ├── specification: PrintSpecification
│   │   ├── productType (single/double/multi)
│   │   ├── printSide (front_only/back_only/both)
│   │   ├── pageCount (다중 페이지 전용)
│   │   ├── colorFront, colorBack
│   │   ├── paper
│   │   ├── finishing
│   │   └── bindingType (다중 페이지 전용)
│   ├── images: ProductImage[]
│   │   ├── id, url
│   │   ├── side (앞면/뒷면) 또는 pageNumber (페이지 번호)
│   │   └── description, width, height
│   ├── postProcessing: PostProcessing[]
│   │   ├── id, name, description, position
│   │   └── images (후가공 참고 이미지)
│   └── note
└── 출력 정보 (printDate, printedBy)
```

## 🔄 마이그레이션 가이드

기존 구조에서 새 구조로 변환:

```typescript
// 기존 구조
const old = {
  productName: "명함",
  size: "90x50mm",
  options: {
    option1: "스노우화이트 300g",
    option2: "UV 코팅",
  },
};

// 새 구조
const new = {
  product: {
    productName: "명함",
    size: "90x50mm",
    specification: {
      productType: "double",
      printSide: "both",
      paper: "스노우화이트 300g",
    },
    images: [
      { id: "1", url: "/front.jpg", side: "front" },
      { id: "2", url: "/back.jpg", side: "back" },
    ],
    postProcessing: [
      { id: "1", name: "UV 코팅", position: "앞면 전체" },
    ],
  },
};
```

## 📚 추가 리소스

- Mock 데이터 예시: `src/app/api/job-orders/mock-data.ts`
- API 엔드포인트: `src/app/api/job-orders/[id]/route.ts`
- Swagger 문서: `http://localhost:3000/api-docs`
