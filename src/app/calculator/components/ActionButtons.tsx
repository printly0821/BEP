"use client";

import { Download, Save, Loader2, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onSave?: () => void;
  onDownloadPdf?: () => void;
  onDownloadExcel?: () => void;
  isDownloadingPdf?: boolean;
  isDownloadingExcel?: boolean;
}

export function ActionButtons({
  onSave,
  onDownloadPdf,
  onDownloadExcel,
  isDownloadingPdf = false,
  isDownloadingExcel = false,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* PDF 및 Excel 다운로드 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="secondary"
          className="flex-1"
          size="lg"
          onClick={onDownloadPdf}
          disabled={!onDownloadPdf || isDownloadingPdf}
        >
          {isDownloadingPdf ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              PDF 생성 중...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              PDF 다운로드
            </>
          )}
        </Button>
        <Button
          variant="secondary"
          className="flex-1"
          size="lg"
          onClick={onDownloadExcel}
          disabled={!onDownloadExcel || isDownloadingExcel}
        >
          {isDownloadingExcel ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Excel 생성 중...
            </>
          ) : (
            <>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel 다운로드
            </>
          )}
        </Button>
      </div>

      {/* 프로젝트 저장 버튼 */}
      <Button className="w-full" size="lg" onClick={onSave}>
        <Save className="h-4 w-4 mr-2" />
        프로젝트로 저장
      </Button>
    </div>
  );
}
