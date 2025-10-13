"use client";

import { TrendingUp, Target, DollarSign, PieChart } from "lucide-react";
import { MetricCard } from "@/components/calculator/MetricCard";

interface ResultsDashboardProps {
  breakEvenQuantity: number;
  targetQuantity: number;
  expectedRevenue: number;
  expectedProfit: number;
}

export function ResultsDashboard({
  breakEvenQuantity,
  targetQuantity,
  expectedRevenue,
  expectedProfit,
}: ResultsDashboardProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">계산 결과</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          title="손익분기점 판매량"
          value={breakEvenQuantity}
          unit="개"
          icon={TrendingUp}
          description="이익도 손실도 없는 판매량"
        />
        <MetricCard
          title="목표 달성 판매량"
          value={targetQuantity}
          unit="개"
          icon={Target}
          description="목표 수익을 달성하는 판매량"
        />
        <MetricCard
          title="예상 월 매출"
          value={expectedRevenue}
          unit="원"
          icon={DollarSign}
          description="목표 달성 시 총 매출"
        />
        <MetricCard
          title="예상 월 이익"
          value={expectedProfit}
          unit="원"
          icon={PieChart}
          description="목표 달성 시 순이익"
        />
      </div>
    </div>
  );
}
