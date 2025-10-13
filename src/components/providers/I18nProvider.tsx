'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode, useState, useEffect } from 'react';
import { defaultLocale, type Locale } from '@/lib/i18n';
import koMessages from '../../../messages/ko.json';
import enMessages from '../../../messages/en.json';

interface I18nProviderProps {
  children: ReactNode;
  locale?: Locale;
}

const messages = {
  ko: koMessages,
  en: enMessages,
};

/**
 * Client-side I18n Provider
 *
 * 프로젝트 페이지에서 사용하는 다국어 Provider입니다.
 * 브라우저 localStorage에서 사용자 선택 언어를 저장/불러옵니다.
 */
export function I18nProvider({ children, locale }: I18nProviderProps) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale || defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // localStorage에서 저장된 언어 불러오기
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale;
      if (savedLocale && (savedLocale === 'ko' || savedLocale === 'en')) {
        setCurrentLocale(savedLocale);
      }
    }
  }, []);

  // SSR 중에는 기본 언어로, CSR에서는 저장된 언어로
  return (
    <NextIntlClientProvider
      locale={mounted ? currentLocale : defaultLocale}
      messages={messages[mounted ? currentLocale : defaultLocale]}
    >
      {children}
    </NextIntlClientProvider>
  );
}

/**
 * 언어 변경 훅
 */
export function useChangeLocale() {
  return (newLocale: Locale) => {
    localStorage.setItem('locale', newLocale);
    window.location.reload(); // 간단하게 페이지 새로고침
  };
}
