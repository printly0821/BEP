import { NextResponse } from "next/server";
import type { JobOrderSummary } from "@/types/job-order";
import { mockDatabase } from "./mock-data";

export async function GET() {
  try {
    // Mock 지연
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock 데이터에서 요약 정보 생성
    const summaries: JobOrderSummary[] = Object.entries(mockDatabase).map(
      ([id, jobOrder]) => ({
        id,
        documentNumber: jobOrder.documentNumber,
        orderNumber: jobOrder.orderNumber,
        clientName: jobOrder.clientName,
        orderDate: jobOrder.orderDate,
        productName: jobOrder.product.productName,
        productType: jobOrder.product.specification.productType,
        status: "pending", // 실제로는 DB에서 상태 조회
      })
    );

    return NextResponse.json({
      success: true,
      data: summaries,
      total: summaries.length,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
