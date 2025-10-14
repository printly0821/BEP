/**
 * Excel Import 데이터 유효성 검증 스키마
 *
 * Zod를 사용하여 CalculationInputs 데이터의 유효성을 검증하고
 * 사용자 친화적인 에러 메시지를 제공합니다.
 */

import { z } from 'zod';
import { safeParseNumber } from './number-utils';

/**
 * 숫자 필드 전처리기
 *
 * 문자열 숫자를 정규화하고 number로 변환합니다.
 * 이미 숫자면 그대로 반환합니다.
 */
const preprocessNumber = (value: unknown) => {
  if (typeof value === 'string') {
    const parsed = safeParseNumber(value);
    return isNaN(parsed) ? value : parsed;
  }
  return value;
};

/**
 * 기본 숫자 스키마 (전처리 포함)
 */
const numberField = z.preprocess(
  preprocessNumber,
  z.number({
    invalid_type_error: '숫자 형식이어야 합니다.',
    required_error: '필수 입력 항목입니다.',
  }).finite('유한한 숫자여야 합니다.')
);

/**
 * 양수 숫자 스키마 (0 초과)
 */
const positiveNumber = z.preprocess(
  preprocessNumber,
  z.number({
    invalid_type_error: '숫자 형식이어야 합니다.',
    required_error: '필수 입력 항목입니다.',
  }).finite('유한한 숫자여야 합니다.').positive('0보다 큰 숫자여야 합니다.')
);

/**
 * 음이 아닌 숫자 스키마 (0 이상)
 */
const nonnegativeNumber = z.preprocess(
  preprocessNumber,
  z.number({
    invalid_type_error: '숫자 형식이어야 합니다.',
    required_error: '필수 입력 항목입니다.',
  }).finite('유한한 숫자여야 합니다.').nonnegative('0 이상의 숫자여야 합니다.')
);

/**
 * 선택적 양수 숫자 스키마
 */
const optionalPositiveNumber = z.preprocess(
  preprocessNumber,
  z.union([
    z.number().positive('0보다 큰 숫자여야 합니다.').finite(),
    z.undefined(),
  ])
);

/**
 * 선택적 음이 아닌 숫자 스키마
 */
const optionalNonnegativeNumber = z.preprocess(
  preprocessNumber,
  z.union([
    z.number().nonnegative('0 이상의 숫자여야 합니다.').finite(),
    z.undefined(),
  ])
);

/**
 * 변동비 세부 항목 스키마
 */
export const variableCostDetailSchema = z.object({
  materials: optionalNonnegativeNumber,
  packaging: optionalNonnegativeNumber,
  shippingBox: optionalNonnegativeNumber,
  marketFee: optionalNonnegativeNumber,
  shippingCost: optionalNonnegativeNumber,
  other: optionalNonnegativeNumber,
}).optional();

/**
 * 고정비 세부 항목 스키마
 */
export const fixedCostDetailSchema = z.object({
  labor: optionalNonnegativeNumber,
  meals: optionalNonnegativeNumber,
  rent: optionalNonnegativeNumber,
  utilities: optionalNonnegativeNumber,
  office: optionalNonnegativeNumber,
  marketing: optionalNonnegativeNumber,
  other: optionalNonnegativeNumber,
}).optional();

/**
 * CalculationInputs 스키마
 */
export const calculationInputsSchema = z.object({
  price: positiveNumber,
  unitCost: nonnegativeNumber,
  fixedCost: nonnegativeNumber,
  targetProfit: optionalPositiveNumber,
  variableCostDetail: variableCostDetailSchema,
  fixedCostDetail: fixedCostDetailSchema,
}).refine(
  (data) => {
    // 공헌이익 검증: price > unitCost
    return data.price > data.unitCost;
  },
  {
    message: '판매가는 단위 변동비보다 커야 합니다. (공헌이익이 0 이하입니다)',
    path: ['price'], // 에러를 price 필드에 연결
  }
).refine(
  (data) => {
    // 변동비 세부 항목 합계 검증
    if (!data.variableCostDetail) return true;

    const detailValues = Object.values(data.variableCostDetail).filter(
      (v): v is number => typeof v === 'number' && v !== null && v !== undefined
    );

    // 세부 항목이 없으면 검증 스킵
    if (detailValues.length === 0) return true;

    const sum = detailValues.reduce((acc: number, val: number) => acc + val, 0);
    const tolerance = 0.01; // 부동소수점 오차 허용

    // unitCost가 숫자인지 확인
    if (typeof data.unitCost !== 'number') return false;

    return Math.abs(sum - data.unitCost) < tolerance;
  },
  {
    message: '변동비 세부 항목의 합계가 단위 변동비와 일치하지 않습니다.',
    path: ['variableCostDetail'],
  }
).refine(
  (data) => {
    // 고정비 세부 항목 합계 검증
    if (!data.fixedCostDetail) return true;

    const detailValues = Object.values(data.fixedCostDetail).filter(
      (v): v is number => typeof v === 'number' && v !== null && v !== undefined
    );

    // 세부 항목이 없으면 검증 스킵
    if (detailValues.length === 0) return true;

    const sum = detailValues.reduce((acc: number, val: number) => acc + val, 0);
    const tolerance = 0.01; // 부동소수점 오차 허용

    // fixedCost가 숫자인지 확인
    if (typeof data.fixedCost !== 'number') return false;

    return Math.abs(sum - data.fixedCost) < tolerance;
  },
  {
    message: '고정비 세부 항목의 합계가 월 고정비와 일치하지 않습니다.',
    path: ['fixedCostDetail'],
  }
);

/**
 * CalculationInputs 타입 (zod에서 추론)
 */
export type CalculationInputsValidated = z.infer<typeof calculationInputsSchema>;
