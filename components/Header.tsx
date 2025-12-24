import React, { useState, useRef, useEffect } from 'react';
import { Wallet as WalletIcon, ChevronDown, Copy, LogOut, Check, Shield } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Language } from '../translations';

interface HeaderProps {
  address: string;
  onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ address, onDisconnect }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'zhCN', label: '简' },
    { code: 'zhTW', label: '繁' },
  ];

  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-end px-8 sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center space-x-4">
        {/* Language Switcher */}
        <div className="flex items-center bg-gray-900/80 border border-gray-800 rounded-lg p-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all duration-200 ${
                language === lang.code
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Authenticated Wallet Display */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-3 py-1 text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-full">
               <Shield className="w-3 h-3" />
               <span className="uppercase tracking-tight">{t.admin.roles.super}</span>
            </div>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800 transition-all duration-300 font-mono text-xs font-bold"
            >
              <WalletIcon className="h-4 w-4" />
              <span>{shortenedAddress}</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-gray-800 mb-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t.header.connected}</p>
                <p className="text-xs font-mono text-gray-200 break-all">{address}</p>
              </div>
              
              <div className="space-y-1">
                <button 
                  onClick={handleCopy}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
                >
                  <div className="flex items-center">
                    <Copy className="w-4 h-4 mr-2" />
                    {t.header.copy}
                  </div>
                  {copied && <Check className="w-3 h-3 text-green-500" />}
                </button>
                
                <button 
                  onClick={onDisconnect}
                  className="w-full flex items-center px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.header.disconnect}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;