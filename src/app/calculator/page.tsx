"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CalculatorForm } from "./components/CalculatorForm";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { SensitivityChart } from "./components/SensitivityChart";
import { SimulationPanel } from "./components/SimulationPanel";
import { ActionButtons } from "./components/ActionButtons";
import { SaveProjectDialog } from "./components/SaveProjectDialog";
import { DebugPanel } from "./components/DebugPanel";
import { ReportView } from "./components/ReportView";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/lib/pdf-generator";
import { downloadXlsx, generateSensitivityData } from "@/lib/excel-generator";
import type { CalculationState } from "@/features/projects/types";

interface CalculationResult {
  contributionMargin: number;
  breakEvenQuantity: number;
  targetQuantity: number;
  projectedRevenue: number;
  projectedProfit: number;
}

export default function CalculatorPage() {
  const { toast } = useToast();

  // 입력 상태 (string으로 관리하여 빈 입력 허용)
  const [sellingPrice, setSellingPrice] = useState("50000");
  const [variableCost, setVariableCost] = useState("20000");
  const [fixedCost, setFixedCost] = useState("3000000");
  const [targetProfit, setTargetProfit] = useState("5000000");

  // 시뮬레이션 전용 상태
  const [simPrice, setSimPrice] = useState(50000);
  const [simVariableCost, setSimVariableCost] = useState(20000);

  // 저장 다이얼로그 상태
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // PDF 및 Excel 다운로드 로딩 상태
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  // 계산 결과 상태
  const [calculationResult, setCalculationResult] = useState<CalculationResult>({
    contributionMargin: 0,
    breakEvenQuantity: 0,
    targetQuantity: 0,
    projectedRevenue: 0,
    projectedProfit: 0,
  });

  // 실시간 계산 로직
  useEffect(() => {
    const calculateResults = () => {
      // 문자열을 숫자로 변환 (빈 문자열은 0으로 처리)
      const sp = Number(sellingPrice) || 0;
      const vc = Number(variableCost) || 0;
      const fc = Number(fixedCost) || 0;
      const tp = Number(targetProfit) || 0;

      // 공헌이익 계산
      const contributionMargin = sp - vc;

      // 공헌이익이 0 이하면 계산 불가
      if (contributionMargin <= 0) {
        setCalculationResult({
          contributionMargin: 0,
          breakEvenQuantity: 0,
          targetQuantity: 0,
          projectedRevenue: 0,
          projectedProfit: 0,
        });
        return;
      }

      // 손익분기점 판매량
      const breakEvenQuantity = Math.ceil(fc / contributionMargin);

      // 목표 달성 판매량
      const targetQuantity = Math.ceil((fc + tp) / contributionMargin);

      // 예상 월 매출
      const projectedRevenue = targetQuantity * sp;

      // 예상 월 이익
      const projectedProfit = projectedRevenue - (targetQuantity * vc) - fc;

      setCalculationResult({
        contributionMargin,
        breakEvenQuantity,
        targetQuantity,
        projectedRevenue,
        projectedProfit,
      });
    };

    calculateResults();
  }, [sellingPrice, variableCost, fixedCost, targetProfit]);

  // 시뮬레이션 결과 계산 (useMemo로 최적화)
  const simulationResult = useMemo(() => {
    const fc = Number(fixedCost) || 0;
    const tp = Number(targetProfit) || 0;
    const cm = simPrice - simVariableCost;

    if (cm <= 0) {
      return null;
    }

    const bepQty = Math.ceil(fc / cm);
    const targetQty = Math.ceil((fc + tp) / cm);

    return {
      contributionMargin: cm,
      breakEvenQuantity: bepQty,
      targetQuantity: targetQty,
      projectedRevenue: targetQty * simPrice,
      projectedProfit: targetQty * simPrice - targetQty * simVariableCost - fc,
    };
  }, [simPrice, simVariableCost, fixedCost, targetProfit]);

  // 시뮬레이션 값을 실제 폼에 적용
  const handleApplySimulation = () => {
    setSellingPrice(simPrice.toString());
    setVariableCost(simVariableCost.toString());
    toast({
      title: "적용 완료",
      description: "시뮬레이션 값이 계산기에 반영되었습니다.",
    });
  };

  // 시뮬레이션 값을 실제 값으로 초기화
  const handleResetSimulation = () => {
    setSimPrice(Number(sellingPrice) || 50000);
    setSimVariableCost(Number(variableCost) || 20000);
  };

  // 실제 입력 값이 변경되면 시뮬레이션도 동기화
  useEffect(() => {
    setSimPrice(Number(sellingPrice) || 50000);
    setSimVariableCost(Number(variableCost) || 20000);
  }, [sellingPrice, variableCost]);

  // CalculationState 생성 (저장용 및 Excel 다운로드용)
  const calculationState: CalculationState = useMemo(() => {
    const sp = Number(sellingPrice) || 0;
    const vc = Number(variableCost) || 0;
    const fc = Number(fixedCost) || 0;
    const tp = Number(targetProfit) || 0;

    // 민감도 분석 데이터 생성
    const sensitivityData = generateSensitivityData(sp, vc, fc, tp > 0 ? tp : undefined);

    return {
      version: 'v1',
      inputs: {
        price: sp,
        unitCost: vc,
        fixedCost: fc,
        targetProfit: tp > 0 ? tp : undefined,
      },
      results: {
        bepQuantity: calculationResult.breakEvenQuantity,
        bepRevenue: calculationResult.projectedRevenue,
        marginRate: sp > 0 ? calculationResult.contributionMargin / sp : 0,
        targetQuantity: calculationResult.targetQuantity > 0 ? calculationResult.targetQuantity : undefined,
      },
      sensitivity: sensitivityData,
      chartsMeta: {},
    };
  }, [sellingPrice, variableCost, fixedCost, targetProfit, calculationResult]);

  // 저장 핸들러
  const handleSave = () => {
    if (calculationResult.breakEvenQuantity === 0) {
      toast({
        title: "저장 불가",
        description: "먼저 계산을 완료해주세요.",
        variant: "destructive",
      });
      return;
    }
    setSaveDialogOpen(true);
  };

  // PDF 다운로드 핸들러
  const handleDownloadPdf = async () => {
    if (calculationResult.breakEvenQuantity === 0) {
      toast({
        title: "다운로드 불가",
        description: "먼저 계산을 완료해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloadingPdf(true);

    try {
      // PDF 생성 및 다운로드
      await generatePDF("pdf-report-view");

      toast({
        title: "다운로드 완료",
        description: "PDF 리포트가 성공적으로 다운로드되었습니다.",
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

  // Excel 다운로드 핸들러
  const handleDownloadExcel = async () => {
    if (calculationResult.breakEvenQuantity === 0) {
      toast({
        title: "다운로드 불가",
        description: "먼저 계산을 완료해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloadingExcel(true);

    try {
      // Excel 생성 및 다운로드
      await downloadXlsx(calculationState);

      toast({
        title: "다운로드 완료",
        description: "Excel 파일이 성공적으로 다운로드되었습니다.",
      });
    } catch (error) {
      console.error("Excel 다운로드 오류:", error);
      toast({
        title: "다운로드 실패",
        description: "Excel 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              BEP 마진 계산기
            </h1>
            <p className="text-muted-foreground">
              판매가, 원가, 고정비를 입력하여 손익분기점을 계산하세요
            </p>
          </div>

          {/* 데스크톱: 2단 그리드, 모바일: 1단 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽 열: 입력 폼, 시뮬레이션, 액션 버튼 */}
            <div className="lg:col-span-1 space-y-6">
              <CalculatorForm
                sellingPrice={sellingPrice}
                variableCost={variableCost}
                fixedCost={fixedCost}
                targetProfit={targetProfit}
                onSellingPriceChange={setSellingPrice}
                onVariableCostChange={setVariableCost}
                onFixedCostChange={setFixedCost}
                onTargetProfitChange={setTargetProfit}
              />
              <SimulationPanel
                actualSellingPrice={Number(sellingPrice) || 0}
                actualVariableCost={Number(variableCost) || 0}
                simPrice={simPrice}
                simVariableCost={simVariableCost}
                onSimPriceChange={setSimPrice}
                onSimVariableCostChange={setSimVariableCost}
                simulationResult={simulationResult}
                actualResult={{
                  breakEvenQuantity: calculationResult.breakEvenQuantity,
                  targetQuantity: calculationResult.targetQuantity,
                }}
                onApply={handleApplySimulation}
                onReset={handleResetSimulation}
              />
              <ActionButtons
                onSave={handleSave}
                onDownloadPdf={handleDownloadPdf}
                onDownloadExcel={handleDownloadExcel}
                isDownloadingPdf={isDownloadingPdf}
                isDownloadingExcel={isDownloadingExcel}
              />
            </div>

            {/* 오른쪽 열: 결과 대시보드, 그래프 */}
            <div className="lg:col-span-2 space-y-6">
              <ResultsDashboard
                breakEvenQuantity={calculationResult.breakEvenQuantity}
                targetQuantity={calculationResult.targetQuantity}
                expectedRevenue={calculationResult.projectedRevenue}
                expectedProfit={calculationResult.projectedProfit}
              />
              <SensitivityChart />
            </div>
          </div>

          {/* 개발 전용 디버그 패널 */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-8">
              <DebugPanel
                inputs={{
                  sellingPrice: Number(sellingPrice) || 0,
                  variableCost: Number(variableCost) || 0,
                  fixedCost: Number(fixedCost) || 0,
                  targetProfit: Number(targetProfit) || 0,
                }}
                results={calculationResult}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* 저장 다이얼로그 */}
      <SaveProjectDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        calculationState={calculationState}
      />

      {/* PDF 생성용 숨겨진 ReportView (화면에 표시되지 않음) */}
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
          id="pdf-report-view"
          style={{
            width: "210mm",
            backgroundColor: "#ffffff",
            color: "#000000",
            fontFamily: "'Noto Sans KR', sans-serif",
          }}
        >
          <ReportView
            breakEvenQuantity={calculationResult.breakEvenQuantity}
            targetQuantity={calculationResult.targetQuantity}
            expectedRevenue={calculationResult.projectedRevenue}
            expectedProfit={calculationResult.projectedProfit}
            sellingPrice={Number(sellingPrice) || 0}
            variableCost={Number(variableCost) || 0}
            fixedCost={Number(fixedCost) || 0}
            targetProfit={Number(targetProfit) || 0}
          />
        </div>
      </div>
    </div>
  );
}
