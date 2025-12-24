import React, { useState, useMemo } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield, 
  Calendar,
  Filter,
  Wallet,
  Coins,
  AlertCircle,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

type MainTab = 'DEPOSIT' | 'WITHDRAW';
type WithdrawSubTab = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'FAILED';

interface FundRecord {
  id?: string;
  uid: string;
  wallet: string;
  token: string;
  network: string;
  amount: number;
  time: string;
  status?: string;
}

const FundRecords: React.FC = () => {
  const { t } = useLanguage();
  const [mainTab, setMainTab] = useState<MainTab>('WITHDRAW');
  const [withdrawTab, setWithdrawTab] = useState<WithdrawSubTab>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [tokenFilter, setTokenFilter] = useState('USDC');
  const [networkFilter, setNetworkFilter] = useState('Arbitrum');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Mock State for Multi-sig Simulation
  const [sigs, setSigs] = useState<Record<string, number>>({ 'W101': 0, 'W102': 1 });
  const [signingId, setSigningId] = useState<string | null>(null);
  
  // Rejection state
  const [rejectModal, setRejectModal] = useState<{ id: string, uid: string } | null>(null);

  // Use state for withdraw records to allow status updates
  const [withdrawRecords, setWithdrawRecords] = useState<FundRecord[]>([
    { id: 'W101', uid: '565682', wallet: '0xs4d5ad...88e1', token: 'USDC', network: 'Arbitrum', amount: 2000, time: '2025-12-10 10:31:19', status: 'PENDING' },
    { id: 'W102', uid: '123445', wallet: '0xabc999...f012', token: 'USDC', network: 'Arbitrum', amount: 5500, time: '2025-12-10 09:12:05', status: 'PENDING' },
    { id: 'W103', uid: '881223', wallet: '0xfee01a...d9e3', token: 'USDC', network: 'Arbitrum', amount: 150, time: '2025-12-10 08:45:00', status: 'PROCESSING' },
    { id: 'W104', uid: '992233', wallet: '0x321abc...77d2', token: 'USDC', network: 'Arbitrum', amount: 12000, time: '2025-12-09 14:20:11', status: 'COMPLETED' },
    { id: 'W105', uid: '776655', wallet: '0x999000...111a', token: 'USDC', network: 'Arbitrum', amount: 800, time: '2025-12-09 10:10:05', status: 'REJECTED' },
    { id: 'W106', uid: '112233', wallet: '0xdead...beef', token: 'USDC', network: 'Arbitrum', amount: 50, time: '2025-12-08 22:30:45', status: 'FAILED' },
  ]);

  const depositRecords = useMemo(() => [
    { uid: '565682', wallet: '0xs4d5ad...88e1', token: 'USDC', network: 'Arbitrum', amount: 2000, time: '2025-12-10 10:31:19' },
    { uid: '123445', wallet: '0xabc999...f012', token: 'USDC', network: 'Arbitrum', amount: 5500, time: '2025-12-10 09:12:05' },
    { uid: '881223', wallet: '0xfee01a...d9e3', token: 'USDC', network: 'Arbitrum', amount: 150, time: '2025-12-10 08:45:00' },
  ], []);

  const handleApprove = (id: string) => {
    setSigningId(id);
    // Simulate wallet signing delay
    setTimeout(() => {
      setSigs(prev => {
        const newVal = Math.min((prev[id] || 0) + 1, 2);
        if (newVal === 2) {
            // Once 2 sigs reached, mark as completed in mock state after a small delay
            setTimeout(() => {
                setWithdrawRecords(list => list.map(r => r.id === id ? { ...r, status: 'COMPLETED' } : r));
            }, 500);
        }
        return { ...prev, [id]: newVal };
      });
      setSigningId(null);
    }, 1500);
  };

  const handleRejectConfirm = () => {
    if (!rejectModal) return;
    setWithdrawRecords(list => list.map(r => r.id === rejectModal.id ? { ...r, status: 'REJECTED' } : r));
    setRejectModal(null);
  };

  const filteredData = useMemo(() => {
    if (mainTab === 'DEPOSIT') {
      return depositRecords.filter(r => 
        (r.uid.includes(searchQuery) || r.wallet.includes(searchQuery)) &&
        r.token === tokenFilter &&
        r.network === networkFilter
      );
    } else {
      return withdrawRecords.filter(r => 
        r.status === withdrawTab &&
        (r.uid.includes(searchQuery) || r.wallet.includes(searchQuery)) &&
        r.token === tokenFilter &&
        r.network === networkFilter
      );
    }
  }, [mainTab, withdrawTab, searchQuery, tokenFilter, networkFilter, depositRecords, withdrawRecords]);

  // Statistics calculation based on requirements
  const stats = useMemo(() => {
    if (mainTab === 'DEPOSIT') {
      return {
        count: depositRecords.length,
        amount: depositRecords.reduce((acc, curr) => acc + curr.amount, 0)
      };
    } else {
      const filteredForStats = withdrawRecords.filter(r => r.status === withdrawTab);
      return {
        count: filteredForStats.length,
        amount: filteredForStats.reduce((acc, curr) => acc + curr.amount, 0)
      };
    }
  }, [mainTab, withdrawTab, depositRecords, withdrawRecords]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Top Header & Main Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
            <Wallet className="w-6 h-6 mr-3 text-amber-500" />
            {t.funds.title}
          </h1>
          <p className="text-gray-400 text-sm">{t.funds.subtitle}</p>
        </div>
        <div className="bg-gray-900/80 border border-gray-800 p-1 rounded-xl flex shadow-lg">
          <button 
            onClick={() => setMainTab('DEPOSIT')}
            className={`px-8 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${mainTab === 'DEPOSIT' ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {t.funds.recharge}
          </button>
          <button 
            onClick={() => setMainTab('WITHDRAW')}
            className={`px-8 py-2.5 rounded-lg text-sm font-black uppercase tracking-widest transition-all ${mainTab === 'WITHDRAW' ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {t.funds.withdrawals}
          </button>
        </div>
      </div>

      {/* Sub-tabs for Withdrawals Only */}
      {mainTab === 'WITHDRAW' && (
        <div className="flex space-x-2 border-b border-gray-800/50 pb-px">
          {(['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED', 'FAILED'] as WithdrawSubTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setWithdrawTab(tab)}
              className={`px-4 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${
                withdrawTab === tab 
                  ? 'border-amber-500 text-amber-500 bg-amber-500/5' 
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
              }`}
            >
              {t.funds.tabs[tab.toLowerCase() as keyof typeof t.funds.tabs]}
            </button>
          ))}
        </div>
      )}

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Coins className="w-24 h-24 text-amber-500" />
          </div>
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">
            {mainTab === 'DEPOSIT' ? t.funds.stats.totalCount : t.funds.stats[`${withdrawTab.toLowerCase()}Count` as keyof typeof t.funds.stats]}
          </p>
          <div className="flex items-end space-x-3">
            <span className="text-4xl font-black text-white">{stats.count}</span>
            <span className="text-xs font-bold text-gray-500 mb-1.5 uppercase">Records</span>
          </div>
        </div>
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wallet className="w-24 h-24 text-blue-500" />
          </div>
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1.5">
            {mainTab === 'DEPOSIT' ? t.funds.stats.totalAmount : t.funds.stats[`${withdrawTab.toLowerCase()}Amount` as keyof typeof t.funds.stats]}
          </p>
          <div className="flex items-end space-x-3">
            <span className="text-4xl font-black text-amber-500">{stats.amount.toLocaleString()}</span>
            <span className="text-xs font-bold text-gray-500 mb-1.5 uppercase">USDC</span>
          </div>
        </div>
      </div>

      {/* Search Bar & Advanced Filters */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 flex flex-wrap gap-4 items-center shadow-inner">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search Wallet Address or UID..." 
            className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 pl-10 text-sm focus:border-amber-500 outline-none transition-all text-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 space-x-3 group hover:border-gray-700 transition-all">
          <Calendar className="w-4 h-4 text-gray-500 group-hover:text-amber-500 transition-colors" />
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{t.funds.filters.dateRange}:</span>
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

        <div className="flex space-x-2">
          <div className="relative">
            <select 
              value={tokenFilter}
              onChange={(e) => setTokenFilter(e.target.value)}
              className="bg-gray-950 border border-gray-800 rounded-xl py-2 px-4 text-xs font-bold text-gray-400 outline-none focus:border-amber-500 transition-colors cursor-pointer appearance-none pr-8"
            >
              <option value="USDC">USDC</option>
              <option value="ETH">ETH</option>
              <option value="BTC">BTC</option>
            </select>
            <Filter className="w-3 h-3 text-gray-600 absolute right-3 top-3 pointer-events-none" />
          </div>
          <div className="relative">
            <select 
              value={networkFilter}
              onChange={(e) => setNetworkFilter(e.target.value)}
              className="bg-gray-950 border border-gray-800 rounded-xl py-2 px-4 text-xs font-bold text-gray-400 outline-none focus:border-amber-500 transition-colors cursor-pointer appearance-none pr-8"
            >
              <option value="Arbitrum">Arbitrum</option>
              <option value="Ethereum">Ethereum</option>
              <option value="Solana">Solana</option>
              <option value="Polygon">Polygon</option>
            </select>
            <Filter className="w-3 h-3 text-gray-600 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              {mainTab === 'WITHDRAW' && <th className="px-6 py-5 w-16">#</th>}
              <th className="px-6 py-5">{t.funds.table.uid} | {t.funds.table.address}</th>
              <th className="px-6 py-5">{t.funds.table.token}</th>
              <th className="px-6 py-5">{t.funds.table.network}</th>
              <th className="px-6 py-5">{mainTab === 'DEPOSIT' ? t.funds.table.quantity : t.funds.table.withdrawQty}</th>
              <th className="px-6 py-5">{t.funds.table.time}</th>
              {mainTab === 'WITHDRAW' && <th className="px-6 py-5 text-right">{t.common.status} / {t.funds.table.actions}</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filteredData.length > 0 ? filteredData.map((rec, idx) => (
              <tr key={idx} className="hover:bg-amber-500/[0.01] transition-all group">
                {mainTab === 'WITHDRAW' && <td className="px-6 py-5 text-xs text-gray-600 font-mono">{(rec as any).id}</td>}
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl transition-colors ${mainTab === 'DEPOSIT' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {mainTab === 'DEPOSIT' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-mono font-bold text-white group-hover:text-amber-500 transition-colors tracking-tight">{rec.wallet}</div>
                      <div className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">UID: {rec.uid}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-sm font-black text-white">{rec.token}</span>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[10px] font-black uppercase bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-700 text-gray-400 tracking-tighter">{rec.network}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-black text-amber-500">{rec.amount.toLocaleString()} <span className="text-[10px] text-gray-500 font-bold tracking-tighter">USDC</span></div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-[10px] text-gray-500 font-mono font-bold">{rec.time}</div>
                </td>
                {mainTab === 'WITHDRAW' && (
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end space-x-4">
                      {withdrawTab === 'PENDING' ? (
                        <>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-500 uppercase font-black mb-1.5 tracking-tighter">
                              {t.funds.table.sigStatus}: {sigs[(rec as any).id] || 0}/2
                            </span>
                            <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                              <div 
                                className={`h-full transition-all duration-700 shadow-sm ${(sigs[(rec as any).id] || 0) >= 2 ? 'bg-green-500 shadow-green-500/50' : 'bg-amber-500 shadow-amber-500/50'}`} 
                                style={{ width: `${((sigs[(rec as any).id] || 0) / 2) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleApprove((rec as any).id)}
                              disabled={signingId === (rec as any).id || (sigs[(rec as any).id] || 0) >= 2}
                              className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center
                                ${(sigs[(rec as any).id] || 0) >= 2 
                                  ? 'bg-green-500/10 border-green-500/30 text-green-500 cursor-default' 
                                  : 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20 active:scale-95'}
                              `}
                            >
                              {signingId === (rec as any).id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Shield className="w-3 h-3 mr-1" />}
                              {t.funds.table.approve}
                            </button>
                            <button 
                              onClick={() => setRejectModal({ id: (rec as any).id, uid: rec.uid })}
                              className="p-1.5 rounded-xl border border-red-900/30 text-red-500 hover:bg-red-500/10 active:scale-95 transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center space-x-2">
                           {withdrawTab === 'COMPLETED' && <CheckCircle className="w-4 h-4 text-green-500" />}
                           {withdrawTab === 'PROCESSING' && <Clock className="w-4 h-4 text-blue-500 animate-pulse" />}
                           {withdrawTab === 'REJECTED' && <XCircle className="w-4 h-4 text-red-500" />}
                           {withdrawTab === 'FAILED' && <AlertCircle className="w-4 h-4 text-gray-500" />}
                           <span className={`text-[10px] font-black uppercase tracking-widest ${
                             withdrawTab === 'COMPLETED' ? 'text-green-500' :
                             withdrawTab === 'PROCESSING' ? 'text-blue-500' :
                             withdrawTab === 'REJECTED' ? 'text-red-500' :
                             withdrawTab === 'FAILED' ? 'text-gray-500' : ''
                           }`}>
                             {t.funds.statusText[withdrawTab.toLowerCase() as keyof typeof t.funds.statusText]}
                           </span>
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan={mainTab === 'WITHDRAW' ? 7 : 6} className="px-6 py-20 text-center">
                   <div className="flex flex-col items-center justify-center opacity-20">
                     <Coins className="w-16 h-16 mb-4" />
                     <p className="text-sm font-black uppercase tracking-widest">{t.common.noData}</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reject Confirmation Modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setRejectModal(null)} />
          <div className="relative w-full max-w-sm bg-gray-900 border border-gray-800 rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-3xl bg-red-500/10 text-red-500">
                 <AlertTriangle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{t.funds.modals.rejectTitle}</h3>
                <p className="text-sm text-gray-400">
                  {t.funds.modals.rejectDesc.replace('{id}', rejectModal.id).replace('{uid}', rejectModal.uid)}
                </p>
              </div>
            </div>
            <div className="flex space-x-3 mt-8">
              <button 
                onClick={() => setRejectModal(null)}
                className="flex-1 px-4 py-3 bg-gray-800/60 hover:bg-gray-700/60 rounded-2xl text-sm font-bold text-gray-300 transition-all border border-gray-700"
              >
                {t.common.cancel}
              </button>
              <button 
                onClick={handleRejectConfirm}
                className="flex-1 px-4 py-3 rounded-2xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-900/20"
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

export default FundRecords;