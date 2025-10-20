import { createMiddleware } from 'hono/factory';
import { createServerClient } from '@supabase/ssr';
import { getCookie } from 'hono/cookie';
import {
  contextKeys,
  type AppEnv,
} from '@/backend/hono/context';

// 쿠키 파싱 함수를 미들웨어 외부로 이동하여 최적화
const parseCookies = (cookieHeader: string | undefined): Array<{ name: string; value: string }> => {
  if (!cookieHeader) return [];

  const cookies: Array<{ name: string; value: string }> = [];
  const cookiePairs = cookieHeader.split(';');

  for (const cookiePair of cookiePairs) {
    const trimmedPair = cookiePair.trim();
    if (!trimmedPair) continue;

    const eqIndex = trimmedPair.indexOf('=');
    if (eqIndex === -1) continue;

    const name = trimmedPair.substring(0, eqIndex);
    const value = trimmedPair.substring(eqIndex + 1);

    if (name && value) {
      cookies.push({ name, value });
    }
  }

  return cookies;
};

// 쿠키 직렬화 최적화
const serializeCookie = (
  name: string,
  value: string,
  options?: {
    maxAge?: number;
    path?: string;
    domain?: string;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
    secure?: boolean;
    httpOnly?: boolean;
  }
): string => {
  const parts = [`${name}=${value}`];

  if (options?.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options?.path) parts.push(`Path=${options.path}`);
  if (options?.domain) parts.push(`Domain=${options.domain}`);
  if (options?.sameSite && typeof options.sameSite === 'string') {
    parts.push(`SameSite=${options.sameSite}`);
  }
  if (options?.secure) parts.push('Secure');
  if (options?.httpOnly) parts.push('HttpOnly');

  return parts.join('; ');
};

export const withSupabase = () =>
  createMiddleware<AppEnv>(async (c, next) => {
    const config = c.get(
      contextKeys.config,
    ) as AppEnv['Variables']['config'] | undefined;

    if (!config) {
      throw new Error('Application configuration is not available.');
    }

    // 쿠키 헤더를 한 번만 가져옴
    const cookieHeader = c.req.header('cookie');
    const parsedCookies = parseCookies(cookieHeader);

    // Supabase 클라이언트 생성 (최적화된 쿠키 핸들러)
    const client = createServerClient(
      config.supabase.url,
      config.supabase.anonKey,
      {
        cookies: {
          getAll() {
            return parsedCookies;
          },
          setAll(cookiesToSet) {
            // 배치로 쿠키 설정 (성능 최적화)
            for (const { name, value, options } of cookiesToSet) {
              const cookieValue = serializeCookie(name, value, options);
              c.header('Set-Cookie', cookieValue, { append: true });
            }
          },
        },
      }
    );

    c.set(contextKeys.supabase, client);

    await next();
  });
