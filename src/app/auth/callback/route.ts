import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/constants/env";

/**
 * OAuth 및 매직 링크 인증 후 콜백 핸들러
 * 인증 코드를 세션으로 교환하고 사용자를 리다이렉트합니다.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // 에러가 있는 경우 로그인 페이지로 리다이렉트
  if (errorParam) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", errorDescription ?? errorParam);
    return NextResponse.redirect(loginUrl);
  }

  // 인증 코드가 없는 경우
  if (!code) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", "인증 코드가 없습니다.");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const response = NextResponse.redirect(new URL(next, origin));

    const supabase = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // 요청 쿠키와 응답 쿠키 모두 업데이트
              request.cookies.set({ name, value, ...options });
              response.cookies.set({ name, value, ...options });
            });
          },
        },
      }
    );

    // 인증 코드를 세션으로 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("OAuth callback error:", error);
      const loginUrl = new URL("/login", origin);
      loginUrl.searchParams.set(
        "error",
        error.message ?? "인증에 실패했습니다."
      );
      return NextResponse.redirect(loginUrl);
    }

    return response;
  } catch (error) {
    console.error("OAuth callback exception:", error);
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", "인증 처리 중 오류가 발생했습니다.");
    return NextResponse.redirect(loginUrl);
  }
}
