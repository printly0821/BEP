import type { Hono } from 'hono';
import {
  failure,
  respond,
  type ErrorResult,
} from '@/backend/http/response';
import {
  getLogger,
  getSupabase,
  type AppEnv,
} from '@/backend/hono/context';
import {
  SaveProjectBodySchema,
  UpdateProjectBodySchema,
} from '@/features/projects/backend/schema';
import {
  saveProject,
  listProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '@/features/projects/backend/service';
import {
  projectErrorCodes,
  type ProjectServiceError,
} from '@/features/projects/backend/error';

/**
 * 프로젝트 관련 라우트 등록
 */
export const registerProjectRoutes = (app: Hono<AppEnv>) => {
  /**
   * POST /api/projects
   * 프로젝트 저장 엔드포인트
   */
  app.post('/projects', async (c) => {
    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // 사용자 인증 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return respond(
        c,
        failure(
          401,
          projectErrorCodes.unauthorized,
          'User is not authenticated.',
        ),
      );
    }

    // 요청 바디 파싱 및 검증
    let body: unknown;
    try {
      body = await c.req.json();
    } catch (err) {
      return respond(
        c,
        failure(
          400,
          projectErrorCodes.validationError,
          'Invalid JSON in request body.',
        ),
      );
    }

    const parsedBody = SaveProjectBodySchema.safeParse(body);

    if (!parsedBody.success) {
      return respond(
        c,
        failure(
          400,
          projectErrorCodes.validationError,
          'The provided project data is invalid.',
          parsedBody.error.format(),
        ),
      );
    }

    // 프로젝트 저장
    const result = await saveProject(supabase, user.id, parsedBody.data);

    if (!result.ok) {
      const errorResult = result as ErrorResult<ProjectServiceError, unknown>;

      if (errorResult.error.code === projectErrorCodes.saveError) {
        logger.error('Failed to save project', errorResult.error.message);
      }

      return respond(c, result);
    }

    return respond(c, result);
  });

  /**
   * GET /api/projects
   * 프로젝트 목록 조회 엔드포인트
   */
  app.get('/projects', async (c) => {
    const supabase = getSupabase(c);
    const logger = getLogger(c);

    // 사용자 인증 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return respond(
        c,
        failure(
          401,
          projectErrorCodes.unauthorized,
          'User is not authenticated.',
        ),
      );
    }

    // 프로젝트 목록 조회
    const result = await listProjects(supabase, user.id);

    if (!result.ok) {
      const errorResult = result as ErrorResult<ProjectServiceError, unknown>;

      if (errorResult.error.code === projectErrorCodes.fetchError) {
        logger.error('Failed to fetch projects', errorResult.error.message);
      }

      return respond(c, result);
    }

    return respond(c, result);
  });

  /**
   * GET /api/projects/:id
   * 프로젝트 상세 조회 엔드포인트
   */
  app.get('/projects/:id', async (c) => {
    const supabase = getSupabase(c);
    const logger = getLogger(c);
    const projectId = c.req.param('id');

    // 사용자 인증 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return respond(
        c,
        failure(
          401,
          projectErrorCodes.unauthorized,
          'User is not authenticated.',
        ),
      );
    }

    // 프로젝트 상세 조회
    const result = await getProjectById(supabase, user.id, projectId);

    if (!result.ok) {
      const errorResult = result as ErrorResult<ProjectServiceError, unknown>;

      if (errorResult.error.code === projectErrorCodes.fetchError) {
        logger.error('Failed to fetch project', errorResult.error.message);
      }

      return respond(c, result);
    }

    return respond(c, result);
  });

  /**
   * PATCH /api/projects/:id
   * 프로젝트 수정 엔드포인트 (이름 변경)
   */
  app.patch('/projects/:id', async (c) => {
    const supabase = getSupabase(c);
    const logger = getLogger(c);
    const projectId = c.req.param('id');

    // 사용자 인증 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return respond(
        c,
        failure(
          401,
          projectErrorCodes.unauthorized,
          'User is not authenticated.',
        ),
      );
    }

    // 요청 바디 파싱 및 검증
    let body: unknown;
    try {
      body = await c.req.json();
    } catch (err) {
      return respond(
        c,
        failure(
          400,
          projectErrorCodes.validationError,
          'Invalid JSON in request body.',
        ),
      );
    }

    const parsedBody = UpdateProjectBodySchema.safeParse(body);

    if (!parsedBody.success) {
      return respond(
        c,
        failure(
          400,
          projectErrorCodes.validationError,
          'The provided update data is invalid.',
          parsedBody.error.format(),
        ),
      );
    }

    // 프로젝트 업데이트
    const result = await updateProject(supabase, user.id, projectId, parsedBody.data);

    if (!result.ok) {
      const errorResult = result as ErrorResult<ProjectServiceError, unknown>;

      if (errorResult.error.code === projectErrorCodes.updateError) {
        logger.error('Failed to update project', errorResult.error.message);
      }

      return respond(c, result);
    }

    return respond(c, result);
  });

  /**
   * DELETE /api/projects/:id
   * 프로젝트 삭제 엔드포인트
   */
  app.delete('/projects/:id', async (c) => {
    const supabase = getSupabase(c);
    const logger = getLogger(c);
    const projectId = c.req.param('id');

    // 사용자 인증 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return respond(
        c,
        failure(
          401,
          projectErrorCodes.unauthorized,
          'User is not authenticated.',
        ),
      );
    }

    // 프로젝트 삭제
    const result = await deleteProject(supabase, user.id, projectId);

    if (!result.ok) {
      const errorResult = result as ErrorResult<ProjectServiceError, unknown>;

      if (errorResult.error.code === projectErrorCodes.deleteError) {
        logger.error('Failed to delete project', errorResult.error.message);
      }

      return respond(c, result);
    }

    return respond(c, result);
  });
};
