import React, { useState, useMemo } from 'react';
import { ScrollText, Search, User, Globe, Wallet, Clock, Filter, Tag } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface LogRecord {
  id: string;
  type: string;
  userId: string;
  ip: string;
  address: string;
  detail: string;
  time: string;
  category: 'LOGIN' | 'FUNDS' | 'TRADE' | 'POS' | 'RISK' | 'GOV';
}

const AuditLogs: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');

  const logs: LogRecord[] = useMemo(() => [
    // 1. Login & Reg
    { id: 'L1', type: t.logs.types.login, userId: 'U565682', ip: '124.23.45.1', address: '0xs4d5ad...88e1', detail: 'Admin authorized login via wallet signature.', time: '2025-12-10 13:00:12', category: 'LOGIN' },
    { id: 'L2', type: t.logs.types.reg, userId: 'U992233', ip: '45.12.33.2', address: '0x321abc...77d2', detail: 'New account registered on Arbitrum.', time: '2025-12-10 12:55:00', category: 'LOGIN' },
    
    // 2. Funds
    { id: 'F1', type: t.logs.types.deposit, userId: 'U123445', ip: '1.2.3.4', address: '0xabc999...f012', detail: 'Recharge ID: 0x92...81, Chain: Arbitrum, Amount: 5,500 USDC, Block: 1245012', time: '2025-12-10 12:45:00', category: 'FUNDS' },
    { id: 'F2', type: t.logs.types.withdraw, userId: 'U565682', ip: 'internal', address: '0xs4d5ad...88e1', detail: 'Withdrawal ID: W101, Amount: 2,000 USDC, Status: SUCCESS', time: '2025-12-10 12:31:19', category: 'FUNDS' },
    
    // 3. Trade
    { id: 'T1', type: t.logs.types.orderCreate, userId: 'U881223', ip: '92.11.0.4', address: '0xfee01a...d9e3', detail: 'Order ID: 8812, Symbol: XAUUSDC, Side: LONG, Price: 2610.5, Size: 1.2, Nonce: 421', time: '2025-12-10 12:15:22', category: 'TRADE' },
    { id: 'T2', type: t.logs.types.trade, userId: 'U112233', ip: 'internal', address: '0xdead...beef', detail: 'Trade ID: T901, Order: 8712(Buy), Price: 2605.1, Size: 0.5, Maker, Fee: 0.15 USDC', time: '2025-12-10 12:00:05', category: 'TRADE' },
    
    // 4. Pos
    { id: 'P1', type: t.logs.types.posOpen, userId: 'U776655', ip: '11.22.33.44', address: '0x999000...111a', detail: 'Pos ID: P421, Symbol: ETHUSDC, Side: SHORT, Leverage: 50x, Size: 15.0', time: '2025-12-10 11:45:10', category: 'POS' },
    { id: 'P2', type: t.logs.types.liq, userId: 'U443322', ip: 'system', address: '0x3344...eeff', detail: 'Pos ID: P399, Liq Price: 2540.2, Keeper: 0x8a2...3211, Ins Fund Delta: -120.5 USDC', time: '2025-12-10 11:30:11', category: 'POS' },
    
    // 5. Risk
    { id: 'R1', type: t.logs.types.riskMr, userId: 'U100255', ip: '127.0.0.1', address: '0x8a2...3211', detail: 'Risk Ratio: 82.4%, Maintenance Margin Alert Triggered.', time: '2025-12-10 11:15:00', category: 'RISK' },
    { id: 'R2', type: t.logs.types.freeze, userId: 'U100256', ip: '1.2.3.4', address: '0x4f1...99bc', detail: 'Action: FREEZE, Reason: Suspicious arbitrage / wash trading.', time: '2025-12-10 11:00:22', category: 'RISK' },
    
    // 6. Gov
    { id: 'G1', type: t.logs.types.ins, userId: 'System', ip: 'contract', address: 'Vault_0x1', detail: 'Insurance fund change: +250.2 USDC, Source: Liq Penalty.', time: '2025-12-10 10:45:11', category: 'GOV' },
    { id: 'G2', type: t.logs.types.params, userId: 'Admin_Super', ip: '0.0.0.0', address: '0xRoot...8888', detail: 'Param: XAUUSDC MMR, Old: 2.4%, New: 2.5%', time: '2025-12-10 10:30:00', category: 'GOV' },
  ], [t.logs.types]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
        if (catFilter !== 'ALL' && log.category !== catFilter) return false;
        const search = searchQuery.toLowerCase();
        return (
            log.userId.toLowerCase().includes(search) ||
            log.address.toLowerCase().includes(search) ||
            log.ip.toLowerCase().includes(search) ||
            log.detail.toLowerCase().includes(search)
        );
    });
  }, [logs, searchQuery, catFilter]);

  const categories = [
    { label: t.common.all, value: 'ALL' },
    { label: 'Login & Reg', value: 'LOGIN' },
    { label: 'Funds', value: 'FUNDS' },
    { label: 'Trades', value: 'TRADE' },
    { label: 'Positions', value: 'POS' },
    { label: 'Risk', value: 'RISK' },
    { label: 'Governance', value: 'GOV' },
  ];

  return (
    <div className="space-y-6 pb-12">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center tracking-tight">
            <ScrollText className="w-6 h-6 mr-3 text-amber-500" />
            {t.logs.title}
          </h1>
          <p className="text-gray-400 text-sm">{t.logs.subtitle}</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 flex flex-wrap gap-4 items-center shadow-inner">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder={t.logs.placeholder} 
            className="w-full bg-gray-950 border border-gray-800 rounded-xl py-2 pl-10 text-sm focus:border-amber-500 outline-none transition-all text-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 hover:border-gray-700 transition-all">
          <Filter className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Category:</span>
          <select 
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="bg-transparent text-xs text-gray-400 font-bold outline-none cursor-pointer pr-2 appearance-none"
          >
            {categories.map(c => (
              <option key={c.value} value={c.value} className="bg-gray-900">{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Log Table/List */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
            <thead className="bg-gray-800/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                    <th className="px-6 py-5">{t.logs.table.type}</th>
                    <th className="px-6 py-5">{t.logs.table.user}</th>
                    <th className="px-6 py-5">{t.logs.table.ip}</th>
                    <th className="px-6 py-5">{t.logs.table.detail}</th>
                    <th className="px-6 py-5 text-right">{t.logs.table.time}</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
                {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-amber-500/[0.01] transition-all group">
                        <td className="px-6 py-5">
                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest
                                ${log.category === 'LOGIN' ? 'bg-blue-500/10 text-blue-500' : 
                                  log.category === 'GOV' ? 'bg-purple-500/10 text-purple-500' : 
                                  log.category === 'RISK' ? 'bg-red-500/10 text-red-500' : 
                                  log.category === 'TRADE' ? 'bg-emerald-500/10 text-emerald-500' :
                                  'bg-amber-500/10 text-amber-500'}
                            `}>
                                {log.type}
                            </span>
                        </td>
                        <td className="px-6 py-5">
                            <div className="flex flex-col">
                                <div className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors flex items-center">
                                    <User className="w-3 h-3 mr-1.5 opacity-50" />
                                    {log.userId}
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono mt-0.5 flex items-center">
                                    <Wallet className="w-2.5 h-2.5 mr-1.5 opacity-50" />
                                    {log.address}
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-5">
                            <div className="flex items-center text-[10px] text-gray-400 font-mono font-bold tracking-tight">
                                <Globe className="w-3 h-3 mr-1.5 text-blue-500/50" />
                                {log.ip}
                            </div>
                        </td>
                        <td className="px-6 py-5 max-w-md">
                            <p className="text-xs text-gray-300 leading-relaxed font-medium italic group-hover:text-white transition-colors">
                                {log.detail}
                            </p>
                        </td>
                        <td className="px-6 py-5 text-right">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-gray-500 font-mono font-bold flex items-center">
                                    <Clock className="w-2.5 h-2.5 mr-1 opacity-50" />
                                    {log.time.split(' ')[1]}
                                </span>
                                <span className="text-[9px] text-gray-600 font-mono uppercase font-black">{log.time.split(' ')[0]}</span>
                            </div>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                            <div className="flex flex-col items-center justify-center opacity-20">
                                <ScrollText className="w-16 h-16 mb-4" />
                                <p className="text-sm font-black uppercase tracking-widest">{t.common.noData}</p>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
