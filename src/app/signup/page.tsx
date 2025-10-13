"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

const defaultFormState = {
  email: "",
  password: "",
  confirmPassword: "",
};

type SignupPageProps = {
  params: Promise<Record<string, never>>;
};

export default function SignupPage({ params }: SignupPageProps) {
  void params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, refresh } = useCurrentUser();
  const [formState, setFormState] = useState(defaultFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectedFrom = searchParams.get("redirectedFrom") ?? "/";
      router.replace(redirectedFrom);
    }
  }, [isAuthenticated, router, searchParams]);

  const isSubmitDisabled = useMemo(
    () =>
      !formState.email.trim() ||
      !formState.password.trim() ||
      formState.password !== formState.confirmPassword,
    [formState.confirmPassword, formState.email, formState.password]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setFormState((previous) => ({ ...previous, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);
      setErrorMessage(null);
      setInfoMessage(null);

      if (formState.password !== formState.confirmPassword) {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
        setIsSubmitting(false);
        return;
      }

      const supabase = getSupabaseBrowserClient();

      try {
        const result = await supabase.auth.signUp({
          email: formState.email,
          password: formState.password,
        });

        if (result.error) {
          setErrorMessage(result.error.message ?? "회원가입에 실패했습니다.");
          setIsSubmitting(false);
          return;
        }

        await refresh();

        const redirectedFrom = searchParams.get("redirectedFrom") ?? "/";

        if (result.data.session) {
          router.replace(redirectedFrom);
          return;
        }

        setInfoMessage(
          "확인 이메일을 보냈습니다. 이메일 인증 후 로그인해 주세요."
        );
        router.prefetch("/login");
        setFormState(defaultFormState);
      } catch (error) {
        setErrorMessage("회원가입 처리 중 문제가 발생했습니다.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState.confirmPassword, formState.email, formState.password, refresh, router, searchParams]
  );

  const handleGoogleLogin = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    const redirectedFrom = searchParams.get("redirectedFrom") ?? "/calculator";

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectedFrom=${redirectedFrom}`,
      },
    });
  }, [searchParams]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-10 bg-background px-6 py-16">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold text-primary">회원가입</h1>
        <p className="text-muted-foreground">
          계정을 만들고 손익분기점 계산기를 시작하세요.
        </p>
      </header>
      <div className="grid w-full gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          {/* Google 로그인 버튼 */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="flex items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google로 시작하기
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">또는</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* 이메일 회원가입 폼 */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm"
          >
            <label className="flex flex-col gap-2 text-sm text-foreground">
              이메일
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={formState.email}
                onChange={handleChange}
                className="rounded-lg border border-input bg-background px-3 py-2 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-foreground">
              비밀번호
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                required
                value={formState.password}
                onChange={handleChange}
                className="rounded-lg border border-input bg-background px-3 py-2 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-foreground">
              비밀번호 확인
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                required
                value={formState.confirmPassword}
                onChange={handleChange}
                className="rounded-lg border border-input bg-background px-3 py-2 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              />
            </label>
            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
            {infoMessage ? (
              <p className="text-sm text-accent">{infoMessage}</p>
            ) : null}
            <button
              type="submit"
              disabled={isSubmitting || isSubmitDisabled}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "등록 중" : "회원가입"}
            </button>
            <p className="text-xs text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login"
                className="font-medium text-secondary underline hover:text-secondary/80"
              >
                로그인으로 이동
              </Link>
            </p>
          </form>
        </div>
        <figure className="overflow-hidden rounded-lg border border-border">
          <Image
            src="https://picsum.photos/seed/signup/640/640"
            alt="회원가입"
            width={640}
            height={640}
            className="h-full w-full object-cover"
            priority
          />
        </figure>
      </div>
    </div>
  );
}
