# T-012 민감도 분석 그래프 구현 가이드

**Task ID:** T-012
**작성일:** 2025-10-20
**우선순위:** P0 (CRITICAL)
**예상 시간:** 2일 (16시간)
**Epic:** Epic 1 - 핵심 가치 제안 완성
**Story Points:** 13

---

## 📋 목차

1. [개요](#개요)
2. [구현 요구사항](#구현-요구사항)
3. [기술 스펙](#기술-스펙)
4. [구현 단계](#구현-단계)
5. [테스트 체크리스트](#테스트-체크리스트)
6. [문제 해결](#문제-해결)

---

## 개요

### 배경
현재 `SensitivityChart.tsx`는 placeholder만 있고 실제 그래프가 구현되지 않았습니다. PRD의 핵심 가치인 "시각적으로 확인"이 달성되지 않은 상태입니다.

### 목적
가격과 원가 변동에 따른 BEP 변화를 시각적으로 보여주는 민감도 분석 그래프를 구현하여 사용자가 최적 가격대를 빠르게 파악할 수 있도록 합니다.

### User Story
```
As a 예비 창업자,
I want to 가격과 원가 변동에 따른 BEP 변화를 시각적으로 확인하고 싶다,
So that 최적 가격대를 빠르게 파악할 수 있다.
```

### Acceptance Criteria
- [ ] 가격 민감도 Line Chart 표시 (X축: 가격 ±50%, Y축: BEP 판매량)
- [ ] 원가 민감도 Line Chart 표시 (X축: 원가 ±50%, Y축: BEP 판매량)
- [ ] 현재값을 세로 점선 + 마커로 강조
- [ ] 호버 시 Tooltip 표시 ("판매가 55,000원 → BEP 120개")
- [ ] 모바일에서 가로 스크롤 또는 탭 전환 지원
- [ ] 렌더링 시간 < 500ms
- [ ] 데이터 포인트 개수: 11개 (현재값 ± 50%, 10% 간격)
- [ ] 공헌이익 ≤ 0인 구간 에러 메시지 표시

### 비즈니스 목표
- **계산 완료율 +15%p** (50% → 65%)
- **사용자 만족도 +1.2점** (5점 척도)
- **PRD 핵심 가치 달성**

---

## 구현 요구사항

### 기능 요구사항

#### 1. 민감도 데이터 계산
- 가격 민감도: 현재 판매가의 ±50% 범위, 10% 간격 (11개 포인트)
- 원가 민감도: 현재 단위 원가의 ±50% 범위, 10% 간격 (11개 포인트)
- 각 포인트마다 BEP 계산: `Math.ceil(fixedCost / (price - unitCost))`
- 공헌이익 ≤ 0인 경우 BEP = 0 처리

#### 2. 그래프 시각화
- **라이브러리:** Recharts (선택 이유: Next.js 호환, 반응형, 경량)
- **차트 타입:** Line Chart
- **색상:**
  - Line: `#3b82f6` (파란색)
  - 현재값 참조선: `#10b981` (녹색)
  - 그리드: `#e5e7eb` (회색)
- **현재값 강조:**
  - 세로 점선 (ReferenceLine)
  - 큰 원형 마커 (r=6px)

#### 3. 인터랙션
- 호버 시 커스텀 Tooltip 표시
- Tooltip 내용:
  - "판매가: 55,000원"
  - "BEP: 120개"
  - 현재값이면 "현재값" 표시
- 탭 전환: 가격 민감도 ↔ 원가 민감도

#### 4. 에러 상태 처리
- 데이터 없을 때: "판매가가 원가보다 높아야 그래프가 표시됩니다"
- 모든 포인트가 BEP = 0: 동일한 메시지 표시

---

## 기술 스펙

### 의존성 설치

```bash
npm install recharts
npx shadcn@latest add tabs
```

### 파일 구조

```
src/
├── lib/
│   ├── sensitivity-analyzer.ts          # 신규 생성
│   └── __tests__/
│       └── sensitivity-analyzer.test.ts  # 신규 생성
└── app/calculator/components/
    ├── SensitivityChart.tsx              # 기존 파일 교체
    └── charts/                           # 신규 디렉토리
        ├── PriceSensitivityChart.tsx     # 신규 생성
        └── CostSensitivityChart.tsx      # 신규 생성
```

### 타입 정의

```typescript
// src/lib/sensitivity-analyzer.ts
export type SensitivityPoint = {
  variable: number;        // 가격 또는 원가 값
  bep: number;            // 손익분기점 판매량
  profit: number;         // 이익 (목표 수익 입력 시)
  isCurrentValue: boolean; // 현재 값 여부
};

export type SensitivityData = SensitivityPoint[];
```

### 계산 로직

```typescript
// src/lib/sensitivity-analyzer.ts
export function generatePriceSensitivity(
  basePrice: number,
  unitCost: number,
  fixedCost: number,
  targetProfit?: number
): SensitivityPoint[] {
  // 1. 입력 검증
  if (basePrice <= 0 || unitCost < 0 || fixedCost < 0) {
    return [];
  }

  // 2. 범위 계산
  const min = basePrice * 0.5;  // -50%
  const max = basePrice * 1.5;  // +50%
  const step = (max - min) / 10; // 11개 포인트

  // 3. 각 포인트 계산
  const points: SensitivityPoint[] = [];
  for (let price = min; price <= max; price += step) {
    const cm = price - unitCost; // 공헌이익

    // 3-1. 공헌이익 ≤ 0 처리
    if (cm <= 0) {
      points.push({
        variable: Math.round(price),
        bep: 0,
        profit: 0,
        isCurrentValue: false,
      });
      continue;
    }

    // 3-2. BEP 계산
    const bep = Math.ceil(fixedCost / cm);
    const targetQty = targetProfit
      ? Math.ceil((fixedCost + targetProfit) / cm)
      : bep;
    const profit = targetQty * price - targetQty * unitCost - fixedCost;

    // 3-3. 현재값 여부 (오차 허용)
    const isCurrentValue = Math.abs(price - basePrice) < step / 2;

    points.push({
      variable: Math.round(price),
      bep,
      profit,
      isCurrentValue,
    });
  }

  return points;
}

export function generateCostSensitivity(
  basePrice: number,
  baseCost: number,
  fixedCost: number,
  targetProfit?: number
): SensitivityPoint[] {
  // 동일한 로직, unitCost 기준으로 범위 생성
  if (basePrice <= 0 || baseCost < 0 || fixedCost < 0) {
    return [];
  }

  const min = baseCost * 0.5;
  const max = baseCost * 1.5;
  const step = (max - min) / 10;

  const points: SensitivityPoint[] = [];
  for (let cost = min; cost <= max; cost += step) {
    const cm = basePrice - cost;

    if (cm <= 0) {
      points.push({
        variable: Math.round(cost),
        bep: 0,
        profit: 0,
        isCurrentValue: false,
      });
      continue;
    }

    const bep = Math.ceil(fixedCost / cm);
    const targetQty = targetProfit
      ? Math.ceil((fixedCost + targetProfit) / cm)
      : bep;
    const profit = targetQty * basePrice - targetQty * cost - fixedCost;

    const isCurrentValue = Math.abs(cost - baseCost) < step / 2;

    points.push({
      variable: Math.round(cost),
      bep,
      profit,
      isCurrentValue,
    });
  }

  return points;
}
```

---

## 구현 단계

### Step 1: 계산 로직 구현 (2시간)

**작업 내용:**
- [ ] `src/lib/sensitivity-analyzer.ts` 생성
- [ ] `generatePriceSensitivity` 함수 작성
- [ ] `generateCostSensitivity` 함수 작성
- [ ] 타입 정의 추가

**코드:**
위의 "계산 로직" 섹션 참고

**검증:**
```bash
npm run typecheck
```

---

### Step 2: 단위 테스트 작성 (2시간)

**작업 내용:**
- [ ] `src/lib/__tests__/sensitivity-analyzer.test.ts` 생성
- [ ] 10개 테스트 케이스 작성

**테스트 케이스:**

```typescript
// src/lib/__tests__/sensitivity-analyzer.test.ts
import { describe, it, expect } from 'vitest';
import { generatePriceSensitivity, generateCostSensitivity } from '../sensitivity-analyzer';

describe('generatePriceSensitivity', () => {
  it('should return 11 data points', () => {
    const result = generatePriceSensitivity(50000, 20000, 3000000);
    expect(result).toHaveLength(11);
  });

  it('should mark current value correctly', () => {
    const result = generatePriceSensitivity(50000, 20000, 3000000);
    const currentPoint = result.find(p => p.isCurrentValue);
    expect(currentPoint).toBeDefined();
    expect(currentPoint!.variable).toBeCloseTo(50000, -3);
  });

  it('should handle negative contribution margin', () => {
    const result = generatePriceSensitivity(10000, 20000, 3000000);
    const invalidPoints = result.filter(p => p.bep === 0);
    expect(invalidPoints.length).toBeGreaterThan(0);
  });

  it('should calculate BEP correctly', () => {
    const result = generatePriceSensitivity(50000, 20000, 3000000);
    const currentPoint = result.find(p => p.isCurrentValue)!;
    const expectedBEP = Math.ceil(3000000 / (50000 - 20000));
    expect(currentPoint.bep).toBe(expectedBEP);
  });

  it('should include target profit when provided', () => {
    const result = generatePriceSensitivity(50000, 20000, 3000000, 5000000);
    const currentPoint = result.find(p => p.isCurrentValue)!;
    expect(currentPoint.profit).toBeGreaterThan(0);
  });

  it('should return empty array for invalid inputs', () => {
    expect(generatePriceSensitivity(0, 20000, 3000000)).toEqual([]);
    expect(generatePriceSensitivity(-10, 20000, 3000000)).toEqual([]);
    expect(generatePriceSensitivity(50000, -1, 3000000)).toEqual([]);
  });

  it('should have correct range (±50%)', () => {
    const result = generatePriceSensitivity(50000, 20000, 3000000);
    const min = result[0].variable;
    const max = result[result.length - 1].variable;
    expect(min).toBeCloseTo(50000 * 0.5, -3);
    expect(max).toBeCloseTo(50000 * 1.5, -3);
  });
});

describe('generateCostSensitivity', () => {
  it('should return 11 data points', () => {
    const result = generateCostSensitivity(50000, 20000, 3000000);
    expect(result).toHaveLength(11);
  });

  it('should calculate BEP correctly for cost variations', () => {
    const result = generateCostSensitivity(50000, 20000, 3000000);
    const currentPoint = result.find(p => p.isCurrentValue)!;
    const expectedBEP = Math.ceil(3000000 / (50000 - 20000));
    expect(currentPoint.bep).toBe(expectedBEP);
  });

  it('should handle price lower than cost', () => {
    const result = generateCostSensitivity(10000, 5000, 3000000);
    // Max cost = 7500, 일부 포인트에서 cost > price
    const invalidPoints = result.filter(p => p.bep === 0);
    expect(invalidPoints.length).toBeGreaterThan(0);
  });
});
```

**검증:**
```bash
npm run test
```

**예상 결과:**
```
✓ src/lib/__tests__/sensitivity-analyzer.test.ts (10)
  ✓ generatePriceSensitivity (7)
  ✓ generateCostSensitivity (3)

Test Files  1 passed (1)
     Tests  10 passed (10)
```

---

### Step 3: 가격 민감도 차트 컴포넌트 (3시간)

**작업 내용:**
- [ ] `src/app/calculator/components/charts/` 디렉토리 생성
- [ ] `PriceSensitivityChart.tsx` 작성
- [ ] Recharts 컴포넌트 구현
- [ ] 커스텀 Tooltip 구현

**코드:**

```tsx
// src/app/calculator/components/charts/PriceSensitivityChart.tsx
"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useCalculatorStore } from "@/features/calculator/store/calculator.store";
import { generatePriceSensitivity, type SensitivityPoint } from "@/lib/sensitivity-analyzer";

export function PriceSensitivityChart() {
  const inputs = useCalculatorStore((state) => state.inputs);

  // 1. 데이터 생성 (useMemo로 캐싱)
  const data = useMemo(() => {
    return generatePriceSensitivity(
      inputs.price,
      inputs.unitCost,
      inputs.fixedCost,
      inputs.targetProfit
    );
  }, [inputs.price, inputs.unitCost, inputs.fixedCost, inputs.targetProfit]);

  const currentValue = inputs.price;

  // 2. 에러 상태 처리
  if (data.length === 0 || data.every(d => d.bep === 0)) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-muted-foreground text-sm">
          판매가가 원가보다 높아야 그래프가 표시됩니다
        </p>
      </div>
    );
  }

  // 3. 차트 렌더링
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {/* 그리드 */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        {/* X축 */}
        <XAxis
          dataKey="variable"
          label={{
            value: "판매가 (원)",
            position: "insideBottom",
            offset: -5
          }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />

        {/* Y축 */}
        <YAxis
          label={{
            value: "손익분기점 (개)",
            angle: -90,
            position: "insideLeft"
          }}
          tick={{ fontSize: 12 }}
        />

        {/* Tooltip */}
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const data = payload[0].payload as SensitivityPoint;
            return (
              <div className="bg-white p-3 border rounded-lg shadow-lg">
                <p className="font-semibold text-sm">
                  판매가: {data.variable.toLocaleString()}원
                </p>
                <p className="text-sm text-blue-600">
                  BEP: {data.bep}개
                </p>
                {data.isCurrentValue && (
                  <p className="text-xs text-emerald-600 font-bold mt-1">
                    현재값
                  </p>
                )}
              </div>
            );
          }}
        />

        {/* Legend */}
        <Legend />

        {/* 현재값 참조선 */}
        <ReferenceLine
          x={currentValue}
          stroke="#10b981"
          strokeDasharray="3 3"
          label={{
            value: "현재",
            position: "top",
            fill: "#10b981",
            fontSize: 12
          }}
        />

        {/* Line */}
        <Line
          type="monotone"
          dataKey="bep"
          stroke="#3b82f6"
          strokeWidth={2}
          name="손익분기점"
          dot={(props) => {
            const { cx, cy, payload } = props;
            if (payload.isCurrentValue) {
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill="#10b981"
                  stroke="#fff"
                  strokeWidth={2}
                />
              );
            }
            return <circle cx={cx} cy={cy} r={3} fill="#3b82f6" />;
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

### Step 4: 원가 민감도 차트 컴포넌트 (2시간)

**작업 내용:**
- [ ] `CostSensitivityChart.tsx` 작성 (PriceSensitivityChart 복사 후 수정)

**코드:**

```tsx
// src/app/calculator/components/charts/CostSensitivityChart.tsx
"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useCalculatorStore } from "@/features/calculator/store/calculator.store";
import { generateCostSensitivity, type SensitivityPoint } from "@/lib/sensitivity-analyzer";

export function CostSensitivityChart() {
  const inputs = useCalculatorStore((state) => state.inputs);

  const data = useMemo(() => {
    return generateCostSensitivity(
      inputs.price,
      inputs.unitCost,
      inputs.fixedCost,
      inputs.targetProfit
    );
  }, [inputs.price, inputs.unitCost, inputs.fixedCost, inputs.targetProfit]);

  const currentValue = inputs.unitCost;

  if (data.length === 0 || data.every(d => d.bep === 0)) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-muted-foreground text-sm">
          판매가가 원가보다 높아야 그래프가 표시됩니다
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="variable"
          label={{
            value: "단위 원가 (원)",
            position: "insideBottom",
            offset: -5
          }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <YAxis
          label={{
            value: "손익분기점 (개)",
            angle: -90,
            position: "insideLeft"
          }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const data = payload[0].payload as SensitivityPoint;
            return (
              <div className="bg-white p-3 border rounded-lg shadow-lg">
                <p className="font-semibold text-sm">
                  단위 원가: {data.variable.toLocaleString()}원
                </p>
                <p className="text-sm text-blue-600">
                  BEP: {data.bep}개
                </p>
                {data.isCurrentValue && (
                  <p className="text-xs text-emerald-600 font-bold mt-1">
                    현재값
                  </p>
                )}
              </div>
            );
          }}
        />
        <Legend />
        <ReferenceLine
          x={currentValue}
          stroke="#10b981"
          strokeDasharray="3 3"
          label={{
            value: "현재",
            position: "top",
            fill: "#10b981",
            fontSize: 12
          }}
        />
        <Line
          type="monotone"
          dataKey="bep"
          stroke="#3b82f6"
          strokeWidth={2}
          name="손익분기점"
          dot={(props) => {
            const { cx, cy, payload } = props;
            if (payload.isCurrentValue) {
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill="#10b981"
                  stroke="#fff"
                  strokeWidth={2}
                />
              );
            }
            return <circle cx={cx} cy={cy} r={3} fill="#3b82f6" />;
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

### Step 5: SensitivityChart 통합 (2시간)

**작업 내용:**
- [ ] `SensitivityChart.tsx` 기존 내용 교체
- [ ] Tabs 컴포넌트 통합
- [ ] 설명 문구 추가

**코드:**

```tsx
// src/app/calculator/components/SensitivityChart.tsx (교체)
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriceSensitivityChart } from "./charts/PriceSensitivityChart";
import { CostSensitivityChart } from "./charts/CostSensitivityChart";

export function SensitivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>민감도 분석 그래프</CardTitle>
        <CardDescription>
          가격이나 원가가 변동하면 손익분기점이 어떻게 달라지는지 보여줍니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="price">가격 민감도</TabsTrigger>
            <TabsTrigger value="cost">원가 민감도</TabsTrigger>
          </TabsList>
          <TabsContent value="price" className="mt-4">
            <PriceSensitivityChart />
          </TabsContent>
          <TabsContent value="cost" className="mt-4">
            <CostSensitivityChart />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
```

**shadcn-ui Tabs 설치:**
```bash
npx shadcn@latest add tabs
```

---

### Step 6: 성능 최적화 (1시간)

**작업 내용:**
- [ ] useMemo 확인
- [ ] 렌더링 시간 측정
- [ ] 데이터 포인트 개수 최적화 (11개 확인)

**렌더링 시간 측정:**

```typescript
// 개발자 도구 Console에서 실행
const start = performance.now();
// 입력값 변경
const end = performance.now();
console.log(`Rendering time: ${end - start}ms`);
```

**목표:** < 500ms

---

### Step 7: QA 및 배포 (1시간)

**작업 내용:**
- [ ] 데스크톱 Chrome 테스트
- [ ] 데스크톱 Safari 테스트
- [ ] 모바일 iOS Safari 테스트
- [ ] 모바일 Android Chrome 테스트
- [ ] Lighthouse Performance 측정

---

## 테스트 체크리스트

### 기능 테스트

#### 가격 민감도 차트
- [ ] 11개 데이터 포인트 표시
- [ ] 현재값 세로 점선 표시 (녹색)
- [ ] 현재값 마커 강조 (큰 원, 녹색)
- [ ] 호버 시 Tooltip 정상 표시
- [ ] Tooltip에 "현재값" 표시
- [ ] X축: 판매가 (k 단위)
- [ ] Y축: 손익분기점 (개)
- [ ] 범위: 현재값 ±50%

#### 원가 민감도 차트
- [ ] 11개 데이터 포인트 표시
- [ ] 현재값 강조
- [ ] Tooltip 정상 표시
- [ ] X축: 단위 원가 (k 단위)
- [ ] 범위: 현재값 ±50%

#### 탭 전환
- [ ] "가격 민감도" / "원가 민감도" 탭 표시
- [ ] 탭 전환 시 차트 변경
- [ ] 기본 탭: 가격 민감도

#### 에러 상태
- [ ] 입력값 없을 때 에러 메시지 표시
- [ ] 판매가 ≤ 원가일 때 에러 메시지 표시
- [ ] 에러 메시지: "판매가가 원가보다 높아야 그래프가 표시됩니다"

### 단위 테스트
- [ ] 10개 테스트 케이스 모두 통과
- [ ] Coverage > 90%
- [ ] `npm run test` 통과

### E2E 테스트 (Optional)
- [ ] 계산 후 그래프 표시 확인
- [ ] 탭 전환 동작 확인
- [ ] 호버 Tooltip 확인

### 성능 테스트
- [ ] 렌더링 시간 < 500ms
- [ ] 차트 인터랙션 부드러움 (60fps)
- [ ] 메모리 누수 없음

### 반응형 테스트
- [ ] 데스크톱 (1920×1080)
- [ ] 태블릿 (768×1024)
- [ ] 모바일 (375×667)
- [ ] 가로 스크롤 없음

### 접근성 테스트
- [ ] 키보드 탭 네비게이션
- [ ] 스크린 리더 호환
- [ ] 색상 대비 WCAG AA 이상

### 브라우저 호환성
- [ ] Chrome 최신
- [ ] Safari 최신
- [ ] Firefox 최신
- [ ] Edge 최신
- [ ] iOS Safari
- [ ] Android Chrome

---

## 문제 해결

### Issue 1: Recharts가 SSR 에러 발생

**증상:**
```
ReferenceError: window is not defined
```

**원인:** Recharts가 브라우저 API 사용

**해결:**
```tsx
"use client"; // 파일 최상단에 추가
```

---

### Issue 2: 차트가 렌더링되지 않음

**원인:**
- 데이터가 빈 배열
- 입력값이 없음

**해결:**
```typescript
// 개발자 도구 Console에서 확인
console.log(data);
```

---

### Issue 3: 현재값 마커가 표시되지 않음

**원인:** `isCurrentValue` 플래그 오류

**해결:**
```typescript
// sensitivity-analyzer.ts에서 오차 허용
const isCurrentValue = Math.abs(price - basePrice) < step / 2;
```

---

### Issue 4: Tooltip이 잘림

**원인:** ResponsiveContainer의 margin 부족

**해결:**
```tsx
<LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
```

---

### Issue 5: 모바일에서 X축 레이블 겹침

**원인:** 긴 숫자 표시

**해결:**
```tsx
tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
```

---

### Issue 6: 성능 저하 (렌더링 느림)

**원인:** useMemo 미사용

**해결:**
```tsx
const data = useMemo(() => {
  return generatePriceSensitivity(...);
}, [inputs.price, inputs.unitCost, inputs.fixedCost, inputs.targetProfit]);
```

---

## 참고 자료

- [Recharts Documentation](https://recharts.org/)
- [shadcn/ui Tabs](https://ui.shadcn.com/docs/components/tabs)
- [SPEC-DRIVEN-IMPLEMENTATION-GUIDE.md](./SPEC-DRIVEN-IMPLEMENTATION-GUIDE.md)

---

## 다음 단계

1. ✅ T-012 완료 후 배포
2. ⏭️ T-013 Progressive Disclosure 착수
3. 📊 사용자 피드백 수집
4. 🔍 A/B 테스트: 그래프 유무에 따른 완료율 비교

---

**작성자:** Claude Code
**버전:** 1.0
**최종 업데이트:** 2025-10-20
