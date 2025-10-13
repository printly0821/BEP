/**
 * 책자 사양 검증 로직
 */

import type {
  BookletSpecification,
  BindingType,
  ValidationResult,
  BINDING_CONSTRAINTS,
} from "@/types/booklet";

/**
 * 책자 사양 전체 검증
 */
export function validateBookletSpecification(
  spec: BookletSpecification
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. 제본 방식별 페이지 제약 검증
  const bindingValidation = validateBindingConstraints(
    spec.binding.type,
    spec.inner.pageCount
  );
  if (!bindingValidation.valid) {
    errors.push(bindingValidation.error!);
  }
  if (bindingValidation.warnings) {
    warnings.push(...bindingValidation.warnings);
  }

  // 2. 총 페이지 수 검증
  const totalPageValidation = validateTotalPages(
    spec.totalPages,
    spec.inner.pageCount,
    spec.cover
  );
  if (!totalPageValidation.valid) {
    errors.push(totalPageValidation.error!);
  }

  // 3. 컬러 페이지 검증 (혼합 모드인 경우)
  if (spec.inner.colorMode === "mixed") {
    const colorPagesValidation = validateColorPages(
      spec.inner.colorPages,
      spec.inner.pageCount
    );
    if (!colorPagesValidation.valid) {
      errors.push(colorPagesValidation.error!);
    }
    if (colorPagesValidation.warnings) {
      warnings.push(...colorPagesValidation.warnings);
    }
  }

  // 4. 제본 위치 검증
  const positionValidation = validateBindingPosition(spec.binding.type, spec.binding.position);
  if (positionValidation.warnings) {
    warnings.push(...positionValidation.warnings);
  }

  // 최종 결과
  if (errors.length > 0) {
    return {
      valid: false,
      error: errors.join("; "),
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * 제본 방식별 페이지 제약 검증
 */
export function validateBindingConstraints(
  bindingType: BindingType,
  pageCount: number
): ValidationResult {
  const constraints = getBindingConstraints(bindingType);

  // 최소 페이지 검증
  if (pageCount < constraints.minPages) {
    return {
      valid: false,
      error: `${bindingType} 제본은 최소 ${constraints.minPages}페이지가 필요합니다 (현재: ${pageCount}p)`,
    };
  }

  // 최대 페이지 검증
  if (pageCount > constraints.maxPages) {
    return {
      valid: false,
      error: `${bindingType} 제본은 최대 ${constraints.maxPages}페이지까지 가능합니다 (현재: ${pageCount}p)`,
    };
  }

  // 페이지 배수 제약 검증 (중철은 4의 배수)
  if (constraints.pageMultiple && pageCount % constraints.pageMultiple !== 0) {
    return {
      valid: false,
      error: `${bindingType} 제본은 ${constraints.pageMultiple}의 배수 페이지가 필요합니다 (현재: ${pageCount}p)`,
    };
  }

  return { valid: true };
}

/**
 * 총 페이지 수 검증
 */
export function validateTotalPages(
  totalPages: number,
  innerPages: number,
  cover: BookletSpecification["cover"]
): ValidationResult {
  // 표지 페이지 계산
  const coverPages = cover.printing === "double" ? 4 : 2;
  const expectedTotal = innerPages + coverPages;

  if (totalPages !== expectedTotal) {
    return {
      valid: false,
      error: `총 페이지 수가 일치하지 않습니다 (표지 ${coverPages}p + 내지 ${innerPages}p = ${expectedTotal}p, 입력값: ${totalPages}p)`,
    };
  }

  return { valid: true };
}

/**
 * 컬러 페이지 검증
 */
export function validateColorPages(
  colorPages: number[] | undefined,
  totalInnerPages: number
): ValidationResult {
  const warnings: string[] = [];

  if (!colorPages || colorPages.length === 0) {
    return {
      valid: false,
      error: "혼합 모드에서는 컬러 페이지 번호를 지정해야 합니다",
    };
  }

  // 페이지 번호 범위 검증
  const invalidPages = colorPages.filter(
    (page) => page < 1 || page > totalInnerPages
  );
  if (invalidPages.length > 0) {
    return {
      valid: false,
      error: `잘못된 페이지 번호: ${invalidPages.join(", ")} (전체 페이지: ${totalInnerPages}p)`,
    };
  }

  // 중복 페이지 검증
  const uniquePages = Array.from(new Set(colorPages));
  if (uniquePages.length !== colorPages.length) {
    warnings.push("중복된 페이지 번호가 제거되었습니다");
  }

  // 컬러 페이지 비율 경고
  const colorRatio = (colorPages.length / totalInnerPages) * 100;
  if (colorRatio > 80) {
    warnings.push(
      `컬러 페이지 비율이 ${colorRatio.toFixed(1)}%입니다. 전체 컬러 인쇄를 고려해보세요`
    );
  } else if (colorRatio < 20) {
    warnings.push(
      `컬러 페이지 비율이 ${colorRatio.toFixed(1)}%입니다. 혼합 모드가 효율적인지 확인해보세요`
    );
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * 제본 위치 검증
 */
export function validateBindingPosition(
  bindingType: BindingType,
  position: BookletSpecification["binding"]["position"]
): ValidationResult {
  const warnings: string[] = [];

  // 일반적인 제본 위치가 아닌 경우 경고
  if (position === "top" && bindingType !== "coil" && bindingType !== "twin_ring") {
    warnings.push(
      `${bindingType} 제본에서는 위쪽 제본이 일반적이지 않습니다`
    );
  }

  if (position === "right") {
    warnings.push("오른쪽 제본은 특수한 경우에만 사용됩니다");
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * 제본 방식별 제약 조건 조회
 */
export function getBindingConstraints(bindingType: BindingType) {
  const constraints: Record<
    BindingType,
    { minPages: number; maxPages: number; pageMultiple?: number }
  > = {
    wireless: { minPages: 10, maxPages: 300 },
    stapled: { minPages: 4, maxPages: 32, pageMultiple: 4 },
    twin_ring: { minPages: 2, maxPages: 200 },
    coil: { minPages: 2, maxPages: 130 },
    thread: { minPages: 40, maxPages: 300 },
    exposed_thread: { minPages: 20, maxPages: 200 },
    lay_flat: { minPages: 20, maxPages: 50 },
  };

  return constraints[bindingType];
}

/**
 * 페이지 수를 제본 방식에 맞게 조정
 */
export function adjustPageCount(
  pageCount: number,
  bindingType: BindingType
): number {
  const constraints = getBindingConstraints(bindingType);

  // 최소값 보다 작으면 최소값으로
  if (pageCount < constraints.minPages) {
    return constraints.minPages;
  }

  // 최대값 보다 크면 최대값으로
  if (pageCount > constraints.maxPages) {
    return constraints.maxPages;
  }

  // 배수 제약이 있으면 조정
  if (constraints.pageMultiple) {
    const remainder = pageCount % constraints.pageMultiple;
    if (remainder !== 0) {
      // 올림 처리
      return pageCount + (constraints.pageMultiple - remainder);
    }
  }

  return pageCount;
}
