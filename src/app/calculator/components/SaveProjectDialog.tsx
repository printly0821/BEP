"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSaveProject } from "@/features/projects/hooks/useSaveProject";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Loader2 } from "lucide-react";
import type { CalculationState } from "@/features/projects/types";

interface SaveProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calculationState: CalculationState;
}

/**
 * 프로젝트 저장 다이얼로그
 *
 * 사용자가 계산 결과를 프로젝트로 저장할 수 있는 다이얼로그입니다.
 * 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트됩니다.
 */
export function SaveProjectDialog({
  open,
  onOpenChange,
  calculationState,
}: SaveProjectDialogProps) {
  const [projectName, setProjectName] = useState("");
  const { toast } = useToast();
  const { mutate: saveProject, isPending } = useSaveProject();
  const { isAuthenticated } = useCurrentUser();

  const handleSave = () => {
    if (!isAuthenticated) {
      toast({
        title: "로그인 필요",
        description: "프로젝트를 저장하려면 먼저 로그인해주세요.",
        variant: "destructive",
      });
      onOpenChange(false);
      window.location.href = "/login";
      return;
    }

    if (!projectName.trim()) {
      toast({
        title: "입력 오류",
        description: "프로젝트명을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    saveProject(
      {
        name: projectName.trim(),
        locale: "ko",
        ...calculationState,
      },
      {
        onSuccess: (data) => {
          toast({
            title: "저장 완료",
            description: `프로젝트 "${projectName}"이(가) 성공적으로 저장되었습니다.`,
          });
          setProjectName("");
          onOpenChange(false);
        },
        onError: (error) => {
          toast({
            title: "저장 실패",
            description: error.message || "프로젝트 저장 중 오류가 발생했습니다.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleCancel = () => {
    setProjectName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>프로젝트 저장</DialogTitle>
          <DialogDescription>
            현재 계산 결과를 프로젝트로 저장합니다. 나중에 다시 불러올 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">프로젝트명</Label>
            <Input
              id="project-name"
              placeholder="예: 카페 창업 수익 분석"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isPending) {
                  handleSave();
                }
              }}
              disabled={isPending}
              autoFocus
            />
          </div>
          <div className="text-sm text-muted-foreground">
            저장되는 정보: 입력값, 계산 결과, 민감도 분석 데이터
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
          <Button onClick={handleSave} disabled={isPending || !projectName.trim()}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
