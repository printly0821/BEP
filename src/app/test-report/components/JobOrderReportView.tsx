"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import Barcode from "react-barcode";
import type { ProductInfo } from "@/types/job-order";
import Image from "next/image";

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

  // 제품 상세 정보 (이미지 포함)
  product?: ProductInfo;
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
  productName = "2단 접지 카드",
  companyProductName = "2단 접지 엽서카드",
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
  product,
}: JobOrderReportViewProps) {
  // 이미지 뷰어 상태 관리
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 스와이프 최소 거리 (px)
  const minSwipeDistance = 50;

  // 현재 표시할 이미지 목록 가져오기
  const getAllImages = () => {
    if (!product?.images) return [];

    if (product.specification.productType === "multi") {
      return [...product.images].sort((a, b) => (a.pageNumber || 0) - (b.pageNumber || 0));
    }

    return product.images;
  };

  const allImages = getAllImages();
  const totalImages = allImages.length;

  // 책자 페이지 번호 계산 (표지/뒷표지 제외, 속지만 순차 번호)
  const getPageLabel = (img: typeof allImages[0], index: number) => {
    if (img.pageType === "cover_front") return "표지";
    if (img.pageType === "cover_back") return "뒷표지";

    // inside 페이지는 순차 번호 계산
    const insidePages = allImages.filter(i => i.pageType === "inside");
    const insideIndex = insidePages.findIndex(i => i.id === img.id);
    return insideIndex >= 0 ? `${insideIndex + 1}` : img.pageNumber?.toString() || `${index + 1}`;
  };

  // 이미지 네비게이션
  const goToPrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setSelectedImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  // 터치 이벤트 핸들러
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextImage();
    }
    if (isRightSwipe) {
      goToPrevImage();
    }
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isViewerOpen) return;

    if (e.key === "ArrowLeft") {
      goToPrevImage();
    } else if (e.key === "ArrowRight") {
      goToNextImage();
    } else if (e.key === "Escape") {
      setIsViewerOpen(false);
    }
  };

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown as any);
      return () => window.removeEventListener("keydown", handleKeyDown as any);
    }
  }, [isViewerOpen, selectedImageIndex]);

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

      {/* 메인 컨텐츠 - 1단 레이아웃 (모바일 최적화) */}
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
            ■ 제품 이미지
          </h2>
          <div
            style={{
              border: "1px solid #000000",
              minHeight: "200px",
              backgroundColor: "#f9fafb",
              padding: "16px",
            }}
          >
            {product?.images && product.images.length > 0 ? (
              <div>
                {/* 단면 제품 */}
                {product.specification.productType === "single" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                    {product.images
                      .filter((img) => img.side === "front")
                      .map((img, index) => (
                        <div
                          key={img.id}
                          onClick={() => {
                            setSelectedImageIndex(index);
                            setIsViewerOpen(true);
                          }}
                          style={{
                            cursor: "pointer",
                            border: "2px solid #e5e7eb",
                            borderRadius: "8px",
                            overflow: "hidden",
                            backgroundColor: "#ffffff",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#3b82f6";
                            e.currentTarget.style.transform = "scale(1.02)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <img
                            src={img.url}
                            alt={img.description || "제품 이미지"}
                            style={{
                              width: "100%",
                              height: "auto",
                              maxHeight: "300px",
                              objectFit: "contain",
                              display: "block",
                            }}
                          />
                          <div
                            style={{
                              padding: "8px 12px",
                              backgroundColor: "#f3f4f6",
                              fontSize: "12px",
                              color: "#374151",
                              textAlign: "center",
                            }}
                          >
                            {img.description || "앞면"}
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* 양면 제품 */}
                {product.specification.productType === "double" && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {product.images.map((img, index) => (
                      <div
                        key={img.id}
                        onClick={() => {
                          setSelectedImageIndex(index);
                          setIsViewerOpen(true);
                        }}
                        style={{
                          cursor: "pointer",
                          border: "2px solid #e5e7eb",
                          borderRadius: "8px",
                          overflow: "hidden",
                          backgroundColor: "#ffffff",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#3b82f6";
                          e.currentTarget.style.transform = "scale(1.02)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <img
                          src={img.url}
                          alt={img.description || "제품 이미지"}
                          style={{
                            width: "100%",
                            height: "auto",
                            maxHeight: "200px",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                        <div
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#f3f4f6",
                            fontSize: "12px",
                            color: "#374151",
                            textAlign: "center",
                          }}
                        >
                          {img.description || (img.side === "front" ? "앞면" : "뒷면")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 다중 페이지 제품 - 전체 그리드 */}
                {product.specification.productType === "multi" && (() => {
                  const sortedImages = [...product.images].sort(
                    (a, b) => (a.pageNumber || 0) - (b.pageNumber || 0)
                  );

                  return (
                    <>
                      <div
                        style={{
                          marginBottom: "12px",
                          padding: "8px 12px",
                          backgroundColor: "#ffffff",
                          borderRadius: "6px",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <p style={{ fontSize: "13px", fontWeight: "600", color: "#374151", margin: 0 }}>
                          총 {product.specification.pageCount || sortedImages.length}페이지 ({sortedImages.length}개 이미지) • 이미지를 클릭하면 크게 볼 수 있습니다
                        </p>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                          gap: "12px",
                        }}
                      >
                        {sortedImages.map((img, index) => (
                          <div
                            key={img.id}
                            onClick={() => {
                              setSelectedImageIndex(index);
                              setIsViewerOpen(true);
                            }}
                            style={{
                              cursor: "pointer",
                              border: "2px solid #e5e7eb",
                              borderRadius: "8px",
                              overflow: "hidden",
                              backgroundColor: "#ffffff",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#3b82f6";
                              e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#e5e7eb";
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                          >
                            <img
                              src={img.url}
                              alt={img.description || `페이지 ${img.pageNumber}`}
                              style={{
                                width: "100%",
                                height: "120px",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                            <div
                              style={{
                                padding: "6px 8px",
                                backgroundColor: "#f3f4f6",
                                fontSize: "11px",
                                color: "#374151",
                                textAlign: "center",
                                fontWeight: "500",
                              }}
                            >
                              {getPageLabel(img, index)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "200px",
                }}
              >
                <p style={{ color: "#6b7280", fontSize: "14px" }}>제품 이미지 없음</p>
              </div>
            )}
          </div>
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
              minHeight: "80px",
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

      {/* 전체화면 이미지 뷰어 (모바일 최적화) */}
      {isViewerOpen && allImages.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsViewerOpen(false);
            }
          }}
        >
          {/* 헤더: 닫기 버튼 + 페이지 정보 */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
              zIndex: 10,
            }}
          >
            <div style={{ color: "#ffffff", fontSize: "16px", fontWeight: "600" }}>
              {product?.specification.productType === "multi"
                ? getPageLabel(allImages[selectedImageIndex], selectedImageIndex)
                : `${selectedImageIndex + 1} / ${totalImages}`}
            </div>
            <button
              onClick={() => setIsViewerOpen(false)}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "#ffffff",
                fontSize: "24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
              }}
            >
              ×
            </button>
          </div>

          {/* 이미지 영역 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "80px 20px 120px",
              overflow: "hidden",
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={allImages[selectedImageIndex]?.url}
              alt={
                allImages[selectedImageIndex]?.description ||
                `이미지 ${selectedImageIndex + 1}`
              }
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
            />
          </div>

          {/* 좌우 네비게이션 버튼 (데스크톱) */}
          {totalImages > 1 && (
            <>
              <button
                onClick={goToPrevImage}
                style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "32px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                }}
              >
                ‹
              </button>
              <button
                onClick={goToNextImage}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "32px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                }}
              >
                ›
              </button>
            </>
          )}

          {/* 하단: 도트 인디케이터 (모바일) */}
          {totalImages > 1 && totalImages <= 20 && (
            <div
              style={{
                position: "absolute",
                bottom: "40px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px",
                padding: "12px 20px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "24px",
                backdropFilter: "blur(10px)",
              }}
            >
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  style={{
                    width: index === selectedImageIndex ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    backgroundColor:
                      index === selectedImageIndex
                        ? "#ffffff"
                        : "rgba(255, 255, 255, 0.4)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    padding: 0,
                  }}
                  aria-label={`이미지 ${index + 1}로 이동`}
                />
              ))}
            </div>
          )}

          {/* 이미지 설명 (있는 경우) */}
          {allImages[selectedImageIndex]?.description && (
            <div
              style={{
                position: "absolute",
                bottom: totalImages > 1 && totalImages <= 20 ? "100px" : "40px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "10px 20px",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderRadius: "8px",
                color: "#ffffff",
                fontSize: "14px",
                maxWidth: "90%",
                textAlign: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              {allImages[selectedImageIndex].description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
