"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { LogOut } from "lucide-react";

export function Header() {
  const { user, isAuthenticated, isLoading } = useCurrentUser();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-foreground">
            쉬잇크루
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/calculator"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              계산기
            </Link>
            <Link
              href="/projects"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              프로젝트
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              요금제
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {isLoading ? (
            <span className="text-sm text-muted-foreground">로딩 중...</span>
          ) : isAuthenticated && user ? (
            <>
              <span className="text-sm text-foreground hidden md:inline">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">대시보드</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">시작하기</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
