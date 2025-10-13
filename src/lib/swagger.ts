import { Options } from "swagger-jsdoc";

export const swaggerDefinition: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "제작 의뢰서 API",
      version: "1.0.0",
      description: `
제작 의뢰서 관리를 위한 RESTful API입니다.

## 주요 기능
- 제작 의뢰서 목록 조회
- 제작 의뢰서 상세 조회
- 제작 의뢰서 생성 (테스트용)

## 인증
현재 버전은 인증이 필요하지 않습니다. (테스트 환경)
      `.trim(),
      contact: {
        name: "쉬잇크루",
        url: "https://sheatcrew.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "개발 서버",
      },
      {
        url: "http://localhost:3001",
        description: "개발 서버 (대체 포트)",
      },
      {
        url: "http://localhost:3002",
        description: "개발 서버 (대체 포트 2)",
      },
    ],
    tags: [
      {
        name: "job-orders",
        description: "제작 의뢰서 관리",
      },
    ],
    components: {
      schemas: {
        JobOrderOptions: {
          type: "object",
          properties: {
            option1: { type: "string", example: "랑데뷰 240g" },
            option2: { type: "string", example: "흰색 무지봉투(165x115mm)" },
            option3: { type: "string", example: "-" },
            option4: { type: "string", example: "50" },
            option5: { type: "string", example: "-" },
            option6: { type: "string", example: "-" },
            option7: { type: "string", example: "-" },
          },
        },
        JobOrderData: {
          type: "object",
          required: [
            "documentNumber",
            "orderNumber",
            "orderDate",
            "clientName",
            "ordererName",
            "deliveryDate",
            "deliveryMethod",
            "itemCount",
            "recipientName",
            "deliveryMemo",
            "productName",
            "companyProductName",
            "productSize",
            "productionNumber",
            "productionQuantity",
            "printDate",
            "printedBy",
          ],
          properties: {
            documentNumber: {
              type: "string",
              description: "문서 번호",
              example: "202510-BIZ-00431_00",
            },
            orderDate: {
              type: "string",
              description: "발주 일자",
              example: "2025-10-02",
            },
            clientName: {
              type: "string",
              description: "거래처명",
              example: "BIZ",
            },
            orderNumber: {
              type: "string",
              description: "주문 번호",
              example: "8360443",
            },
            ordererName: {
              type: "string",
              description: "주문자명",
              example: "최정희",
            },
            deliveryDate: {
              type: "string",
              description: "출고 요청일",
              example: "2025-10-15",
            },
            deliveryMethod: {
              type: "string",
              description: "배송 방법",
              example: "택배",
            },
            itemCount: {
              type: "string",
              description: "품목 수량",
              example: "1 / 1",
            },
            recipientName: {
              type: "string",
              description: "수취인명",
              example: "최정희",
            },
            deliveryMemo: {
              type: "string",
              description: "배송 메모",
              example: "부재시 집앞에 놔주세요.",
            },
            productName: {
              type: "string",
              description: "제작 품명",
              example: "2단접지카드",
            },
            companyProductName: {
              type: "string",
              description: "업체 상품명",
              example: "2단 엽서카드-접이식 엽서카드",
            },
            productSize: {
              type: "string",
              description: "사이즈",
              example: "150x100mm [15.2 X 20.2]",
            },
            productionNumber: {
              type: "string",
              description: "제작 번호",
              example: "30153892",
            },
            productionQuantity: {
              type: "string",
              description: "제작 수량",
              example: "10 매",
            },
            note: {
              type: "string",
              description: "비고",
              example: "",
            },
            options: {
              $ref: "#/components/schemas/JobOrderOptions",
            },
            printDate: {
              type: "string",
              description: "출력 일시",
              example: "2025년 10월 12일 오후 11:16:38",
            },
            printedBy: {
              type: "string",
              description: "출력자",
              example: "어드민(admin)",
            },
          },
        },
        JobOrderSummary: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "제작 의뢰서 ID",
              example: "1",
            },
            documentNumber: {
              type: "string",
              description: "문서 번호",
              example: "202510-BIZ-00431_00",
            },
            orderNumber: {
              type: "string",
              description: "주문 번호",
              example: "8360443",
            },
            clientName: {
              type: "string",
              description: "거래처명",
              example: "BIZ",
            },
            orderDate: {
              type: "string",
              description: "발주 일자",
              example: "2025-10-02",
            },
            productName: {
              type: "string",
              description: "제작 품명",
              example: "2단접지카드",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              example: "Error message",
            },
          },
        },
      },
    },
    paths: {
      "/api/job-orders": {
        get: {
          tags: ["job-orders"],
          summary: "제작 의뢰서 목록 조회",
          description: "모든 제작 의뢰서의 요약 정보를 조회합니다.",
          responses: {
            "200": {
              description: "성공",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/JobOrderSummary" },
                      },
                      total: { type: "number", example: 3 },
                    },
                  },
                },
              },
            },
            "500": {
              description: "서버 오류",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/job-orders/{id}": {
        get: {
          tags: ["job-orders"],
          summary: "제작 의뢰서 상세 조회",
          description: "특정 제작 의뢰서의 상세 정보를 조회합니다.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "제작 의뢰서 ID",
              schema: { type: "string", example: "1" },
            },
          ],
          responses: {
            "200": {
              description: "성공",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/JobOrderData" },
                    },
                  },
                },
              },
            },
            "404": {
              description: "제작 의뢰서를 찾을 수 없음",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "500": {
              description: "서버 오류",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
        post: {
          tags: ["job-orders"],
          summary: "제작 의뢰서 생성 (테스트용)",
          description: "새로운 제작 의뢰서를 생성합니다. (테스트 환경)",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "제작 의뢰서 ID",
              schema: { type: "string", example: "1" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/JobOrderData" },
              },
            },
          },
          responses: {
            "201": {
              description: "생성 성공",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/JobOrderData" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "잘못된 요청",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
            "500": {
              description: "서버 오류",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};
