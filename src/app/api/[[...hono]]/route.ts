import { createHonoApp } from '@/backend/hono/app';

const app = createHonoApp();

export const runtime = 'nodejs';

// Next.js 15 호환 핸들러
const handler = async (req: Request) => {
  return app.fetch(req);
};

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as OPTIONS };
