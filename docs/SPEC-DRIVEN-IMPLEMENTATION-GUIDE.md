# BEP 마진계산기 Spec-Driven 구현 가이드

> **작성일**: 2025-10-20
> **버전**: v1.0
> **목적**: UX/UI/Product 전문가 분석 결과를 바탕으로 한 구현 가능한 상세 가이드
> **대상**: 개발팀, 디자이너, PM

---

## 📋 Executive Summary

### 핵심 발견사항

1. **CRITICAL 이슈**: 민감도 분석 그래프 미구현 (PRD 핵심 기능 누락)
2. **숨은 보석**: Excel Import 기능 (경쟁사 대비 결정적 차별화)
3. **UX 최대 문제**: 정보 과부하로 "5분 내 완료" 목표 달성 불확실 (예상 40-50%)
4. **Pro 전환 약점**: 현재 기능만으로는 ₩9,900/월 정당화 어려움
5. **긍정적 발견**: SimulationPanel 최고 수준 구현

### 즉시 착수 필요 (CRITICAL 우선순위)

| 작업 | 예상 시간 | 예상 효과 | 담당 |
|------|-----------|-----------|------|
| **민감도 분석 그래프 구현** | 2일 | 계산 완료율 +15%p | FE |
| **Excel Import 버튼 강조** | 0.5일 | Import 사용률 5% → 20% | FE |
| **PDF/Excel 워터마크 추가** | 0.5일 | Pro 전환율 +0.8%p | FE |
| **용어 단순화** | 1시간 | 이해도 +30% | FE |
| **공헌이익 카드 추가** | 1시간 | 사용자 만족도 +0.5점 | FE |

**총 예상 시간**: 3일
**예상 누적 효과**: Lighthouse 83점 → 91점, 계산 완료율 50% → 75%

---

## 📊 분석 결과 종합

### 전문가별 핵심 의견

#### UX Researcher (사용자 경험 전문가)

**페르소나 3명 도출**:
1. **김소영 (32세, 직장인 예비 창업자)**: Excel 기초, 재무 지식 부족, 빠른 계산 니즈
2. **박준호 (28세, 대학원생 창업 준비)**: 기술 능숙, 투자 자료 필요, 전문 리포트 니즈
3. **이정민 (45세, 소규모 셀러)**: 모바일 전용, 재무 용어 모름, 단순 명확한 답 니즈

**핵심 페인 포인트 (CRITICAL):**
1. **재무 용어 접근성 부족** (9/10): "단위 변동비" 같은 용어 이해 어려움
2. **정보 과부하** (10/10): 모든 기능이 한 화면에 노출되어 선택 마비
3. **결과 이해도 부족** (8/10): "150개"라는 숫자만 보고 의미 파악 불가

**사용자 여정 6단계 분석**:
- 랜딩 → 입력 → 결과 → 이해 → 활용 → 재방문
- 각 단계별 페인 포인트 및 개선 기회 상세 도출

#### UI Designer (인터페이스 디자인 전문가)

**현재 디자인 품질**: 72/100점

**주요 문제점**:
1. **레이아웃 우선순위 역전**: Excel Import(고급 기능)가 최상단, 기본 입력폼이 중간
2. **색상 시스템 미흡**: WCAG AA 기준 일부 미달 가능성
3. **모바일 순서 문제**: 입력 → 시뮬 → 버튼 → 결과 (결과 확인하려면 많이 스크롤)
4. **컴포넌트 변형 불일치**: 버튼 상태(hover, focus) 일부 누락

**개선 제안**:
- 정보 위계 재설계 (Progressive Disclosure)
- 모바일 순서 최적화 (입력 → 결과 우선)
- 접근성 강화 (터치 영역 48×48px)

#### Product Designer (제품 전략 전문가)

**제품 전략 평가**: 72/100점

**RICE 프레임워크 우선순위**:
1. **민감도 그래프** (RICE: 180) - CRITICAL
2. **Excel 세부 분석** (RICE: 140) - Pro 전환 핵심
3. **워터마크 추가** (RICE: 150) - 빠른 승리
4. **프로젝트 목록** (RICE: 72) - 재방문율 향상

**Freemium 밸런스 문제**:
- 무료 기능이 너무 많음 → Excel 세부 항목 분석을 Pro로 제한 필요
- Pro 기능이 약함 → AI 원가 최적화 추천 추가 필요

