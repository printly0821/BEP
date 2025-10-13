"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  description?: string;
}

export function MetricCard({ title, value, unit, icon: Icon, description }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {unit && <span className="text-lg font-normal text-foreground/70 ml-1">{unit}</span>}
        </div>
        {description && (
          <p className="text-xs text-foreground/60 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
