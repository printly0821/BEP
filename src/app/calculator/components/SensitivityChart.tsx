"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PriceSensitivityChart } from "./charts/PriceSensitivityChart";
import { CostSensitivityChart } from "./charts/CostSensitivityChart";

interface SensitivityChartProps {
  price: number;
  unitCost: number;
  fixedCost: number;
  targetProfit?: number;
}

export function SensitivityChart({
  price,
  unitCost,
  fixedCost,
  targetProfit,
}: SensitivityChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>💡 가격이 바뀌면 어떻게 될까?</CardTitle>
        <CardDescription>
          판매가나 원가를 올리거나 내릴 때 손익분기점이 어떻게 달라지는지 한눈에 보세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="price">판매가 변화</TabsTrigger>
            <TabsTrigger value="cost">원가 변화</TabsTrigger>
          </TabsList>
          <TabsContent value="price" className="mt-4">
            <PriceSensitivityChart
              price={price}
              unitCost={unitCost}
              fixedCost={fixedCost}
              targetProfit={targetProfit}
            />
          </TabsContent>
          <TabsContent value="cost" className="mt-4">
            <CostSensitivityChart
              price={price}
              unitCost={unitCost}
              fixedCost={fixedCost}
              targetProfit={targetProfit}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
