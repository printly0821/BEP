"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "@scalar/api-reference/style.css";

export default function ApiDocsScalarPage() {
  const [spec, setSpec] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (spec && typeof window !== "undefined") {
      // Scalar API Reference 렌더링
      import("@scalar/api-reference").then((module) => {
        const container = document.getElementById("scalar-container");
        if (container && module.default) {
          // Scalar 렌더링
          container.innerHTML = "";
          module.default(container, {
            spec: {
              content: spec,
            },
            configuration: {
              theme: "default",
              layout: "modern",
            },
          });
        }
      });
    }
  }, [spec]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              API 문서 (Scalar)
            </h1>
            <p className="text-muted-foreground">
              제작 의뢰서 API의 Scalar API Reference 문서입니다
            </p>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                💡 <strong>Swagger UI와 비교:</strong> Scalar은 더 현대적인 디자인과 React 19 호환성을 제공합니다.{" "}
                <a href="/api-docs" className="underline hover:text-blue-700">
                  Swagger UI 버전 보기
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
              <div id="scalar-container" className="min-h-[800px]" />
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
