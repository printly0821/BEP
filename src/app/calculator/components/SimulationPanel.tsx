"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, RotateCcw, TrendingDown, TrendingUp, FileSpreadsheet, Undo2 } from "lucide-react";
import type { CalculationInputs } from "@/features/projects/types";

interface SimulationPanelProps {
  // 실제 값 (비교용)
  actualSellingPrice: number;
  actualVariableCost: number;

  // Import한 원본 데이터
  importedData: {
    inputs: CalculationInputs;
    fileName: string;
    timestamp: Date;
  } | null;

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
  onResetToOriginal?: () => void;

  // 비활성화 상태 (세부 항목 모드)
  disabled?: boolean;
}

export function SimulationPanel({
  actualSellingPrice,
  actualVariableCost,
  importedData,
  simPrice,
  simVariableCost,
  onSimPriceChange,
  onSimVariableCostChange,
  simulationResult,
  actualResult,
  onApply,
  onReset,
  onResetToOriginal,
  disabled = false,
}: SimulationPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("simulation");

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

  // 원본이 없으면 시뮬레이션 탭만 표시
  if (!importedData) {
    // 비활성화 상태 UI
    if (disabled) {
      return (
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>시뮬레이션</span>
              <span className="text-xs font-normal text-muted-foreground">[비활성]</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mb-2 text-sm font-medium text-foreground">
                세부 항목 모드
              </p>
              <p className="mb-4 text-xs text-muted-foreground">
                세부 항목 값을 직접 조정하여<br />
                영향을 확인하세요.
              </p>
              <div className="mx-auto max-w-xs space-y-2 text-left">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>팁:</strong> 각 세부 항목을 조정하면<br />
                  실시간으로 BEP가 재계산됩니다
                </p>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                시뮬레이터를 사용하려면<br />
                세부 항목을 초기화하세요.
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

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

  // Import한 원본이 있는 경우: 탭 UI 표시
  return (
    <Card>
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
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="original">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              원본
            </TabsTrigger>
            <TabsTrigger value="simulation">시뮬레이션</TabsTrigger>
          </TabsList>

          {/* 원본 탭 */}
          <TabsContent value="original" className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">파일명:</span>
                <span className="font-medium truncate ml-2">{importedData.fileName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Import 시간:</span>
                <span className="font-medium">
                  {importedData.timestamp.toLocaleString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            {/* 원본 vs 현재 비교 */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">원본 vs 현재 값</p>

              <div className="rounded-lg border p-3 space-y-2">
                {/* 판매가 */}
                <div className="flex items-center justify-between text-sm">
                  <span>판매가</span>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      {importedData.inputs.price.toLocaleString()}원
                    </span>
                    <span className="font-medium min-w-[100px] text-right">
                      {actualSellingPrice.toLocaleString()}원
                    </span>
                    {actualSellingPrice !== importedData.inputs.price && (
                      <span className={`text-xs ${
                        actualSellingPrice > importedData.inputs.price
                          ? "text-green-600"
                          : "text-red-600"
                      }`}>
                        {actualSellingPrice > importedData.inputs.price ? "↑" : "↓"}
                        {Math.abs(actualSellingPrice - importedData.inputs.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* 단위 변동비 */}
                <div className="flex items-center justify-between text-sm">
                  <span>단위 변동비</span>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      {importedData.inputs.unitCost.toLocaleString()}원
                    </span>
                    <span className="font-medium min-w-[100px] text-right">
                      {actualVariableCost.toLocaleString()}원
                    </span>
                    {actualVariableCost !== importedData.inputs.unitCost && (
                      <span className={`text-xs ${
                        actualVariableCost < importedData.inputs.unitCost
                          ? "text-green-600"
                          : "text-red-600"
                      }`}>
                        {actualVariableCost < importedData.inputs.unitCost ? "↓" : "↑"}
                        {Math.abs(actualVariableCost - importedData.inputs.unitCost).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 원본으로 복구 버튼 */}
            {onResetToOriginal && (actualSellingPrice !== importedData.inputs.price ||
              actualVariableCost !== importedData.inputs.unitCost) && (
              <Button
                onClick={onResetToOriginal}
                variant="outline"
                className="w-full"
              >
                <Undo2 className="mr-2 h-4 w-4" />
                원본으로 복구
              </Button>
            )}
          </TabsContent>

          {/* 시뮬레이션 탭 */}
          <TabsContent value="simulation" className="space-y-6">
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

            {/* 원본 vs 시뮬레이션 비교 */}
            {importedData && hasChanges && (
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  원본 대비 변화
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">판매가:</span>
                    <span className={`ml-2 font-medium ${
                      simPrice === importedData.inputs.price
                        ? ""
                        : simPrice > importedData.inputs.price
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                      {simPrice === importedData.inputs.price ? "동일" :
                        `${simPrice > importedData.inputs.price ? "↑" : "↓"}${Math.abs(simPrice - importedData.inputs.price).toLocaleString()}원`
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">원가:</span>
                    <span className={`ml-2 font-medium ${
                      simVariableCost === importedData.inputs.unitCost
                        ? ""
                        : simVariableCost < importedData.inputs.unitCost
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                      {simVariableCost === importedData.inputs.unitCost ? "동일" :
                        `${simVariableCost < importedData.inputs.unitCost ? "↓" : "↑"}${Math.abs(simVariableCost - importedData.inputs.unitCost).toLocaleString()}원`
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}

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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
