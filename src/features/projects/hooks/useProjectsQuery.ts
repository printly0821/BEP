'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient, extractApiErrorMessage } from '@/lib/remote/api-client';
import type { ProjectListItem } from '@/features/projects/lib/dto';

/**
 * 프로젝트 목록 조회 API 호출
 */
const fetchProjects = async (): Promise<ProjectListItem[]> => {
  try {
    const { data } = await apiClient.get('/api/projects');
    return data as ProjectListItem[];
  } catch (error) {
    const message = extractApiErrorMessage(error, 'Failed to fetch projects.');
    throw new Error(message);
  }
};

/**
 * 프로젝트 목록 조회 query hook
 *
 * 사용 예시:
 * ```tsx
 * const { data: projects, isLoading, error } = useProjectsQuery();
 *
 * if (isLoading) return <div>로딩 중...</div>;
 * if (error) return <div>에러: {error.message}</div>;
 *
 * return (
 *   <ul>
 *     {projects?.map((project) => (
 *       <li key={project.id}>{project.name}</li>
 *     ))}
 *   </ul>
 * );
 * ```
 */
export const useProjectsQuery = () =>
  useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // 5분
  });
