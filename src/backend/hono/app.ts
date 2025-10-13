import { Hono } from 'hono';
import { errorBoundary } from '@/backend/middleware/error';
import { withAppContext } from '@/backend/middleware/context';
import { withSupabase } from '@/backend/middleware/supabase';
import { registerExampleRoutes } from '@/features/example/backend/route';
import { registerProjectRoutes } from '@/features/projects/backend/route';
import type { AppEnv } from '@/backend/hono/context';

export const createHonoApp = () => {
  const app = new Hono<AppEnv>().basePath('/api');

  // 테스트 라우트
  app.get('/health', (c) => c.json({ status: 'ok', message: 'Hono is working' }));

  app.use('*', errorBoundary());
  app.use('*', withAppContext());
  app.use('*', withSupabase());

  registerExampleRoutes(app);
  registerProjectRoutes(app);

  return app;
};
