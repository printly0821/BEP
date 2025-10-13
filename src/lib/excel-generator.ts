import * as XLSX from "xlsx";
import { format } from "date-fns";
import type { CalculationState } from "@/features/projects/types";

/**
 * CalculationState를 Excel 파일(.xlsx)로 변환하여 다운로드합니다.
 *
 * @param state - 계산 상태 데이터 (입력값, 결과값, 민감도 분석)
 * @param fileName - 다운로드할 파일명 (기본값: BEP_Export_YYYY-MM-DD.xlsx)
 * @returns Promise<void>
 */
export async function downloadXlsx(
  state: CalculationState,
  fileName?: string
): Promise<void> {
  try {
    // 워크북 생성
    const wb = XLSX.utils.book_new();

    // 현재 날짜 기반 파일명 생성
    const today = new Date();
    const defaultFileName = `BEP_Export_${format(today, "yyyy-MM-dd")}.xlsx`;
    const finalFileName = fileName || defaultFileName;

    // 1. Inputs 시트 생성
    const inputsAoA = [
      ["WATERMARK: SHEATCREW FREE"],
      [],
      ["필드", "값"],
      ["판매가", state.inputs.price],
      ["단위 원가", state.inputs.unitCost],
      ["월 고정비", state.inputs.fixedCost],
      [
        "목표 수익",
        state.inputs.targetProfit !== undefined ? state.inputs.targetProfit : "",
      ],
    ];
    const inputsSheet = XLSX.utils.aoa_to_sheet(inputsAoA);

    // Inputs 시트 스타일링
    if (!inputsSheet["!cols"]) inputsSheet["!cols"] = [];
    inputsSheet["!cols"][0] = { wch: 15 }; // 첫 번째 열 너비
    inputsSheet["!cols"][1] = { wch: 20 }; // 두 번째 열 너비

    // 2. Results 시트 생성
    const resultsAoA = [
      ["WATERMARK: SHEATCREW FREE"],
      [],
      ["지표", "값"],
      ["손익분기점 판매량", state.results.bepQuantity],
      ["손익분기점 매출액", state.results.bepRevenue],
      ["공헌이익률 (%)", (state.results.marginRate * 100).toFixed(2)],
      [
        "목표 수익 달성 판매량",
        state.results.targetQuantity !== undefined
          ? state.results.targetQuantity
          : "",
      ],
    ];
    const resultsSheet = XLSX.utils.aoa_to_sheet(resultsAoA);

    // Results 시트 스타일링
    if (!resultsSheet["!cols"]) resultsSheet["!cols"] = [];
    resultsSheet["!cols"][0] = { wch: 25 }; // 첫 번째 열 너비
    resultsSheet["!cols"][1] = { wch: 20 }; // 두 번째 열 너비

    // 3. Sensitivity 시트 생성
    const sensAoA: (string | number)[][] = [
      ["WATERMARK: SHEATCREW FREE"],
      [],
      ["판매가", "단위 원가", "손익분기점", "수익"],
    ];

    // 민감도 데이터가 있는 경우 추가
    if (state.sensitivity && state.sensitivity.length > 0) {
      state.sensitivity.forEach((point) => {
        sensAoA.push([point.price, point.unitCost, point.bep, point.profit]);
      });
    } else {
      // 데이터가 없는 경우 안내 메시지
      sensAoA.push(["민감도 분석 데이터가 없습니다.", "", "", ""]);
    }

    const sensitivitySheet = XLSX.utils.aoa_to_sheet(sensAoA);

    // Sensitivity 시트 스타일링
    if (!sensitivitySheet["!cols"]) sensitivitySheet["!cols"] = [];
    sensitivitySheet["!cols"][0] = { wch: 15 };
    sensitivitySheet["!cols"][1] = { wch: 15 };
    sensitivitySheet["!cols"][2] = { wch: 15 };
    sensitivitySheet["!cols"][3] = { wch: 15 };

    // 4. Readme 시트 생성
    const readmeAoA = [
      ["쉬잇크루 BEP 계산기"],
      [],
      ["이 워크북은 BEP 마진 계산기에서 생성되었습니다."],
      [],
      ["📊 포함된 데이터:"],
      ["  • Inputs: 계산에 사용된 입력값"],
      ["  • Results: 계산된 결과값"],
      ["  • Sensitivity: 민감도 분석 데이터"],
      [],
      ["⚠️ 무료 버전 안내:"],
      ["  • 이 파일은 무료 버전으로 생성되었습니다."],
      ["  • 워터마크가 포함되어 있습니다."],
      ["  • Pro 버전으로 업그레이드하면 워터마크 없는 고해상도 리포트를 받을 수 있습니다."],
      [],
      ["📅 생성일: " + format(today, "yyyy-MM-dd HH:mm:ss")],
      ["🔗 https://bep-calculator.sheatcrew.com"],
    ];
    const readmeSheet = XLSX.utils.aoa_to_sheet(readmeAoA);

    // Readme 시트 스타일링
    if (!readmeSheet["!cols"]) readmeSheet["!cols"] = [];
    readmeSheet["!cols"][0] = { wch: 80 }; // 넓은 열 너비

    // 워크북에 시트 추가
    XLSX.utils.book_append_sheet(wb, inputsSheet, "Inputs");
    XLSX.utils.book_append_sheet(wb, resultsSheet, "Results");
    XLSX.utils.book_append_sheet(wb, sensitivitySheet, "Sensitivity");
    XLSX.utils.book_append_sheet(wb, readmeSheet, "Readme");

    // 파일 다운로드
    XLSX.writeFile(wb, finalFileName);
  } catch (error) {
    console.error("Excel 생성 중 오류 발생:", error);
    throw error;
  }
}

