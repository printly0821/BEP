"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JobOrderReportView } from "./components/JobOrderReportView";
import { Button } from "@/components/ui/button";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/lib/pdf-generator";
import type { JobOrderData } from "@/types/job-order";

interface JobOrderSummary {
  id: string;
  documentNumber: string;
  orderNumber: string;
  clientName: string;
  orderDate: string;
  productName: string;
}

export default function TestReportPage() {
  const { toast } = useToast();

  // 상태 관리
  const [jobOrders, setJobOrders] = useState<JobOrderSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string>("1");
  const [jobOrderData, setJobOrderData] = useState<JobOrderData | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // 목록 불러오기
  const fetchJobOrders = async () => {
    setIsLoadingList(true);
    try {
      const response = await fetch("/api/job-orders");
      const result = await response.json();

      if (result.success) {
        setJobOrders(result.data);
      } else {
        toast({
          title: "목록 불러오기 실패",
          description: result.error || "알 수 없는 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("목록 불러오기 오류:", error);
      toast({
        title: "목록 불러오기 실패",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingList(false);
    }
  };

  // 상세 데이터 불러오기
  const fetchJobOrderDetail = async (id: string) => {
    setIsLoadingDetail(true);
    try {
      const response = await fetch(`/api/job-orders/${id}`);
      const result = await response.json();

      if (result.success && result.data) {
        setJobOrderData(result.data);
      } else {
        toast({
          title: "데이터 불러오기 실패",
          description: result.error || "알 수 없는 오류가 발생했습니다.",
          variant: "destructive",
        });
        setJobOrderData(null);
      }
    } catch (error) {
      console.error("데이터 불러오기 오류:", error);
      toast({
        title: "데이터 불러오기 실패",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      });
      setJobOrderData(null);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // 초기 로딩
  useEffect(() => {
    fetchJobOrders();
  }, []);

  // 선택된 ID가 변경되면 상세 데이터 불러오기
  useEffect(() => {
    if (selectedId) {
      fetchJobOrderDetail(selectedId);
    }
  }, [selectedId]);

  // PDF 다운로드 핸들러
  const handleDownloadPdf = async () => {
    if (!jobOrderData) return;

    setIsDownloadingPdf(true);

    try {
      await generatePDF(
        "job-order-report",
        `제작의뢰서_${jobOrderData.documentNumber}.pdf`
      );

      toast({
        title: "다운로드 완료",
        description: "제작 의뢰서 PDF가 성공적으로 다운로드되었습니다.",
      });
    } catch (error) {
      console.error("PDF 다운로드 오류:", error);
      toast({
        title: "다운로드 실패",
        description: "PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              제작 의뢰서 API 테스트
            </h1>
            <p className="text-muted-foreground">
              API에서 JSON 데이터를 불러와 동적으로 리포트를 생성합니다
            </p>
          </div>

          {/* 제어 패널 */}
          <div className="bg-card p-6 rounded-lg shadow-sm border mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 w-full md:w-auto">
                <label className="text-sm font-medium mb-2 block">
                  제작 의뢰서 선택
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  disabled={isLoadingList || isLoadingDetail}
                  className="w-full md:w-auto px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {isLoadingList ? (
                    <option>로딩 중...</option>
                  ) : (
                    jobOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.documentNumber} - {order.clientName} ({order.productName})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fetchJobOrders()}
                  disabled={isLoadingList}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${isLoadingList ? "animate-spin" : ""}`}
                  />
                  새로고침
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleDownloadPdf}
                  disabled={!jobOrderData || isDownloadingPdf}
                >
                  {isDownloadingPdf ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      PDF 다운로드
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* API 정보 */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">API 엔드포인트:</span>{" "}
                <code className="bg-muted px-2 py-1 rounded">
                  GET /api/job-orders/{selectedId}
                </code>
              </p>
            </div>
          </div>

          {/* 로딩 또는 리포트 표시 */}
          {isLoadingDetail ? (
            <div className="bg-white p-16 rounded-lg shadow-lg flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">데이터를 불러오는 중...</p>
              </div>
            </div>
          ) : jobOrderData ? (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <JobOrderReportView {...jobOrderData} />
            </div>
          ) : (
            <div className="bg-white p-16 rounded-lg shadow-lg text-center">
              <p className="text-muted-foreground">데이터를 불러올 수 없습니다.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* PDF 생성용 숨겨진 ReportView */}
      {jobOrderData && (
        <div
          style={{
            position: "fixed",
            left: "-9999px",
            top: "0",
            backgroundColor: "#ffffff",
            color: "#000000",
          }}
        >
          <div
            id="job-order-report"
            style={{
              width: "210mm",
              backgroundColor: "#ffffff",
              color: "#000000",
              fontFamily: "'Noto Sans KR', sans-serif",
            }}
          >
            <JobOrderReportView {...jobOrderData} />
          </div>
        </div>
      )}
    </div>
  );
}
