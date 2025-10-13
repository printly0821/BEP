"use client";

import QRCode from "react-qr-code";
import Barcode from "react-barcode";

interface JobOrderReportViewProps {
  // 주문 정보
  orderDate?: string;
  clientName?: string;
  orderNumber?: string;
  ordererName?: string;

  // 출고 정보
  deliveryDate?: string;
  deliveryMethod?: string;
  itemCount?: string;
  recipientName?: string;
  deliveryMemo?: string;

  // 제품 정보
  productName?: string;
  companyProductName?: string;
  productSize?: string;
  productionNumber?: string;
  productionQuantity?: string;

  // 비고
  note?: string;

  // 옵션 정보
  options?: {
    option1?: string;
    option2?: string;
    option3?: string;
    option4?: string;
    option5?: string;
    option6?: string;
    option7?: string;
  };

  // 문서 번호
  documentNumber?: string;

  // 출력 정보
  printDate?: string;
  printedBy?: string;
}

export function JobOrderReportView({
  orderDate = "2025-10-02",
  clientName = "BIZ",
  orderNumber = "8360443",
  ordererName = "최정희",
  deliveryDate = "2025-10-15",
  deliveryMethod = "택배",
  itemCount = "1 / 1",
  recipientName = "최정희",
  deliveryMemo = "부재시 집앞에 놔주세요.",
  productName = "2단접지카드",
  companyProductName = "2단 엽서카드-접이식 엽서카드",
  productSize = "150x100mm [15.2 X 20.2]",
  productionNumber = "30153892",
  productionQuantity = "10 매",
  note = "",
  options = {
    option1: "랑데뷰 240g",
    option2: "흰색 무지봉투(165x115mm)",
    option3: "-",
    option4: "50",
    option5: "-",
    option6: "-",
    option7: "-",
  },
  documentNumber = "202510-BIZ-00431_00",
  printDate = "2025년 10월 12일 오후 11:16:38",
  printedBy = "어드민(admin)",
}: JobOrderReportViewProps) {

  // 테이블 행 컴포넌트
  const TableRow = ({ label, value }: { label: string; value: string }) => (
    <tr style={{ borderBottom: "1px solid #000000" }}>
      <td
        style={{
          padding: "8px 12px",
          backgroundColor: "#e5e7eb",
          fontWeight: "700",
          fontSize: "14px",
          borderRight: "1px solid #000000",
          width: "35%",
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: "8px 12px",
          fontSize: "14px",
        }}
      >
        {value}
      </td>
    </tr>
  );

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "32px",
        minHeight: "100vh",
        position: "relative",
        fontFamily: "'Noto Sans KR', sans-serif",
        color: "#000000",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "2px solid #000000",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#000000",
            margin: "0",
          }}
        >
          제작 의뢰서
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            {documentNumber}
          </span>
          <div
            style={{
              width: "80px",
              height: "80px",
              border: "2px solid #000000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              backgroundColor: "#ffffff",
            }}
          >
            <QRCode
              value={documentNumber}
              size={72}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 - 2단 레이아웃 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* 왼쪽 열 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* 주문 정보 */}
          <div>
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "700",
                marginBottom: "8px",
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "6px 12px",
              }}
            >
              ■ 주문정보
            </h2>
            <table
              style={{
                width: "100%",
                border: "1px solid #000000",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <TableRow label="발주일자" value={orderDate} />
                <TableRow label="거래처명" value={clientName} />
                <TableRow label="주문번호" value={orderNumber} />
                <TableRow label="주문자명" value={ordererName} />
              </tbody>
            </table>
          </div>

          {/* 제품 정보 */}
          <div>
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "700",
                marginBottom: "8px",
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "6px 12px",
              }}
            >
              ■ 제품정보
            </h2>
            <table
              style={{
                width: "100%",
                border: "1px solid #000000",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <TableRow label="제작품명" value={productName} />
                <TableRow label="업체상품명" value={companyProductName} />
                <TableRow label="사이즈" value={productSize} />
                <TableRow label="제작번호" value={productionNumber} />
                <TableRow label="제작수량" value={productionQuantity} />
              </tbody>
            </table>
          </div>

          {/* 비고 */}
          <div>
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "700",
                marginBottom: "8px",
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "6px 12px",
              }}
            >
              ■ 비고
            </h2>
            <div
              style={{
                border: "1px solid #000000",
                minHeight: "100px",
                padding: "12px",
                fontSize: "14px",
              }}
            >
              {note || " "}
            </div>
          </div>

          {/* 옵션 정보 */}
          <div>
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "700",
                marginBottom: "8px",
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "6px 12px",
              }}
            >
              ■ 옵션정보
            </h2>
            <table
              style={{
                width: "100%",
                border: "1px solid #000000",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <TableRow label="옵션1" value={options.option1 || "-"} />
                <TableRow label="옵션2" value={options.option2 || "-"} />
                <TableRow label="옵션3" value={options.option3 || "-"} />
                <TableRow label="옵션4" value={options.option4 || "-"} />
                <TableRow label="옵션5" value={options.option5 || "-"} />
                <TableRow label="옵션6" value={options.option6 || "-"} />
                <TableRow label="옵션7" value={options.option7 || "-"} />
              </tbody>
            </table>
          </div>
        </div>

        {/* 오른쪽 열 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* 출고 정보 */}
          <div>
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "700",
                marginBottom: "8px",
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "6px 12px",
              }}
            >
              ■ 출고정보
            </h2>
            <table
              style={{
                width: "100%",
                border: "1px solid #000000",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <TableRow label="출고요청일" value={deliveryDate} />
                <TableRow label="배송방법" value={deliveryMethod} />
                <TableRow label="품목수량" value={itemCount} />
                <TableRow label="수취인명" value={recipientName} />
                <TableRow label="배송메모" value={deliveryMemo} />
              </tbody>
            </table>
          </div>

          {/* 제품 이미지 영역 */}
          <div>
            <div
              style={{
                border: "1px solid #000000",
                minHeight: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f9fafb",
              }}
            >
              <p style={{ color: "#6b7280", fontSize: "14px" }}>
                제품 이미지 영역
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div
        style={{
          marginTop: "32px",
          paddingTop: "24px",
          borderTop: "2px solid #000000",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
          <div style={{ flex: "0 0 auto" }}>
            <Barcode
              value={orderNumber}
              width={1.5}
              height={50}
              displayValue={true}
              fontSize={14}
              margin={0}
            />
          </div>
          <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "12px" }}>출력일시 : {printDate}</span>
            <span style={{ fontSize: "12px" }}>출력자 : {printedBy}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