/**
 * 민감도 분석 데이터를 생성합니다.
 * 가격과 원가의 ±20% 범위에서 각 10개 데이터 포인트를 생성합니다.
 *
 * @param price - 기준 판매가
 * @param unitCost - 기준 단위 원가
 * @param fixedCost - 고정비
 * @param targetProfit - 목표 수익 (선택적)
 * @returns SensitivityPoint[]
 */
export function generateSensitivityData(
  price: number,
  unitCost: number,
  fixedCost: number,
  targetProfit?: number
): Array<{ price: number; unitCost: number; bep: number; profit: number }> {
  const dataPoints: Array<{
    price: number;
    unitCost: number;
    bep: number;
    profit: number;
  }> = [];

  // 가격 변동 범위: ±20% (10개 포인트)
  const priceRange = 0.2; // 20%
  const priceSteps = 10;

  for (let i = 0; i < priceSteps; i++) {
    const priceFactor = 1 - priceRange + (2 * priceRange * i) / (priceSteps - 1);
    const adjustedPrice = Math.round(price * priceFactor);

    // 공헌이익 계산
    const contributionMargin = adjustedPrice - unitCost;

    if (contributionMargin > 0) {
      // BEP 계산
      const bep = Math.ceil(fixedCost / contributionMargin);

      // 목표 수익이 있는 경우 해당 수량, 없으면 BEP 수량 기준
      const targetQty = targetProfit
        ? Math.ceil((fixedCost + targetProfit) / contributionMargin)
        : bep;

      // 예상 이익 계산
      const profit =
        adjustedPrice * targetQty - unitCost * targetQty - fixedCost;

      dataPoints.push({
        price: adjustedPrice,
        unitCost,
        bep,
        profit,
      });
    }
  }

  // 원가 변동 범위: ±20% (10개 포인트)
  const costRange = 0.2; // 20%
  const costSteps = 10;

  for (let i = 0; i < costSteps; i++) {
    const costFactor = 1 - costRange + (2 * costRange * i) / (costSteps - 1);
    const adjustedCost = Math.round(unitCost * costFactor);

    // 공헌이익 계산
    const contributionMargin = price - adjustedCost;

    if (contributionMargin > 0) {
      // BEP 계산
      const bep = Math.ceil(fixedCost / contributionMargin);

      // 목표 수익이 있는 경우 해당 수량, 없으면 BEP 수량 기준
      const targetQty = targetProfit
        ? Math.ceil((fixedCost + targetProfit) / contributionMargin)
        : bep;

      // 예상 이익 계산
      const profit = price * targetQty - adjustedCost * targetQty - fixedCost;

      dataPoints.push({
        price,
        unitCost: adjustedCost,
        bep,
        profit,
      });
    }
  }

  return dataPoints;
}