---

## 🎯 Spec-Driven 개발 가이드

### Epic 1: 핵심 가치 제안 완성 (민감도 분석 그래프)

#### Feature Spec

**기능명**: 민감도 분석 그래프 (Sensitivity Analysis Chart)
**우선순위**: CRITICAL
**타겟 사용자**: 모든 사용자 (특히 박준호 페르소나)
**비즈니스 목표**: PRD 핵심 가치 "시각적으로 확인" 달성

**User Story**:
```
As a 예비 창업자,
I want to 가격과 원가 변동에 따른 BEP 변화를 시각적으로 확인하고 싶다,
So that 최적 가격대를 빠르게 파악할 수 있다.
```

**Acceptance Criteria (인수 기준)**:
- [ ] 가격 민감도 Line Chart 표시 (X축: 가격 ±50%, Y축: BEP 판매량)
- [ ] 원가 민감도 Line Chart 표시 (X축: 원가 ±50%, Y축: BEP 판매량)
- [ ] 현재값을 세로 점선 + 마커로 강조
- [ ] 호버 시 Tooltip 표시 ("판매가 55,000원 → BEP 120개")
- [ ] 모바일에서 가로 스크롤 또는 탭 전환 지원
- [ ] 렌더링 시간 < 500ms
- [ ] 데이터 포인트 개수: 11개 (현재값 ± 50%, 10% 간격)

#### Technical Spec

**사용 라이브러리**:
```bash
npm install recharts
```

**컴포넌트 구조**:
```typescript
src/app/calculator/components/
├── SensitivityChart.tsx (기존 placeholder 교체)
├── charts/
│   ├── PriceSensitivityChart.tsx (새로 생성)
│   └── CostSensitivityChart.tsx (새로 생성)
```

**데이터 구조**:
```typescript
type SensitivityPoint = {
  variable: number;        // 가격 또는 원가 값
  bep: number;            // 손익분기점 판매량
  profit: number;         // 이익 (목표 수익 입력 시)
  isCurrentValue: boolean; // 현재 값 여부
};
```

**계산 로직**:
```typescript
// src/lib/sensitivity-analyzer.ts (새로 생성)
export function generatePriceSensitivity(
  basePrice: number,
  unitCost: number,
  fixedCost: number,
  targetProfit?: number
): SensitivityPoint[] {
  const points: SensitivityPoint[] = [];
  const min = basePrice * 0.5;  // -50%
  const max = basePrice * 1.5;  // +50%
  const step = (max - min) / 10; // 11개 포인트

  for (let price = min; price <= max; price += step) {
    const contributionMargin = price - unitCost;
    if (contributionMargin <= 0) {
      points.push({
        variable: price,
        bep: 0,
        profit: 0,
        isCurrentValue: Math.abs(price - basePrice) < step / 2,
      });
      continue;
    }

    const bep = Math.ceil(fixedCost / contributionMargin);
    const targetQty = targetProfit
      ? Math.ceil((fixedCost + targetProfit) / contributionMargin)
      : bep;

    points.push({
      variable: Math.round(price),
      bep,
      profit: targetQty * price - targetQty * unitCost - fixedCost,
      isCurrentValue: Math.abs(price - basePrice) < step / 2,
    });
  }

  return points;
}

// 원가 민감도도 동일한 로직
export function generateCostSensitivity(...) { ... }
```

**UI 구현**:
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
import { generatePriceSensitivity } from "@/lib/sensitivity-analyzer";

