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
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('projects');
  const { toast } = useToast();
  const { data: project, isLoading, error } = useProjectQuery(projectId);
  const { mutate: loadProject, isPending: isLoadingProject } = useLoadProject();

  const handleLoadToCalculator = () => {
    if (!project) return;

    loadProject(projectId, {
      onSuccess: () => {
        toast({
          title: t('toast.loadSuccess'),
          description: t('toast.loadSuccessDesc', { name: project.name }),
        });
        router.push('/calculator');
      },
      onError: (error) => {
        toast({
          title: t('toast.loadFailed'),
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
          <SheetTitle className="text-heading-2">{t('detail.title')}</SheetTitle>
          <SheetDescription>
            {t('detail.description')}
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
                {t('error.detailLoadFailed')}
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
                <CardTitle className="text-heading-3">{t('detail.basicInfo.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-caption text-muted-foreground mb-1">
                    {t('detail.basicInfo.projectName')}
                  </p>
                  <p className="text-body font-medium">{project.name}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      {t('detail.basicInfo.createdAt')}
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
                      {t('detail.basicInfo.updatedAt')}
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
                      {t('detail.basicInfo.version')}
                    </p>
                    <p className="text-body-small">{project.version}</p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      {t('detail.basicInfo.locale')}
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
                <CardTitle className="text-heading-3">{t('detail.inputs.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      {t('detail.inputs.price')}
                    </p>
                    <p className="text-body font-medium">
                      {project.input_json.price.toLocaleString()}{t('units.won')}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      {t('detail.inputs.unitCost')}
                    </p>
                    <p className="text-body font-medium">
                      {project.input_json.unitCost.toLocaleString()}{t('units.won')}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      {t('detail.inputs.fixedCost')}
                    </p>
                    <p className="text-body font-medium">
                      {project.input_json.fixedCost.toLocaleString()}{t('units.won')}
                    </p>
                  </div>
                  {project.input_json.targetProfit !== undefined &&
                    project.input_json.targetProfit > 0 && (
                      <div>
                        <p className="text-caption text-muted-foreground mb-1">
                          {t('detail.inputs.targetProfit')}
                        </p>
                        <p className="text-body font-medium">
                          {project.input_json.targetProfit.toLocaleString()}{t('units.won')}
                        </p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>

            {/* 계산 결과 */}
            <Card className="rounded-card shadow-card">
              <CardHeader>
                <CardTitle className="text-heading-3">{t('detail.results.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      {t('detail.results.bepQuantity')}
                    </p>
                    <p className="text-body font-semibold text-accent">
                      {project.result_json.bepQuantity.toLocaleString()}{t('units.quantity')}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      {t('detail.results.bepRevenue')}
                    </p>
                    <p className="text-body font-semibold text-accent">
                      {project.result_json.bepRevenue.toLocaleString()}{t('units.won')}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption text-muted-foreground mb-1">
                      {t('detail.results.marginRate')}
                    </p>
                    <p className="text-body font-medium">
                      {(project.result_json.marginRate * 100).toFixed(1)}{t('units.percent')}
                    </p>
                  </div>
                  {project.result_json.targetQuantity !== undefined &&
                    project.result_json.targetQuantity > 0 && (
                      <div>
                        <p className="text-caption text-muted-foreground mb-1">
                          {t('detail.results.targetQuantity')}
                        </p>
                        <p className="text-body font-medium">
                          {project.result_json.targetQuantity.toLocaleString()}{t('units.quantity')}
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
                  <CardTitle className="text-heading-3">{t('detail.sensitivity.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-body-small text-muted-foreground">
                    {project.sensitivity_json.length}{t('detail.sensitivity.dataPoints')}
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
                {t('actions.loadToCalculator')}
              </Button>
              <Button
                variant="outline"
                disabled
                title={t('actions.exportTooltip')}
                className="transition-button"
              >
                <Download className="mr-2 h-4 w-4" />
                {t('actions.exportData')}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
