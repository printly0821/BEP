import { NextResponse } from "next/server";
import type { JobOrderData } from "@/types/job-order";

// 목록 조회용 간단한 요약 데이터
interface JobOrderSummary {
  id: string;
  documentNumber: string;
  orderNumber: string;
  clientName: string;
  orderDate: string;
  productName: string;
}

export async function GET() {
  try {
    // Mock 지연
    await new Promise((resolve) => setTimeout(resolve, 300));

    const summaries: JobOrderSummary[] = [
      {
        id: "1",
        documentNumber: "202510-BIZ-00431_00",
        orderNumber: "8360443",
        clientName: "BIZ",
        orderDate: "2025-10-02",
        productName: "2단접지카드",
      },
      {
        id: "2",
        documentNumber: "202510-SHOP-00532_01",
        orderNumber: "8360789",
        clientName: "쉬잇크루",
        orderDate: "2025-10-05",
        productName: "명함",
      },
      {
        id: "3",
        documentNumber: "202510-CORP-00891_02",
        orderNumber: "8361024",
        clientName: "주식회사 테크노",
        orderDate: "2025-10-08",
        productName: "포스터",
      },
    ];

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
