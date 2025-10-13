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
  const { toast } = useToast();
  const { mutate: saveProject, isPending } = useSaveProject();
  const { isAuthenticated } = useCurrentUser();

  const handleCreate = () => {
    if (!isAuthenticated) {
      toast({
        title: '로그인 필요',
        description: '프로젝트를 생성하려면 먼저 로그인해주세요.',
        variant: 'destructive',
      });
      onOpenChange(false);
      window.location.href = '/login';
      return;
    }

    if (!projectName.trim()) {
      toast({
        title: '입력 오류',
        description: '프로젝트명을 입력해주세요.',
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
            title: '생성 완료',
            description: `프로젝트 "${projectName}"이(가) 성공적으로 생성되었습니다.`,
          });
          setProjectName('');
          onOpenChange(false);
        },
        onError: (error) => {
          toast({
            title: '생성 실패',
            description: error.message || '프로젝트 생성 중 오류가 발생했습니다.',
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
          <DialogTitle>새 프로젝트 생성</DialogTitle>
          <DialogDescription>
            새로운 BEP 계산 프로젝트를 생성합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="new-project-name">프로젝트명</Label>
            <Input
              id="new-project-name"
              placeholder="예: 카페 창업 BEP 분석"
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
            💡 프로젝트를 생성한 후 계산기에서 데이터를 입력하고 저장할 수 있습니다.
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
          >
            취소
          </Button>
          <Button onClick={handleCreate} disabled={isPending || !projectName.trim()}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            생성
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
