'use client';

import { I18nProvider } from '@/components/providers/I18nProvider';
import { ProjectsPageContent } from './components/ProjectsPageContent';

/**
 * 프로젝트 관리 페이지
 *
 * T-007: 프로젝트 관리 UI/UX 구현
 * - 프로젝트 목록 조회
 * - 프로젝트 생성/수정/삭제
 * - Import/Export 진입점
 * - 다국어 지원 (한국어/영어)
 */
export default function ProjectsPage() {
  return (
    <I18nProvider>
      <ProjectsPageContent />
    </I18nProvider>
  );
}
