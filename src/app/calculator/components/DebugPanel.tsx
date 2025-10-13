"use client";

import { AlertCircle, Bug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DebugPanelProps {
  inputs: {
    sellingPrice: number;
    variableCost: number;
    fixedCost: number;
    targetProfit: number;
  };
  results: {
    contributionMargin: number;
    breakEvenQuantity: number;
    targetQuantity: number;
    projectedRevenue: number;
    projectedProfit: number;
  };
}

export function DebugPanel({ inputs, results }: DebugPanelProps) {
  const { sellingPrice, variableCost, fixedCost, targetProfit } = inputs;
  const {
    contributionMargin,
    breakEvenQuantity,
    targetQuantity,
    projectedRevenue,
    projectedProfit,
  } = results;

  const isInvalid = contributionMargin <= 0;

  return (
    <Card className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
          <Bug className="h-5 w-5" />
          개발 디버그 패널 (Development Only)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm font-semibold">
              계산 상세 정보
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 text-xs font-mono">
                {/* 입력값 */}
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">[입력값]</h4>
                  <div className="pl-4 space-y-1 text-muted-foreground">
                    <p>• 판매가: {sellingPrice.toLocaleString()}원</p>
                    <p>• 단위원가: {variableCost.toLocaleString()}원</p>
                    <p>• 월 고정비: {fixedCost.toLocaleString()}원</p>
                    <p>• 목표 수익: {targetProfit.toLocaleString()}원</p>
                  </div>
                </div>

                {/* 중간 계산 */}
                <div className="space-y-2">
                  <h4 className="font-bold text-foreground">[중간 계산]</h4>
                  <div className="pl-4 space-y-1 text-muted-foreground">
                    <p>
                      • 공헌이익: {contributionMargin.toLocaleString()}원
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      → 계산식: {sellingPrice.toLocaleString()} -{" "}
                      {variableCost.toLocaleString()} ={" "}
                      {contributionMargin.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* 예외 상태 */}
                {isInvalid && (
                  <div className="flex items-start gap-2 p-3 bg-red-100 dark:bg-red-900 rounded">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                    <div className="text-red-600 dark:text-red-400">
                      <p className="font-bold">⚠️ 계산 불가 상태</p>
                      <p className="text-xs">
                        공헌이익이 0 이하입니다. 판매가가 단위원가보다 커야
                        합니다.
                      </p>
                    </div>
                  </div>
                )}

                {/* 최종 결과 */}
                {!isInvalid && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground">[최종 결과]</h4>
                    <div className="pl-4 space-y-3 text-muted-foreground">
                      <div>
                        <p>
                          • 손익분기점: {breakEvenQuantity.toLocaleString()}개
                        </p>
                        <p className="text-xs text-muted-foreground/70 pl-2">
                          → Math.ceil({fixedCost.toLocaleString()} /{" "}
                          {contributionMargin.toLocaleString()}) ={" "}
                          {breakEvenQuantity.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p>
                          • 목표 판매량: {targetQuantity.toLocaleString()}개
                        </p>
                        <p className="text-xs text-muted-foreground/70 pl-2">
                          → Math.ceil(({fixedCost.toLocaleString()} +{" "}
                          {targetProfit.toLocaleString()}) /{" "}
                          {contributionMargin.toLocaleString()}) ={" "}
                          {targetQuantity.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p>
                          • 예상 매출: {projectedRevenue.toLocaleString()}원
                        </p>
                        <p className="text-xs text-muted-foreground/70 pl-2">
                          → {targetQuantity.toLocaleString()} ×{" "}
                          {sellingPrice.toLocaleString()} ={" "}
                          {projectedRevenue.toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p>
                          • 예상 이익: {projectedProfit.toLocaleString()}원
                        </p>
                        <p className="text-xs text-muted-foreground/70 pl-2">
                          → {projectedRevenue.toLocaleString()} - (
                          {targetQuantity.toLocaleString()} ×{" "}
                          {variableCost.toLocaleString()}) -{" "}
                          {fixedCost.toLocaleString()} ={" "}
                          {projectedProfit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
