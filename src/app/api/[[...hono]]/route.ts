import { createHonoApp } from '@/backend/hono/app';

const app = createHonoApp();

// Edge Runtime으로 변경하여 응답 시간 단축 및 콜드 스타트 개선
export const runtime = 'edge';

// Edge Runtime에서는 maxDuration을 명시적으로 설정할 수 없지만
// 기본적으로 25초 타임아웃이 적용됨 (Node.js 10초보다 긴 시간)
// 추가로 Edge Runtime은 콜드 스타트가 거의 없어 응답 속도가 빠름

// Next.js 15 호환 핸들러
const handler = async (req: Request) => {
  return app.fetch(req);
};

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as OPTIONS };
