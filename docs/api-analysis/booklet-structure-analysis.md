# 책자 제품 API 구조 분석

## 📋 분석 대상

1. **무선철 책자 (PRBKPSN)**
   - URL: https://www.redprinting.co.kr/ko/product/item/PR/PRBKPSN
   - 다양한 제본 방식 지원

2. **토너 스테플러 책자 (PRBKOST)**
   - URL: https://www.redprinting.co.kr/ko/product/item/PR/PRBKOST
   - 컬러 인쇄, 스테플러 제본

---

## 🔍 책자 제품의 특징

### 1. 표지(Cover)와 내지(Inner Pages) 분리

책자는 단면/양면 제품과 달리 **표지**와 **내지**의 사양이 완전히 다릅니다:

| 구분 | 표지 | 내지 |
|------|------|------|
| 용지 | Snow, Art, Arte, Landevu | Green Light, Matte/White Mozo |
| 인쇄 | 단면/양면 선택 가능 | 흑백/컬러 선택 가능 |
| 후가공 | 코팅(유광/무광/엠보/벨벳) 필수 | 일반적으로 없음 |
| 용지 중량 | 일반적으로 더 두꺼움 | 상대적으로 얇음 |

### 2. 제본 방식 (Binding Type)

다양한 제본 방식이 있으며, 각각 페이지 제약이 다릅니다:

```typescript
interface BindingOption {
  type: string;
  minPages: number;
  maxPages: number;
}

const bindingOptions: BindingOption[] = [
  { type: "무선철 (Wireless)", minPages: 10, maxPages: 300 },
  { type: "중철 (Stapled)", minPages: 4, maxPages: 32 },
  { type: "쌍링 (Twin Ring)", minPages: 2, maxPages: 200 },
  { type: "코일 (Coil)", minPages: 2, maxPages: 130 },
  { type: "실제본 (Thread)", minPages: 40, maxPages: 300 },
  { type: "노출제본 (Exposed Thread)", minPages: 20, maxPages: 200 },
  { type: "누름제본 (Lay-flat)", minPages: 20, maxPages: 50 },
];
```

### 3. 표지 종류

```typescript
type CoverType =
  | "soft_cover"      // 소프트커버 (일반)
  | "hard_cover"      // 하드커버 (양장)
  | "separate_cover"  // 별도 커버
  | "pvc_cover";      // PVC 커버
```

### 4. 페이지 구조

책자는 페이지 수가 제본 방식에 따라 제약이 있습니다:
- **중철**: 4의 배수 (4, 8, 12, 16, 20, 24, 28, 32)
- **무선철**: 최소 10페이지, 4의 배수 권장
- **쌍링/코일**: 제약 없음

---

## 🎯 현재 API 구조 평가

### ✅ 이미 지원되는 부분

```typescript
// src/types/job-order.ts
export interface PrintSpecification {
  productType: ProductType; // "multi" 타입 지원 ✓
  pageCount?: number;        // 페이지 수 ✓
  bindingType?: string;      // 제본 방식 ✓
  // ...
}
```

### ⚠️ 부족한 부분

1. **표지/내지 사양 분리 불가**
   ```typescript
   // 현재는 단일 사양만 가능
   paper?: string;
   colorFront?: string;

   // 필요한 구조: 표지와 내지를 분리
   cover: {
     paper: "아트지 250g",
     printing: "양면 4도",
     coating: "유광코팅"
   },
   inner: {
     paper: "모조지 80g",
     printing: "양면 흑백",
     pageCount: 200
   }
   ```

2. **제본 제약 검증 없음**
   - 제본 방식에 따른 페이지 수 제약 검증이 없음
   - 클라이언트에서 검증해야 함

3. **표지 종류 구분 없음**
   - 소프트커버/하드커버 구분 불가

---

## 💡 개선 방안

### 방안 1: BookletSpecification 타입 추가 (권장)

표지와 내지를 명확히 분리하는 전용 타입을 추가합니다.

