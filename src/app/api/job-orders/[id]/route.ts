import { NextRequest, NextResponse } from "next/server";
import type { JobOrderData, JobOrderApiResponse } from "@/types/job-order";

// Mock 데이터베이스
const mockDatabase: Record<string, JobOrderData> = {
  "1": {
    documentNumber: "202510-BIZ-00431_00",
    orderDate: "2025-10-02",
    clientName: "BIZ",
    orderNumber: "8360443",
    ordererName: "최정희",
    deliveryDate: "2025-10-15",
    deliveryMethod: "택배",
    itemCount: "1 / 1",
    recipientName: "최정희",
    deliveryMemo: "부재시 집앞에 놔주세요.",
    productName: "2단접지카드",
    companyProductName: "2단 엽서카드-접이식 엽서카드",
    productSize: "150x100mm [15.2 X 20.2]",
    productionNumber: "30153892",
    productionQuantity: "10 매",
    note: "",
    options: {
      option1: "랑데뷰 240g",
      option2: "흰색 무지봉투(165x115mm)",
      option3: "-",
      option4: "50",
      option5: "-",
      option6: "-",
      option7: "-",
    },
    printDate: "2025년 10월 12일 오후 11:16:38",
    printedBy: "어드민(admin)",
  },
  "2": {
    documentNumber: "202510-SHOP-00532_01",
    orderDate: "2025-10-05",
    clientName: "쉬잇크루",
    orderNumber: "8360789",
    ordererName: "김철수",
    deliveryDate: "2025-10-20",
    deliveryMethod: "직접수령",
    itemCount: "2 / 5",
    recipientName: "김철수",
    deliveryMemo: "오전 배송 부탁드립니다.",
    productName: "명함",
    companyProductName: "고급 명함 - 양면 컬러",
    productSize: "90x50mm",
    productionNumber: "30154001",
    productionQuantity: "500 매",
    note: "UV 코팅 처리 필요",
    options: {
      option1: "스노우화이트 300g",
      option2: "UV 코팅",
      option3: "양면 4도",
      option4: "100",
      option5: "모서리 라운딩",
      option6: "-",
      option7: "-",
    },
    printDate: "2025년 10월 13일 오후 08:30:15",
    printedBy: "어드민(admin)",
  },
  "3": {
    documentNumber: "202510-CORP-00891_02",
    orderDate: "2025-10-08",
    clientName: "주식회사 테크노",
    orderNumber: "8361024",
    ordererName: "박영희",
    deliveryDate: "2025-10-25",
    deliveryMethod: "퀵서비스",
    itemCount: "1 / 1",
    recipientName: "박영희",
    deliveryMemo: "급한 물건입니다. 빠른 배송 부탁드립니다.",
    productName: "포스터",
    companyProductName: "대형 포스터 - 실사 출력",
    productSize: "A1 (594x841mm)",
    productionNumber: "30154205",
    productionQuantity: "20 매",
    note: "고해상도 이미지 사용, 색상 교정 필요",
    options: {
      option1: "백색 합지 200g",
      option2: "무광 코팅",
      option3: "단면 4도",
      option4: "150",
      option5: "-",
      option6: "-",
      option7: "-",
    },
    printDate: "2025년 10월 13일 오후 09:45:22",
    printedBy: "운영자(operator)",
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
    const body: JobOrderData = await request.json();

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
