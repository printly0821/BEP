/**
 * 숫자 정규화 유틸리티
 *
 * 다양한 로케일의 숫자 형식(쉼표, 통화기호, 공백 등)을 정규화하여
 * 안전한 JavaScript number로 변환합니다.
 */

/**
 * 문자열에서 숫자가 아닌 문자를 제거하고 정규화
 *
 * 지원하는 형식:
 * - "1,234,567" → "1234567"
 * - "₩1,000" → "1000"
 * - "123 456" → "123456"
 * - "-500" → "-500"
 * - "1.5" → "1.5"
 *
 * @param value - 정규화할 문자열
 * @returns 정규화된 숫자 문자열
 */
export function normalizeNumberString(value: string): string {
  if (typeof value !== 'string') {
    return String(value);
  }

  // 모든 공백, 쉼표, 통화기호 제거
  // 숫자(0-9), 마이너스(-), 소수점(.)만 유지
  const normalized = value.replace(/[^0-9.-]/g, '');

  return normalized;
}

/**
 * 안전하게 숫자로 파싱
 *
 * @param value - 파싱할 값 (string | number | unknown)
 * @returns 파싱된 숫자 또는 NaN
 */
export function safeParseNumber(value: unknown): number {
  // 이미 숫자면 그대로 반환
  if (typeof value === 'number') {
    return value;
  }

  // 문자열이면 정규화 후 파싱
  if (typeof value === 'string') {
    const normalized = normalizeNumberString(value);
    const parsed = Number(normalized);
    return parsed;
  }

  // null, undefined 등은 NaN 반환
  return NaN;
}

/**
 * 숫자 파싱 결과
 */
export interface ParseNumberResult {
  /** 파싱 성공 여부 */
  success: boolean;
  /** 파싱된 숫자 (실패 시 undefined) */
  value?: number;
  /** 에러 메시지 (실패 시) */
  error?: string;
}

/**
 * 숫자 파싱 및 검증
 *
 * @param value - 파싱할 값
 * @param options - 검증 옵션
 * @returns ParseNumberResult
 */
export function parseNumber(
  value: unknown,
  options?: {
    /** 최소값 (inclusive) */
    min?: number;
    /** 최대값 (inclusive) */
    max?: number;
    /** 양수만 허용 (0 제외) */
    positive?: boolean;
    /** 음이 아닌 수만 허용 (0 포함) */
    nonnegative?: boolean;
    /** 정수만 허용 */
    integer?: boolean;
  }
): ParseNumberResult {
  const parsed = safeParseNumber(value);

  // NaN 체크
  if (isNaN(parsed)) {
    return {
      success: false,
      error: '올바른 숫자 형식이 아닙니다.',
    };
  }

  // Infinity 체크
  if (!isFinite(parsed)) {
    return {
      success: false,
      error: '유한한 숫자여야 합니다.',
    };
  }

  // 양수 체크
  if (options?.positive && parsed <= 0) {
    return {
      success: false,
      error: '0보다 큰 숫자여야 합니다.',
    };
  }

  // 음이 아닌 수 체크
  if (options?.nonnegative && parsed < 0) {
    return {
      success: false,
      error: '0 이상의 숫자여야 합니다.',
    };
  }

  // 최소값 체크
  if (options?.min !== undefined && parsed < options.min) {
    return {
      success: false,
      error: `${options.min} 이상이어야 합니다.`,
    };
  }

  // 최대값 체크
  if (options?.max !== undefined && parsed > options.max) {
    return {
      success: false,
      error: `${options.max} 이하여야 합니다.`,
    };
  }

  // 정수 체크
  if (options?.integer && !Number.isInteger(parsed)) {
    return {
      success: false,
      error: '정수여야 합니다.',
    };
  }

  return {
    success: true,
    value: parsed,
  };
}
