/**
 * Client-side i18n 설정
 *
 * 프로젝트 페이지에서만 다국어를 지원합니다.
 * 전체 앱에 영향을 주지 않는 간단한 client-side 전용 방식입니다.
 */

export type Locale = 'ko' | 'en';

export const defaultLocale: Locale = 'ko';

export const locales: Locale[] = ['ko', 'en'];

export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};