```typescript
/**
 * 책자 전용 사양
 */
export interface BookletSpecification extends PrintSpecification {
  productType: "multi"; // multi로 고정

  // 표지 사양
  cover: {
    type: CoverType;                    // 표지 종류
    paper: string;                      // 표지 용지
    weight: string;                     // 용지 중량
    printing: "single" | "double";      // 단면/양면
    colorMode: "bw" | "color" | "spot"; // 흑백/컬러/별색
    coating?: CoatingType;              // 코팅
    lamination?: LaminationType;        // 라미네이팅
  };

  // 내지 사양
  inner: {
    paper: string;                      // 내지 용지
    weight: string;                     // 용지 중량
    pageCount: number;                  // 내지 페이지 수
    colorMode: "bw" | "color" | "mixed"; // 흑백/컬러/혼합
    colorPages?: number[];              // 컬러 페이지 번호 (혼합인 경우)
  };

  // 제본 정보
  binding: {
    type: BindingType;                  // 제본 방식
    position?: "left" | "top" | "right"; // 제본 위치
    color?: string;                     // 제본 색상 (링/코일)
  };

  // 총 페이지 수 (표지 + 내지)
  totalPages: number;
}

type CoverType = "soft_cover" | "hard_cover" | "separate_cover" | "pvc_cover";
type CoatingType = "glossy" | "matte" | "emboss" | "velvet" | "uv";
type LaminationType = "glossy" | "matte";
type BindingType = "wireless" | "stapled" | "twin_ring" | "coil" | "thread" | "exposed_thread" | "lay_flat";
```

### 방안 2: 기존 구조 확장 (하위 호환성 유지)

```typescript
export interface PrintSpecification {
  // 기존 필드 유지
  productType: ProductType;
  printSide: PrintSide;
  pageCount?: number;

  // 책자용 추가 필드
  booklet?: {
    cover: CoverSpecification;
    inner: InnerSpecification;
    binding: BindingSpecification;
  };
}
```

### 방안 3: Union 타입 사용 (타입 안정성 최대)

```typescript
export type ProductSpecification =
  | SingleSidedSpec    // 단면 제품
  | DoubleSidedSpec    // 양면 제품
  | BookletSpec;       // 책자 제품

export interface ProductInfo {
  // ...
  specification: ProductSpecification;
}
```

---

## 🔧 구현 예시

### 책자 제품 데이터 예시

```typescript
const bookletOrder: JobOrderData = {
  documentNumber: "202510-BK-00123",
  orderDate: "2025-10-13",
  clientName: "출판사ABC",
  orderNumber: "BK-2025-456",
  ordererName: "김편집",

  deliveryDate: "2025-10-20",
  deliveryMethod: "택배",
  itemCount: "50 권",
  recipientName: "김편집",
  deliveryMemo: "배송 전 연락 부탁드립니다",

  product: {
    productName: "카탈로그",
    companyProductName: "고급 카탈로그 - 무선철 제본",
    productionNumber: "BK-2025-456",
    productionQuantity: "50 권",

    size: "A4 (210x297mm)",
    finishedSize: "A4 (210x297mm)",

    specification: {
      productType: "multi",

      // 책자 전용 사양
      booklet: {
        // 표지
        cover: {
          type: "soft_cover",
          paper: "아트지",
          weight: "250g",
          printing: "double",
          colorMode: "color",
          coating: "matte"
        },

        // 내지
        inner: {
          paper: "모조지",
          weight: "80g",
          pageCount: 200,
          colorMode: "mixed",
          colorPages: [1, 2, 3, 50, 51, 52, 199, 200] // 앞/뒤 일부만 컬러
        },

        // 제본
        binding: {
          type: "wireless",
          position: "left"
        }
      },

      totalPages: 204, // 표지 4p + 내지 200p
    },

    images: [
      {
        id: "cover-front",
        url: "/designs/cover-front.pdf",
        side: "front",
        description: "표지 앞면"
      },
      {
        id: "cover-back",
        url: "/designs/cover-back.pdf",
        side: "back",
        description: "표지 뒷면"
      },
      {
        id: "inner-pages",
        url: "/designs/inner-pages.pdf",
        pageNumber: 1,
        description: "내지 전체 (200p)"
      }
    ],

    postProcessing: [
      {
        id: "pp-1",
        name: "표지 무광코팅",
        description: "표지 전체 무광 코팅 처리"
      }
    ]
  },

  printDate: "2025년 10월 13일",
  printedBy: "운영자(operator)"
};
```

### API 엔드포인트 예시

```typescript
// GET /api/job-orders/booklet/:id
// 책자 전용 조회 (타입 검증 포함)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const jobOrder = await getJobOrder(id);

  // 책자 타입 검증
  if (jobOrder.product.specification.productType !== "multi") {
    return NextResponse.json({
      success: false,
      error: "This endpoint is for booklet products only"
    }, { status: 400 });
  }

  // 제본 제약 검증
  const validation = validateBookletSpecs(jobOrder.product.specification);
  if (!validation.valid) {
    return NextResponse.json({
      success: false,
      error: validation.error,
      warnings: validation.warnings
    }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    data: jobOrder
  });
}
```

