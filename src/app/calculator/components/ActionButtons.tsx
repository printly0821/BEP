"use client";

import { Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onSave?: () => void;
  onDownloadPdf?: () => void;
}

export function ActionButtons({ onSave, onDownloadPdf }: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        variant="secondary"
        className="flex-1"
        size="lg"
        onClick={onDownloadPdf}
        disabled={!onDownloadPdf}
      >
        <Download className="h-4 w-4 mr-2" />
        PDF 다운로드
      </Button>
      <Button
        className="flex-1"
        size="lg"
        onClick={onSave}
      >
        <Save className="h-4 w-4 mr-2" />
        프로젝트로 저장
      </Button>
    </div>
  );
}
