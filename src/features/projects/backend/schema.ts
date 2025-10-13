import { z } from 'zod';

/**
 * 계산 입력값 스키마
 */
export const CalculationInputsSchema = z.object({
  price: z.number().positive({ message: '판매 단가는 양수여야 합니다.' }),
  unitCost: z
    .number()
    .nonnegative({ message: '단위당 변동비는 0 이상이어야 합니다.' }),
  fixedCost: z
    .number()
    .nonnegative({ message: '고정비는 0 이상이어야 합니다.' }),
  targetProfit: z
    .number()
    .nonnegative({ message: '목표 수익은 0 이상이어야 합니다.' })
    .optional(),
});

/**
 * 계산 결과값 스키마
 */
export const CalculationResultsSchema = z.object({
  bepQuantity: z.number(),
  bepRevenue: z.number(),
  marginRate: z.number(),
  targetQuantity: z.number().optional(),
});

/**
 * 민감도 분석 데이터 포인트 스키마
 */
export const SensitivityPointSchema = z.object({
  price: z.number(),
  unitCost: z.number(),
  bep: z.number(),
  profit: z.number(),
});

/**
 * 프로젝트 저장 요청 바디 스키마
 */
export const SaveProjectBodySchema = z.object({
  name: z
    .string()
    .min(1, { message: '프로젝트명은 최소 1자 이상이어야 합니다.' })
    .max(100, { message: '프로젝트명은 최대 100자까지 가능합니다.' }),
  locale: z.string().default('ko'),
  version: z.literal('v1'),
  inputs: CalculationInputsSchema,
  results: CalculationResultsSchema,
  sensitivity: z.array(SensitivityPointSchema),
  chartsMeta: z.record(z.unknown()).optional(),
});

export type SaveProjectBody = z.infer<typeof SaveProjectBodySchema>;

/**
 * 프로젝트 저장 응답 스키마
 */
export const SaveProjectResponseSchema = z.object({
  id: z.string().uuid(),
});

export type SaveProjectResponse = z.infer<typeof SaveProjectResponseSchema>;

/**
 * 프로젝트 업데이트 요청 바디 스키마
 */
export const UpdateProjectBodySchema = z.object({
  name: z
    .string()
    .min(1, { message: '프로젝트명은 최소 1자 이상이어야 합니다.' })
    .max(100, { message: '프로젝트명은 최대 100자까지 가능합니다.' }),
});

export type UpdateProjectBody = z.infer<typeof UpdateProjectBodySchema>;

/**
 * DB 테이블 Row 스키마
 */
export const ProjectRowSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string(),
  version: z.string(),
  locale: z.string(),
  input_json: z.any(), // JSONB 타입
  result_json: z.any(), // JSONB 타입
  sensitivity_json: z.any().nullable(), // JSONB 타입
  created_at: z.string(),
  updated_at: z.string(),
});

export type ProjectRow = z.infer<typeof ProjectRowSchema>;
