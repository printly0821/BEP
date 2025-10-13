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
import { useTranslations } from 'next-intl';
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

  const t = useTranslations('projects');
  const { toast } = useToast();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const handleRename = () => {
    if (!newName.trim()) {
      toast({
        title: t('toast.inputError'),
        description: t('toast.nameRequired'),
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
            title: t('toast.renameSuccess'),
            description: t('toast.renameSuccessDesc', { name: newName }),
          });
          setIsRenameDialogOpen(false);
        },
        onError: (error) => {
          toast({
            title: t('toast.renameFailed'),
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
          title: t('toast.deleteSuccess'),
          description: t('toast.deleteSuccessDesc', { name: project.name }),
        });
        setIsDeleteDialogOpen(false);
      },
      onError: (error) => {
        toast({
          title: t('toast.deleteFailed'),
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
            <span className="sr-only">{t('table.openMenu')}</span>
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
            {t('menu.view')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsRenameDialogOpen(true);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            {t('menu.rename')}
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
            {t('menu.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 이름 변경 다이얼로그 */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-modal">
          <DialogHeader>
            <DialogTitle>{t('rename.title')}</DialogTitle>
            <DialogDescription>
              {t('rename.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">{t('rename.nameLabel')}</Label>
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
              {t('rename.cancel')}
            </Button>
            <Button onClick={handleRename} disabled={isUpdating || !newName.trim()}>
              {isUpdating ? t('rename.submitting') : t('rename.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-modal">
          <DialogHeader>
            <DialogTitle>{t('delete.title')}</DialogTitle>
            <DialogDescription>
              {t('delete.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-body-small text-foreground mb-2">
                <strong>{t('delete.projectName')}</strong> {project.name}
              </p>
              <p className="text-caption text-muted-foreground">
                {t('delete.warning')}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              {t('delete.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t('delete.submitting') : t('delete.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
