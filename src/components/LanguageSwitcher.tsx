"use client"

import { useTranslation } from "@/lib/i18n/I18nContext";

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex bg-secondary/50 rounded-lg p-1 border border-border">
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
          locale === 'en'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('pt')}
        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
          locale === 'pt'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        PT
      </button>
    </div>
  );
}
