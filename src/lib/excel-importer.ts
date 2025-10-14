import * as XLSX from "xlsx";
import type { CalculationInputs, VariableCostDetail, FixedCostDetail } from "@/features/projects/types";

/**
 * 쉬잇크루 원본 엑셀 파일의 제품 데이터
 */
export interface SheatcrewProductData {
  rowIndex: number;
  type: string; // B2C, B2B, B2G
  no: number;
  name: string;
  price: number;
  // 변동비
  materials: number;
  packaging: number;
  shippingBox: number;
  marketFee: number;
  shippingCost: number;
  variableOther: number;
  // 고정비
  labor: number;
  meals: number;
  rent: number;
  utilities: number;
  office: number;
  marketing: number;
  fixedOther: number;
  // 목표
  targetProfit: number;
}

/**
 * 쉬잇크루 원본 엑셀 파일 파싱
 *
 * @param file - 업로드된 Excel 파일
 * @returns 제품 데이터 배열
 */
export async function parseSheatcrewExcel(file: File): Promise<SheatcrewProductData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // 첫 번째 시트 가져오기
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // AoA로 변환
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][];

        const products: SheatcrewProductData[] = [];

        // 8행부터 데이터 시작 (0-based index: 7)
        for (let i = 7; i < rows.length; i++) {
          const row = rows[i] as (string | number)[];

          // 상품명이 없으면 스킵
          if (!row[2] || row[2] === "") continue;

          // 판매가가 없으면 스킵
          if (!row[3] || row[3] === 0) continue;

          products.push({
            rowIndex: i + 1, // 1-based
            type: (row[0] as string) || "",
            no: (row[1] as number) || 0,
            name: (row[2] as string) || "",
            price: (row[3] as number) || 0,
            // 변동비 (G-L열, index 6-11)
            materials: (row[6] as number) || 0,
            packaging: (row[7] as number) || 0,
            shippingBox: (row[8] as number) || 0,
            marketFee: (row[9] as number) || 0,
            shippingCost: (row[10] as number) || 0,
            variableOther: (row[11] as number) || 0,
            // 고정비 (M-S열, index 12-18)
            labor: (row[12] as number) || 0,
            meals: (row[13] as number) || 0,
            rent: (row[14] as number) || 0,
            utilities: (row[15] as number) || 0,
            office: (row[16] as number) || 0,
            marketing: (row[17] as number) || 0,
            fixedOther: (row[18] as number) || 0,
            // 목표 순이익 (T열, index 19)
            targetProfit: (row[19] as number) || 0,
          });
        }

        resolve(products);
      } catch (error) {
        reject(new Error(`엑셀 파일 파싱 실패: ${error instanceof Error ? error.message : String(error)}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("파일 읽기 실패"));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * BEP Export 파일 파싱
 *
 * @param file - BEP Export Excel 파일
 * @returns CalculationInputs
 */
export async function parseBEPExportExcel(file: File): Promise<CalculationInputs> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        // Inputs 시트 찾기
        const inputsSheet = workbook.Sheets["Inputs"];
        if (!inputsSheet) {
          throw new Error("Inputs 시트를 찾을 수 없습니다.");
        }

        // AoA로 변환
        const rows = XLSX.utils.sheet_to_json(inputsSheet, { header: 1 }) as unknown[][];

        // 기본값
        let price = 0;
        let unitCost = 0;
        let fixedCost = 0;
        let targetProfit: number | undefined = undefined;
        const variableCostDetail: VariableCostDetail = {};
        const fixedCostDetail: FixedCostDetail = {};

        // 행 파싱
        for (const row of rows) {
          const cells = row as (string | number)[];
          const field = cells[0] as string;
          const value = cells[1] as number;

          if (!field) continue;

          // 기본 필드
          if (field === "판매가") price = value || 0;
          else if (field.includes("단위 변동비")) unitCost = value || 0;
          else if (field.includes("월 고정비")) fixedCost = value || 0;
          else if (field === "목표 수익" && value) targetProfit = value;

          // 변동비 세부 항목
          else if (field.includes("원재료비")) variableCostDetail.materials = value || 0;
          else if (field.includes("패키지")) variableCostDetail.packaging = value || 0;
          else if (field.includes("택배박스")) variableCostDetail.shippingBox = value || 0;
          else if (field.includes("마켓수수료")) variableCostDetail.marketFee = value || 0;
          else if (field.includes("배송비")) variableCostDetail.shippingCost = value || 0;
          else if (field.trim() === "기타" && cells[0]?.toString().startsWith("  ")) {
            // 변동비 섹션의 기타인지 확인 필요 (간단히 처리)
            if (!variableCostDetail.other) variableCostDetail.other = value || 0;
            else if (!fixedCostDetail.other) fixedCostDetail.other = value || 0;
          }

          // 고정비 세부 항목
          else if (field.includes("인건비")) fixedCostDetail.labor = value || 0;
          else if (field.includes("식비")) fixedCostDetail.meals = value || 0;
          else if (field.includes("임대료")) fixedCostDetail.rent = value || 0;
          else if (field.includes("공과금")) fixedCostDetail.utilities = value || 0;
          else if (field.includes("사무실운영비")) fixedCostDetail.office = value || 0;
          else if (field.includes("마케팅비")) fixedCostDetail.marketing = value || 0;
        }

        // 세부 항목이 있는지 확인
        const hasVariableDetail = Object.values(variableCostDetail).some(v => v !== undefined && v > 0);
        const hasFixedDetail = Object.values(fixedCostDetail).some(v => v !== undefined && v > 0);

        resolve({
          price,
          unitCost,
          fixedCost,
          targetProfit,
          variableCostDetail: hasVariableDetail ? variableCostDetail : undefined,
          fixedCostDetail: hasFixedDetail ? fixedCostDetail : undefined,
        });
      } catch (error) {
        reject(new Error(`BEP Export 파일 파싱 실패: ${error instanceof Error ? error.message : String(error)}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("파일 읽기 실패"));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * 쉬잇크루 제품 데이터를 CalculationInputs로 변환
 *
 * @param product - 쉬잇크루 제품 데이터
 * @returns CalculationInputs
 */
export function convertToCalculationInputs(product: SheatcrewProductData): CalculationInputs {
  // 변동비 합계 계산
  const unitCost =
    product.materials +
    product.packaging +
    product.shippingBox +
    product.marketFee +
    product.shippingCost +
    product.variableOther;

  // 고정비 합계 계산
  const fixedCost =
    product.labor +
    product.meals +
    product.rent +
    product.utilities +
    product.office +
    product.marketing +
    product.fixedOther;

  // 세부 항목
  const variableCostDetail: VariableCostDetail = {
    materials: product.materials || undefined,
    packaging: product.packaging || undefined,
    shippingBox: product.shippingBox || undefined,
    marketFee: product.marketFee || undefined,
    shippingCost: product.shippingCost || undefined,
    other: product.variableOther || undefined,
  };

  const fixedCostDetail: FixedCostDetail = {
    labor: product.labor || undefined,
    meals: product.meals || undefined,
    rent: product.rent || undefined,
    utilities: product.utilities || undefined,
    office: product.office || undefined,
    marketing: product.marketing || undefined,
    other: product.fixedOther || undefined,
  };

  return {
    price: product.price,
    unitCost,
    fixedCost,
    targetProfit: product.targetProfit > 0 ? product.targetProfit : undefined,
    variableCostDetail,
    fixedCostDetail,
  };
}

/**
 * 파일이 쉬잇크루 원본인지 BEP Export인지 자동 감지
 *
 * @param file - Excel 파일
 * @returns "sheatcrew" | "bep-export" | "unknown"
 */
export async function detectExcelType(file: File): Promise<"sheatcrew" | "bep-export" | "unknown"> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });

        const sheetNames = workbook.SheetNames;

        // BEP Export 파일은 Inputs, Results, Sensitivity, Readme 시트를 가짐
        if (
          sheetNames.includes("Inputs") &&
          sheetNames.includes("Results") &&
          sheetNames.includes("Sensitivity")
        ) {
          resolve("bep-export");
          return;
        }

        // 쉬잇크루 원본은 "목표설정 마진계산기" 시트를 가짐
        if (sheetNames.includes("목표설정 마진계산기")) {
          resolve("sheatcrew");
          return;
        }

        resolve("unknown");
      } catch {
        resolve("unknown");
      }
    };

    reader.onerror = () => {
      resolve("unknown");
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * 데이터 유효성 검증
 *
 * @deprecated 새로운 유효성 검증은 excel-validator.ts의 validateImportData()를 사용하세요.
 * @param inputs - CalculationInputs
 * @returns 에러 메시지 배열 (빈 배열이면 유효함)
 */
export function validateCalculationInputs(inputs: CalculationInputs): string[] {
  const errors: string[] = [];

  if (inputs.price <= 0) {
    errors.push("판매가는 0보다 커야 합니다.");
  }

  if (inputs.unitCost < 0) {
    errors.push("단위 변동비는 0 이상이어야 합니다.");
  }

  if (inputs.fixedCost < 0) {
    errors.push("월 고정비는 0 이상이어야 합니다.");
  }

  if (inputs.price <= inputs.unitCost) {
    errors.push("판매가는 단위 변동비보다 커야 합니다. (공헌이익이 0 이하입니다)");
  }

  if (inputs.targetProfit !== undefined && inputs.targetProfit < 0) {
    errors.push("목표 수익은 0 이상이어야 합니다.");
  }

  return errors;
}
