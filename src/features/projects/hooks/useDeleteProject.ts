'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';

/**
 * 프로젝트 삭제 API 호출
 */
const deleteProject = async (projectId: string): Promise<{ id: string }> => {
  try {
    const { data } = await apiClient.delete(`/api/projects/${projectId}`);
    return data;
  } catch (error) {
    const message = extractApiErrorMessage(error, 'Failed to delete project.');
    throw new Error(message);
  }
};

/**
 * 프로젝트 삭제 mutation hook
 *
 * 사용 예시:
 * ```tsx
 * const { mutate, isPending } = useDeleteProject();
 *
 * const handleDelete = (projectId: string) => {
 *   if (confirm('정말 삭제하시겠습니까?')) {
 *     mutate(projectId, {
 *       onSuccess: () => {
 *         toast.success('프로젝트가 삭제되었습니다.');
 *       },
 *       onError: (error) => {
 *         toast.error(error.message);
 *       },
 *     });
 *   }
 * };
 * ```
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (data, projectId) => {
      // 삭제 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.removeQueries({ queryKey: ['project', projectId] });
    },
  });
};
