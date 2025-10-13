import { NextRequest, NextResponse } from "next/server";
import type { JobOrderApiResponse } from "@/types/job-order";
import { mockDatabase } from "../mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Mock 지연 시뮬레이션 (실제 API 호출처럼)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const jobOrder = mockDatabase[id];

    if (!jobOrder) {
      return NextResponse.json<JobOrderApiResponse>(
        {
          success: false,
          error: `Job order with ID "${id}" not found`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<JobOrderApiResponse>({
      success: true,
      data: jobOrder,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json<JobOrderApiResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// POST: 새로운 제작 의뢰서 생성 (테스트용)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 간단한 유효성 검사
    if (!body.documentNumber || !body.orderNumber) {
      return NextResponse.json<JobOrderApiResponse>(
        {
          success: false,
          error: "documentNumber and orderNumber are required",
        },
        { status: 400 }
      );
    }

    // product 필드 검증
    if (!body.product || !body.product.productName) {
      return NextResponse.json<JobOrderApiResponse>(
        {
          success: false,
          error: "product information is required",
        },
        { status: 400 }
      );
    }

    // Mock 지연
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json<JobOrderApiResponse>(
      {
        success: true,
        data: body,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json<JobOrderApiResponse>(
      {
        success: false,
        error: "Invalid JSON data",
      },
      { status: 400 }
    );
  }
}
