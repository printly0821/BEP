'use client';

import { useState } from 'react';
import { MoreVertical, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUpdateProject } from '@/features/projects/hooks/useUpdateProject';
import { useDeleteProject } from '@/features/projects/hooks/useDeleteProject';
import type { ProjectListItem } from '@/features/projects/lib/dto';

interface ProjectRowActionsProps {
  project: ProjectListItem;
  onProjectSelect: (projectId: string) => void;
}

/**
 * 프로젝트 행 액션 컴포넌트
 *
 * 기능:
 * - 프로젝트 상세 보기
 * - 프로젝트 이름 변경
 * - 프로젝트 삭제
 */
export function ProjectRowActions({
  project,
  onProjectSelect,
}: ProjectRowActionsProps) {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newName, setNewName] = useState(project.name);

  const { toast } = useToast();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const handleRename = () => {
    if (!newName.trim()) {
      toast({
        title: '입력 오류',
        description: '프로젝트명을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    updateProject(
      {
        projectId: project.id,
        name: newName.trim(),
      },
      {
        onSuccess: () => {
          toast({
            title: '변경 완료',
            description: `프로젝트명이 "${newName}"로 변경되었습니다.`,
          });
          setIsRenameDialogOpen(false);
        },
        onError: (error) => {
          toast({
            title: '변경 실패',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleDelete = () => {
    deleteProject(project.id, {
      onSuccess: () => {
        toast({
          title: '삭제 완료',
          description: `프로젝트 "${project.name}"이(가) 삭제되었습니다.`,
        });
        setIsDeleteDialogOpen(false);
      },
      onError: (error) => {
        toast({
          title: '삭제 실패',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">메뉴 열기</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onProjectSelect(project.id);
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsRenameDialogOpen(true);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            이름 변경
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 이름 변경 다이얼로그 */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-modal">
          <DialogHeader>
            <DialogTitle>프로젝트 이름 변경</DialogTitle>
            <DialogDescription>
              프로젝트의 새로운 이름을 입력하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">프로젝트명</Label>
              <Input
                id="project-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isUpdating) {
                    handleRename();
                  }
                }}
                disabled={isUpdating}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRenameDialogOpen(false)}
              disabled={isUpdating}
            >
              취소
            </Button>
            <Button onClick={handleRename} disabled={isUpdating || !newName.trim()}>
              {isUpdating ? '변경 중...' : '변경'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-modal">
          <DialogHeader>
            <DialogTitle>프로젝트 삭제</DialogTitle>
            <DialogDescription>
              정말로 이 프로젝트를 삭제하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-body-small text-foreground mb-2">
                <strong>프로젝트명:</strong> {project.name}
              </p>
              <p className="text-caption text-muted-foreground">
                삭제된 프로젝트는 복구할 수 없습니다.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
