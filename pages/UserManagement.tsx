import React, { useState, useMemo } from 'react';
import { Search, UserX, ShieldCheck, Mail, Globe, ExternalLink, Calendar, AlertTriangle, Users, HelpCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface ExtendedUserAccount {
  uid: string;
  wallet: string;
  email: string;
  registeredAt: string;
  balance: number;
  lastIp: string;
  lastLoginAt: string;
  isFrozen: boolean;
  lastActionReason?: string;
}

const UserManagement: React.FC = () => {
  const { t, showTip } = useLanguage();
  
  const initialUsers: ExtendedUserAccount[] = [
    { uid: 'U100254', wallet: '0xd3e...58e3', email: 'user1@example.com', registeredAt: '2025-10-01', balance: 12500, lastIp: '192.168.1.1', lastLoginAt: '2025-12-10 09:15:22', isFrozen: false, lastActionReason: '异常解除' },
    { uid: 'U100255', wallet: '0x8a2...3211', email: 'whale@deep.io', registeredAt: '2025-11-12', balance: 450000, lastIp: '45.12.33.2', lastLoginAt: '2025-12-10 11:45:10', isFrozen: false },
    { uid: 'U100256', wallet: '0x4f1...99bc', email: 'test@dev.com', registeredAt: '2025-12-01', balance: 50, lastIp: '127.0.0.1', lastLoginAt: '2025-12-05 14:20:00', isFrozen: true, lastActionReason: '异常操作' },
  ];

  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [confirmModal, setConfirmModal] = useState<{ uid: string, wallet: string, action: 'freeze' | 'unfreeze' } | null>(null);
  
  const [reason, setReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAction = () => {
    if (!confirmModal) return;
    
    setIsSubmitted(true);
    if (!reason.trim()) return;
    
    setUsers(prev => prev.map(u => {
      if (u.uid === confirmModal.uid) {
        const isFreezing = confirmModal.action === 'freeze';
        return { 
          ...u, 
          isFrozen: isFreezing,
          lastActionReason: reason 
        };
      }
      return u;
    }));
    
    showTip(confirmModal.action === 'freeze' ? t.tips.userFrozen : t.tips.userUnfrozen, 'info');
    closeModal();
  };

  const closeModal = () => {
    setConfirmModal(null);
    setReason('');
    setIsSubmitted(false);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (statusFilter === 'ACTIVE' && user.isFrozen) return false;
      if (statusFilter === 'FROZEN' && !user.isFrozen) return false;

      const matchesSearch = user.wallet.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (dateRange.start && user.registeredAt < dateRange.start) return false;
      if (dateRange.end && user.registeredAt > dateRange.end) return false;

      return true;
    });
  }, [users, searchQuery, dateRange, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Users className="w-6 h-6 mr-3 text-amber-500" />
            {t.users.title}
          </h1>
          <p className="text-gray-400">{t.users.subtitle}</p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 shadow-xl">
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
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-10 text-sm focus:border-amber-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 space-x-3 group hover:border-gray-700 transition-all">
          <Calendar className="w-4 h-4 text-gray-500 group-hover:text-amber-500 transition-colors" />
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{t.users.regTime}:</span>
            <input 
              type="date" 
              className="bg-transparent text-xs text-gray-300 outline-none [color-scheme:dark] cursor-pointer"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
            <span className="text-gray-700">-</span>
            <input 
              type="date" 
              className="bg-transparent text-xs text-gray-300 outline-none [color-scheme:dark] cursor-pointer"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-900 border border-gray-800 rounded-lg py-2 px-4 text-sm focus:border-amber-500 outline-none text-gray-400 font-bold cursor-pointer"
        >
          <option value="ALL">{t.common.status}: {t.common.all}</option>
          <option value="ACTIVE">{t.users.statusActive}</option>
          <option value="FROZEN">{t.users.statusFrozen}</option>
        </select>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">{t.users.identity}</th>
              <th className="px-6 py-4">{t.users.assets}</th>
              <th className="px-6 py-4">{t.users.regTime}</th>
              <th className="px-6 py-4">{t.users.lastLoginTime}</th>
              <th className="px-6 py-4">{t.users.lastLogin}</th>
              <th className="px-6 py-4">{t.users.security}</th>
              <th className="px-6 py-4">{t.common.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filteredUsers.map((user) => (
              <tr key={user.uid} className="hover:bg-amber-500/[0.01] transition-all group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-bold text-white flex items-center group-hover:text-amber-500 transition-colors">
                      {user.wallet}
                      <ExternalLink className="w-3 h-3 ml-2 text-gray-600 cursor-pointer hover:text-amber-500" />
                    </div>
                    <div className="flex items-center text-[10px] text-gray-500 mt-1 font-bold">
                      <span className="mr-3 uppercase tracking-tighter">UID: {user.uid}</span>
                      <span className="flex items-center"><Mail className="w-3 h-3 mr-1 opacity-50" /> {user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-black text-amber-500">${user.balance.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-gray-400 font-mono font-bold tracking-tight">{user.registeredAt}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-gray-400 font-mono font-bold tracking-tight">{user.lastLoginAt}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-xs text-gray-500 font-mono font-bold">
                    <Globe className="w-3 h-3 mr-1.5 text-blue-500/50" />
                    {user.lastIp}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1.5">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${user.isFrozen ? 'bg-red-500/10 text-red-500 ring-1 ring-red-500/20' : 'bg-green-500/10 text-green-500 ring-1 ring-green-500/20'}`}>
                      {user.isFrozen ? t.users.statusFrozen : t.users.verified}
                    </span>
                    {user.lastActionReason && (
                      <div className="relative group/tooltip">
                        <HelpCircle className="w-4 h-4 text-gray-600 cursor-help hover:text-amber-500 transition-colors" />
                        {/* Tooltip Content */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block z-50 transition-all">
                           <div className="bg-gray-800 text-white text-[10px] font-bold py-2 px-3 rounded-xl shadow-2xl border border-gray-700 whitespace-nowrap">
                             <div className="flex flex-col">
                               <span className="text-gray-500 uppercase text-[8px] mb-0.5">{t.users.lastReason}</span>
                               <span>{user.lastActionReason}</span>
                             </div>
                             {/* Tooltip Arrow */}
                             <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-800" />
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    {user.isFrozen ? (
                      <button 
                        onClick={() => setConfirmModal({ uid: user.uid, wallet: user.wallet, action: 'unfreeze' })}
                        className="p-2 text-green-500 hover:bg-green-500/10 rounded-xl transition-all border border-transparent hover:border-green-500/30" 
                        title="Unfreeze"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => setConfirmModal({ uid: user.uid, wallet: user.wallet, action: 'freeze' })}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/30" 
                        title="Freeze User"
                      >
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

      {confirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-sm bg-gray-900 border border-gray-800 rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`p-4 rounded-3xl ${confirmModal.action === 'freeze' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                 <AlertTriangle className="w-10 h-10" />
              </div>
              <div className="space-y-2 w-full">
                <h3 className="text-xl font-bold text-white">
                  {confirmModal.action === 'freeze' ? t.users.freezeTitle : t.users.unfreezeTitle}
                </h3>
                <p className="text-sm text-gray-400">
                  {confirmModal.action === 'freeze' 
                    ? t.users.freezeDesc.replace('{uid}', confirmModal.uid) 
                    : t.users.unfreezeDesc.replace('{uid}', confirmModal.uid)}
                </p>
                
                <div className="mt-6 text-left space-y-2">
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">
                     {t.users.reasonLabel} <span className="text-red-500">*</span>
                   </label>
                   <textarea 
                     value={reason}
                     onChange={(e) => setReason(e.target.value)}
                     placeholder={t.users.reasonPlaceholder}
                     className={`w-full bg-gray-950 border ${isSubmitted && !reason.trim() ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]' : 'border-gray-800'} rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition-all resize-none h-24`}
                   />
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-8">
              <button 
                onClick={closeModal}
                className="flex-1 px-4 py-3 bg-gray-800/60 hover:bg-gray-700/60 rounded-2xl text-sm font-bold text-gray-300 transition-all border border-gray-700"
              >
                {t.common.cancel}
              </button>
              <button 
                onClick={handleAction}
                className={`flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-white transition-all shadow-lg ${
                  confirmModal.action === 'freeze' 
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-900/20' 
                    : 'bg-green-500 hover:bg-green-600 shadow-green-900/20'
                }`}
              >
                {t.common.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
