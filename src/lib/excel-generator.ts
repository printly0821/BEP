import * as XLSX from "xlsx";
import { format } from "date-fns";
import type { CalculationState, VariableCostDetail, FixedCostDetail } from "@/features/projects/types";

/**
 * Summary 시트 생성
 * 대시보드 형식의 한눈에 보는 요약 페이지
 */
function createSummarySheet(state: CalculationState, today: Date): XLSX.WorkSheet {
  const contributionMargin = state.inputs.price - state.inputs.unitCost;
  const contributionMarginRate = (state.results.marginRate * 100).toFixed(2);
  const unitCostRate = ((state.inputs.unitCost / state.inputs.price) * 100).toFixed(1);

  const summaryAoA: (string | number)[][] = [
    ["쉬잇크루 BEP 계산기 - 계산 결과 요약"],
    ["생성일: " + format(today, "yyyy-MM-dd HH:mm:ss")],
    [],
    ["=== 📊 핵심 지표 ==="],
    [],
    ["지표", "값", "단위"],
    ["판매가", state.inputs.price, "원"],
    ["공헌이익", contributionMargin, "원"],
    ["공헌이익률", contributionMarginRate, "%"],
    ["손익분기점 판매량", state.results.bepQuantity, "개"],
    ["손익분기점 매출액", state.results.bepRevenue, "원"],
    [
      "목표 달성 판매량",
      state.results.targetQuantity !== undefined ? state.results.targetQuantity : "-",
      "개"
    ],
    [],
    ["=== 💰 비용 구조 ==="],
    [],
    ["항목", "금액", "비율"],
    ["단위 변동비", state.inputs.unitCost, unitCostRate + "%"],
    ["월 고정비", state.inputs.fixedCost, "-"],
    [
      "목표 수익",
      state.inputs.targetProfit !== undefined ? state.inputs.targetProfit : "-",
      "-"
    ],
  ];

  const sheet = XLSX.utils.aoa_to_sheet(summaryAoA);

  // 스타일링
  if (!sheet["!cols"]) sheet["!cols"] = [];
  sheet["!cols"][0] = { wch: 25 };
  sheet["!cols"][1] = { wch: 20 };
  sheet["!cols"][2] = { wch: 15 };

  return sheet;
}

/**
 * 개선된 Inputs 시트 생성
 * 비율, 검증 컬럼 추가
 */
function createInputsSheet(state: CalculationState): XLSX.WorkSheet {
  const inputsAoA: (string | number)[][] = [
    ["WATERMARK: SHEATCREW FREE"],
    [],
    ["=== [기본 정보] ==="],
    [],
    ["필드", "값", "단위", "비고"],
    ["판매가", state.inputs.price, "원", ""],
    ["단위 변동비 (합계)", state.inputs.unitCost, "원", "세부↓"],
    ["월 고정비 (합계)", state.inputs.fixedCost, "원", "세부↓"],
    [
      "목표 수익",
      state.inputs.targetProfit !== undefined ? state.inputs.targetProfit : "",
      "원",
      ""
    ],
  ];

  // 변동비 세부 항목이 있으면 추가
  if (state.inputs.variableCostDetail) {
    const detail = state.inputs.variableCostDetail;
    const items: Array<[string, number | undefined]> = [
      ["원재료비", detail.materials],
      ["패키지", detail.packaging],
      ["택배박스", detail.shippingBox],
      ["마켓수수료", detail.marketFee],
      ["배송비", detail.shippingCost],
      ["기타", detail.other],
    ];

    // 실제 값이 있는 항목만 필터링
    const validItems = items.filter(([, value]) => value !== undefined);

    if (validItems.length > 0) {
      // 세부 항목 합계 계산
      const detailSum = validItems.reduce((sum, [, value]) => sum + (value || 0), 0);

      inputsAoA.push([]);
      inputsAoA.push(["=== [변동비 세부 항목] ===", "", "", ""]);
      inputsAoA.push(["항목", "금액", "비율", "상태"]);

      validItems.forEach(([name, value]) => {
        const ratio = state.inputs.unitCost > 0
          ? ((value! / state.inputs.unitCost) * 100).toFixed(1) + "%"
          : "0%";
        inputsAoA.push(["  " + name, value!, ratio, ""]);
      });

      // 합계 및 검증
      const isValid = detailSum === state.inputs.unitCost;
      inputsAoA.push(["합계", detailSum, "100.0%", isValid ? "✅" : "❌"]);
      inputsAoA.push([
        "합계 검증",
        state.inputs.unitCost,
        "",
        isValid ? "일치" : "불일치"
      ]);
    }
  }

  // 고정비 세부 항목이 있으면 추가
  if (state.inputs.fixedCostDetail) {
    const detail = state.inputs.fixedCostDetail;
    const items: Array<[string, number | undefined]> = [
      ["인건비", detail.labor],
      ["식비", detail.meals],
      ["임대료", detail.rent],
      ["공과금", detail.utilities],
      ["사무실운영비", detail.office],
      ["마케팅비", detail.marketing],
      ["기타", detail.other],
    ];

    // 실제 값이 있는 항목만 필터링
    const validItems = items.filter(([, value]) => value !== undefined);

    if (validItems.length > 0) {
      // 세부 항목 합계 계산
      const detailSum = validItems.reduce((sum, [, value]) => sum + (value || 0), 0);

      inputsAoA.push([]);
      inputsAoA.push(["=== [고정비 세부 항목] ===", "", "", ""]);
      inputsAoA.push(["항목", "금액", "비율", "상태"]);

      validItems.forEach(([name, value]) => {
        const ratio = state.inputs.fixedCost > 0
          ? ((value! / state.inputs.fixedCost) * 100).toFixed(1) + "%"
          : "0%";
        inputsAoA.push(["  " + name, value!, ratio, ""]);
      });

      // 합계 및 검증
      const isValid = detailSum === state.inputs.fixedCost;
      inputsAoA.push(["합계", detailSum, "100.0%", isValid ? "✅" : "❌"]);
      inputsAoA.push([
        "합계 검증",
        state.inputs.fixedCost,
        "",
        isValid ? "일치" : "불일치"
      ]);
    }
  }

  const sheet = XLSX.utils.aoa_to_sheet(inputsAoA);

  // 스타일링
  if (!sheet["!cols"]) sheet["!cols"] = [];
  sheet["!cols"][0] = { wch: 25 };
  sheet["!cols"][1] = { wch: 20 };
  sheet["!cols"][2] = { wch: 15 };
  sheet["!cols"][3] = { wch: 15 };

  return sheet;
}

