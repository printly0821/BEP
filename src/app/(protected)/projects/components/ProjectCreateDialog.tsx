'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
import { useSaveProject } from '@/features/projects/hooks/useSaveProject';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

interface ProjectCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 프로젝트 생성 다이얼로그
 *
 * 빈 프로젝트를 생성하는 다이얼로그입니다.
 * 계산기에서 데이터를 저장할 때는 SaveProjectDialog를 사용합니다.
 */
export function ProjectCreateDialog({
  open,
  onOpenChange,
}: ProjectCreateDialogProps) {
  const [projectName, setProjectName] = useState('');
  const t = useTranslations('projects');
  const { toast } = useToast();
  const { mutate: saveProject, isPending } = useSaveProject();
  const { isAuthenticated } = useCurrentUser();

  const handleCreate = () => {
    if (!isAuthenticated) {
      toast({
        title: t('toast.loginRequired'),
        description: t('toast.loginRequiredDesc'),
        variant: 'destructive',
      });
      onOpenChange(false);
      window.location.href = '/login';
      return;
    }

    if (!projectName.trim()) {
      toast({
        title: t('toast.inputError'),
        description: t('toast.nameRequired'),
        variant: 'destructive',
      });
      return;
    }

    // 빈 프로젝트 생성 (기본값으로 초기화)
    saveProject(
      {
        name: projectName.trim(),
        locale: 'ko',
        version: 'v1',
        inputs: {
          price: 0,
          unitCost: 0,
          fixedCost: 0,
          targetProfit: 0,
        },
        results: {
          bepQuantity: 0,
          bepRevenue: 0,
          marginRate: 0,
          targetQuantity: 0,
        },
        sensitivity: [],
      },
      {
        onSuccess: (data) => {
          toast({
            title: t('toast.createSuccess'),
            description: t('toast.createSuccessDesc', { name: projectName }),
          });
          setProjectName('');
          onOpenChange(false);
        },
        onError: (error) => {
          toast({
            title: t('toast.createFailed'),
            description: error.message || t('toast.createFailedDesc'),
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleCancel = () => {
    setProjectName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-modal">
        <DialogHeader>
          <DialogTitle>{t('create.title')}</DialogTitle>
          <DialogDescription>
            {t('create.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="new-project-name">{t('create.nameLabel')}</Label>
            <Input
              id="new-project-name"
              placeholder={t('create.namePlaceholder')}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isPending) {
                  handleCreate();
                }
              }}
              disabled={isPending}
              autoFocus
            />
          </div>
          <div className="p-3 rounded-lg bg-muted text-body-small text-muted-foreground">
            {t('create.hint')}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
          >
            {t('create.cancel')}
          </Button>
          <Button onClick={handleCreate} disabled={isPending || !projectName.trim()}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? t('create.submitting') : t('create.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
