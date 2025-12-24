import React, { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, LayoutGrid, Calendar, Layers, ChevronDown, Eye } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const MarketWatch: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContract, setSelectedContract] = useState('XAUUSDC');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Contracts list
  const contracts = ['XAUUSDC', 'BTCUSDC', 'ETHUSDC', 'SOLUSDC'];

  // Mock Position Data
  const mockPositions = [
    { 
      id: 'P1001', userWallet: '0xd3e...58e3', contract: 'XAUUSDC', direction: 'LONG', 
      leverage: 20, margin: 5000, marginType: t.market.marginIsolated, entryPrice: 2610.45, liqPrice: 2540.50, pnl: 450, roi: 9, 
      marginRate: 45, status: 'NORMAL', openedAt: '2025-12-10 09:30:12' 
    },
    { 
      id: 'P1002', userWallet: '0x8a2...3211', contract: 'XAUUSDC', direction: 'SHORT', 
      leverage: 50, margin: 2000, marginType: t.market.marginCross, entryPrice: 2655.10, liqPrice: 2685.20, pnl: -120, roi: -6, 
      marginRate: 82, status: 'WARNING', openedAt: '2025-12-10 10:15:45' 
    },
    { 
      id: 'P1003', userWallet: '0x4f1...99bc', contract: 'XAUUSDC', direction: 'LONG', 
      leverage: 10, margin: 15000, marginType: t.market.marginCross, entryPrice: 2595.00, liqPrice: 2410.00, pnl: 2300, roi: 15.3, 
      marginRate: 22, status: 'NORMAL', openedAt: '2025-12-10 11:05:00' 
    },
    { 
      id: 'P1004', userWallet: '0xabc...ef67', contract: 'XAUUSDC', direction: 'SHORT', 
      leverage: 100, margin: 1000, marginType: t.market.marginIsolated, entryPrice: 2645.50, liqPrice: 2652.80, pnl: -850, roi: -85, 
      marginRate: 98, status: 'LIQUIDATING', openedAt: '2025-12-10 11:45:22' 
    },
  ];

  // Mock All Platform Filled History
  const mockFilledHistory = [
    { id: 'T5001', userWallet: '0xd3e...58e3', direction: 'LONG', contract: 'XAUUSDC', orderType: t.market.marketOrder, txType: t.market.txClose, quantity: '10.5', amount: '27,742.50', fee: '13.87', pnl: '450.20', time: '2025-12-10 11:58:22' },
    { id: 'T5002', userWallet: '0x8a2...3211', direction: 'SHORT', contract: 'XAUUSDC', orderType: t.market.limitOrder, txType: t.market.txOpen, quantity: '5.0', amount: '13,210.00', fee: '6.60', pnl: '-', time: '2025-12-10 11:45:10' },
    { id: 'T5003', userWallet: '0x4f1...99bc', direction: 'LONG', contract: 'BTCUSDC', orderType: t.market.marketOrder, txType: t.market.txLiq, quantity: '0.1', amount: '9,850.40', fee: '4.92', pnl: '-210.00', time: '2025-12-10 11:30:05' },
    { id: 'T5004', userWallet: '0xabc...ef67', direction: 'SHORT', contract: 'ETHUSDC', orderType: t.market.limitOrder, txType: t.market.txOpen, quantity: '20.0', amount: '54,200.00', fee: '27.10', pnl: '-', time: '2025-12-10 10:15:22' },
    { id: 'T5005', userWallet: '0x71C...d897', direction: 'LONG', contract: 'SOLUSDC', orderType: t.market.marketOrder, txType: t.market.txClose, quantity: '150.0', amount: '24,000.00', fee: '12.00', pnl: '890.50', time: '2025-12-10 09:45:00' },
  ];

  const filteredPositions = mockPositions.filter(p => 
    p.contract === selectedContract &&
    (p.userWallet.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredHistory = mockFilledHistory.filter(h => 
    (h.userWallet.toLowerCase().includes(searchQuery.toLowerCase()) || h.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const lastPrice = 2642.15;
  const markPrice = 2641.98;
  const spread = Math.abs(markPrice - lastPrice);
  const spreadPct = (spread / lastPrice) * 100;

  const getSpreadStatus = (pct: number) => {
    if (pct < 0.1) return { text: t.market.normal, color: 'text-green-500' };
    if (pct < 1.0) return { text: t.market.warning, color: 'text-amber-500' };
    return { text: t.market.abnormal, color: 'text-red-500' };
  };

  const spreadInfo = getSpreadStatus(spreadPct);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header with Contract Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Eye className="w-6 h-6 mr-3 text-amber-500" />
              {t.market.title}
            </h1>
            <p className="text-gray-400">{t.market.subtitle}</p>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LayoutGrid className="h-4 w-4 text-amber-500" />
            </div>
            <select 
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded-xl py-2 pl-10 pr-10 text-sm font-bold text-amber-500 focus:border-amber-500 outline-none appearance-none cursor-pointer hover:bg-gray-800 transition-colors"
            >
              {contracts.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-amber-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 p-1 rounded-lg flex shrink-0 shadow-inner">
          <button 
            onClick={() => setActiveTab('OPEN')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'OPEN' ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            {t.market.openPositions}
          </button>
          <button 
            onClick={() => setActiveTab('CLOSED')}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'CLOSED' ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            {t.market.closedHistory}
          </button>
        </div>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[
          { label: t.market.lastPrice, value: `$${lastPrice.toLocaleString()}` },
          { label: t.market.indexPrice, value: '$2,641.90' },
          { label: t.market.markPrice, value: `$${markPrice.toLocaleString()}`, color: 'text-amber-400' },
          { label: t.market.oracleLag, value: '1.2s', color: 'text-green-500' },
          { label: t.market.matchingLag, value: '2.1s', color: 'text-blue-500' },
          { label: t.market.priceSpread, value: `${spread.toFixed(2)} (${spreadPct.toFixed(3)}%)`, sub: spreadInfo.text, subColor: spreadInfo.color },
          { label: t.market.longStats, value: '15,240 / 40.2M', sub: '58.2%', subColor: 'text-green-500' },
          { label: t.market.shortStats, value: '10,980 / 29.0M', sub: '41.8%', subColor: 'text-red-500' }
        ].map((item, idx) => (
          <div key={idx} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 flex flex-col justify-between hover:border-gray-700 transition-colors group">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 group-hover:text-gray-400 transition-colors">{item.label}</p>
              <p className={`text-base font-black ${item.color || 'text-white'}`}>{item.value}</p>
            </div>
            {item.sub && (
              <p className={`text-[10px] font-black uppercase mt-1 tracking-tight ${item.subColor}`}>{item.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* Filters Area */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder={t.market.userPlaceholder} 
            className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-10 text-sm focus:border-amber-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Date Range Selector */}
        <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 space-x-3 group hover:border-gray-700 transition-all">
          <Calendar className="w-4 h-4 text-gray-500 group-hover:text-amber-500 transition-colors" />
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{t.market.dateRange}:</span>
            <input 
              type="date" 
              className="bg-transparent text-xs text-gray-300 outline-none [color-scheme:dark]"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
            <span className="text-gray-700">-</span>
            <input 
              type="date" 
              className="bg-transparent text-xs text-gray-300 outline-none [color-scheme:dark]"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>

        {activeTab === 'OPEN' && (
          <select className="bg-gray-900 border border-gray-800 rounded-xl py-2 px-4 text-sm font-medium focus:border-amber-500 outline-none text-gray-400 cursor-pointer">
            <option>{t.common.status}: {t.common.all}</option>
            <option>{t.market.normal}</option>
            <option>{t.market.warning}</option>
            <option>{t.market.liquidating}</option>
          </select>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-3xl overflow-x-auto shadow-2xl">
        {activeTab === 'OPEN' ? (
          <table className="w-full text-left min-w-[1100px]">
            <thead className="bg-gray-800/50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-6 py-5">{t.common.address} / {t.common.id}</th>
                <th className="px-6 py-5">{t.market.direction}</th>
                <th className="px-6 py-5">{t.market.leverage}</th>
                <th className="px-6 py-5">{t.market.margin}</th>
                <th className="px-6 py-5">{t.market.marginType}</th>
                <th className="px-6 py-5">{t.market.entryPrice}</th>
                <th className="px-6 py-5">{t.market.liqPrice}</th>
                <th className="px-6 py-5">{t.market.pnl}</th>
                <th className="px-6 py-5">{t.market.marginRate}</th>
                <th className="px-6 py-5">{t.common.status}</th>
                <th className="px-6 py-5">{t.common.time}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredPositions.map((pos) => (
                <tr key={pos.id} className="hover:bg-amber-500/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-mono text-white group-hover:text-amber-500 transition-colors">{pos.userWallet}</span>
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{pos.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`flex items-center text-sm font-black ${pos.direction === 'LONG' ? 'text-green-500' : 'text-red-500'}`}>
                      {pos.direction === 'LONG' ? <ArrowUpRight className="w-4 h-4 mr-1.5" /> : <ArrowDownRight className="w-4 h-4 mr-1.5" />}
                      {pos.direction === 'LONG' ? t.market.long : t.market.short}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-300 font-bold">{pos.leverage}x</td>
                  <td className="px-6 py-5 text-sm text-gray-300 font-bold">${pos.margin.toLocaleString()}</td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-black px-2 py-1 rounded bg-gray-800 border border-gray-700 text-gray-400 tracking-tight`}>
                      {pos.marginType}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-white font-mono font-bold">${pos.entryPrice.toFixed(2)}</td>
                  <td className="px-6 py-5 text-sm text-amber-500 font-mono font-bold">${pos.liqPrice.toFixed(2)}</td>
                  <td className="px-6 py-5">
                    <div className={`text-sm font-black ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {pos.pnl >= 0 ? '+' : ''}{pos.pnl.toLocaleString()}
                      <span className="text-[10px] ml-1.5 font-bold opacity-80">({pos.roi}%)</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden mb-1.5 shadow-inner">
                      <div 
                        className={`h-full transition-all duration-700 ${pos.marginRate > 80 ? 'bg-red-500' : pos.marginRate > 60 ? 'bg-amber-500' : 'bg-green-500'}`} 
                        style={{ width: `${pos.marginRate}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-tight">{pos.marginRate}% MR</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest
                      ${pos.status === 'NORMAL' ? 'bg-green-500/10 text-green-500' : 
                        pos.status === 'WARNING' ? 'bg-amber-500/10 text-amber-500 animate-pulse' : 
                        'bg-red-500/10 text-red-500 ring-1 ring-red-500/50'}
                    `}>
                      {pos.status === 'NORMAL' ? t.market.normal : pos.status === 'WARNING' ? t.market.warning : t.market.liquidating}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[10px] text-gray-500 font-mono font-bold whitespace-nowrap">
                    {pos.openedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-gray-800/50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-6 py-5">{t.common.id}</th>
                <th className="px-6 py-5">{t.common.address}</th>
                <th className="px-6 py-5">{t.market.direction}</th>
                <th className="px-6 py-5">{t.market.contract}</th>
                <th className="px-6 py-5">{t.market.txType}</th>
                <th className="px-6 py-5">{t.market.orderType}</th>
                <th className="px-6 py-5">{t.market.quantity}</th>
                <th className="px-6 py-5">{t.market.amount}</th>
                <th className="px-6 py-5">{t.market.fee}</th>
                <th className="px-6 py-5">{t.market.realizedPnl}</th>
                <th className="px-6 py-5">{t.common.time}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredHistory.map((trade) => (
                <tr key={trade.id} className="hover:bg-amber-500/[0.01] transition-colors group">
                  <td className="px-6 py-5 text-[10px] text-gray-500 font-mono font-bold tracking-tight">{trade.id}</td>
                  <td className="px-6 py-5 font-mono text-gray-300 text-xs tracking-tighter">{trade.userWallet}</td>
                  <td className="px-6 py-5">
                    <div className={`flex items-center text-xs font-black ${trade.direction === 'LONG' ? 'text-green-500' : 'text-red-500'}`}>
                      {trade.direction === 'LONG' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                      {trade.direction === 'LONG' ? t.market.long : t.market.short}
                    </div>
                  </td>
                  <td className="px-6 py-5 font-black text-white text-sm">
                    <div className="flex items-center space-x-2">
                       <Layers className="w-3 h-3 text-amber-500" />
                       <span className="tracking-tight">{trade.contract}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-black px-2 py-1 rounded tracking-tighter
                      ${trade.txType === t.market.txOpen ? 'bg-green-500/10 text-green-500' : 
                        trade.txType === t.market.txClose ? 'bg-blue-500/10 text-blue-500' : 
                        'bg-red-500/10 text-red-500'}
                    `}>
                      {trade.txType}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md tracking-tighter ${trade.orderType === t.market.marketOrder ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                      {trade.orderType}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-300 font-mono font-bold">{trade.quantity}</td>
                  <td className="px-6 py-5 text-sm text-white font-mono font-bold">${trade.amount}</td>
                  <td className="px-6 py-5 text-sm text-gray-500 font-mono font-medium">{trade.fee}</td>
                  <td className="px-6 py-5">
                    <div className={`text-sm font-black ${trade.pnl.startsWith('-') ? 'text-red-500' : trade.pnl === '-' ? 'text-gray-500' : 'text-green-500'}`}>
                      {trade.pnl === '-' ? '-' : (trade.pnl.startsWith('-') ? '' : '+') + trade.pnl + ' USDC'}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[10px] text-gray-500 font-mono font-bold">{trade.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MarketWatch;