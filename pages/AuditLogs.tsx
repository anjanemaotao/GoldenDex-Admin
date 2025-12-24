import React, { useState, useMemo } from 'react';
import { ScrollText, Search, User, Globe, Wallet, Clock, Filter, Calendar } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface LogRecord {
  id: string;
  typeKey: string; // key into t.logs.types
  userId: string;
  ip: string;
  address: string;
  time: string;
  category: 'LOGIN' | 'FUNDS' | 'TRADE' | 'POS' | 'RISK' | 'GOV';
  meta: Record<string, any>;
}

const AuditLogs: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const logs: LogRecord[] = useMemo(() => [
    // 1. Login & Reg
    { id: 'L1', typeKey: 'adminLogin', userId: 'Root_A1', ip: '2.2.2.2', address: '0xRoot...8888', time: '2025-12-10 13:00:12', category: 'LOGIN', meta: { ip: '2.2.2.2' } },
    { id: 'L2', typeKey: 'login', userId: 'U565682', ip: '92.11.0.4', address: '0xs4d5ad...88e1', time: '2025-12-10 12:58:30', category: 'LOGIN', meta: { ip: '92.11.0.4' } },
    { id: 'L3', typeKey: 'reg', userId: 'U992233', ip: '45.12.33.2', address: '0x321abc...77d2', time: '2025-12-10 12:55:00', category: 'LOGIN', meta: { net: 'Arbitrum' } },
    
    // 2. Funds
    { id: 'F1', typeKey: 'deposit', userId: 'U123445', ip: '1.2.3.4', address: '0xabc999...f012', time: '2025-12-10 12:45:00', category: 'FUNDS', meta: { id: 'D223', qty: '23.42', net: 'Arbitrum', status: t.funds.statusText.completed } },
    { id: 'F2', typeKey: 'withdraw', userId: 'U565682', ip: 'internal', address: '0xs4d5ad...88e1', time: '2025-12-10 12:31:19', category: 'FUNDS', meta: { id: 'W223', qty: '23.42', net: 'Arbitrum', status: t.funds.statusText.completed } },
    
    // 3. Trade
    { id: 'T1', typeKey: 'orderCreate', userId: 'U881223', ip: '92.11.0.4', address: '0xfee01a...d9e3', time: '2025-12-10 12:15:22', category: 'TRADE', meta: { id: 'O223', side: t.market.long, sym: 'XAUUSDC', lev: '20', qty: '23.42', price: '2234.22', type: t.market.limitOrder, fee: '2.34' } },
    { id: 'T3', typeKey: 'orderCancel', userId: 'U881223', ip: '92.11.0.4', address: '0xfee01a...d9e3', time: '2025-12-10 12:18:05', category: 'TRADE', meta: { id: 'O223' } },
    { id: 'T2', typeKey: 'trade', userId: 'U112233', ip: 'internal', address: '0xdead...beef', time: '2025-12-10 12:00:05', category: 'TRADE', meta: { id: 'O223', sym: 'XAUUSDC', side: t.market.long, qty: '23.42', price: '2234.22', type: t.market.marketOrder, pnl: '23.23', fee: '2.34', time: '2025-12-10 12:00:05' } },
    
    // 4. Position
    { id: 'P1', typeKey: 'posOpen', userId: 'U776655', ip: '11.22.33.44', address: '0x999000...111a', time: '2025-12-10 11:45:10', category: 'POS', meta: { id: 'P223', sym: 'XAUUSDC', side: t.market.long, lev: '20', qty: '23.42', price: '2234.22' } },
    { id: 'P2', typeKey: 'posChange', userId: 'U565682', ip: 'internal', address: '0xs4d...5ad', time: '2025-12-10 11:35:00', category: 'POS', meta: { id: 'P223', sym: 'XAUUSDC', side: t.market.long, lev: '20', qty: '23.42', price: '2234.22' } },
    { id: 'P4', typeKey: 'liq', userId: 'U443322', ip: 'system', address: '0x3344...eeff', time: '2025-12-10 11:30:11', category: 'POS', meta: { id: 'P223', sym: 'XAUUSDC', side: t.market.long, lev: '20', price: '3423.23', qty: '23.42', fee: '234.22', keeper: '0x23k3...2ikss' } },
    
    // 5. Risk (Insurance Fund and Oracle)
    { id: 'R1', typeKey: 'riskMr', userId: 'U100255', ip: '127.0.0.1', address: '0x8a2...3211', time: '2025-12-10 11:15:00', category: 'RISK', meta: { sym: 'XAUUSDC', id: 'P233', mr: '84', limit: '80' } },
    { id: 'R2', typeKey: 'riskPrice', userId: 'Oracle', ip: 'oracle', address: '0xFeed...Abc1', time: '2025-12-10 11:10:00', category: 'RISK', meta: { sym: 'XAUUSDC', spread: '3.3', limit: '1' } },
    { id: 'R3', typeKey: 'riskLimit', userId: 'U10244', ip: '155.23.4.1', address: '0xabc...111', time: '2025-12-10 11:05:00', category: 'RISK', meta: { type: t.params.labels.orderFreq } },
    
    // 6. Gov (Insurance Fund)
    { id: 'G1', typeKey: 'ins', userId: 'Insurance Fund', ip: 'contract', address: '0xVault...Ins1', time: '2025-12-10 10:45:11', category: 'GOV', meta: { delta: '+250.2', source: t.funds.recharge } },
    { id: 'G2', typeKey: 'params', userId: 'Root_A1', ip: '0.0.0.0', address: '0xRoot...8888', time: '2025-12-10 10:30:00', category: 'GOV', meta: { key: 'XAUUSDC 最大杠杆倍数', old: '2.4%', new: '2.5%' } },
  ], [t.logs.types, t.funds.statusText, t.market, t.params.labels.orderFreq, t.funds.recharge]);

  const formatDetail = (log: LogRecord) => {
    const template = (t.logs.details as any)[log.typeKey];
    if (!template) return log.typeKey;
    
    let detail = template;
    Object.keys(log.meta).forEach(key => {
        detail = detail.replace(`{${key}}`, log.meta[key]);
    });
    return detail;
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
        // Category filter
        if (catFilter !== 'ALL' && log.category !== catFilter) return false;
        
        // Search query
        const search = searchQuery.toLowerCase();
        const typeStr = (t.logs.types as any)[log.typeKey]?.toLowerCase() || '';
        const matchesSearch = log.userId.toLowerCase().includes(search) ||
                            log.address.toLowerCase().includes(search) ||
                            log.ip.toLowerCase().includes(search) ||
                            typeStr.includes(search);
        if (!matchesSearch) return false;

        // Date range filter
        const logDate = log.time.split(' ')[0];
        if (dateRange.start && logDate < dateRange.start) return false;
        if (dateRange.end && logDate > dateRange.end) return false;

        return true;
    });
  }, [logs, searchQuery, catFilter, dateRange, t.logs.types]);

  const categories = useMemo(() => [
    { label: t.logs.categories.all, value: 'ALL' },
    { label: t.logs.categories.login, value: 'LOGIN' },
    { label: t.logs.categories.funds, value: 'FUNDS' },
    { label: t.logs.categories.trade, value: 'TRADE' },
    { label: t.logs.categories.pos, value: 'POS' },
    { label: t.logs.categories.risk, value: 'RISK' },
    { label: t.logs.categories.gov, value: 'GOV' },
  ], [t.logs.categories]);

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

        {/* Date Range Filter */}
        <div className="flex items-center bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 space-x-3 group hover:border-gray-700 transition-all">
          <Calendar className="w-4 h-4 text-gray-500 group-hover:text-amber-500 transition-colors" />
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{t.market.dateRange}:</span>
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
        
        <div className="flex items-center space-x-2 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 hover:border-gray-700 transition-all">
          <Filter className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{t.alerts.filterType}:</span>
          <select 
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="bg-transparent text-xs text-gray-300 font-bold outline-none cursor-pointer pr-2 appearance-none"
          >
            {categories.map(c => (
              <option key={c.value} value={c.value} className="bg-gray-900">{c.label}</option>
            ))}
          </select>
        </div>
      </div>

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
                                {(t.logs.types as any)[log.typeKey]}
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
                                {formatDetail(log)}
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
