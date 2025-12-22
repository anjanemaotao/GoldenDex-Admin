
import React from 'react';
import { ScrollText, Search, Tag, User } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const AuditLogs: React.FC = () => {
  const { t } = useLanguage();
  
  const logs = [
    { id: 1, type: 'LOGIN', user: 'Admin_Root', detail: 'Successful wallet authorization via 0xRoot...8888', ip: '1.2.3.4', time: '2025-12-10 13:00:12' },
    { id: 2, type: 'CONFIG', user: 'Admin_Risk', detail: 'Adjusted MMR for XAUUSDC from 2.4% to 2.5%', ip: '1.2.3.5', time: '2025-12-10 12:45:00' },
    { id: 3, type: 'USER', user: 'Admin_Root', detail: 'Suspended user UID: U100256 for suspicious funding patterns', ip: '1.2.3.4', time: '2025-12-10 12:30:11' },
    { id: 4, type: 'WITHDRAW', user: 'System_Bot', detail: 'Automated withdrawal settlement for TX: 0x82...221', ip: 'internal', time: '2025-12-10 12:15:00' },
  ];

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <ScrollText className="w-6 h-6 mr-3 text-amber-500" />
            {t.logs.title}
          </h1>
          <p className="text-gray-400">{t.logs.subtitle}</p>
        </div>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder={t.logs.placeholder} 
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-10 text-sm focus:border-amber-500 outline-none"
          />
        </div>
        <select className="bg-gray-900 border border-gray-800 rounded-lg py-2 px-4 text-sm outline-none">
          <option>{t.common.type}: {t.common.all}</option>
          <option>Login</option>
          <option>Config Change</option>
          <option>Risk Trigger</option>
        </select>
      </div>

      <div className="space-y-3">
        {logs.map(log => (
          <div key={log.id} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex items-center group hover:border-amber-500/30 transition-all">
            <div className="mr-6 flex-shrink-0">
               <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest
                 ${log.type === 'LOGIN' ? 'bg-blue-500/10 text-blue-500' : 
                   log.type === 'CONFIG' ? 'bg-purple-500/10 text-purple-500' : 
                   log.type === 'USER' ? 'bg-red-500/10 text-red-500' : 
                   'bg-green-500/10 text-green-500'}
               `}>
                 {log.type}
               </span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-200">{log.detail}</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-[10px] text-gray-500 flex items-center font-mono">
                  <User className="w-2.5 h-2.5 mr-1" /> {log.user}
                </span>
                <span className="text-[10px] text-gray-500 flex items-center font-mono">
                  <Tag className="w-2.5 h-2.5 mr-1" /> {log.ip}
                </span>
              </div>
            </div>
            <div className="text-right text-[10px] text-gray-600 font-mono">
              {log.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLogs;
