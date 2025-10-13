/**
 * BEP 계산기 프로젝트 저장 기능 타입 정의
 *
 * 계산 입력값, 결과값, 민감도 분석 데이터를 포함하는
 * 프로젝트 데이터 구조를 정의합니다.
 */

/**
 * 계산 입력값 타입
 */
export type CalculationInputs = {
  /** 판매 단가 */
  price: number;
  /** 단위당 변동비 */
  unitCost: number;
  /** 고정비 */
  fixedCost: number;
  /** 목표 수익 (선택적) */
  targetProfit?: number;
};

/**
 * 계산 결과값 타입
 */
export type CalculationResults = {
  /** 손익분기점 판매량 */
  bepQuantity: number;
  /** 손익분기점 매출액 */
  bepRevenue: number;
  /** 공헌이익률 */
  marginRate: number;
  /** 목표 수익 달성 판매량 (선택적) */
  targetQuantity?: number;
};

/**
 * 민감도 분석 데이터 포인트
 */
export type SensitivityPoint = {
  /** 판매 단가 */
  price: number;
  /** 단위당 변동비 */
  unitCost: number;
  /** 손익분기점 */
  bep: number;
  /** 수익 */
  profit: number;
};

/**
 * 차트 메타데이터 (확장 가능)
 */
export type ChartsMeta = Record<string, unknown>;

/**
 * 계산 상태 전체 데이터 (v1 스키마)
 */
export type CalculationState = {
  /** 데이터 스키마 버전 */
  version: 'v1';
  /** 계산 입력값 */
  inputs: CalculationInputs;
  /** 계산 결과값 */
  results: CalculationResults;
  /** 민감도 분석 데이터 */
  sensitivity: SensitivityPoint[];
  /** 차트 메타데이터 (선택적) */
  chartsMeta?: ChartsMeta;
};

/**
 * 프로젝트 저장 요청 페이로드
 */
export type SaveProjectRequest = {
  /** 프로젝트명 */
  name: string;
  /** 로케일 (기본값: 'ko') */
  locale?: string;
} & CalculationState;

/**
 * 프로젝트 저장 응답
 */
export type SaveProjectResponse = {
  /** 생성된 프로젝트 ID */
  id: string;
};

/**
 * 프로젝트 엔티티 (DB 레코드)
 * DB에서 반환되는 snake_case 필드명 사용
 */
export type Project = {
  id: string;
  user_id: string;
  name: string;
  version: string;
  locale: string;
  input_json: CalculationInputs;
  result_json: CalculationResults;
  sensitivity_json: SensitivityPoint[] | null;
  created_at: string;
  updated_at: string;
};

/**
 * 프로젝트 목록 조회 응답
 * DB에서 반환되는 snake_case 필드명 사용
 */
export type ProjectListItem = {
  id: string;
  name: string;
  locale: string;
  created_at: string;
  updated_at: string;
};

/**
 * 프로젝트 상세 조회 응답
 */
export type ProjectDetail = Project;
