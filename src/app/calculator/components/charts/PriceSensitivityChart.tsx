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
import { generatePriceSensitivity, type SensitivityDataPoint } from "@/lib/sensitivity-analyzer";

interface PriceSensitivityChartProps {
  price: number;
  unitCost: number;
  fixedCost: number;
  targetProfit?: number;
}

export function PriceSensitivityChart({
  price,
  unitCost,
  fixedCost,
  targetProfit,
}: PriceSensitivityChartProps) {
  // 1. 데이터 생성 (useMemo로 캐싱)
  const data = useMemo(() => {
    return generatePriceSensitivity(price, unitCost, fixedCost, targetProfit);
  }, [price, unitCost, fixedCost, targetProfit]);

  const currentValue = price;

  // 2. 에러 상태 처리
  if (data.length === 0 || data.every((d) => d.bep === 0)) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
        <p className="text-muted-foreground text-sm">
          판매가가 원가보다 높아야 그래프가 표시됩니다
        </p>
      </div>
    );
  }

  // 3. 인사이트 계산
  const currentBEP = data.find((d) => d.isCurrentValue)?.bep || 0;
  const price10PercentUp = data.find((d) => Math.abs(d.variable - price * 1.1) < 1)?.bep || 0;
  const price10PercentDown = data.find((d) => Math.abs(d.variable - price * 0.9) < 1)?.bep || 0;

  const bepReductionUp = Math.round(currentBEP - price10PercentUp);
  const bepIncreaseDown = Math.round(price10PercentDown - currentBEP);

  // 4. 차트 렌더링
  return (
    <div className="space-y-4">
      {/* 인사이트 패널 */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-semibold text-blue-900 mb-3">💡 가격 변화 시뮬레이션</p>
        <div className="space-y-2 text-sm text-blue-800">
          {bepReductionUp > 0 && (
            <p>
              ✅ <strong>판매가를 10% 올리면</strong> (₩{Math.round(price * 1.1).toLocaleString()}원)
              BEP가 <strong className="text-green-600">{currentBEP}개 → {price10PercentUp}개</strong>로
              줄어듭니다 (<strong>{bepReductionUp}개 감소</strong>)
            </p>
          )}
          {bepIncreaseDown > 0 && (
            <p>
              ⚠️ <strong>판매가를 10% 내리면</strong> (₩{Math.round(price * 0.9).toLocaleString()}원)
              BEP가 <strong className="text-red-600">{currentBEP}개 → {price10PercentDown}개</strong>로
              늘어납니다 (<strong>{bepIncreaseDown}개 증가</strong>)
            </p>
          )}
          <p className="text-xs text-blue-700 mt-2">
            💡 팁: 가격을 올리는 게 내리는 것보다 더 적은 판매량으로 목표를 달성할 수 있습니다
          </p>
        </div>
      </div>

      {/* 차트 */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {/* 그리드 */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        {/* X축 */}
        <XAxis
          dataKey="variable"
          label={{
            value: "판매가 (원)",
            position: "insideBottom",
            offset: -5,
          }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
        />

        {/* Y축 */}
        <YAxis
          label={{
            value: "손익분기점 (개)",
            angle: -90,
            position: "insideLeft",
          }}
          tick={{ fontSize: 12 }}
        />

        {/* Tooltip */}
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0) return null;
            const dataPoint = payload[0].payload as SensitivityDataPoint;
            return (
              <div className="bg-white p-3 border rounded-lg shadow-lg">
                <p className="font-semibold text-sm">
                  판매가: {dataPoint.variable.toLocaleString()}원
                </p>
                <p className="text-sm text-blue-600">BEP: {dataPoint.bep}개</p>
                {dataPoint.isCurrentValue && (
                  <p className="text-xs text-emerald-600 font-bold mt-1">현재값</p>
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
            fontSize: 12,
          }}
        />

        {/* Line */}
        <Line
          type="monotone"
          dataKey="bep"
          stroke="#3b82f6"
          strokeWidth={2}
          name="손익분기점"
          dot={(props: any) => {
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
    </div>
  );
}