/**
 * Validation 시트 생성
 * 데이터 무결성 자동 검증
 */
function createValidationSheet(state: CalculationState, today: Date): XLSX.WorkSheet {
  const validationResults: Array<[string, string, string]> = [];
  let passCount = 0;
  let totalCount = 0;

  // 기본 검증
  const checks: Array<[string, boolean, string]> = [
    ["판매가 > 0", state.inputs.price > 0, "통과"],
    ["판매가 > 단위 변동비", state.inputs.price > state.inputs.unitCost, "통과"],
    ["공헌이익 > 0", state.inputs.price - state.inputs.unitCost > 0, "통과"],
    ["고정비 >= 0", state.inputs.fixedCost >= 0, "통과"],
    [
      "목표 수익 >= 0",
      state.inputs.targetProfit === undefined || state.inputs.targetProfit >= 0,
      "통과"
    ],
  ];

  checks.forEach(([checkName, isValid]) => {
    totalCount++;
    if (isValid) passCount++;
    validationResults.push([
      checkName,
      isValid ? "✅" : "❌",
      isValid ? "통과" : "실패"
    ]);
  });

  // 세부 항목 합계 검증
  const detailChecks: Array<[string, number, number, string]> = [];

  if (state.inputs.variableCostDetail) {
    const detail = state.inputs.variableCostDetail;
    const detailSum = Object.values(detail).reduce((sum, val) => sum + (val || 0), 0);
    const isValid = detailSum === state.inputs.unitCost;
    detailChecks.push([
      "변동비",
      detailSum,
      state.inputs.unitCost,
      isValid ? "✅" : "❌"
    ]);
    totalCount++;
    if (isValid) passCount++;
  }

  if (state.inputs.fixedCostDetail) {
    const detail = state.inputs.fixedCostDetail;
    const detailSum = Object.values(detail).reduce((sum, val) => sum + (val || 0), 0);
    const isValid = detailSum === state.inputs.fixedCost;
    detailChecks.push([
      "고정비",
      detailSum,
      state.inputs.fixedCost,
      isValid ? "✅" : "❌"
    ]);
    totalCount++;
    if (isValid) passCount++;
  }

  const integrityScore = totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(0) : "100";
  const canImport = passCount === totalCount;

  const validationAoA: (string | number)[][] = [
    ["데이터 검증 리포트"],
    ["생성일: " + format(today, "yyyy-MM-dd HH:mm:ss")],
    [],
    ["=== ✅ 기본 검증 ==="],
    [],
    ["검증 항목", "결과", "메시지"],
    ...validationResults,
    [],
    ["=== ✅ 세부 항목 합계 검증 ==="],
    [],
    ["항목", "세부합계", "총합계", "결과"],
    ...detailChecks,
    [],
    ["=== 📊 데이터 무결성 점수 ==="],
    [],
    ["총 검증 항목", totalCount + "개"],
    ["통과", passCount + "개"],
    ["실패", (totalCount - passCount) + "개"],
    ["무결성 점수", integrityScore + "% " + (canImport ? "✅" : "❌")],
    [],
    [
      "💡 Import 가능 여부",
      canImport ? "✅ 이 파일은 다시 Import 가능합니다." : "❌ 검증 실패 항목을 수정하세요."
    ],
  ];

  const sheet = XLSX.utils.aoa_to_sheet(validationAoA);

  // 스타일링
  if (!sheet["!cols"]) sheet["!cols"] = [];
  sheet["!cols"][0] = { wch: 30 };
  sheet["!cols"][1] = { wch: 20 };
  sheet["!cols"][2] = { wch: 20 };
  sheet["!cols"][3] = { wch: 15 };

  return sheet;
}

