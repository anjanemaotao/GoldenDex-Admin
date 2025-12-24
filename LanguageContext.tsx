import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations, Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.zhCN;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zhCN');

  // Update HTML lang attribute to control native browser locale (like date picker placeholders)
  useEffect(() => {
    const html = document.documentElement;
    if (language === 'zhCN') html.setAttribute('lang', 'zh-CN');
    else if (language === 'zhTW') html.setAttribute('lang', 'zh-TW');
    else html.setAttribute('lang', 'en');
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
