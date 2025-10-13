import { createMiddleware } from 'hono/factory';
import { createServerClient } from '@supabase/ssr';
import { getCookie } from 'hono/cookie';
import {
  contextKeys,
  type AppEnv,
} from '@/backend/hono/context';

export const withSupabase = () =>
  createMiddleware<AppEnv>(async (c, next) => {
    const config = c.get(
      contextKeys.config,
    ) as AppEnv['Variables']['config'] | undefined;

    if (!config) {
      throw new Error('Application configuration is not available.');
    }

    // Hono 컨텍스트에서 쿠키를 읽어서 Supabase 서버 클라이언트 생성
    const client = createServerClient(
      config.supabase.url,
      config.supabase.anonKey,
      {
        cookies: {
          getAll() {
            // Hono에서 모든 쿠키를 읽어서 Supabase 형식으로 변환
            const cookieHeader = c.req.header('cookie');
            if (!cookieHeader) return [];

            return cookieHeader.split(';').map((cookie) => {
              const [name, ...rest] = cookie.trim().split('=');
              return {
                name: name.trim(),
                value: rest.join('=').trim(),
              };
            });
          },
          setAll(cookiesToSet) {
            // 쿠키 설정 (응답 헤더에 추가)
            cookiesToSet.forEach(({ name, value, options }) => {
              let cookieValue = `${name}=${value}`;

              if (options?.maxAge) {
                cookieValue += `; Max-Age=${options.maxAge}`;
              }
              if (options?.path) {
                cookieValue += `; Path=${options.path}`;
              }
              if (options?.domain) {
                cookieValue += `; Domain=${options.domain}`;
              }
              if (options?.sameSite) {
                cookieValue += `; SameSite=${options.sameSite}`;
              }
              if (options?.secure) {
                cookieValue += '; Secure';
              }
              if (options?.httpOnly) {
                cookieValue += '; HttpOnly';
              }

              c.header('Set-Cookie', cookieValue, { append: true });
            });
          },
        },
      }
    );

    c.set(contextKeys.supabase, client);

    await next();
  });
