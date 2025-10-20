/**
 * 민감도 분석 계산 유틸리티
 *
 * 가격과 원가 변동에 따른 손익분기점(BEP) 변화를 계산합니다.
 */

/**
 * 민감도 분석 데이터 포인트
 * (기존 types.ts의 SensitivityPoint와 구분하기 위해 SensitivityDataPoint 사용)
 */
export type SensitivityDataPoint = {
  /** 변수 값 (가격 또는 원가) */
  variable: number;
  /** 손익분기점 판매량 */
  bep: number;
  /** 이익 (목표 수익 달성 시) */
  profit: number;
  /** 현재 값 여부 */
  isCurrentValue: boolean;
};

/**
 * 가격 민감도 분석 데이터 생성
 *
 * @param basePrice - 기준 판매가
 * @param unitCost - 단위 원가
 * @param fixedCost - 고정비
 * @param targetProfit - 목표 수익 (선택)
 * @returns 11개의 민감도 데이터 포인트 (±50%, 10% 간격)
 */
export function generatePriceSensitivity(
  basePrice: number,
  unitCost: number,
  fixedCost: number,
  targetProfit?: number
): SensitivityDataPoint[] {
  // 1. 입력 검증
  if (basePrice <= 0 || unitCost < 0 || fixedCost < 0) {
    return [];
  }

  // 2. 범위 계산 (±50%)
  const min = basePrice * 0.5;
  const max = basePrice * 1.5;
  const step = (max - min) / 10; // 11개 포인트

  // 3. 각 포인트 계산
  const points: SensitivityDataPoint[] = [];

  for (let price = min; price <= max; price += step) {
    const contributionMargin = price - unitCost;

    // 3-1. 공헌이익 ≤ 0 처리
    if (contributionMargin <= 0) {
      points.push({
        variable: Math.round(price),
        bep: 0,
        profit: 0,
        isCurrentValue: false,
      });
      continue;
    }

    // 3-2. BEP 계산
    const bep = Math.ceil(fixedCost / contributionMargin);

    // 3-3. 목표 수익 달성 판매량 및 이익
    const targetQty = targetProfit
      ? Math.ceil((fixedCost + targetProfit) / contributionMargin)
      : bep;

    const profit = targetQty * price - targetQty * unitCost - fixedCost;

    // 3-4. 현재값 여부 (오차 허용)
    const isCurrentValue = Math.abs(price - basePrice) < step / 2;

    points.push({
      variable: Math.round(price),
      bep,
      profit,
      isCurrentValue,
    });
  }

  return points;
}

/**
 * 원가 민감도 분석 데이터 생성
 *
 * @param basePrice - 판매가 (고정)
 * @param baseCost - 기준 단위 원가
 * @param fixedCost - 고정비
 * @param targetProfit - 목표 수익 (선택)
 * @returns 11개의 민감도 데이터 포인트 (±50%, 10% 간격)
 */
export function generateCostSensitivity(
  basePrice: number,
  baseCost: number,
  fixedCost: number,
  targetProfit?: number
): SensitivityDataPoint[] {
  // 1. 입력 검증
  if (basePrice <= 0 || baseCost < 0 || fixedCost < 0) {
    return [];
  }

  // 2. 범위 계산 (±50%)
  const min = baseCost * 0.5;
  const max = baseCost * 1.5;
  const step = (max - min) / 10; // 11개 포인트

  // 3. 각 포인트 계산
  const points: SensitivityDataPoint[] = [];

  for (let cost = min; cost <= max; cost += step) {
    const contributionMargin = basePrice - cost;

    // 3-1. 공헌이익 ≤ 0 처리
    if (contributionMargin <= 0) {
      points.push({
        variable: Math.round(cost),
        bep: 0,
        profit: 0,
        isCurrentValue: false,
      });
      continue;
    }

    // 3-2. BEP 계산
    const bep = Math.ceil(fixedCost / contributionMargin);

    // 3-3. 목표 수익 달성 판매량 및 이익
    const targetQty = targetProfit
      ? Math.ceil((fixedCost + targetProfit) / contributionMargin)
      : bep;

    const profit = targetQty * basePrice - targetQty * cost - fixedCost;

    // 3-4. 현재값 여부 (오차 허용)
    const isCurrentValue = Math.abs(cost - baseCost) < step / 2;

    points.push({
      variable: Math.round(cost),
      bep,
      profit,
      isCurrentValue,
    });
  }

  return points;
}
