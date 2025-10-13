'use client';

import { useMutation } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';
import { ProjectRowSchema } from '@/features/projects/backend/schema';
import type { ProjectRow } from '@/features/projects/backend/schema';

/**
 * 프로젝트 불러오기 API 호출
 */
const loadProject = async (projectId: string): Promise<ProjectRow> => {
  try {
    const { data } = await apiClient.get(`/api/projects/${projectId}`);

    // 응답 데이터 검증
    const parsed = ProjectRowSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error('Invalid project data received from server');
    }

    return parsed.data;
  } catch (error) {
    const message = extractApiErrorMessage(error, 'Failed to load project.');
    throw new Error(message);
  }
};

/**
 * 프로젝트 불러오기 mutation hook
 *
 * 사용 예시:
 * ```tsx
 * const { mutate, isPending } = useLoadProject();
 *
 * const handleLoad = (projectId: string) => {
 *   mutate(projectId, {
 *     onSuccess: (project) => {
 *       // 계산기 상태 업데이트 (snake_case 필드 사용)
 *       setSellingPrice(String(project.input_json.price));
 *       setVariableCost(String(project.input_json.unitCost));
 *       setFixedCost(String(project.input_json.fixedCost));
 *       setTargetProfit(String(project.input_json.targetProfit || 0));
 *
 *       toast.success('프로젝트를 불러왔습니다.');
 *     },
 *     onError: (error) => {
 *       toast.error(error.message);
 *     },
 *   });
 * };
 * ```
 */
export const useLoadProject = () => {
  return useMutation({
    mutationFn: loadProject,
  });
};
