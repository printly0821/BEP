"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SensitivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>민감도 분석 그래프</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 bg-secondary rounded-lg">
          <p className="text-muted-foreground">그래프 영역</p>
        </div>
      </CardContent>
    </Card>
  );
}
