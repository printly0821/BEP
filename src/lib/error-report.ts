/**
 * 에러 리포트 생성 및 다운로드
 *
 * 유효성 검증 실패 시 사용자가 다운로드 가능한
 * CSV 에러 리포트를 생성합니다.
 */

import type { ValidationIssue } from './excel-validator';

/**
 * ValidationIssue 배열을 CSV 문자열로 변환
 *
 * @param issues - ValidationIssue 배열
 * @returns CSV 형식 문자열
 */
export function generateErrorCsv(issues: ValidationIssue[]): string {
  // UTF-8 BOM (Excel 한글 호환)
  const BOM = '\uFEFF';

  // CSV 헤더
  const header = '에러 코드,필드명,메시지\n';

  // CSV 본문
  const rows = issues.map((issue) => {
    const code = issue.code;
    const field = issue.field || '';
    // CSV 이스케이프: 쉼표, 줄바꿈, 따옴표 처리
    const message = escapeCsvField(issue.message);

    return `${code},${field},${message}`;
  }).join('\n');

  return BOM + header + rows;
}

/**
 * CSV 필드 이스케이프
 *
 * 쉼표, 줄바꿈, 따옴표가 포함된 경우 따옴표로 감싸고
 * 내부 따옴표는 이중 따옴표로 처리
 *
 * @param field - CSV 필드 값
 * @returns 이스케이프된 필드 값
 */
function escapeCsvField(field: string): string {
  // 쉼표, 줄바꿈, 따옴표가 없으면 그대로 반환
  if (!/[",\n\r]/.test(field)) {
    return field;
  }

  // 따옴표를 이중 따옴표로 이스케이프
  const escaped = field.replace(/"/g, '""');

  // 전체를 따옴표로 감싸기
  return `"${escaped}"`;
}

/**
 * CSV 문자열을 Blob으로 변환하고 다운로드
 *
 * @param csvContent - CSV 문자열
 * @param fileName - 다운로드 파일명 (기본: error-report.csv)
 */
export function downloadErrorCsv(csvContent: string, fileName = 'error-report.csv'): void {
  // Blob 생성 (UTF-8)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Blob URL 생성
  const url = URL.createObjectURL(blob);

  // 임시 <a> 태그 생성 및 클릭
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // 정리
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * ValidationIssue 배열을 CSV 파일로 다운로드
 *
 * @param issues - ValidationIssue 배열
 * @param fileName - 다운로드 파일명 (기본: error-report.csv)
 */
export function downloadValidationErrors(
  issues: ValidationIssue[],
  fileName = 'validation-errors.csv'
): void {
  const csv = generateErrorCsv(issues);
  downloadErrorCsv(csv, fileName);
}
