'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';
import type { ProjectDetail } from '@/features/projects/lib/dto';

/**
 * 프로젝트 상세 조회 API 호출
 */
const fetchProject = async (id: string): Promise<ProjectDetail> => {
  try {
    const { data } = await apiClient.get(`/api/projects/${id}`);
    return data as ProjectDetail;
  } catch (error) {
    const message = extractApiErrorMessage(error, 'Failed to fetch project.');
    throw new Error(message);
  }
};

/**
 * 프로젝트 상세 조회 query hook
 *
 * 사용 예시:
 * ```tsx
 * const { data: project, isLoading, error } = useProjectQuery(projectId);
 *
 * if (isLoading) return <div>로딩 중...</div>;
 * if (error) return <div>에러: {error.message}</div>;
 * if (!project) return <div>프로젝트를 찾을 수 없습니다.</div>;
 *
 * return (
 *   <div>
 *     <h1>{project.name}</h1>
 *     <p>판매 단가: {project.input_json.price}</p>
 *     <p>손익분기점: {project.result_json.bepQuantity}</p>
 *   </div>
 * );
 * ```
 */
export const useProjectQuery = (id: string) =>
  useQuery({
    queryKey: ['projects', id],
    queryFn: () => fetchProject(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000, // 5분
  });
