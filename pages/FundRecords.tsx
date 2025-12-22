
import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Search, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const FundRecords: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAW'>('WITHDRAW');
  const [sigs, setSigs] = useState<Record<string, number>>({ 'W101': 0, 'W102': 1 });

  const handleSign = (id: string) => {
    setSigs(prev => ({ ...prev, [id]: Math.min(prev[id] + 1, 2) }));
  };

  const records = [
    { id: 'W101', uid: '565682', wallet: '0xs4d...5ad', token: 'USDC', network: 'Arbitrum', amount: 2000, time: '2025-12-10 10:31:19', status: 'PENDING' },
    { id: 'W102', uid: '123445', wallet: '0xabc...999', token: 'USDC', network: 'Arbitrum', amount: 5500, time: '2025-12-10 09:12:05', status: 'PROCESSING' },
    { id: 'W103', uid: '881223', wallet: '0xfee...f01', token: 'USDC', network: 'Arbitrum', amount: 150, time: '2025-12-10 08:45:00', status: 'COMPLETED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.funds.title}</h1>
          <p className="text-gray-400">{t.funds.subtitle}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-1 rounded-lg flex">
          <button 
            onClick={() => setActiveTab('DEPOSIT')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'DEPOSIT' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {t.funds.recharge}
          </button>
          <button 
            onClick={() => setActiveTab('WITHDRAW')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'WITHDRAW' ? 'bg-amber-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {t.funds.withdrawals}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl">
          <p className="text-xs text-gray-500 uppercase font-bold mb-1">{t.funds.pendingReq}</p>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-black text-white">12</span>
            <span className="text-sm text-amber-500 mb-1">~ $24,500 USDC</span>
          </div>
        </div>
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl">
          <p className="text-xs text-gray-500 uppercase font-bold mb-1">{t.funds.todayVol}</p>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-black text-white">$142.2K</span>
            <span className="text-sm text-green-500 mb-1">+5% from avg</span>
          </div>
        </div>
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl">
          <p className="text-xs text-gray-500 uppercase font-bold mb-1">{t.funds.buffers}</p>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-black text-white">100%</span>
            <span className="text-sm text-blue-500 mb-1">All cold-vault synced</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search Tx Hash, Wallet, or UID..." 
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-10 text-sm focus:border-amber-500 outline-none"
          />
        </div>
        <select className="bg-gray-900 border border-gray-800 rounded-lg py-2 px-4 text-sm outline-none">
          <option>{t.common.status}: {t.common.all}</option>
          <option>Pending</option>
          <option>Success</option>
          <option>Rejected</option>
        </select>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 text-gray-400 text-xs font-bold uppercase">
            <tr>
              <th className="px-6 py-4">{t.funds.txUid}</th>
              <th className="px-6 py-4">{t.users.assets}</th>
              <th className="px-6 py-4">Network</th>
              <th className="px-6 py-4">{t.common.status}</th>
              <th className="px-6 py-4">{t.funds.approval}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {records.map((rec) => (
              <tr key={rec.id} className="hover:bg-gray-800/20 transition-all">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${activeTab === 'DEPOSIT' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {activeTab === 'DEPOSIT' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-mono text-white">{rec.wallet}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-tighter">UID: {rec.uid} • {rec.time}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-black text-white">{rec.amount.toLocaleString()} <span className="text-xs text-gray-500">{rec.token}</span></div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-gray-800 px-2 py-1 rounded border border-gray-700">{rec.network}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {rec.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-amber-500 animate-pulse" />}
                    <span className={`text-xs font-bold ${rec.status === 'COMPLETED' ? 'text-green-500' : 'text-amber-500'}`}>{rec.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {rec.status === 'COMPLETED' ? (
                    <div className="text-xs text-gray-500 italic">Auto-settled / Approved</div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">Sigs: {sigs[rec.id] || 0}/2</span>
                        <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${(sigs[rec.id] || 0) >= 2 ? 'bg-green-500' : 'bg-amber-500'}`} 
                            style={{ width: `${((sigs[rec.id] || 0) / 2) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleSign(rec.id)}
                          disabled={(sigs[rec.id] || 0) >= 2}
                          className={`p-1.5 rounded-lg border transition-all 
                            ${(sigs[rec.id] || 0) >= 2 
                              ? 'bg-green-500/10 border-green-500/30 text-green-500' 
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20'}
                          `}
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg border border-red-900/30 text-red-500 hover:bg-red-500/10">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FundRecords;
