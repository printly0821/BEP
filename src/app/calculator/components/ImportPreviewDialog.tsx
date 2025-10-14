"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FileSpreadsheet, ChevronDown, ChevronUp, AlertCircle, TrendingUp } from "lucide-react";
import type { CalculationInputs } from "@/features/projects/types";

interface ImportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CalculationInputs;
  fileName: string;
  existingData?: CalculationInputs | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ImportPreviewDialog({
  open,
  onOpenChange,
  data,
  fileName,
  existingData,
  onConfirm,
  onCancel,
}: ImportPreviewDialogProps) {
  const [showVariableDetail, setShowVariableDetail] = useState(false);
  const [showFixedDetail, setShowFixedDetail] = useState(false);

  // 세부 항목 존재 여부 확인
  const hasVariableDetail =
    data.variableCostDetail &&
    Object.values(data.variableCostDetail).some((v) => v && v > 0);
  const hasFixedDetail =
    data.fixedCostDetail &&
    Object.values(data.fixedCostDetail).some((v) => v && v > 0);

  // 덮어쓰기 확인
  const hasExistingData = existingData && (
    existingData.price > 0 ||
    existingData.unitCost > 0 ||
    existingData.fixedCost > 0
  );

  // 예상 계산 결과
  const estimatedResults = useMemo(() => {
    const contributionMargin = data.price - data.unitCost;
    if (contributionMargin <= 0) {
      return null;
    }

    const breakEvenQuantity = Math.ceil(data.fixedCost / contributionMargin);
    const targetQuantity = data.targetProfit
      ? Math.ceil((data.fixedCost + data.targetProfit) / contributionMargin)
      : null;

    return {
      contributionMargin,
      breakEvenQuantity,
      targetQuantity,
    };
  }, [data]);

  // 비율 계산 헬퍼
  const calcRatio = (value: number | undefined, total: number) => {
    if (!value || total === 0) return "0.0";
    return ((value / total) * 100).toFixed(1);
  };

  // 변동비 세부 항목 라벨
  const variableLabels: Record<string, string> = {
    materials: "원재료비",
    packaging: "패키지",
    shippingBox: "택배박스",
    marketFee: "마켓수수료",
    shippingCost: "배송비",
    other: "기타",
  };

  // 고정비 세부 항목 라벨
  const fixedLabels: Record<string, string> = {
    labor: "인건비",
    meals: "식비",
    rent: "임대료",
    utilities: "공과금",
    office: "사무실운영비",
    marketing: "마케팅비",
    other: "기타",
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        {/* 헤더 */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Excel 데이터 미리보기
          </DialogTitle>
          <DialogDescription>
            <span className="font-medium">{fileName}</span>에서 불러올 데이터를 확인하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 기본 정보 - 항상 표시 */}
          <div className="rounded-lg border p-4 bg-muted/30">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span>📊</span>
              <span>기본 정보</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-muted-foreground block mb-1">판매가</span>
                <p className="font-semibold text-lg">{data.price.toLocaleString()}원</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">단위 변동비</span>
                <p className="font-semibold text-lg">{data.unitCost.toLocaleString()}원</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">월 고정비</span>
                <p className="font-semibold text-lg">{data.fixedCost.toLocaleString()}원</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block mb-1">목표 수익</span>
                <p className="font-semibold text-lg">
                  {data.targetProfit ? `${data.targetProfit.toLocaleString()}원` : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* 변동비 세부 항목 */}
          {hasVariableDetail && (
            <Collapsible open={showVariableDetail} onOpenChange={setShowVariableDetail}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between hover:bg-muted/50 px-4 py-2 h-auto"
                >
                  <span className="text-sm font-medium flex items-center gap-2">
                    <span>📝</span>
                    <span>변동비 세부 항목</span>
                  </span>
                  {showVariableDetail ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="rounded-lg border p-3 mt-2 space-y-2 bg-background">
                  {Object.entries(data.variableCostDetail || {}).map(([key, value]) => {
                    if (!value || value === 0) return null;
                    return (
                      <div
                        key={key}
                        className="flex justify-between items-center text-sm py-1"
                      >
                        <span className="text-muted-foreground">
                          {variableLabels[key as keyof typeof variableLabels]}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{value.toLocaleString()}원</span>
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {calcRatio(value, data.unitCost)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t flex justify-between items-center text-sm font-semibold">
                    <span>합계</span>
                    <span>{data.unitCost.toLocaleString()}원</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* 고정비 세부 항목 */}
          {hasFixedDetail && (
            <Collapsible open={showFixedDetail} onOpenChange={setShowFixedDetail}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between hover:bg-muted/50 px-4 py-2 h-auto"
                >
                  <span className="text-sm font-medium flex items-center gap-2">
                    <span>📝</span>
                    <span>고정비 세부 항목</span>
                  </span>
                  {showFixedDetail ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="rounded-lg border p-3 mt-2 space-y-2 bg-background">
                  {Object.entries(data.fixedCostDetail || {}).map(([key, value]) => {
                    if (!value || value === 0) return null;
                    return (
                      <div
                        key={key}
                        className="flex justify-between items-center text-sm py-1"
                      >
                        <span className="text-muted-foreground">
                          {fixedLabels[key as keyof typeof fixedLabels]}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{value.toLocaleString()}원</span>
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {calcRatio(value, data.fixedCost)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t flex justify-between items-center text-sm font-semibold">
                    <span>합계</span>
                    <span>{data.fixedCost.toLocaleString()}원</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* 덮어쓰기 경고 */}
          {hasExistingData && (
            <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-900">
              <AlertCircle className="h-4 w-4 !text-amber-600" />
              <AlertTitle className="text-amber-900">기존 데이터 덮어쓰기</AlertTitle>
              <AlertDescription className="text-amber-800">
                <p className="mb-2">현재 입력된 데이터가 새 데이터로 대체됩니다.</p>
                <div className="grid grid-cols-2 gap-2 text-xs bg-amber-100/50 rounded p-2">
                  <div>
                    <span className="text-amber-700 block">현재 판매가:</span>
                    <span className="font-semibold">
                      {existingData.price.toLocaleString()}원
                    </span>
                  </div>
                  <div>
                    <span className="text-amber-700 block">새 판매가:</span>
                    <span className="font-semibold">{data.price.toLocaleString()}원</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* 예상 계산 결과 */}
          {estimatedResults && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <h3 className="text-sm font-semibold mb-3 text-blue-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>예상 계산 결과</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-blue-700 block mb-1">공헌이익</span>
                  <p className="font-semibold text-blue-900">
                    {estimatedResults.contributionMargin.toLocaleString()}원
                  </p>
                </div>
                <div>
                  <span className="text-xs text-blue-700 block mb-1">손익분기점</span>
                  <p className="font-semibold text-blue-900">
                    {estimatedResults.breakEvenQuantity.toLocaleString()}개
                  </p>
                </div>
                {estimatedResults.targetQuantity && (
                  <div className="col-span-2">
                    <span className="text-xs text-blue-700 block mb-1">목표 판매량</span>
                    <p className="font-semibold text-blue-900">
                      {estimatedResults.targetQuantity.toLocaleString()}개
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 공헌이익 0 이하 경고 */}
          {!estimatedResults && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>계산 불가</AlertTitle>
              <AlertDescription>
                공헌이익이 0 이하입니다. 판매가가 단위 변동비보다 커야 합니다.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* 액션 버튼 */}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!estimatedResults}>
            불러오기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
