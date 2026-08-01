import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language && i18n.language.startsWith('en') ? 'en' : 'es';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'es' ? 'en' : 'es';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
      title={t('language.toggle')}
      aria-label={t('language.toggle')}
    >
      <Globe className="w-4 h-4 text-indigo-600" />
      <span>{currentLang === 'es' ? 'ES' : 'EN'}</span>
    </button>
  );
}

export default LanguageToggle;
