import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations, Language } from './translations';
import { BellRing, X } from 'lucide-react';

interface ToastState {
  show: boolean;
  msg: string;
  type: 'success' | 'info' | 'error';
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.zhCN;
  showTip: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zhCN');
  const [toast, setToast] = useState<ToastState>({ show: false, msg: '', type: 'success' });

  // Update HTML lang attribute to control native browser locale (like date picker placeholders)
  useEffect(() => {
    const html = document.documentElement;
    if (language === 'zhCN') html.setAttribute('lang', 'zh-CN');
    else if (language === 'zhTW') html.setAttribute('lang', 'zh-TW');
    else html.setAttribute('lang', 'en');
  }, [language]);

  const showTip = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const value = {
    language,
    setLanguage,
    t: translations[language],
    showTip
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
      
      {/* Global Toast Component */}
      <div className={`fixed top-8 right-8 z-[2000] transform transition-all duration-500 ease-out ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center space-x-4 p-4 rounded-2xl shadow-2xl border min-w-[320px] backdrop-blur-xl ${
          toast.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 
          toast.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' :
          'bg-amber-500/10 border-amber-500/50 text-amber-400'
        }`}>
          <div className="p-2 rounded-xl bg-white/5">
            <BellRing className="w-5 h-5" />
          </div>
          <div className="flex-1 flex flex-col">
            <span className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-0.5">GoldenDex Terminal</span>
            <span className="text-sm font-bold leading-tight">{toast.msg}</span>
          </div>
          <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="p-1.5 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
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
