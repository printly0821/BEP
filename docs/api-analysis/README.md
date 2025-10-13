# 책자 API 구조 분석 및 구현

## 📚 문서 구조

```
docs/api-analysis/
├── README.md                           # 이 파일
└── booklet-structure-analysis.md       # 상세 분석 문서

src/types/
├── job-order.ts                        # 기본 제작 의뢰서 타입
└── booklet.ts                          # 책자 전용 타입 (신규)

src/lib/
└── booklet-validator.ts                # 책자 검증 로직 (신규)

src/app/api/job-orders/
├── mock-data.ts                        # 기본 제품 Mock 데이터
└── mock-data-booklet.ts                # 책자 제품 Mock 데이터 (신규)
```

## 🚀 빠른 시작

### 1. 타입 임포트

```typescript
import type { BookletSpecification } from "@/types/booklet";
import { validateBookletSpecification } from "@/lib/booklet-validator";
```

### 2. 책자 데이터 생성

```typescript
const catalogSpec: BookletSpecification = {
  cover: {
    type: "soft_cover",
    paper: "아트지",
    weight: "250g",
    printing: "double",
    colorMode: "color",
    coating: "matte"
  },
  inner: {
    paper: "모조지",
    weight: "80g",
    pageCount: 200,
    colorMode: "bw"
  },
  binding: {
    type: "wireless",
    position: "left"
  },
  totalPages: 204,
  finishedSize: "210x297mm"
};
```

### 3. 검증

```typescript
const validation = validateBookletSpecification(catalogSpec);

if (!validation.valid) {
  console.error("검증 실패:", validation.error);
}

if (validation.warnings) {
  console.warn("경고:", validation.warnings);
}
```

## 📖 주요 기능

### 제본 방식별 제약 자동 검증

```typescript
import { validateBindingConstraints } from "@/lib/booklet-validator";

// ✅ 유효한 경우
validateBindingConstraints("wireless", 100);
// { valid: true }

// ❌ 무효한 경우 (중철은 4의 배수만 가능)
validateBindingConstraints("stapled", 15);
// {
//   valid: false,
//   error: "stapled 제본은 4의 배수 페이지가 필요합니다"
// }
```

### 페이지 수 자동 조정

```typescript
import { adjustPageCount } from "@/lib/booklet-validator";

// 중철 제본에 15페이지 요청 시 → 16페이지로 자동 조정
const adjusted = adjustPageCount(15, "stapled");
console.log(adjusted); // 16
```

### Mock 데이터 활용

```typescript
import { bookletMockDatabase, isBookletOrder } from "@/app/api/job-orders/mock-data-booklet";

// 특정 책자 주문 조회
const order = bookletMockDatabase["booklet-1"];

// 타입 가드 사용
if (isBookletOrder(order)) {
  console.log(order.product.booklet.binding.type); // "wireless"
}
```

## 🎯 API 사용 예시

### GET /api/job-orders/booklet/:id

```typescript
// src/app/api/job-orders/booklet/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { bookletMockDatabase, isBookletOrder } from "@/app/api/job-orders/mock-data-booklet";
import { validateBookletSpecification } from "@/lib/booklet-validator";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = bookletMockDatabase[id];

  if (!order) {
    return NextResponse.json({
      success: false,
      error: "주문을 찾을 수 없습니다"
    }, { status: 404 });
  }

  // 책자 타입 검증
  if (!isBookletOrder(order)) {
    return NextResponse.json({
      success: false,
      error: "이 API는 책자 제품 전용입니다"
    }, { status: 400 });
  }

  // 사양 검증
  const validation = validateBookletSpecification(order.product.booklet);
  if (!validation.valid) {
    return NextResponse.json({
      success: false,
      error: validation.error,
      warnings: validation.warnings
    }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    data: order,
    warnings: validation.warnings
  });
}
```

### POST /api/job-orders/booklet/validate

```typescript
// src/app/api/job-orders/booklet/validate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateBookletSpecification } from "@/lib/booklet-validator";
import type { BookletSpecification } from "@/types/booklet";

export async function POST(request: NextRequest) {
  try {
    const spec: BookletSpecification = await request.json();
    const validation = validateBookletSpecification(spec);

    return NextResponse.json({
      success: validation.valid,
      error: validation.error,
      warnings: validation.warnings
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "잘못된 요청 형식입니다"
    }, { status: 400 });
  }
}
```

