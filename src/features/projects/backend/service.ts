import type { SupabaseClient } from '@supabase/supabase-js';
import {
  failure,
  success,
  type HandlerResult,
} from '@/backend/http/response';
import {
  ProjectRowSchema,
  SaveProjectResponseSchema,
  UpdateProjectBodySchema,
  type SaveProjectBody,
  type SaveProjectResponse,
  type UpdateProjectBody,
} from '@/features/projects/backend/schema';
import {
  projectErrorCodes,
  type ProjectServiceError,
} from '@/features/projects/backend/error';

const PROJECTS_TABLE = 'projects';

/**
 * 프로젝트 저장 서비스
 *
 * @param client Supabase 클라이언트
 * @param userId 인증된 사용자 ID
 * @param body 프로젝트 저장 요청 데이터
 * @returns 생성된 프로젝트 ID 또는 에러
 */
export const saveProject = async (
  client: SupabaseClient,
  userId: string,
  body: SaveProjectBody,
): Promise<
  HandlerResult<SaveProjectResponse, ProjectServiceError, unknown>
> => {
  // DB에 저장할 페이로드 구성
  const payload = {
    user_id: userId,
    name: body.name,
    version: body.version,
    locale: body.locale,
    input_json: body.inputs,
    result_json: body.results,
    sensitivity_json: body.sensitivity,
  };

  // Supabase insert 실행
  const { data, error } = await client
    .from(PROJECTS_TABLE)
    .insert(payload)
    .select('id')
    .single();

  if (error) {
    return failure(
      500,
      projectErrorCodes.saveError,
      `Failed to save project: ${error.message}`,
    );
  }

  if (!data) {
    return failure(
      500,
      projectErrorCodes.saveError,
      'Project was not created',
    );
  }

  // 응답 검증
  const parsed = SaveProjectResponseSchema.safeParse(data);

  if (!parsed.success) {
    return failure(
      500,
      projectErrorCodes.validationError,
      'Save project response failed validation.',
      parsed.error.format(),
    );
  }

  return success(parsed.data, 201);
};

/**
 * 프로젝트 목록 조회 서비스
 *
 * @param client Supabase 클라이언트
 * @param userId 인증된 사용자 ID
 * @returns 사용자의 프로젝트 목록
 */
export const listProjects = async (
  client: SupabaseClient,
  userId: string,
): Promise<HandlerResult<any[], ProjectServiceError, unknown>> => {
  const { data, error } = await client
    .from(PROJECTS_TABLE)
    .select('id, name, locale, created_at, updated_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return failure(
      500,
      projectErrorCodes.fetchError,
      `Failed to fetch projects: ${error.message}`,
    );
  }

  return success(data ?? []);
};

/**
 * 프로젝트 상세 조회 서비스
 *
 * @param client Supabase 클라이언트
 * @param userId 인증된 사용자 ID
 * @param projectId 프로젝트 ID
 * @returns 프로젝트 상세 정보
 */
export const getProjectById = async (
  client: SupabaseClient,
  userId: string,
  projectId: string,
): Promise<HandlerResult<any, ProjectServiceError, unknown>> => {
  const { data, error } = await client
    .from(PROJECTS_TABLE)
    .select('*')
    .eq('id', projectId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    return failure(
      500,
      projectErrorCodes.fetchError,
      `Failed to fetch project: ${error.message}`,
    );
  }

  if (!data) {
    return failure(404, projectErrorCodes.notFound, 'Project not found');
  }

  const rowParse = ProjectRowSchema.safeParse(data);

  if (!rowParse.success) {
    return failure(
      500,
      projectErrorCodes.validationError,
      'Project row failed validation.',
      rowParse.error.format(),
    );
  }

  return success(rowParse.data);
};

/**
 * 프로젝트 업데이트 서비스 (이름 수정)
 *
 * @param client Supabase 클라이언트
 * @param userId 인증된 사용자 ID
 * @param projectId 프로젝트 ID
 * @param body 업데이트 요청 데이터
 * @returns 업데이트 성공 여부
 */
export const updateProject = async (
  client: SupabaseClient,
  userId: string,
  projectId: string,
  body: UpdateProjectBody,
): Promise<HandlerResult<{ id: string }, ProjectServiceError, unknown>> => {
  const { data, error } = await client
    .from(PROJECTS_TABLE)
    .update({ name: body.name })
    .eq('id', projectId)
    .eq('user_id', userId)
    .select('id')
    .maybeSingle();

  if (error) {
    return failure(
      500,
      projectErrorCodes.updateError,
      `Failed to update project: ${error.message}`,
    );
  }

  if (!data) {
    return failure(404, projectErrorCodes.notFound, 'Project not found or unauthorized');
  }

  return success({ id: data.id });
};

/**
 * 프로젝트 삭제 서비스
 *
 * @param client Supabase 클라이언트
 * @param userId 인증된 사용자 ID
 * @param projectId 프로젝트 ID
 * @returns 삭제 성공 여부
 */
export const deleteProject = async (
  client: SupabaseClient,
  userId: string,
  projectId: string,
): Promise<HandlerResult<{ id: string }, ProjectServiceError, unknown>> => {
  const { data, error } = await client
    .from(PROJECTS_TABLE)
    .delete()
    .eq('id', projectId)
    .eq('user_id', userId)
    .select('id')
    .maybeSingle();

  if (error) {
    return failure(
      500,
      projectErrorCodes.deleteError,
      `Failed to delete project: ${error.message}`,
    );
  }

  if (!data) {
    return failure(404, projectErrorCodes.notFound, 'Project not found or unauthorized');
  }

  return success({ id: data.id });
};