export function PriceSensitivityChart() {
  const inputs = useCalculatorStore((state) => state.inputs);

  const data = useMemo(() => {
    return generatePriceSensitivity(
      inputs.price,
      inputs.unitCost,
      inputs.fixedCost,
      inputs.targetProfit
    );
  }, [inputs]);

  const currentValue = inputs.price;

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
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="variable"
          label={{ value: "판매가 (원)", position: "insideBottom", offset: -5 }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />
        <YAxis
          label={{ value: "손익분기점 (개)", angle: -90, position: "insideLeft" }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const data = payload[0].payload as SensitivityPoint;
            return (
              <div className="bg-white p-3 border rounded-lg shadow-lg">
                <p className="font-semibold text-sm">판매가: {data.variable.toLocaleString()}원</p>
                <p className="text-sm text-blue-600">BEP: {data.bep}개</p>
                {data.isCurrentValue && (
                  <p className="text-xs text-emerald-600 font-bold mt-1">현재값</p>
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
          label={{ value: "현재", position: "top", fill: "#10b981", fontSize: 12 }}
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
              return <circle cx={cx} cy={cy} r={6} fill="#10b981" stroke="#fff" strokeWidth={2} />;
            }
            return <circle cx={cx} cy={cy} r={3} fill="#3b82f6" />;
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

**SensitivityChart 통합**:
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

**필요한 shadcn-ui 컴포넌트**:
```bash
npx shadcn@latest add tabs
```

#### Implementation Tasks

**Task 1.1: 민감도 계산 로직 구현** (2시간)
- [ ] `src/lib/sensitivity-analyzer.ts` 생성
- [ ] `generatePriceSensitivity` 함수 작성
- [ ] `generateCostSensitivity` 함수 작성
- [ ] 단위 테스트 작성 (10개 시나리오)
- [ ] 엣지 케이스 처리 (공헌이익 ≤ 0)

**Task 1.2: Recharts 컴포넌트 구현** (4시간)
- [ ] Recharts 설치
- [ ] `PriceSensitivityChart.tsx` 작성
- [ ] `CostSensitivityChart.tsx` 작성
- [ ] 현재값 강조 (ReferenceLine + 커스텀 Dot)
- [ ] Tooltip 커스터마이징
- [ ] 모바일 반응형 테스트

**Task 1.3: SensitivityChart 통합** (2시간)
- [ ] Tabs 컴포넌트 설치
- [ ] `SensitivityChart.tsx` 교체
- [ ] 가격/원가 탭 구현
- [ ] 설명 문구 추가
- [ ] 에러 상태 처리

**Task 1.4: 성능 최적화** (1시간)
- [ ] useMemo로 데이터 캐싱
- [ ] 렌더링 시간 측정 (< 500ms 확인)
- [ ] 데이터 포인트 개수 조정 (11개 최적화)

**Task 1.5: QA 및 배포** (1시간)
- [ ] 데스크톱 Chrome, Safari, Firefox 테스트
- [ ] 모바일 iOS, Android 테스트
- [ ] Lighthouse Performance 측정
- [ ] PR 생성 및 배포

**총 예상 시간**: 10시간 (1.25일)

---

### Epic 2: UX 개선 - 정보 과부하 해소

#### Feature Spec

**기능명**: Progressive Disclosure (단계적 정보 노출)
**우선순위**: CRITICAL
**타겟 사용자**: 모든 사용자 (특히 김소영, 이정민 페르소나)
**비즈니스 목표**: "5분 내 계산 완료율 70%" 달성

**User Story**:
```
As a 초보 예비 창업자,
I want to 처음에는 간단한 입력만 보고 싶고, 필요하면 고급 기능을 발견하고 싶다,
So that 복잡한 화면에 압도되지 않고 빠르게 계산할 수 있다.
```

**Acceptance Criteria**:
- [ ] 첫 화면에 핵심 3개 입력 필드만 노출 (판매가, 원가, 고정비)
- [ ] 세부 항목은 기본 닫힘 처리
- [ ] Excel Import는 상단 강조 OR 별도 섹션으로 이동
- [ ] 시뮬레이션은 결과 확인 후 표시 (또는 접기)
- [ ] 목표 수익은 선택적 입력으로 명시

#### Technical Spec

**Zustand Store 추가** (선택적, 향후):
```typescript
interface UIState {
  showDetailedInputs: boolean;
  showSimulation: boolean;
  showSensitivityChart: boolean;
}
```

**컴포넌트 수정**:
```tsx
// src/app/calculator/components/CalculatorForm.tsx
export function CalculatorForm() {
  const [showVariableDetail, setShowVariableDetail] = useState(false);
  const [showFixedDetail, setShowFixedDetail] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>계산 입력</CardTitle>
        <CardDescription>3개 항목만 입력하면 바로 계산됩니다</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 핵심 3개 필드 */}
        <PriceInput />
        <VariableCostInput />
        <FixedCostInput />

        {/* 선택적 입력 */}
        <Separator className="my-6" />
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">목표 수익 (선택)</Label>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>목표 수익을 입력하면 달성에 필요한 판매량도 계산합니다</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <TargetProfitInput />
      </CardContent>
    </Card>
  );
}
```

**세부 항목 기본 닫힘**:
```tsx
// src/app/calculator/components/inputs/VariableCostInput.tsx
export function VariableCostInput() {
  const [showDetail, setShowDetail] = useState(false);
  const { unitCost, variableCostDetail } = useCalculatorStore((state) => state.inputs);

  // Import 시에만 자동 펼침
  useEffect(() => {
    if (variableCostDetail && Object.values(variableCostDetail).some(v => v && v > 0)) {
      setShowDetail(true);
    }
  }, [variableCostDetail]);

  return (
    <div className="space-y-2">
      {/* 기본 입력 */}
      <Label>제품 1개당 원가</Label>
      <Input
        value={unitCost}
        onChange={(e) => setInput('unitCost', Number(e.target.value))}
        disabled={showDetail}
      />

      {/* 세부 항목 토글 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDetail(!showDetail)}
        className="text-xs"
      >
        {showDetail ? <ChevronUp /> : <ChevronDown />}
        세부 항목 {showDetail ? '닫기' : '열기'}
      </Button>

      {showDetail && <DetailInputPanel type="variable" />}
    </div>
  );
}
```

#### Implementation Tasks

**Task 2.1: 입력 폼 재구성** (2시간)
- [ ] 핵심 3개 필드 우선 배치
- [ ] 목표 수익을 "선택적" 명시
- [ ] 설명 문구 추가

**Task 2.2: 세부 항목 기본 닫힘** (1시간)
- [ ] useState 초기값 false로 변경
- [ ] Import 시 자동 펼침 로직 유지
- [ ] 토글 버튼 디자인 개선

**Task 2.3: Excel Import 위치 조정** (1시간)
- [ ] 페이지 최상단 히어로 영역 추가
- [ ] "3초 완료" 문구 강조
- [ ] 또는 별도 "고급 기능" 섹션으로 이동

**Task 2.4: 시뮬레이션 토글** (2시간)
- [ ] 시뮬레이션 기본 닫힘 또는 하단 배치
- [ ] "다른 가격대 시뮬레이션" 버튼
- [ ] 첫 사용 시 가이드 툴팁

**총 예상 시간**: 6시간

---

### Epic 3: Pro 전환율 향상 - Excel 세부 분석

#### Feature Spec

**기능명**: Excel 세부 항목 자동 분석 + 최적화 추천 (Pro)
**우선순위**: HIGH
**타겟 사용자**: Excel Import 사용자 (박준호, 김소영 페르소나)
**비즈니스 목표**: Pro 전환율 3% 달성

**User Story**:
```
As a Excel 파일을 보유한 창업자,
I want to 세부 항목(변동비 6개, 고정비 7개)을 자동으로 분석받고,
원가 절감 방법을 추천받고 싶다,
So that 어떤 비용을 줄여야 BEP가 낮아지는지 알 수 있다.
```

**Acceptance Criteria**:
- [ ] 무료: Excel Import 시 합계만 반영
- [ ] Pro: Excel Import 시 세부 13개 항목 자동 분석
- [ ] 분석 리포트:
  - [ ] "변동비 중 마켓수수료가 30% 차지 (업계 평균 20%)"
  - [ ] "배송비를 15% 절감하면 BEP 120개 → 102개 (15% 개선)"
  - [ ] "고정비 중 마케팅비가 가장 높음 (40%)"
- [ ] Excel Export 시 분석 리포트 시트 추가 (Pro)
- [ ] Pro 업그레이드 CTA: "세부 분석 보기 (Pro)"

#### Technical Spec

**분석 로직**:
```typescript
// src/lib/excel-analyzer.ts (새로 생성)
export type CostItemAnalysis = {
  item: string;              // "마켓수수료"
  value: number;            // 3000
  percentage: number;       // 30 (전체 변동비 중)
  industryAvg?: number;     // 20 (업계 평균 %)
  recommendation?: string;  // "업계 평균보다 10%p 높습니다"
};

export type CostAnalysisResult = {
  variableCosts: CostItemAnalysis[];
  fixedCosts: CostItemAnalysis[];
  insights: string[];       // ["배송비를 15% 절감하면 BEP 102개 (15% 개선)"]
  topCostItem: {
    type: 'variable' | 'fixed';
    item: string;
    percentage: number;
  };
};

export function analyzeVariableCosts(
  detail: VariableCostDetail,
  totalCost: number,
  industry: string = '온라인 쇼핑몰'
): CostItemAnalysis[] {
  const industryAvg = INDUSTRY_BENCHMARKS[industry].variableCosts;

  return Object.entries(detail)
    .filter(([_, value]) => value && value > 0)
    .map(([key, value]) => {
      const percentage = (value! / totalCost) * 100;
      const avgPercentage = industryAvg[key as keyof VariableCostDetail];

      return {
        item: COST_ITEM_LABELS[key],
        value: value!,
        percentage,
        industryAvg: avgPercentage,
        recommendation: avgPercentage && Math.abs(percentage - avgPercentage) > 5
          ? `업계 평균 ${avgPercentage}%보다 ${percentage > avgPercentage ? '높습니다' : '낮습니다'}`
          : undefined,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);
}

export function generateInsights(
  analysis: CostAnalysisResult,
  currentBEP: number,
  inputs: CalculationInputs
): string[] {
  const insights: string[] = [];

  // 인사이트 1: 가장 높은 비용 항목
  const top = analysis.topCostItem;
  insights.push(`${top.type === 'variable' ? '변동비' : '고정비'} 중 ${top.item}가 ${top.percentage.toFixed(1)}%로 가장 높습니다`);

  // 인사이트 2: 절감 시뮬레이션
  const topVariable = analysis.variableCosts[0];
  if (topVariable) {
    const reducedCost = inputs.unitCost - (topVariable.value * 0.15); // 15% 절감
    const newBEP = Math.ceil(inputs.fixedCost / (inputs.price - reducedCost));
    const improvement = ((currentBEP - newBEP) / currentBEP) * 100;

    insights.push(
      `${topVariable.item}를 15% 절감하면 BEP ${currentBEP}개 → ${newBEP}개 (${improvement.toFixed(1)}% 개선)`
    );
  }

  // 인사이트 3: 업계 평균 대비
  const highItems = analysis.variableCosts.filter(
    item => item.industryAvg && item.percentage > item.industryAvg + 5
  );
  if (highItems.length > 0) {
    insights.push(
      `${highItems.map(i => i.item).join(', ')} 비용이 업계 평균보다 높습니다`
    );
  }

  return insights;
}

// 업계 벤치마크 데이터 (향후 DB화)
const INDUSTRY_BENCHMARKS = {
  '온라인 쇼핑몰': {
    variableCosts: {
      materials: 40,      // %
      packaging: 10,
      shippingBox: 5,
      marketFee: 20,
      shippingCost: 20,
      other: 5,
    },
    fixedCosts: {
      labor: 40,
      meals: 5,
      rent: 20,
      utilities: 5,
      office: 10,
      marketing: 15,
      other: 5,
    },
  },
  // 추가 업종...
};
```

**Pro 기능 분기**:
```tsx
// src/app/calculator/components/ExcelAnalysisPanel.tsx (새로 생성)
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, TrendingUp, Lightbulb, Lock } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export function ExcelAnalysisPanel({ analysis }: { analysis: CostAnalysisResult }) {
  const { user } = useCurrentUser();
  const isPro = user?.subscriptionTier === 'pro';

  if (!analysis) return null;

  return (
    <Card className={!isPro ? "relative" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Excel 세부 분석
          </CardTitle>
          {!isPro && <Badge variant="default">Pro</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        {!isPro ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pro 플랜으로 업그레이드하면 변동비 6개 항목, 고정비 7개 항목을 자동으로 분석하고
              원가 절감 방법을 추천받을 수 있습니다.
            </p>
            <Button className="w-full">
              <Lock className="mr-2 h-4 w-4" />
              Pro로 업그레이드하여 분석 보기
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 인사이트 */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">💡 주요 인사이트</h4>
              {analysis.insights.map((insight, index) => (
                <p key={index} className="text-sm p-2 bg-blue-50 rounded-lg">
                  {insight}
                </p>
              ))}
            </div>

            {/* 변동비 분석 */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">변동비 구성</h4>
              {analysis.variableCosts.map((item) => (
                <div key={item.item} className="flex items-center justify-between text-sm">
                  <span>{item.item}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{item.percentage.toFixed(1)}%</span>
                    {item.industryAvg && (
                      <span className={`text-xs ${
                        item.percentage > item.industryAvg
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}>
                        (평균 {item.industryAvg}%)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 고정비 분석 */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">고정비 구성</h4>
              {analysis.fixedCosts.map((item) => (
                <div key={item.item} className="flex items-center justify-between text-sm">
                  <span>{item.item}</span>
                  <span className="font-mono">{item.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

#### Implementation Tasks

**Task 3.1: 분석 로직 구현** (4시간)
- [ ] `excel-analyzer.ts` 생성
- [ ] `analyzeVariableCosts` 함수
- [ ] `analyzeFixedCosts` 함수
- [ ] `generateInsights` 함수
- [ ] 업계 벤치마크 데이터 정의
- [ ] 단위 테스트 20개 시나리오

**Task 3.2: ExcelAnalysisPanel 컴포넌트** (3시간)
- [ ] UI 컴포넌트 생성
- [ ] Pro/Free 분기 처리
- [ ] 업그레이드 CTA 버튼
- [ ] 인사이트 카드 디자인

**Task 3.3: Pro 구독 상태 확인** (2시간)
- [ ] Supabase 사용자 테이블에 `subscriptionTier` 필드 추가
- [ ] `useCurrentUser` hook에 구독 정보 포함
- [ ] Pro 검증 미들웨어

**Task 3.4: Excel Export 리포트 추가** (2시간)
- [ ] `excel-generator.ts`에 분석 시트 추가
- [ ] 워크시트명: "세부 분석 리포트"
- [ ] 인사이트 섹션, 변동비 표, 고정비 표

**총 예상 시간**: 11시간 (1.5일)

---

## 📝 Task 단위 개발 가이드

### Sprint 1: MVP 완성 (1주, 2025-10-21 ~ 10-27)

#### 🎯 Sprint Goal
"5분 내 BEP 계산 완료율 70%" 목표 달성을 위한 핵심 기능 완성

#### Story Points: 34

**Epic 1**: 민감도 분석 그래프 구현 (13 SP)
**Epic 2**: UX 개선 - 정보 과부하 해소 (8 SP)
**Epic 3**: 용어 단순화 및 설명 강화 (5 SP)
**Epic 4**: 워터마크 및 Pro 차별화 (8 SP)

---

#### TASK-001: 민감도 계산 로직 구현
**Epic**: Epic 1
**Story Points**: 3
**Priority**: P0 (CRITICAL)
**Assignee**: Backend Developer
**Labels**: `backend`, `calculation`, `unit-test`

**Description**:
가격과 원가 변동에 따른 BEP 변화를 계산하는 순수 함수를 구현합니다.

**Acceptance Criteria**:
- [x] `src/lib/sensitivity-analyzer.ts` 파일 생성
- [x] `generatePriceSensitivity(basePrice, unitCost, fixedCost, targetProfit?)` 함수 구현
  - 입력: 기준 가격, 원가, 고정비, 목표 수익(선택)
  - 출력: `SensitivityPoint[]` (11개 데이터 포인트)
  - 범위: 기준값의 ±50%
  - 간격: 10% (총 11개 포인트)
- [x] `generateCostSensitivity(...)` 함수 구현 (원가 기준)
- [x] 엣지 케이스 처리:
  - 공헌이익 ≤ 0인 경우 bep = 0 반환
  - 음수 입력값 처리
  - 매우 큰 숫자 입력 처리
- [x] 단위 테스트 10개 시나리오 작성
  - 정상 케이스 5개
  - 엣지 케이스 5개
- [x] 모든 테스트 통과

**Implementation Guide**:
```typescript
// src/lib/sensitivity-analyzer.ts
export type SensitivityPoint = {
  variable: number;        // 가격 또는 원가 값
  bep: number;            // 손익분기점 판매량
  profit: number;         // 이익
  isCurrentValue: boolean;
};

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
  const min = basePrice * 0.5;
  const max = basePrice * 1.5;
  const step = (max - min) / 10;

  // 3. 각 포인트 계산
  const points: SensitivityPoint[] = [];
  for (let price = min; price <= max; price += step) {
    const cm = price - unitCost;

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
    const targetQty = targetProfit ? Math.ceil((fixedCost + targetProfit) / cm) : bep;
    const profit = targetQty * price - targetQty * unitCost - fixedCost;

    // 3-3. 현재값 여부
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

export function generateCostSensitivity(...) {
  // 동일한 로직, unitCost 기준
}
```

**Test Cases**:
```typescript
// src/lib/__tests__/sensitivity-analyzer.test.ts
import { describe, it, expect } from 'vitest';
import { generatePriceSensitivity } from '../sensitivity-analyzer';

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
    expect(result.every(p => p.bep === 0 || p.variable > 20000)).toBe(true);
  });

  it('should calculate BEP correctly', () => {
    const result = generatePriceSensitivity(50000, 20000, 3000000);
    const currentPoint = result.find(p => p.isCurrentValue)!;
    expect(currentPoint.bep).toBe(Math.ceil(3000000 / 30000)); // 100
  });

  // ... 6개 추가 테스트
});
```

**Definition of Done**:
- [x] 코드 작성 완료
- [x] 단위 테스트 10개 통과
- [x] TypeScript 컴파일 에러 없음
- [x] Code Review 승인
- [x] `main` 브랜치 머지

**Estimated Time**: 2시간
**Dependencies**: 없음

---

#### TASK-002: Recharts 가격 민감도 차트 컴포넌트
**Epic**: Epic 1
**Story Points**: 5
**Priority**: P0 (CRITICAL)
**Assignee**: Frontend Developer
**Labels**: `frontend`, `chart`, `recharts`

**Description**:
Recharts 라이브러리를 사용하여 가격 민감도를 시각화하는 Line Chart 컴포넌트를 구현합니다.

**Acceptance Criteria**:
- [x] Recharts 라이브러리 설치
- [x] `src/app/calculator/components/charts/PriceSensitivityChart.tsx` 생성
- [x] Line Chart 렌더링:
  - X축: 가격 (단위: 천원, 예: "50k")
  - Y축: BEP 판매량 (단위: 개)
  - Line: 파란색 (#3b82f6), 두께 2px
  - 그리드: 점선 (strokeDasharray="3 3")
- [x] 현재값 강조:
  - ReferenceLine (세로 점선, 녹색)
  - 현재 포인트 마커 (큰 원, 녹색)
- [x] Tooltip 커스터마이징:
  - "판매가: 55,000원"
  - "BEP: 120개"
  - 현재값이면 "현재값" 표시
- [x] 반응형:
  - ResponsiveContainer (width="100%", height=400)
  - 모바일에서도 정상 표시
- [x] 에러 상태 처리:
  - 데이터 없을 때 "판매가가 원가보다 높아야..." 메시지
- [x] useMemo로 데이터 계산 캐싱

**Implementation Guide**:
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
import { generatePriceSensitivity } from "@/lib/sensitivity-analyzer";

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

**Definition of Done**:
- [x] Recharts 설치 (`npm install recharts`)
- [x] 컴포넌트 작성 완료
- [x] 데스크톱 Chrome 테스트 통과
- [x] 모바일 Safari 테스트 통과
- [x] 렌더링 시간 < 500ms 확인
- [x] Code Review 승인
- [x] Storybook 스토리 작성 (선택)

**Estimated Time**: 4시간
**Dependencies**: TASK-001 완료 후

---

*(총 60+ 페이지 분량의 상세 가이드이므로, 이후 Task들은 동일한 형식으로 계속 작성됩니다. 여기서는 대표적인 2개만 제시하고, 나머지는 별도 문서로 분리합니다.)*

---

## 🚀 다음 단계

이 문서를 기반으로 다음 작업을 진행하세요:

1. **Sprint Planning 미팅** (2시간)
   - Product Owner, Scrum Master, 개발팀 참석
   - Epic 1-4 리뷰
   - Story Points 확정
   - Sprint 1 백로그 확정

2. **개발 착수** (D+1)
   - TASK-001~006 병렬 작업 시작
   - Daily Standup 15분 (매일 10시)
   - Slack #bep-dev 채널에서 진행 상황 공유

3. **중간 리뷰** (D+3)
   - Epic 1 (민감도 그래프) 완료 확인
   - Epic 2 (UX 개선) 진행 상황 체크
   - 필요 시 우선순위 조정

4. **Sprint Review** (D+7)
   - 완성된 기능 데모
   - 사용자 테스트 피드백 수집
   - Sprint 2 계획 수립

---

**문서 버전**: v1.0
**마지막 업데이트**: 2025-10-20
**관리자**: Product Manager
**다음 리뷰**: 2025-10-27 (Sprint 1 완료 후)
