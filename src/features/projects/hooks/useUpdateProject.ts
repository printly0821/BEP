'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';
import { type UpdateProjectBody } from '@/features/projects/lib/dto';

/**
 * 프로젝트 업데이트 API 호출
 */
const updateProject = async (
  projectId: string,
  body: UpdateProjectBody,
): Promise<{ id: string }> => {
  try {
    const { data } = await apiClient.patch(`/api/projects/${projectId}`, body);
    return data;
  } catch (error) {
    const message = extractApiErrorMessage(error, 'Failed to update project.');
    throw new Error(message);
  }
};

/**
 * 프로젝트 업데이트 mutation hook
 *
 * 사용 예시:
 * ```tsx
 * const { mutate, isPending } = useUpdateProject();
 *
 * const handleRename = (projectId: string, newName: string) => {
 *   mutate({
 *     projectId,
 *     name: newName,
 *   }, {
 *     onSuccess: () => {
 *       toast.success('프로젝트명이 변경되었습니다.');
 *     },
 *     onError: (error) => {
 *       toast.error(error.message);
 *     },
 *   });
 * };
 * ```
 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, ...body }: UpdateProjectBody & { projectId: string }) =>
      updateProject(projectId, body),
    onSuccess: (data, variables) => {
      // 업데이트 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
};
