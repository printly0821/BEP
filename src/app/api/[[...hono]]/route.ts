import { createHonoApp } from '@/backend/hono/app';

const app = createHonoApp();

// Node.js Runtime으로 설정하여 모든 의존성 호환성 확보
export const runtime = 'nodejs';

// 타임아웃을 60초로 설정하여 504 에러 방지
// 최적화된 인증(getSession), 쿠키 파싱으로 대부분 100-300ms 내에 응답
export const maxDuration = 60;

// Next.js 15 호환 핸들러
const handler = async (req: Request) => {
  return app.fetch(req);
};

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as OPTIONS };
