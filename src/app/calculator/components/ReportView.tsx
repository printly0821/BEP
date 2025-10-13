"use client";

import { TrendingUp, Target, DollarSign, PieChart } from "lucide-react";

interface ReportViewProps {
  breakEvenQuantity: number;
  targetQuantity: number;
  expectedRevenue: number;
  expectedProfit: number;
  sellingPrice: number;
  variableCost: number;
  fixedCost: number;
  targetProfit: number;
}

export function ReportView({
  breakEvenQuantity,
  targetQuantity,
  expectedRevenue,
  expectedProfit,
  sellingPrice,
  variableCost,
  fixedCost,
  targetProfit,
}: ReportViewProps) {
  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const contributionMargin = sellingPrice - variableCost;
  const marginRate = sellingPrice > 0 ? (contributionMargin / sellingPrice) * 100 : 0;

  // 메트릭 카드 컴포넌트 (인라인 스타일)
  const MetricCardPDF = ({
    title,
    value,
    unit,
    Icon,
    description,
  }: {
    title: string;
    value: number;
    unit: string;
    Icon: any;
    description: string;
  }) => (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
      }}
    >
      <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
        <Icon size={20} style={{ color: "#6366f1" }} />
        <h3 style={{ fontSize: "14px", fontWeight: "600", color: "#6b7280" }}>{title}</h3>
      </div>
      <div style={{ marginBottom: "8px" }}>
        <span style={{ fontSize: "28px", fontWeight: "700", color: "#111827" }}>
          {value.toLocaleString()}
        </span>
        <span style={{ fontSize: "16px", fontWeight: "500", color: "#6b7280", marginLeft: "4px" }}>
          {unit}
        </span>
      </div>
      <p style={{ fontSize: "12px", color: "#9ca3af" }}>{description}</p>
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "32px",
        minHeight: "100vh",
        position: "relative",
        fontFamily: "'Noto Sans KR', sans-serif",
      }}
    >
      {/* 워터마크 */}
      <div
        style={{
          position: "absolute",
          inset: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: "0",
        }}
      >
        <div
          style={{
            fontSize: "60px",
            fontWeight: "700",
            color: "#d1d5db",
            opacity: "0.3",
            transform: "rotate(-45deg)",
            userSelect: "none",
          }}
        >
          SHEATCREW FREE
        </div>
      </div>

      {/* 헤더 */}
      <div style={{ marginBottom: "32px", position: "relative", zIndex: "10" }}>
        <h1 style={{ fontSize: "30px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
          BEP 마진 계산 리포트
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280" }}>생성일: {currentDate}</p>
      </div>

      {/* 입력 정보 요약 */}
      <div style={{ marginBottom: "32px", position: "relative", zIndex: "10" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
          입력 정보
        </h2>
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>판매 단가</p>
              <p style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>
                {sellingPrice.toLocaleString()}원
              </p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>단위당 변동비</p>
              <p style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>
                {variableCost.toLocaleString()}원
              </p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>월 고정비</p>
              <p style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>
                {fixedCost.toLocaleString()}원
              </p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>목표 수익</p>
              <p style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>
                {targetProfit > 0 ? `${targetProfit.toLocaleString()}원` : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 주요 계산 결과 */}
      <div style={{ marginBottom: "32px", position: "relative", zIndex: "10" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
          계산 결과
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <MetricCardPDF
            title="손익분기점 판매량"
            value={breakEvenQuantity}
            unit="개"
            Icon={TrendingUp}
            description="이익도 손실도 없는 판매량"
          />
          <MetricCardPDF
            title="목표 달성 판매량"
            value={targetQuantity}
            unit="개"
            Icon={Target}
            description="목표 수익을 달성하는 판매량"
          />
          <MetricCardPDF
            title="예상 월 매출"
            value={expectedRevenue}
            unit="원"
            Icon={DollarSign}
            description="목표 달성 시 총 매출"
          />
          <MetricCardPDF
            title="예상 월 이익"
            value={expectedProfit}
            unit="원"
            Icon={PieChart}
            description="목표 달성 시 순이익"
          />
        </div>
      </div>

      {/* 분석 요약 */}
      <div style={{ marginBottom: "32px", position: "relative", zIndex: "10" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
          분석 요약
        </h2>
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>공헌이익</p>
              <p style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>
                {contributionMargin.toLocaleString()}원
              </p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>공헌이익률</p>
              <p style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>
                {marginRate.toFixed(2)}%
              </p>
            </div>
            <div
              style={{
                paddingTop: "16px",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>
                {breakEvenQuantity > 0
                  ? `현재 입력 조건에서 손익분기점을 달성하려면 최소 ${breakEvenQuantity.toLocaleString()}개를 판매해야 합니다. ${
                      targetProfit > 0
                        ? `목표 수익 ${targetProfit.toLocaleString()}원을 달성하려면 ${targetQuantity.toLocaleString()}개를 판매해야 합니다.`
                        : ""
                    }`
                  : "공헌이익이 0 이하이므로 손익분기점 계산이 불가능합니다. 판매가를 올리거나 변동비를 낮춰주세요."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 민감도 분석 그래프 영역 */}
      <div style={{ position: "relative", zIndex: "10", marginBottom: "32px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
          민감도 분석
        </h2>
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>
              가격 및 원가 변화에 따른 BEP 분석
            </h3>
          </div>
          <div style={{ padding: "24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "256px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
              }}
            >
              <p style={{ color: "#6b7280" }}>그래프 영역 (향후 구현 예정)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div
        style={{
          marginTop: "32px",
          paddingTop: "24px",
          borderTop: "1px solid #e5e7eb",
          textAlign: "center",
          position: "relative",
          zIndex: "10",
        }}
      >
        <p style={{ fontSize: "12px", color: "#6b7280" }}>
          본 리포트는 쉬잇크루 BEP 마진 계산기를 통해 생성되었습니다.
        </p>
        <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
          무료 버전 - 워터마크가 포함되어 있습니다.
        </p>
      </div>
    </div>
  );
}
