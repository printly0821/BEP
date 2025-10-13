'use client';

import { useState } from 'react';
import {
  useSaveProject,
  useUpdateProject,
  useDeleteProject,
  useLoadProject,
  useProjectsQuery,
  useProjectQuery,
} from '@/features/projects/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Download } from 'lucide-react';

export default function ProjectTestPage() {
  const [projectName, setProjectName] = useState('테스트 프로젝트');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');

  const { mutate: saveProject, isPending: isSaving } = useSaveProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();
  const { mutate: loadProject, isPending: isLoading } = useLoadProject();
  const { data: projects, isLoading: isLoadingList, refetch } = useProjectsQuery();
  const { data: selectedProject, isLoading: isLoadingDetail } = useProjectQuery(selectedProjectId);
  const { toast } = useToast();

  const handleSave = () => {
    saveProject({
      name: projectName,
      locale: 'ko',
      version: 'v1',
      inputs: {
        price: 10000,
        unitCost: 5000,
        fixedCost: 1000000,
        targetProfit: 500000,
      },
      results: {
        bepQuantity: 200,
        bepRevenue: 2000000,
        marginRate: 0.5,
        targetQuantity: 300,
      },
      sensitivity: [
        { price: 9000, unitCost: 5000, bep: 222, profit: 0 },
        { price: 10000, unitCost: 5000, bep: 200, profit: 0 },
        { price: 11000, unitCost: 5000, bep: 167, profit: 0 },
      ],
    }, {
      onSuccess: (data) => {
        toast({
          title: '✅ 프로젝트 저장 성공!',
          description: `프로젝트 ID: ${data.id}`,
        });
        refetch();
      },
      onError: (error) => {
        toast({
          title: '❌ 저장 실패',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  const handleUpdateName = () => {
    if (!selectedProjectId || !editedName.trim()) return;

    updateProject(
      {
        projectId: selectedProjectId,
        name: editedName.trim(),
      },
      {
        onSuccess: () => {
          toast({
            title: '✅ 이름 변경 성공!',
            description: `프로젝트명이 "${editedName}"로 변경되었습니다.`,
          });
          setIsEditingName(false);
          refetch();
        },
        onError: (error) => {
          toast({
            title: '❌ 이름 변경 실패',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleDelete = () => {
    if (!selectedProjectId) return;

    if (confirm('정말 삭제하시겠습니까?')) {
      deleteProject(selectedProjectId, {
        onSuccess: () => {
          toast({
            title: '✅ 삭제 성공!',
            description: '프로젝트가 삭제되었습니다.',
          });
          setSelectedProjectId('');
          refetch();
        },
        onError: (error) => {
          toast({
            title: '❌ 삭제 실패',
            description: error.message,
            variant: 'destructive',
          });
        },
      });
    }
  };

  const handleLoad = () => {
    if (!selectedProjectId) return;

    loadProject(selectedProjectId, {
      onSuccess: (project) => {
        toast({
          title: '✅ 불러오기 성공!',
          description: `프로젝트 "${project.name}"의 데이터를 불러왔습니다.`,
        });
        console.log('📦 불러온 프로젝트 데이터:', project);
      },
      onError: (error) => {
        toast({
          title: '❌ 불러오기 실패',
          description: error.message,
          variant: 'destructive',
        });
      },
    });
  };

  const startEditingName = () => {
    if (selectedProject) {
      setEditedName(selectedProject.name);
      setIsEditingName(true);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8">🧪 프로젝트 관리 기능 테스트 (T-006)</h1>
      <p className="text-muted-foreground mb-6">
        저장, 목록 조회, 상세 조회, 이름 변경, 삭제, 불러오기 기능 테스트
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 프로젝트 저장 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>💾 프로젝트 저장</CardTitle>
            <CardDescription>새 프로젝트를 저장합니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">프로젝트명</label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="프로젝트명 입력"
              />
            </div>

            <div className="p-4 bg-muted rounded-lg text-sm space-y-1">
              <p><strong>입력값:</strong></p>
              <ul className="list-disc list-inside ml-2 text-muted-foreground">
                <li>판매 단가: 10,000원</li>
                <li>단위당 변동비: 5,000원</li>
                <li>고정비: 1,000,000원</li>
                <li>목표 수익: 500,000원</li>
              </ul>
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving || !projectName}
              className="w-full"
            >
              {isSaving ? '저장 중...' : '프로젝트 저장'}
            </Button>
          </CardContent>
        </Card>

        {/* 프로젝트 목록 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle>📋 저장된 프로젝트 목록</CardTitle>
            <CardDescription>내가 저장한 프로젝트들</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingList ? (
              <p className="text-muted-foreground">로딩 중...</p>
            ) : projects && projects.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                      selectedProjectId === project.id ? 'bg-accent border-primary' : ''
                    }`}
                    onClick={() => setSelectedProjectId(project.id)}
                  >
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(project.created_at).toLocaleString('ko-KR')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">저장된 프로젝트가 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 프로젝트 상세 정보 섹션 */}
      {selectedProjectId && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                {isEditingName ? (
                  <div className="flex gap-2 items-center">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="max-w-xs"
                      placeholder="새 프로젝트명"
                    />
                    <Button
                      size="sm"
                      onClick={handleUpdateName}
                      disabled={isUpdating || !editedName.trim()}
                    >
                      {isUpdating ? '변경 중...' : '저장'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingName(false)}
                    >
                      취소
                    </Button>
                  </div>
                ) : (
                  <>
                    <CardTitle>🔍 프로젝트 상세 정보</CardTitle>
                    <CardDescription>선택한 프로젝트의 상세 정보 및 관리</CardDescription>
                  </>
                )}
              </div>
              {!isEditingName && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={startEditingName}
                    disabled={isLoadingDetail}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    이름 변경
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleLoad}
                    disabled={isLoading || isLoadingDetail}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isLoading ? '불러오는 중...' : '데이터 불러오기'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? '삭제 중...' : '삭제'}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingDetail ? (
              <p className="text-muted-foreground">로딩 중...</p>
            ) : selectedProject ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-2">📊 입력값</h3>
                    <div className="p-4 bg-muted rounded-lg space-y-1 text-sm">
                      <p>판매 단가: {selectedProject.input_json.price.toLocaleString()}원</p>
                      <p>단위당 변동비: {selectedProject.input_json.unitCost.toLocaleString()}원</p>
                      <p>고정비: {selectedProject.input_json.fixedCost.toLocaleString()}원</p>
                      {selectedProject.input_json.targetProfit && (
                        <p>목표 수익: {selectedProject.input_json.targetProfit.toLocaleString()}원</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">📈 계산 결과</h3>
                    <div className="p-4 bg-muted rounded-lg space-y-1 text-sm">
                      <p>손익분기점 판매량: {selectedProject.result_json.bepQuantity.toLocaleString()}개</p>
                      <p>손익분기점 매출액: {selectedProject.result_json.bepRevenue.toLocaleString()}원</p>
                      <p>공헌이익률: {(selectedProject.result_json.marginRate * 100).toFixed(1)}%</p>
                      {selectedProject.result_json.targetQuantity && (
                        <p>목표 달성 판매량: {selectedProject.result_json.targetQuantity.toLocaleString()}개</p>
                      )}
                    </div>
                  </div>
                </div>

                {selectedProject.sensitivity_json && selectedProject.sensitivity_json.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">📉 민감도 분석</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">판매 단가</th>
                            <th className="text-left p-2">단위당 변동비</th>
                            <th className="text-left p-2">손익분기점</th>
                            <th className="text-left p-2">수익</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProject.sensitivity_json.map((point, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="p-2">{point.price.toLocaleString()}원</td>
                              <td className="p-2">{point.unitCost.toLocaleString()}원</td>
                              <td className="p-2">{point.bep.toLocaleString()}개</td>
                              <td className="p-2">{point.profit.toLocaleString()}원</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t text-sm text-muted-foreground">
                  <p>생성일: {new Date(selectedProject.created_at).toLocaleString('ko-KR')}</p>
                  <p>수정일: {new Date(selectedProject.updated_at).toLocaleString('ko-KR')}</p>
                  <p>프로젝트 ID: {selectedProject.id}</p>
                  <p>사용자 ID: {selectedProject.user_id}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">프로젝트를 찾을 수 없습니다.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
