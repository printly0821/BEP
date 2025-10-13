'use client';

import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useProjectQuery } from '@/features/projects/hooks/useProjectQuery';
import { useLoadProject } from '@/features/projects/hooks/useLoadProject';
import { Loader2, Download, Calculator } from 'lucide-react';

interface ProjectDetailSheetProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 프로젝트 상세 Sheet 컴포넌트
 *
 * 프로젝트의 상세 정보를 Sheet 형태로 표시합니다.
 * Design Guide: Sheet 컴포넌트 사용
 */
export function ProjectDetailSheet({
  projectId,
  open,
  onOpenChange,
}: ProjectDetailSheetProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: project, isLoading, error } = useProjectQuery(projectId);
  const { mutate: loadProject, isPending: isLoadingProject } = useLoadProject();

  const handleLoadToCalculator = () => {
    if (!project) return;

    loadProject(projectId, {
      onSuccess: () => {
        toast({
          title: '불러오기 완료',
          description: `프로젝트 "${project.name}"의 데이터를 계산기에 불러왔습니다.`,
        });
        router.push('/calculator');
      },
      onError: (error) => {
        toast({
          title: '불러오기 실패',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-heading-2">프로젝트 상세</SheetTitle>
          <SheetDescription>
            저장된 BEP 계산 프로젝트의 상세 정보입니다.
          </SheetDescription>
        </SheetHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="p-6">
              <p className="text-body text-destructive">
                프로젝트를 불러오는 중 오류가 발생했습니다.
              </p>
              <p className="text-body-small text-muted-foreground mt-2">
                {error.message}
              </p>
            </CardContent>
          </Card>
        )}

        {project && (
          <div className="space-y-6">
            {/* 프로젝트 기본 정보 */}
            <Card className="rounded-card shadow-card">
              <CardHeader>
                <CardTitle className="text-heading-3">기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-caption text-muted-foreground mb-1">
                    프로젝트명
                  </p>
                  <p className="text-body font-medium">{project.name}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      생성일
                    </p>
                    <p className="text-body-small">
                      {new Date(project.created_at).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      수정일
                    </p>
                    <p className="text-body-small">
                      {new Date(project.updated_at).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      버전
                    </p>
                    <p className="text-body-small">{project.version}</p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      로케일
                    </p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-caption font-medium bg-accent/10 text-accent">
                      {project.locale.toUpperCase()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 계산 입력값 */}
            <Card className="rounded-card shadow-card">
              <CardHeader>
                <CardTitle className="text-heading-3">입력값</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      판매 단가
                    </p>
                    <p className="text-body font-medium">
                      {project.input_json.price.toLocaleString()}원
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      단위당 변동비
                    </p>
                    <p className="text-body font-medium">
                      {project.input_json.unitCost.toLocaleString()}원
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      고정비
                    </p>
                    <p className="text-body font-medium">
                      {project.input_json.fixedCost.toLocaleString()}원
                    </p>
                  </div>
                  {project.input_json.targetProfit !== undefined &&
                    project.input_json.targetProfit > 0 && (
                      <div>
                        <p className="text-caption text-muted-foreground mb-1">
                          목표 수익
                        </p>
                        <p className="text-body font-medium">
                          {project.input_json.targetProfit.toLocaleString()}원
                        </p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* 계산 결과 */}
            <Card className="rounded-card shadow-card">
              <CardHeader>
                <CardTitle className="text-heading-3">계산 결과</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      손익분기점 판매량
                    </p>
                    <p className="text-body font-semibold text-accent">
                      {project.result_json.bepQuantity.toLocaleString()}개
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      손익분기점 매출액
                    </p>
                    <p className="text-body font-semibold text-accent">
                      {project.result_json.bepRevenue.toLocaleString()}원
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      공헌이익률
                    </p>
                    <p className="text-body font-medium">
                      {(project.result_json.marginRate * 100).toFixed(1)}%
                    </p>
                  </div>
                  {project.result_json.targetQuantity !== undefined &&
                    project.result_json.targetQuantity > 0 && (
                      <div>
                        <p className="text-caption text-muted-foreground mb-1">
                          목표 달성 판매량
                        </p>
                        <p className="text-body font-medium">
                          {project.result_json.targetQuantity.toLocaleString()}개
                        </p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* 민감도 분석 */}
            {project.sensitivity_json && project.sensitivity_json.length > 0 && (
              <Card className="rounded-card shadow-card">
                <CardHeader>
                  <CardTitle className="text-heading-3">민감도 분석</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-body-small text-muted-foreground">
                    {project.sensitivity_json.length}개의 데이터 포인트
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 액션 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleLoadToCalculator}
                disabled={isLoadingProject}
                className="flex-1 transition-button"
              >
                {isLoadingProject ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Calculator className="mr-2 h-4 w-4" />
                )}
                계산기로 불러오기
              </Button>
              <Button
                variant="outline"
                disabled
                title="Export 기능 (개발 예정)"
                className="transition-button"
              >
                <Download className="mr-2 h-4 w-4" />
                내보내기
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
