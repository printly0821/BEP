"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, TrendingDown, TrendingUp } from "lucide-react";

interface SimulationPanelProps {
  // 실제 값 (비교용)
  actualSellingPrice: number;
  actualVariableCost: number;

  // 시뮬레이션 값
  simPrice: number;
  simVariableCost: number;

  // 핸들러
  onSimPriceChange: (value: number) => void;
  onSimVariableCostChange: (value: number) => void;

  // 시뮬레이션 결과
  simulationResult: {
    contributionMargin: number;
    breakEvenQuantity: number;
    targetQuantity: number;
    projectedRevenue: number;
    projectedProfit: number;
  } | null;

  // 실제 결과 (비교용)
  actualResult: {
    breakEvenQuantity: number;
    targetQuantity: number;
  };

  // 액션
  onApply: () => void;
  onReset: () => void;
}

export function SimulationPanel({
  actualSellingPrice,
  actualVariableCost,
  simPrice,
  simVariableCost,
  onSimPriceChange,
  onSimVariableCostChange,
  simulationResult,
  actualResult,
  onApply,
  onReset,
}: SimulationPanelProps) {
  // 변화 여부 확인
  const hasChanges =
    simPrice !== actualSellingPrice || simVariableCost !== actualVariableCost;

  // 증감 계산 헬퍼 함수
  const calculateDiff = (simValue: number, actualValue: number) => {
    const diff = simValue - actualValue;
    const percent = actualValue === 0 ? 0 : (diff / actualValue) * 100;
    return { diff, percent };
  };

  // BEP 증감 (감소가 좋음)
  const bepDiff = simulationResult
    ? calculateDiff(
        simulationResult.breakEvenQuantity,
        actualResult.breakEvenQuantity
      )
    : null;

  // 목표 판매량 증감 (감소가 좋음)
  const targetDiff = simulationResult
    ? calculateDiff(
        simulationResult.targetQuantity,
        actualResult.targetQuantity
      )
    : null;

  return (
    <Card className={hasChanges ? "border-blue-300 bg-blue-50/50" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>시뮬레이션</span>
          {hasChanges && (
            <span className="text-xs font-normal text-blue-600">
              변경사항 있음
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 판매가 슬라이더 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>판매가</Label>
            <span className="text-sm font-medium text-foreground">
              {simPrice.toLocaleString()}원
            </span>
          </div>
          <Slider
            value={[simPrice]}
            min={Math.max(10000, Math.floor(actualSellingPrice * 0.5))}
            max={Math.ceil(actualSellingPrice * 1.5)}
            step={1000}
            onValueChange={(values) => onSimPriceChange(values[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {Math.max(10000, Math.floor(actualSellingPrice * 0.5)).toLocaleString()}원
            </span>
            <span>
              {Math.ceil(actualSellingPrice * 1.5).toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 원가 슬라이더 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>원가</Label>
            <span className="text-sm font-medium text-foreground">
              {simVariableCost.toLocaleString()}원
            </span>
          </div>
          <Slider
            value={[simVariableCost]}
            min={Math.max(5000, Math.floor(actualVariableCost * 0.5))}
            max={Math.min(
              Math.ceil(actualVariableCost * 1.5),
              simPrice - 1000
            )}
            step={1000}
            onValueChange={(values) => onSimVariableCostChange(values[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {Math.max(5000, Math.floor(actualVariableCost * 0.5)).toLocaleString()}원
            </span>
            <span>
              {Math.min(Math.ceil(actualVariableCost * 1.5), simPrice - 1000).toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 시뮬레이션 결과 */}
        {simulationResult && hasChanges && (
          <div className="mt-4 space-y-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-900">
              시뮬레이션 결과
            </p>

            {/* 공헌이익 */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">공헌이익:</span>
              <span className="font-medium text-gray-900">
                {simulationResult.contributionMargin.toLocaleString()}원
              </span>
            </div>

            {/* BEP 비교 */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">손익분기점:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {simulationResult.breakEvenQuantity.toLocaleString()}개
                </span>
                {bepDiff && bepDiff.diff !== 0 && (
                  <span
                    className={`flex items-center gap-1 text-xs ${
                      bepDiff.diff < 0
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {bepDiff.diff < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <TrendingUp className="h-3 w-3" />
                    )}
                    {Math.abs(bepDiff.diff).toLocaleString()}개 (
                    {bepDiff.percent.toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>

            {/* 목표 판매량 비교 */}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">목표 판매량:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {simulationResult.targetQuantity.toLocaleString()}개
                </span>
                {targetDiff && targetDiff.diff !== 0 && (
                  <span
                    className={`flex items-center gap-1 text-xs ${
                      targetDiff.diff < 0
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {targetDiff.diff < 0 ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <TrendingUp className="h-3 w-3" />
                    )}
                    {Math.abs(targetDiff.diff).toLocaleString()}개 (
                    {targetDiff.percent.toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 공헌이익이 0 이하인 경우 경고 */}
        {simulationResult && simulationResult.contributionMargin <= 0 && (
          <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800">
            ⚠️ 공헌이익이 0 이하입니다. 판매가를 높이거나 원가를 낮춰주세요.
          </div>
        )}

        {/* 버튼 그룹 */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={!hasChanges}
            className="flex-1"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            초기화
          </Button>
          <Button
            size="sm"
            onClick={onApply}
            disabled={
              !hasChanges ||
              !simulationResult ||
              simulationResult.contributionMargin <= 0
            }
            className="flex-1"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            적용
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
