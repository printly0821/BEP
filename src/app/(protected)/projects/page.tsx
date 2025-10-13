'use client';

import { useState } from 'react';
import { Plus, FileUp, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjectsQuery } from '@/features/projects/hooks/useProjectsQuery';
import { ProjectsTable } from './components/ProjectsTable';
import { ProjectCreateDialog } from './components/ProjectCreateDialog';
import { ProjectDetailSheet } from './components/ProjectDetailSheet';

/**
 * 프로젝트 관리 페이지
 *
 * T-007: 프로젝트 관리 UI/UX 구현
 * - 프로젝트 목록 조회
 * - 프로젝트 생성/수정/삭제
 * - Import/Export 진입점
 */
export default function ProjectsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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
        <h1 className="text-heading-1 font-bold text-foreground mb-2">
          내 프로젝트
        </h1>
        <p className="text-body text-muted-foreground">
          저장된 BEP 계산 프로젝트를 관리하고 불러올 수 있습니다.
        </p>
      </div>

      {/* 액션 바 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="transition-button shadow-button-hover"
        >
          <Plus className="h-4 w-4 mr-2" />
          새 프로젝트
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="transition-button"
            disabled
            title="엑셀 Import 기능 (개발 예정)"
          >
            <FileUp className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">엑셀 Import</span>
            <span className="sm:hidden">Import</span>
          </Button>

          <Button
            variant="outline"
            className="transition-button"
            disabled
            title="Export 기능 (개발 예정)"
          >
            <FileDown className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">내보내기</span>
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
