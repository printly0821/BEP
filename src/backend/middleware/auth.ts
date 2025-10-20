import { createMiddleware } from 'hono/factory';
import {
  contextKeys,
  type AppEnv,
} from '@/backend/hono/context';
import { failure, respond } from '@/backend/http/response';

/**
 * 인증 미들웨어
 *
 * Supabase auth.getUser() 대신 JWT 토큰을 로컬에서 검증하여
 * 네트워크 왕복 시간을 제거하고 응답 속도를 크게 개선
 */
export const requireAuth = () =>
  createMiddleware<AppEnv>(async (c, next) => {
    const supabase = c.get(contextKeys.supabase);

    // getUser() 대신 getSession() 사용
    // getSession()은 로컬 JWT 검증만 수행 (네트워크 호출 없음)
    // getUser()는 Supabase API를 호출하여 네트워크 지연 발생
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session || !session.user) {
      return respond(
        c,
        failure(
          401,
          'UNAUTHORIZED',
          'User is not authenticated.',
        ),
      );
    }

    // 세션의 user 객체를 context에 저장하여 라우트에서 재사용
    c.set(contextKeys.user, session.user);

    await next();
  });
