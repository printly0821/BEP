'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { defaultLocale, localeNames, type Locale } from '@/lib/i18n';

/**
 * 언어 전환 컴포넌트
 *
 * 사용자가 언어를 선택할 수 있는 드롭다운 메뉴를 제공합니다.
 */
export function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // localStorage에서 저장된 언어 불러오기
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'ko' || savedLocale === 'en')) {
      setCurrentLocale(savedLocale);
    }
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    localStorage.setItem('locale', newLocale);
    setCurrentLocale(newLocale);
    window.location.reload(); // 페이지 새로고침으로 언어 변경 적용
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleLocaleChange('ko')}
          className={currentLocale === 'ko' ? 'bg-accent' : ''}
        >
          🇰🇷 한국어
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLocaleChange('en')}
          className={currentLocale === 'en' ? 'bg-accent' : ''}
        >
          🇺🇸 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
