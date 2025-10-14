"use client";

import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import type { VariableCostDetail, FixedCostDetail } from "@/features/projects/types";

interface CalculatorFormProps {
  sellingPrice: string;
  variableCost: string;
  fixedCost: string;
  targetProfit: string;
  variableCostDetail?: VariableCostDetail;
  fixedCostDetail?: FixedCostDetail;
  onSellingPriceChange: (value: string) => void;
  onVariableCostChange: (value: string) => void;
  onFixedCostChange: (value: string) => void;
  onTargetProfitChange: (value: string) => void;
  onVariableCostDetailChange?: (detail: VariableCostDetail | undefined) => void;
  onFixedCostDetailChange?: (detail: FixedCostDetail | undefined) => void;
}

export function CalculatorForm({
  sellingPrice,
  variableCost,
  fixedCost,
  targetProfit,
  variableCostDetail,
  fixedCostDetail,
  onSellingPriceChange,
  onVariableCostChange,
  onFixedCostChange,
  onTargetProfitChange,
  onVariableCostDetailChange,
  onFixedCostDetailChange,
}: CalculatorFormProps) {
  const [showVariableDetail, setShowVariableDetail] = useState(false);
  const [showFixedDetail, setShowFixedDetail] = useState(false);

  // 세부 항목이 있으면 자동으로 펼침
  useEffect(() => {
    if (variableCostDetail && Object.values(variableCostDetail).some(v => v && v > 0)) {
      setShowVariableDetail(true);
    }
  }, [variableCostDetail]);

  useEffect(() => {
    if (fixedCostDetail && Object.values(fixedCostDetail).some(v => v && v > 0)) {
      setShowFixedDetail(true);
    }
  }, [fixedCostDetail]);

  const handleNumberChange = (
    value: string,
    onChange: (value: string) => void
  ) => {
    // 빈 문자열이거나 숫자인 경우에만 업데이트
    if (value === "" || /^\d+$/.test(value)) {
      onChange(value);
    }
  };

  // 변동비 세부 항목 업데이트
  const updateVariableDetail = (field: keyof VariableCostDetail, value: number) => {
    if (!onVariableCostDetailChange) return;

    const newDetail: VariableCostDetail = {
      ...variableCostDetail,
      [field]: value || undefined,
    };

    onVariableCostDetailChange(newDetail);

    // 세부 항목 합계 자동 계산
    const sum = Object.values(newDetail).reduce((acc, val) => acc + (val || 0), 0);
    onVariableCostChange(sum.toString());
  };

  // 고정비 세부 항목 업데이트
  const updateFixedDetail = (field: keyof FixedCostDetail, value: number) => {
    if (!onFixedCostDetailChange) return;

    const newDetail: FixedCostDetail = {
      ...fixedCostDetail,
      [field]: value || undefined,
    };

    onFixedCostDetailChange(newDetail);

    // 세부 항목 합계 자동 계산
    const sum = Object.values(newDetail).reduce((acc, val) => acc + (val || 0), 0);
    onFixedCostChange(sum.toString());
  };

  // 세부 항목 합계 계산
  const variableDetailSum = variableCostDetail
    ? Object.values(variableCostDetail).reduce((acc, val) => acc + (val || 0), 0)
    : 0;

  const fixedDetailSum = fixedCostDetail
    ? Object.values(fixedCostDetail).reduce((acc, val) => acc + (val || 0), 0)
    : 0;

  // 합계 검증
  const isVariableValid = variableDetailSum === Number(variableCost);
  const isFixedValid = fixedDetailSum === Number(fixedCost);

  // 비율 계산
  const calcRatio = (value: number | undefined, total: number) => {
    if (!value || total === 0) return "0.0";
    return ((value / total) * 100).toFixed(1);
  };

  // 세부 항목 존재 여부 확인
  const hasVariableDetail = variableCostDetail &&
    Object.values(variableCostDetail).some(v => v && v > 0);
  const hasFixedDetail = fixedCostDetail &&
    Object.values(fixedCostDetail).some(v => v && v > 0);

  // 세부 항목 초기화 핸들러
  const handleClearVariableDetail = () => {
    if (onVariableCostDetailChange) {
      onVariableCostDetailChange(undefined);
      setShowVariableDetail(false);
    }
  };

  const handleClearFixedDetail = () => {
    if (onFixedCostDetailChange) {
      onFixedCostDetailChange(undefined);
      setShowFixedDetail(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>계산 입력</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <TooltipProvider>
          {/* 판매가 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="sellingPrice">판매가</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>제품 또는 서비스의 판매 가격</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="sellingPrice"
              type="number"
              placeholder="예: 50000"
              value={sellingPrice}
              onChange={(e) =>
                handleNumberChange(e.target.value, onSellingPriceChange)
              }
            />
          </div>

          {/* 단위 변동비 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="variableCost">단위 변동비</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>제품 한 개를 만드는 데 드는 변동비용</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowVariableDetail(!showVariableDetail)}
                className="h-6 px-2 text-xs"
              >
                {showVariableDetail ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    세부 항목 닫기
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    세부 항목 열기
                  </>
                )}
              </Button>
            </div>
            <Input
              id="variableCost"
              type="number"
              placeholder="예: 20000"
              value={variableCost}
              onChange={(e) =>
                handleNumberChange(e.target.value, onVariableCostChange)
              }
              disabled={showVariableDetail || hasVariableDetail}
              className={showVariableDetail || hasVariableDetail ? "bg-muted" : ""}
            />
            {hasVariableDetail && !showVariableDetail && (
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  <span>세부항목으로 관리 중입니다</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearVariableDetail}
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  초기화하여 직접 입력
                </Button>
              </div>
            )}

            {/* 변동비 세부 항목 */}
            {showVariableDetail && (
              <div className="mt-3 p-3 border rounded-md bg-muted/30 space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  세부 항목 (자동 합계)
                </div>

                {/* 원재료비 */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="materials" className="text-xs w-24">원재료비</Label>
                  <Input
                    id="materials"
                    type="number"
                    placeholder="0"
                    value={variableCostDetail?.materials || ""}
                    onChange={(e) => updateVariableDetail("materials", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {calcRatio(variableCostDetail?.materials, Number(variableCost))}%
                  </span>
                </div>

                {/* 패키지 */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="packaging" className="text-xs w-24">패키지</Label>
                  <Input
                    id="packaging"
                    type="number"
                    placeholder="0"
                    value={variableCostDetail?.packaging || ""}
                    onChange={(e) => updateVariableDetail("packaging", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {calcRatio(variableCostDetail?.packaging, Number(variableCost))}%
                  </span>
                </div>

                {/* 택배박스 */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="shippingBox" className="text-xs w-24">택배박스</Label>
                  <Input
                    id="shippingBox"
                    type="number"
                    placeholder="0"
                    value={variableCostDetail?.shippingBox || ""}
                    onChange={(e) => updateVariableDetail("shippingBox", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {calcRatio(variableCostDetail?.shippingBox, Number(variableCost))}%
                  </span>
                </div>

                {/* 마켓수수료 */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="marketFee" className="text-xs w-24">마켓수수료</Label>
                  <Input
                    id="marketFee"
                    type="number"
                    placeholder="0"
                    value={variableCostDetail?.marketFee || ""}
                    onChange={(e) => updateVariableDetail("marketFee", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {calcRatio(variableCostDetail?.marketFee, Number(variableCost))}%
                  </span>
                </div>

                {/* 배송비 */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="shippingCost" className="text-xs w-24">배송비</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    placeholder="0"
                    value={variableCostDetail?.shippingCost || ""}
                    onChange={(e) => updateVariableDetail("shippingCost", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {calcRatio(variableCostDetail?.shippingCost, Number(variableCost))}%
                  </span>
                </div>

                {/* 기타 */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="variableOther" className="text-xs w-24">기타</Label>
                  <Input
                    id="variableOther"
                    type="number"
                    placeholder="0"
                    value={variableCostDetail?.other || ""}
                    onChange={(e) => updateVariableDetail("other", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {calcRatio(variableCostDetail?.other, Number(variableCost))}%
                  </span>
                </div>

                {/* 합계 검증 */}
                <div className="pt-2 border-t mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">합계</span>
                    <div className="flex items-center gap-2">
                      <span className={isVariableValid ? "text-green-600" : "text-red-600"}>
                        {variableDetailSum.toLocaleString()}원
                      </span>
                      <span className="text-xs">
                        {isVariableValid ? "✅" : "❌"}
                      </span>
                    </div>
                  </div>
                  {!isVariableValid && (
                    <p className="text-xs text-red-600 mt-1">
                      세부 항목 합계가 단위 변동비와 일치하지 않습니다.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 월 고정비 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label htmlFor="fixedCost">월 고정비</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>매월 발생하는 고정 비용</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowFixedDetail(!showFixedDetail)}
                className="h-6 px-2 text-xs"
              >
                {showFixedDetail ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    세부 항목 닫기
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    세부 항목 열기
                  </>
                )}
              </Button>
            </div>
            <Input
              id="fixedCost"
              type="number"
              placeholder="예: 3000000"
              value={fixedCost}
              onChange={(e) =>
                handleNumberChange(e.target.value, onFixedCostChange)
              }
              disabled={showFixedDetail || hasFixedDetail}
              className={showFixedDetail || hasFixedDetail ? "bg-muted" : ""}
            />
            {hasFixedDetail && !showFixedDetail && (
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  <span>세부항목으로 관리 중입니다</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFixedDetail}
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  초기화하여 직접 입력
                </Button>
              </div>
            )}

            {/* 고정비 세부 항목 */}
            {showFixedDetail && (
              <div className="mt-3 p-3 border rounded-md bg-muted/30 space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  세부 항목 (자동 합계)
                </div>

                {/* 인건비 */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="labor" className="text-xs w-24">인건비</Label>
                  <Input
                    id="labor"
                    type="number"
                    placeholder="0"
                    value={fixedCostDetail?.labor || ""}
                    onChange={(e) => updateFixedDetail("labor", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {calcRatio(fixedCostDetail?.labor, Number(fixedCost))}%
                  </span>
                </div>

                {/* 식비 */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="meals" className="text-xs w-24">식비</Label>
                  <Input
                    id="meals"
                    type="number"
                    placeholder="0"
                    value={fixedCostDetail?.meals || ""}
                    onChange={(e) => updateFixedDetail("meals", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {calcRatio(fixedCostDetail?.meals, Number(fixedCost))}%
                  </span>
                </div>

                {/* 임대료 */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="rent" className="text-xs w-24">임대료</Label>
                  <Input
                    id="rent"
                    type="number"
                    placeholder="0"
                    value={fixedCostDetail?.rent || ""}
                    onChange={(e) => updateFixedDetail("rent", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {calcRatio(fixedCostDetail?.rent, Number(fixedCost))}%
                  </span>
                </div>

                {/* 공과금 */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="utilities" className="text-xs w-24">공과금</Label>
                  <Input
                    id="utilities"
                    type="number"
                    placeholder="0"
                    value={fixedCostDetail?.utilities || ""}
                    onChange={(e) => updateFixedDetail("utilities", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {calcRatio(fixedCostDetail?.utilities, Number(fixedCost))}%
                  </span>
                </div>

                {/* 사무실운영비 */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="office" className="text-xs w-24">사무실운영비</Label>
                  <Input
                    id="office"
                    type="number"
                    placeholder="0"
                    value={fixedCostDetail?.office || ""}
                    onChange={(e) => updateFixedDetail("office", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {calcRatio(fixedCostDetail?.office, Number(fixedCost))}%
                  </span>
                </div>

                {/* 마케팅비 */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="marketing" className="text-xs w-24">마케팅비</Label>
                  <Input
                    id="marketing"
                    type="number"
                    placeholder="0"
                    value={fixedCostDetail?.marketing || ""}
                    onChange={(e) => updateFixedDetail("marketing", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {calcRatio(fixedCostDetail?.marketing, Number(fixedCost))}%
                  </span>
                </div>

                {/* 기타 */}
                <div className="flex items-center gap-2">
                  <Label htmlFor="fixedOther" className="text-xs w-24">기타</Label>
                  <Input
                    id="fixedOther"
                    type="number"
                    placeholder="0"
                    value={fixedCostDetail?.other || ""}
                    onChange={(e) => updateFixedDetail("other", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {calcRatio(fixedCostDetail?.other, Number(fixedCost))}%
                  </span>
                </div>

                {/* 합계 검증 */}
                <div className="pt-2 border-t mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">합계</span>
                    <div className="flex items-center gap-2">
                      <span className={isFixedValid ? "text-green-600" : "text-red-600"}>
                        {fixedDetailSum.toLocaleString()}원
                      </span>
                      <span className="text-xs">
                        {isFixedValid ? "✅" : "❌"}
                      </span>
                    </div>
                  </div>
                  {!isFixedValid && (
                    <p className="text-xs text-red-600 mt-1">
                      세부 항목 합계가 월 고정비와 일치하지 않습니다.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 목표 수익 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="targetProfit">목표 수익 (선택)</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>달성하고자 하는 월 목표 수익</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="targetProfit"
              type="number"
              placeholder="예: 5000000"
              value={targetProfit}
              onChange={(e) =>
                handleNumberChange(e.target.value, onTargetProfitChange)
              }
            />
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
