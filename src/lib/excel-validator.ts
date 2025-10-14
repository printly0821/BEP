/**
 * Excel Import 데이터 유효성 검증
 *
 * Zod 스키마를 활용하여 데이터 유효성을 검증하고
 * 구조화된 에러 정보를 제공합니다.
 */

import { ZodError } from 'zod';
import { calculationInputsSchema } from './validation-schema';
import type { CalculationInputs } from '@/features/projects/types';

/**
 * 에러 코드 정의
 */
export enum ValidationErrorCode {
  /** 필수 필드 누락 */
  MISSING_FIELD = 'MISSING_FIELD',
  /** 타입 에러 (숫자가 아님) */
  TYPE_ERROR = 'TYPE_ERROR',
  /** 빈 값 */
  EMPTY_VALUE = 'EMPTY_VALUE',
  /** 범위 에러 (min/max 위반) */
  RANGE_ERROR = 'RANGE_ERROR',
  /** 중복 행 */
  DUPLICATE_ROW = 'DUPLICATE_ROW',
  /** 비즈니스 로직 에러 (공헌이익 0 이하 등) */
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR',
  /** 세부 항목 합계 불일치 */
  DETAIL_SUM_MISMATCH = 'DETAIL_SUM_MISMATCH',
  /** 기타 에러 */
  UNKNOWN = 'UNKNOWN',
}

/**
 * 유효성 검증 이슈
 */
export interface ValidationIssue {
  /** 에러 코드 */
  code: ValidationErrorCode;
  /** 필드명 (없으면 전체 데이터 에러) */
  field?: string;
  /** 에러 메시지 */
  message: string;
}

/**
 * 유효성 검증 결과
 */
export interface ValidationResult<T = CalculationInputs> {
  /** 검증 성공 여부 */
  ok: boolean;
  /** 에러 이슈 목록 */
  issues: ValidationIssue[];
  /** 검증된 데이터 (성공 시) */
  value: T | null;
}

/**
 * 필드명 한글 매핑
 */
const FIELD_NAME_MAP: Record<string, string> = {
  price: '판매가',
  unitCost: '단위 변동비',
  fixedCost: '월 고정비',
  targetProfit: '목표 수익',
  variableCostDetail: '변동비 세부 항목',
  fixedCostDetail: '고정비 세부 항목',
};

/**
 * Zod 에러를 ValidationIssue로 변환
 */
function zodErrorToIssues(error: ZodError): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const zodIssue of error.issues) {
    const fieldPath = zodIssue.path.join('.');
    const fieldName = FIELD_NAME_MAP[fieldPath] || fieldPath || '알 수 없는 필드';

    let code = ValidationErrorCode.UNKNOWN;
    let message = zodIssue.message;

    // 에러 타입별 코드 분류
    switch (zodIssue.code) {
      case 'invalid_type':
        if (zodIssue.received === 'undefined' || zodIssue.received === 'null') {
          code = ValidationErrorCode.MISSING_FIELD;
          message = `${fieldName}는 필수 입력 항목입니다.`;
        } else {
          code = ValidationErrorCode.TYPE_ERROR;
          message = `${fieldName}는 ${zodIssue.message}`;
        }
        break;

      case 'too_small':
        code = ValidationErrorCode.RANGE_ERROR;
        message = `${fieldName}는 ${zodIssue.message}`;
        break;

      case 'too_big':
        code = ValidationErrorCode.RANGE_ERROR;
        message = `${fieldName}는 ${zodIssue.message}`;
        break;

      case 'custom':
        // refine() 에러는 비즈니스 로직 에러
        if (message.includes('합계') || message.includes('일치')) {
          code = ValidationErrorCode.DETAIL_SUM_MISMATCH;
        } else if (message.includes('공헌이익') || message.includes('판매가')) {
          code = ValidationErrorCode.BUSINESS_LOGIC_ERROR;
        } else {
          code = ValidationErrorCode.BUSINESS_LOGIC_ERROR;
        }
        break;

      default:
        code = ValidationErrorCode.UNKNOWN;
    }

    issues.push({
      code,
      field: fieldPath || undefined,
      message,
    });
  }

  return issues;
}

/**
 * Import 데이터 유효성 검증
 *
 * @param data - 검증할 데이터 (Record<string, unknown>)
 * @returns ValidationResult
 */
export function validateImportData(data: Record<string, unknown>): ValidationResult<CalculationInputs> {
  const issues: ValidationIssue[] = [];

  // 필수 필드 존재 여부 확인
  const requiredFields = ['price', 'unitCost', 'fixedCost'] as const;
  for (const field of requiredFields) {
    if (!(field in data) || data[field] === null || data[field] === undefined) {
      issues.push({
        code: ValidationErrorCode.MISSING_FIELD,
        field,
        message: `${FIELD_NAME_MAP[field]}는 필수 입력 항목입니다.`,
      });
    }
  }

  // 빈 값 체크 (빈 문자열)
  for (const [key, value] of Object.entries(data)) {
    if (value === '') {
      const fieldName = FIELD_NAME_MAP[key] || key;
      issues.push({
        code: ValidationErrorCode.EMPTY_VALUE,
        field: key,
        message: `${fieldName}에 빈 값이 있습니다.`,
      });
    }
  }

  // 필수 필드 누락 시 zod 검증 스킵
  if (issues.length > 0) {
    return {
      ok: false,
      issues,
      value: null,
    };
  }

  // Zod 스키마 검증
  const parsed = calculationInputsSchema.safeParse(data);

  if (!parsed.success) {
    // Zod 에러를 ValidationIssue로 변환
    const zodIssues = zodErrorToIssues(parsed.error);
    issues.push(...zodIssues);

    return {
      ok: false,
      issues,
      value: null,
    };
  }

  // 검증 성공
  return {
    ok: true,
    issues: [],
    value: parsed.data as CalculationInputs,
  };
}

/**
 * 중복 행 검출 (다중 데이터 Import 시 사용)
 *
 * @param dataList - 검증할 데이터 배열
 * @returns 중복 인덱스 목록
 */
export function detectDuplicates(dataList: Record<string, unknown>[]): number[] {
  const seen = new Set<string>();
  const duplicateIndices: number[] = [];

  for (let i = 0; i < dataList.length; i++) {
    const data = dataList[i];
    // 주요 필드로 유니크 키 생성
    const key = `${data.price}-${data.unitCost}-${data.fixedCost}`;

    if (seen.has(key)) {
      duplicateIndices.push(i);
    } else {
      seen.add(key);
    }
  }

  return duplicateIndices;
}