/**
 * 개선된 Readme 시트 생성
 */
function createReadmeSheet(today: Date): XLSX.WorkSheet {
  const readmeAoA: (string | number)[][] = [
    ["쉬잇크루 BEP 계산기 - Export 파일 가이드"],
    [],
    ["=== 📋 이 파일에 대하여 ==="],
    ["생성일: " + format(today, "yyyy-MM-dd HH:mm:ss")],
    ["버전: v1"],
    ["생성 도구: BEP 계산기 (https://bep.sheatcrew.com)"],
    [],
    ["=== 📊 포함된 시트 ==="],
    ["1. Summary     : 계산 결과 요약 (한눈에 보기)"],
    ["2. Inputs      : 입력값 및 세부 항목 ⬅ Import 대상"],
    ["3. Results     : 계산 결과"],
    ["4. Sensitivity : 민감도 분석"],
    ["5. Validation  : 데이터 무결성 검증"],
    ["6. Readme      : 이 안내 페이지"],
    [],
    ["=== 🔄 다시 Import 하는 방법 ==="],
    ["1. BEP 계산기 접속"],
    ["2. 'Excel 파일 가져오기' 버튼 클릭"],
    ["3. 이 파일 선택"],
    ["4. 자동으로 Inputs 시트에서 데이터 로드"],
    [],
    ["=== ⚠️ 주의사항 ==="],
    ["• Inputs 시트의 구조를 변경하지 마세요"],
    ["• 세부 항목 합계가 총합계와 일치해야 합니다"],
    ["• Validation 시트에서 검증 결과를 확인하세요"],
    ["• 비율, 상태 컬럼은 참고용이며 Import 시 무시됩니다"],
    [],
    ["=== 💰 무료 버전 안내 ==="],
    ["• 이 파일은 무료 버전으로 생성되었습니다"],
    ["• 워터마크가 포함되어 있습니다"],
    ["• Pro 버전: 워터마크 제거, 고급 분석, PDF 리포트"],
    [],
    ["=== 📞 문의 ==="],
    ["웹사이트: https://bep.sheatcrew.com"],
    ["이메일: support@sheatcrew.com"],
  ];

  const sheet = XLSX.utils.aoa_to_sheet(readmeAoA);

  // 스타일링
  if (!sheet["!cols"]) sheet["!cols"] = [];
  sheet["!cols"][0] = { wch: 80 };

  return sheet;
}

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

    // 1. Summary 시트 생성
    const summarySheet = createSummarySheet(state, today);

    // 2. Inputs 시트 생성 (개선됨)
    const inputsSheet = createInputsSheet(state);

    // 3. Results 시트 생성 (기존 유지)
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
    resultsSheet["!cols"][0] = { wch: 25 };
    resultsSheet["!cols"][1] = { wch: 20 };

    // 4. Sensitivity 시트 생성 (기존 유지)
    const sensAoA: (string | number)[][] = [
      ["WATERMARK: SHEATCREW FREE"],
      [],
      ["판매가", "단위 변동비", "손익분기점", "수익"],
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

    // 5. Validation 시트 생성
    const validationSheet = createValidationSheet(state, today);

    // 6. Readme 시트 생성 (개선됨)
    const readmeSheet = createReadmeSheet(today);

    // 워크북에 시트 추가 (순서 중요!)
    XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");
    XLSX.utils.book_append_sheet(wb, inputsSheet, "Inputs");
    XLSX.utils.book_append_sheet(wb, resultsSheet, "Results");
    XLSX.utils.book_append_sheet(wb, sensitivitySheet, "Sensitivity");
    XLSX.utils.book_append_sheet(wb, validationSheet, "Validation");
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
 * @param unitCost - 기준 단위 변동비
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
