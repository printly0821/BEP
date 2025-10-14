"use client";

import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  parseSheatcrewExcel,
  parseBEPExportExcel,
  detectExcelType,
  convertToCalculationInputs,
  type SheatcrewProductData,
} from "@/lib/excel-importer";
import { validateImportData, type ValidationIssue } from "@/lib/excel-validator";
import { downloadValidationErrors } from "@/lib/error-report";
import { ImportPreviewDialog } from "./ImportPreviewDialog";
import type { CalculationInputs } from "@/features/projects/types";

interface ImportExcelButtonProps {
  onImport: (data: CalculationInputs, fileName?: string) => void;
  existingData?: CalculationInputs | null;
}

export function ImportExcelButton({ onImport, existingData }: ImportExcelButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState<SheatcrewProductData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 미리보기 상태
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<CalculationInputs | null>(null);

  // 유효성 검증 에러 상태
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setCurrentFileName(file.name);

    try {
      // 파일 형식 감지
      const fileType = await detectExcelType(file);

      if (fileType === "unknown") {
        throw new Error(
          "지원하지 않는 파일 형식입니다. 쉬잇크루 원본 파일 또는 BEP Export 파일을 선택해주세요."
        );
      }

      if (fileType === "bep-export") {
        // BEP Export 파일 - 파싱 후 유효성 검증
        const rawData = await parseBEPExportExcel(file);

        // 유효성 검증 (새로운 validateImportData 사용)
        const validation = validateImportData(rawData as unknown as Record<string, unknown>);

        if (!validation.ok) {
          // 검증 실패 - 에러 표시
          setValidationIssues(validation.issues);
          setError("데이터 유효성 검증에 실패했습니다. 아래 에러 목록을 확인하세요.");
          return;
        }

        // 검증 성공 - 미리보기 다이얼로그 표시
        setValidationIssues([]); // 에러 초기화
        setPreviewData(validation.value);
        setShowPreview(true);
      } else {
        // 쉬잇크루 원본 파일 - 제품 선택 다이얼로그 표시
        const productList = await parseSheatcrewExcel(file);

        if (productList.length === 0) {
          throw new Error("파일에서 제품 데이터를 찾을 수 없습니다.");
        }

        setProducts(productList);
        setIsDialogOpen(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "파일 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleProductSelect = (product: SheatcrewProductData) => {
    try {
      const rawData = convertToCalculationInputs(product);

      // 유효성 검증 (새로운 validateImportData 사용)
      const validation = validateImportData(rawData as unknown as Record<string, unknown>);

      if (!validation.ok) {
        // 검증 실패 - 에러 표시
        setValidationIssues(validation.issues);
        setError("데이터 유효성 검증에 실패했습니다. 아래 에러 목록을 확인하세요.");
        setIsDialogOpen(false); // 제품 선택 다이얼로그 닫기
        return;
      }

      // 검증 성공 - 미리보기 다이얼로그 표시
      setValidationIssues([]); // 에러 초기화
      setPreviewData(validation.value);
      setShowPreview(true);
      setIsDialogOpen(false); // 제품 선택 다이얼로그 닫기
    } catch (err) {
      setError(err instanceof Error ? err.message : "데이터 변환 중 오류가 발생했습니다.");
    }
  };

  // 미리보기 확인 핸들러
  const handlePreviewConfirm = () => {
    if (previewData) {
      onImport(previewData, currentFileName);
      setShowPreview(false);
      setPreviewData(null);
      setProducts([]); // 제품 목록 초기화
    }
  };

  // 미리보기 취소 핸들러
  const handlePreviewCancel = () => {
    setShowPreview(false);
    setPreviewData(null);
    // 제품 선택으로 돌아가지 않음 (처음부터 다시 선택)
    setProducts([]);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // CSV 에러 리포트 다운로드 핸들러
  const handleDownloadErrorReport = () => {
    if (validationIssues.length > 0) {
      const fileName = `validation-errors-${currentFileName.replace(/\.xlsx?$/, '')}.csv`;
      downloadValidationErrors(validationIssues, fileName);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Excel Import</CardTitle>
          <CardDescription>
            쉬잇크루 원본 파일 또는 BEP Export 파일을 가져올 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            onClick={handleButtonClick}
            disabled={isProcessing}
            className="w-full"
            variant="outline"
          >
            {isProcessing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                파일 처리 중...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Excel 파일 가져오기
              </>
            )}
          </Button>

          {error && (
            <div className="mt-4 space-y-4">
              <div className="rounded-md bg-destructive/15 p-4">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                  <p className="text-sm text-destructive whitespace-pre-line">{error}</p>
                </div>
              </div>

              {/* 유효성 검증 에러 테이블 */}
              {validationIssues.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">에러 목록 ({validationIssues.length}개)</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadErrorReport}
                      className="h-8"
                    >
                      <Download className="mr-2 h-3 w-3" />
                      CSV 다운로드
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[140px]">에러 코드</TableHead>
                          <TableHead className="w-[120px]">필드명</TableHead>
                          <TableHead>메시지</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationIssues.map((issue, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono text-xs">{issue.code}</TableCell>
                            <TableCell className="text-sm">{issue.field || '-'}</TableCell>
                            <TableCell className="text-sm">{issue.message}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 제품 선택 다이얼로그 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>제품 선택</DialogTitle>
            <DialogDescription>
              가져올 제품을 선택해주세요. 총 {products.length}개의 제품이 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="h-[400px] overflow-y-auto pr-4">
            <div className="space-y-2">
              {products.map((product, index) => {
                const totalVariableCost =
                  product.materials +
                  product.packaging +
                  product.shippingBox +
                  product.marketFee +
                  product.shippingCost +
                  product.variableOther;

                const totalFixedCost =
                  product.labor +
                  product.meals +
                  product.rent +
                  product.utilities +
                  product.office +
                  product.marketing +
                  product.fixedOther;

                const contributionMargin = product.price - totalVariableCost;
                const isValid = contributionMargin > 0;

                return (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-colors hover:bg-accent ${
                      !isValid ? "opacity-50" : ""
                    }`}
                    onClick={() => isValid && handleProductSelect(product)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4" />
                            {product.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {product.type} / Row {product.rowIndex}
                          </CardDescription>
                        </div>
                        {!isValid && (
                          <span className="text-xs text-destructive font-medium">
                            공헌이익 0 이하
                          </span>
                        )}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">판매가:</span>
                          <span className="ml-2 font-medium">
                            {product.price.toLocaleString()}원
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">변동비:</span>
                          <span className="ml-2 font-medium">
                            {totalVariableCost.toLocaleString()}원
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">고정비:</span>
                          <span className="ml-2 font-medium">
                            {totalFixedCost.toLocaleString()}원
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">공헌이익:</span>
                          <span
                            className={`ml-2 font-medium ${
                              contributionMargin > 0 ? "text-green-600" : "text-destructive"
                            }`}
                          >
                            {contributionMargin.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 미리보기 다이얼로그 */}
      {previewData && (
        <ImportPreviewDialog
          open={showPreview}
          onOpenChange={setShowPreview}
          data={previewData}
          fileName={currentFileName}
          existingData={existingData}
          onConfirm={handlePreviewConfirm}
          onCancel={handlePreviewCancel}
        />
      )}
    </>
  );
}
