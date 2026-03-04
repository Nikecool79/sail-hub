import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export function useLocalizedField() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('sv') ? 'sv' : 'en';

  const localize = useCallback(
    <T extends Record<string, any>>(obj: T, field: string): string => {
      const svKey = `${field}Sv` as keyof T;
      const enKey = `${field}En` as keyof T;
      const svVal = obj[svKey] as string;
      const enVal = obj[enKey] as string;

      if (lang === 'sv') return svVal || enVal || '';
      return enVal || svVal || '';
    },
    [lang]
  );

  return { localize, lang };
}
