
import React from 'react';
import { Search, UserX, ShieldCheck, Mail, Globe, ExternalLink } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const UserManagement: React.FC = () => {
  const { t } = useLanguage();
  
  const users = [
    { uid: 'U100254', wallet: '0xd3e...58e3', email: 'user1@example.com', registeredAt: '2025-10-01', balance: 12500, lastIp: '192.168.1.1', isFrozen: false },
    { uid: 'U100255', wallet: '0x8a2...3211', email: 'whale@deep.io', registeredAt: '2025-11-12', balance: 450000, lastIp: '45.12.33.2', isFrozen: false },
    { uid: 'U100256', wallet: '0x4f1...99bc', email: 'test@dev.com', registeredAt: '2025-12-01', balance: 50, lastIp: '127.0.0.1', isFrozen: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.users.title}</h1>
          <p className="text-gray-400">{t.users.subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2">
          <span className="text-xs text-gray-500 font-bold uppercase">{t.users.total}:</span>
          <span className="text-sm font-black text-amber-500">892,102</span>
        </div>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder={t.users.placeholder} 
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-10 text-sm focus:border-amber-500 outline-none"
          />
        </div>
        <select className="bg-gray-900 border border-gray-800 rounded-lg py-2 px-4 text-sm focus:border-amber-500 outline-none">
          <option>{t.common.status}: {t.common.all}</option>
          <option>Active</option>
          <option>Frozen</option>
        </select>
        <button className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 px-4 py-2 rounded-lg text-sm font-bold transition-all">
          {t.users.exportBtn}
        </button>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 text-gray-400 text-xs font-bold uppercase">
            <tr>
              <th className="px-6 py-4">{t.users.identity}</th>
              <th className="px-6 py-4">{t.users.assets}</th>
              <th className="px-6 py-4">{t.users.lastLogin}</th>
              <th className="px-6 py-4">{t.users.security}</th>
              <th className="px-6 py-4">{t.common.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user.uid} className="hover:bg-gray-800/20 transition-all group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 font-bold">
                      {user.uid.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center">
                        {user.wallet}
                        <ExternalLink className="w-3 h-3 ml-2 text-gray-600 cursor-pointer hover:text-amber-500" />
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-0.5">
                        <span className="mr-2">UID: {user.uid}</span>
                        <span className="flex items-center"><Mail className="w-3 h-3 mr-1" /> {user.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-black text-amber-500">${user.balance.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500 font-mono">Reg: {user.registeredAt}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-xs text-gray-300">
                    <Globe className="w-3 h-3 mr-1 text-blue-500" />
                    {user.lastIp}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${user.isFrozen ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    {user.isFrozen ? t.users.suspended : t.users.verified}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {user.isFrozen ? (
                      <button className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors" title="Unfreeze">
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Freeze User">
                        <UserX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
