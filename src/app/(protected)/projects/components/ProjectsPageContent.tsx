'use client';

import { useState } from 'react';
import { Plus, FileUp, FileDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useProjectsQuery } from '@/features/projects/hooks/useProjectsQuery';
import { ProjectsTable } from './ProjectsTable';
import { ProjectCreateDialog } from './ProjectCreateDialog';
import { ProjectDetailSheet } from './ProjectDetailSheet';

/**
 * 프로젝트 관리 페이지 내용 컴포넌트
 *
 * I18nProvider 내부에서 useTranslations를 사용하기 위해 분리된 컴포넌트입니다.
 */
export function ProjectsPageContent() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const t = useTranslations('projects');
  const { data: projects, isLoading, error } = useProjectsQuery();

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleProjectClose = () => {
    setSelectedProjectId(null);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-heading-1 font-bold text-foreground mb-2">
              {t('page.title')}
            </h1>
            <p className="text-body text-muted-foreground">
              {t('page.description')}
            </p>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      {/* 액션 바 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="transition-button shadow-button-hover"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('actions.newProject')}
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="transition-button"
            disabled
            title={t('actions.importTooltip')}
          >
            <FileUp className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('actions.import')}</span>
            <span className="sm:hidden">{t('actions.importShort')}</span>
          </Button>

          <Button
            variant="outline"
            className="transition-button"
            disabled
            title={t('actions.exportTooltip')}
          >
            <FileDown className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('actions.export')}</span>
            <span className="sm:hidden">{t('actions.exportShort')}</span>
          </Button>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      <ProjectsTable
        projects={projects}
        isLoading={isLoading}
        error={error}
        onProjectSelect={handleProjectSelect}
      />

      {/* 프로젝트 생성 다이얼로그 */}
      <ProjectCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {/* 프로젝트 상세 Sheet */}
      {selectedProjectId && (
        <ProjectDetailSheet
          projectId={selectedProjectId}
          open={!!selectedProjectId}
          onOpenChange={(open) => !open && handleProjectClose()}
        />
      )}
    </div>
  );
}