## 🧪 테스트 예시

```typescript
// __tests__/booklet-validator.test.ts
import { validateBookletSpecification, adjustPageCount } from "@/lib/booklet-validator";
import type { BookletSpecification } from "@/types/booklet";

describe("책자 검증", () => {
  test("유효한 무선철 책자", () => {
    const spec: BookletSpecification = {
      cover: {
        type: "soft_cover",
        paper: "아트지",
        weight: "250g",
        printing: "double",
        colorMode: "color"
      },
      inner: {
        paper: "모조지",
        weight: "80g",
        pageCount: 200,
        colorMode: "bw"
      },
      binding: {
        type: "wireless",
        position: "left"
      },
      totalPages: 204,
      finishedSize: "210x297mm"
    };

    const result = validateBookletSpecification(spec);
    expect(result.valid).toBe(true);
  });

  test("중철 제본 - 4의 배수 검증", () => {
    const spec: BookletSpecification = {
      // ... 기본 설정
      inner: { pageCount: 15 }, // ❌ 15는 4의 배수가 아님
      binding: { type: "stapled" },
      totalPages: 19
    };

    const result = validateBookletSpecification(spec);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("4의 배수");
  });

  test("페이지 수 자동 조정", () => {
    expect(adjustPageCount(15, "stapled")).toBe(16);
    expect(adjustPageCount(30, "stapled")).toBe(32);
    expect(adjustPageCount(100, "wireless")).toBe(100);
  });
});
```

## 📊 제본 방식별 제약 조건

| 제본 방식 | 최소 페이지 | 최대 페이지 | 페이지 제약 | 설명 |
|----------|------------|------------|-----------|------|
| 무선철 (wireless) | 10 | 300 | - | 접착제로 표지와 내지를 붙이는 방식 |
| 중철 (stapled) | 4 | 32 | 4의 배수 | 스테이플러로 중앙을 고정 |
| 쌍링 (twin_ring) | 2 | 200 | - | 2개의 링으로 고정 |
| 코일 (coil) | 2 | 130 | - | 나선형 코일로 고정 |
| 실제본 (thread) | 40 | 300 | - | 실로 묶는 고급 제본 |
| 노출제본 (exposed_thread) | 20 | 200 | - | 실이 보이도록 제본 |
| 누름제본 (lay_flat) | 20 | 50 | - | 180도로 펼쳐지는 제본 |

## 🔧 커스터마이징

### 새로운 용지 추가

```typescript
// src/types/booklet.ts
export const COVER_PAPER_OPTIONS = [
  // 기존 옵션...
  { value: "premium", label: "프리미엄지", weights: ["220g", "260g", "300g"] },
] as const;
```

### 새로운 제본 방식 추가

```typescript
// src/types/booklet.ts
export type BindingType =
  | "wireless"
  | "stapled"
  // ... 기존 타입
  | "perfect_binding"; // 새로운 타입

// src/lib/booklet-validator.ts
export const BINDING_CONSTRAINTS: Record<BindingType, BindingConstraints> = {
  // ... 기존 제약
  perfect_binding: {
    minPages: 50,
    maxPages: 500,
    description: "완전제본 - 고급 접착 제본 방식"
  }
};
```

## 📝 다음 단계

1. **API 엔드포인트 구현**
   - `src/app/api/job-orders/booklet/route.ts`
   - `src/app/api/job-orders/booklet/[id]/route.ts`
   - `src/app/api/job-orders/booklet/validate/route.ts`

2. **UI 컴포넌트 개발**
   - 책자 사양 입력 폼
   - 실시간 검증 UI
   - 미리보기 컴포넌트

3. **테스트 작성**
   - 단위 테스트
   - 통합 테스트
   - E2E 테스트

4. **문서화**
   - API 명세 작성 (Swagger/Scalar)
   - 사용자 가이드
   - 개발자 가이드

## 📚 참고 자료

- [상세 분석 문서](./booklet-structure-analysis.md)
- [무선철 책자 제품 페이지](https://www.redprinting.co.kr/ko/product/item/PR/PRBKPSN)
- [토너 스테플러 책자](https://www.redprinting.co.kr/ko/product/item/PR/PRBKOST)
- 기본 타입 정의: `src/types/job-order.ts`