### 검증 함수 예시

```typescript
/**
 * 책자 사양 검증
 */
export function validateBookletSpecs(spec: PrintSpecification): ValidationResult {
  if (!spec.booklet) {
    return { valid: false, error: "Booklet specification is required" };
  }

  const { booklet } = spec;
  const { binding, inner } = booklet;

  // 제본 방식별 페이지 제약 검증
  const constraints = getBindingConstraints(binding.type);

  if (inner.pageCount < constraints.minPages) {
    return {
      valid: false,
      error: `${binding.type} requires at least ${constraints.minPages} pages`
    };
  }

  if (inner.pageCount > constraints.maxPages) {
    return {
      valid: false,
      error: `${binding.type} supports maximum ${constraints.maxPages} pages`
    };
  }

  // 중철은 4의 배수만 가능
  if (binding.type === "stapled" && inner.pageCount % 4 !== 0) {
    return {
      valid: false,
      error: "Stapled binding requires page count to be multiple of 4"
    };
  }

  return { valid: true };
}

/**
 * 제본 방식별 제약 조건
 */
function getBindingConstraints(bindingType: BindingType) {
  const constraints: Record<BindingType, { minPages: number; maxPages: number }> = {
    wireless: { minPages: 10, maxPages: 300 },
    stapled: { minPages: 4, maxPages: 32 },
    twin_ring: { minPages: 2, maxPages: 200 },
    coil: { minPages: 2, maxPages: 130 },
    thread: { minPages: 40, maxPages: 300 },
    exposed_thread: { minPages: 20, maxPages: 200 },
    lay_flat: { minPages: 20, maxPages: 50 },
  };

  return constraints[bindingType];
}
```

---

## 📊 비교 분석

### 현재 구조 vs 개선된 구조

| 항목 | 현재 구조 | 개선 방안 1 (BookletSpec) |
|------|-----------|-------------------------|
| 표지/내지 분리 | ❌ 불가능 | ✅ 명확히 분리 |
| 타입 안정성 | ⚠️ 보통 | ✅ 높음 |
| 제본 제약 검증 | ❌ 없음 | ✅ 서버/클라이언트 양측 |
| 하위 호환성 | ✅ 유지 | ⚠️ 마이그레이션 필요 |
| 복잡도 | 낮음 | 중간 |
| 확장성 | 제한적 | 높음 |

---

## 🎯 권장 사항

### 1단계: 타입 정의 확장
```bash
src/types/job-order.ts          # 기본 타입
src/types/booklet.ts             # 책자 전용 타입 (새로 생성)
src/types/validation.ts          # 검증 로직 (새로 생성)
```

### 2단계: API 엔드포인트 추가
```bash
src/app/api/job-orders/booklet/route.ts        # 책자 전용 CRUD
src/app/api/job-orders/booklet/validate/route.ts # 사양 검증 API
```

### 3단계: Mock 데이터 추가
```bash
src/app/api/job-orders/mock-data-booklet.ts    # 책자 샘플 데이터
```

### 4단계: 문서화
```bash
docs/api/booklet-specification.md              # 책자 API 명세
docs/api/booklet-examples.md                   # 샘플 및 예제
```

---

## 🚀 다음 단계

1. **타입 정의 구현**
   - `src/types/booklet.ts` 생성
   - 책자 전용 타입 정의

2. **검증 로직 구현**
   - `src/lib/booklet-validator.ts` 생성
   - 제본 제약, 페이지 수 등 검증

3. **API 엔드포인트 구현**
   - 책자 전용 CRUD API
   - 검증 API

4. **테스트 케이스 작성**
   - 단위 테스트
   - 통합 테스트

5. **UI 컴포넌트 개발**
   - 책자 사양 입력 폼
   - 실시간 검증 UI

---

## 📚 참고 자료

- [무선철 책자 제품 페이지](https://www.redprinting.co.kr/ko/product/item/PR/PRBKPSN)
- [토너 스테플러 책자](https://www.redprinting.co.kr/ko/product/item/PR/PRBKOST)
- 현재 타입 정의: `src/types/job-order.ts`
- 현재 API 구현: `src/app/api/job-orders/[id]/route.ts`
