'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FolderOpen } from 'lucide-react';
import { ProjectRowActions } from './ProjectRowActions';
import type { ProjectListItem } from '@/features/projects/lib/dto';

interface ProjectsTableProps {
  projects?: ProjectListItem[];
  isLoading: boolean;
  error: Error | null;
  onProjectSelect: (projectId: string) => void;
}

/**
 * 프로젝트 목록 테이블 컴포넌트
 *
 * Design Guide 적용:
 * - Card Shadow: shadow-card
 * - Border Radius: rounded-card
 * - Transition: transition-default
 */
export function ProjectsTable({
  projects,
  isLoading,
  error,
  onProjectSelect,
}: ProjectsTableProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="rounded-card shadow-card animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Card className="rounded-card shadow-card border-destructive">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-body text-destructive font-medium mb-2">
              프로젝트 목록을 불러오는 중 오류가 발생했습니다.
            </p>
            <p className="text-body-small text-muted-foreground">
              {error.message}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 빈 상태
  if (!projects || projects.length === 0) {
    return (
      <Card className="rounded-card shadow-card">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-heading-3 font-semibold mb-2">
              저장된 프로젝트가 없습니다
            </h3>
            <p className="text-body text-muted-foreground mb-6">
              첫 번째 프로젝트를 생성하여 BEP 계산 결과를 저장해보세요.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 프로젝트 목록
  return (
    <div className="space-y-4">
      {/* 데스크톱: 테이블 헤더 */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-2 text-body-small font-medium text-muted-foreground">
        <div className="col-span-5">프로젝트명</div>
        <div className="col-span-2">생성일</div>
        <div className="col-span-2">수정일</div>
        <div className="col-span-2">로케일</div>
        <div className="col-span-1 text-right">액션</div>
      </div>

      {/* 프로젝트 목록 */}
      {projects.map((project) => (
        <Card
          key={project.id}
          className="rounded-card shadow-card transition-default hover:shadow-button-hover cursor-pointer"
          onClick={() => onProjectSelect(project.id)}
        >
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center">
              {/* 프로젝트명 */}
              <div className="col-span-1 md:col-span-5">
                <h3 className="text-body-large md:text-body font-semibold text-foreground mb-1">
                  {project.name}
                </h3>
                <p className="text-caption text-muted-foreground md:hidden">
                  ID: {project.id.slice(0, 8)}...
                </p>
              </div>

              {/* 생성일 */}
              <div className="col-span-1 md:col-span-2">
                <div className="md:hidden text-caption text-muted-foreground mb-1">
                  생성일
                </div>
                <p className="text-body-small text-foreground">
                  {new Date(project.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* 수정일 */}
              <div className="col-span-1 md:col-span-2">
                <div className="md:hidden text-caption text-muted-foreground mb-1">
                  수정일
                </div>
                <p className="text-body-small text-foreground">
                  {new Date(project.updated_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* 로케일 */}
              <div className="col-span-1 md:col-span-2">
                <div className="md:hidden text-caption text-muted-foreground mb-1">
                  로케일
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium bg-accent/10 text-accent">
                  {project.locale.toUpperCase()}
                </span>
              </div>

              {/* 액션 */}
              <div className="col-span-1 md:col-span-1 flex justify-end">
                <ProjectRowActions
                  project={project}
                  onProjectSelect={onProjectSelect}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
