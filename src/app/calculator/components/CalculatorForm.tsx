"use client";

import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalculatorFormProps {
  sellingPrice: string;
  variableCost: string;
  fixedCost: string;
  targetProfit: string;
  onSellingPriceChange: (value: string) => void;
  onVariableCostChange: (value: string) => void;
  onFixedCostChange: (value: string) => void;
  onTargetProfitChange: (value: string) => void;
}

export function CalculatorForm({
  sellingPrice,
  variableCost,
  fixedCost,
  targetProfit,
  onSellingPriceChange,
  onVariableCostChange,
  onFixedCostChange,
  onTargetProfitChange,
}: CalculatorFormProps) {
  const handleNumberChange = (
    value: string,
    onChange: (value: string) => void
  ) => {
    // 빈 문자열이거나 숫자인 경우에만 업데이트
    if (value === "" || /^\d+$/.test(value)) {
      onChange(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>계산 입력</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
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

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="variableCost">단위 원가</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>제품 한 개를 만드는 데 드는 변동비용</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="variableCost"
              type="number"
              placeholder="예: 20000"
              value={variableCost}
              onChange={(e) =>
                handleNumberChange(e.target.value, onVariableCostChange)
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="fixedCost">월 고정비</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>매월 발생하는 고정 비용 (임대료, 인건비 등)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="fixedCost"
              type="number"
              placeholder="예: 3000000"
              value={fixedCost}
              onChange={(e) =>
                handleNumberChange(e.target.value, onFixedCostChange)
              }
            />
          </div>

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
