"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Swagger UI를 동적으로 로드하여 SSR 이슈 및 Strict Mode 경고 방지
const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-16">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Swagger UI 로딩 중...</p>
      </div>
    </div>
  ),
});

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // React Strict Mode 경고 억제 (swagger-ui-react 라이브러리 이슈)
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === "string" &&
        (args[0].includes("UNSAFE_componentWillReceiveProps") ||
          args[0].includes("ModelCollapse"))
      ) {
        // swagger-ui-react 라이브러리 내부 경고 무시
        return;
      }
      originalConsoleError.apply(console, args);
    };

    const fetchSpec = async () => {
      try {
        const response = await fetch("/api/swagger");
        if (!response.ok) {
          throw new Error("Failed to fetch API specification");
        }
        const data = await response.json();
        setSpec(data);
      } catch (err) {
        console.error("Swagger 불러오기 실패:", err);
        setError(
          err instanceof Error ? err.message : "Unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpec();

    // cleanup: 원래 console.error 복원
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              API 문서 (Swagger UI)
            </h1>
            <p className="text-muted-foreground">
              제작 의뢰서 API의 Swagger/OpenAPI 문서입니다
            </p>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                💡 <strong>새로운 버전:</strong> 더 현대적인 디자인을 원하시나요?{" "}
                <a href="/api-docs-scalar" className="underline hover:text-blue-700">
                  Scalar API Reference 버전 보기
                </a>
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">문서를 불러오는 중...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-lg">
              <p className="font-semibold">오류 발생</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          ) : spec ? (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <SwaggerUI spec={spec} />
            </div>
          ) : (
            <div className="text-center p-16">
              <p className="text-muted-foreground">문서를 불러올 수 없습니다.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
