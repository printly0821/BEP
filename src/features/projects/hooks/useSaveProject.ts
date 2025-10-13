'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';
import {
  SaveProjectResponseSchema,
  type SaveProjectBody,
  type SaveProjectResponse,
} from '@/features/projects/lib/dto';

/**
 * 프로젝트 저장 API 호출
 */
const saveProject = async (
  body: SaveProjectBody,
): Promise<SaveProjectResponse> => {
  try {
    const { data } = await apiClient.post('/api/projects', body);
    return SaveProjectResponseSchema.parse(data);
  } catch (error) {
    const message = extractApiErrorMessage(error, 'Failed to save project.');
    throw new Error(message);
  }
};

/**
 * 프로젝트 저장 mutation hook
 *
 * 사용 예시:
 * ```tsx
 * const { mutate, isPending } = useSaveProject();
 *
 * const handleSave = () => {
 *   mutate({
 *     name: '내 프로젝트',
 *     locale: 'ko',
 *     version: 'v1',
 *     inputs: { price: 10000, unitCost: 5000, fixedCost: 1000000 },
 *     results: { bepQuantity: 200, bepRevenue: 2000000, marginRate: 0.5 },
 *     sensitivity: [],
 *   }, {
 *     onSuccess: (data) => {
 *       toast.success('프로젝트가 저장되었습니다.');
 *     },
 *     onError: (error) => {
 *       toast.error(error.message);
 *     },
 *   });
 * };
 * ```
 */
export const useSaveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveProject,
    onSuccess: () => {
      // 저장 성공 시 프로젝트 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
