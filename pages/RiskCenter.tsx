import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';
import { ShieldAlert, TrendingDown, Target, LayoutGrid, ChevronDown, Clock, ShieldCheck, Activity, PlusCircle, MinusCircle, Wallet, Coins, Loader2, Shield, Globe, RotateCcw } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const RiskCenter: React.FC = () => {
  const { t, showTip } = useLanguage();
  const [selectedContract, setSelectedContract] = useState('XAUUSDC');

  const contracts = ['XAUUSDC', 'BTCUSDC', 'ETHUSDC', 'SOLUSDC'];

  // Global Insurance Data
  const [insuranceBalanceValue, setInsuranceBalanceValue] = useState(12850200);
  const globalInsurance = {
    usageRate: '0.45%',
    totalPaid: '$420,500'
  };

  // Mock Wallet Balance
  const [walletBalance, setWalletBalance] = useState(15024.50);

  // Modal State
  const [opModal, setOpModal] = useState<{ type: 'RECHARGE' | 'WITHDRAW' | null }>({ type: null });
  const [amount, setAmount] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState(false);
  
  // Multi-sig state for Withdraw
  const [sigCount, setSigCount] = useState(0);

  const handleOpenModal = (type: 'RECHARGE' | 'WITHDRAW') => {
    setAmount('');
    setError(false);
    setSigCount(0);
    setOpModal({ type });
  };

  const handleSign = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError(true);
      return;
    }
    setError(false);
    setIsSigning(true);

    // Simulate Wallet Signing
    setTimeout(() => {
      if (opModal.type === 'RECHARGE') {
        const numAmount = Number(amount);
        setInsuranceBalanceValue(prev => prev + numAmount);
        setWalletBalance(prev => prev - numAmount);
        setIsSigning(false);
        setOpModal({ type: null });
        showTip(t.tips.rechargeSuccess, 'success');
      } else {
        const nextSigCount = sigCount + 1;
        setSigCount(nextSigCount);
        setIsSigning(false);

        if (nextSigCount === 2) {
            handleWithdrawFinish();
        } else {
            showTip(t.tips.paramsSigRecorded.replace('{sigs}', nextSigCount.toString()), 'info');
        }
      }
    }, 1500);
  };

  const handleWithdrawFinish = () => {
    setIsSigning(true);
    setTimeout(() => {
      const numAmount = Number(amount);
      setInsuranceBalanceValue(prev => prev - numAmount);
      setWalletBalance(prev => prev + numAmount);
      setIsSigning(false);
      setOpModal({ type: null });
      showTip(t.tips.withdrawMultiSigComplete, 'success');
    }, 1000);
  };

  const handleResetSig = () => {
    setSigCount(0);
    showTip(t.tips.progressReset, 'info');
  };

  // Mock Data
  const scatterData = [
    { leverage: 10, price: 2600, amount: 50000 },
    { leverage: 20, price: 2615, amount: 20000 },
    { leverage: 50, price: 2635, amount: 150000 },
    { leverage: 100, price: 2638, amount: 80000 },
    { leverage: 125, price: 2640, amount: 250000 },
  ];

  const marginCurveData = [
    { size: 1000, MR: 5 },
    { size: 600000, MR: 45.0 },
  ];

  const liquidationTimelineData = [
    { time: '12-10 09:00', value: 5000 },
    { time: '12-10 10:00', value: 12500 },
    { time: '12-10 11:00', value: 45000 },
    { time: '12-10 11:30', value: 2500 },
    { time: '12-10 12:00', value: 85000 },
    { time: '12-10 12:45', value: 15000 },
  ];

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center tracking-tight">
            <Activity className="w-6 h-6 mr-3 text-amber-500" />
            {t.risk.title}
          </h1>
          <p className="text-gray-400">{t.risk.subtitle}</p>
        </div>
        <div className="px-4 py-2 bg-red-900/20 border border-red-900/40 rounded-lg">
          <span className="text-xs font-bold text-red-500 flex items-center uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4 mr-2" />
            {t.risk.monitoring}
          </span>
        </div>
      </div>

      {/* Global Insurance Metrics (Contract-Independent) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck className="w-12 h-12 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-2">{t.risk.insuranceBalance}</p>
          <p className="text-3xl font-black text-white">${insuranceBalanceValue.toLocaleString()}</p>
          
          <div className="flex space-x-2 mt-4">
            <button 
              onClick={() => handleOpenModal('RECHARGE')}
              className="flex-1 flex items-center justify-center space-x-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 py-2 rounded-xl text-xs font-bold transition-all border border-amber-500/20"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.risk.recharge}</span>
            </button>
            <button 
              onClick={() => handleOpenModal('WITHDRAW')}
              className="flex-1 flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-xl text-xs font-bold transition-all border border-gray-700"
            >
              <MinusCircle className="w-3.5 h-3.5" />
              <span>{t.risk.withdraw}</span>
            </button>
          </div>
        </div>

        {[
          { label: t.risk.insuranceUsage, value: globalInsurance.usageRate, icon: Activity, color: 'text-blue-500' },
          { label: t.risk.insurancePaid, value: globalInsurance.totalPaid, icon: ShieldAlert, color: 'text-amber-500' }
        ].map((item, idx) => (
          <div key={idx} className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <item.icon className={`w-12 h-12 ${item.color}`} />
            </div>
            <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-2">{item.label}</p>
            <p className={`text-3xl font-black text-white`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Contract Selector - Now below global stats */}
      <div className="flex items-center space-x-4 border-t border-gray-800/50 pt-8">
        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{t.nav.contractManager}:</span>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-500">
            <LayoutGrid className="h-4 w-4" />
          </div>
          <select 
            value={selectedContract}
            onChange={(e) => setSelectedContract(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-xl py-2 pl-10 pr-10 text-sm font-bold text-amber-500 focus:border-amber-500 outline-none appearance-none cursor-pointer hover:bg-gray-800 transition-colors border-none"
          >
            {contracts.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-amber-500 pointer-events-none" />
        </div>
      </div>

      {opModal.type && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSigning && setOpModal({ type: null })} />
          <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-6">
              {opModal.type === 'RECHARGE' ? t.risk.modals.rechargeTitle : t.risk.modals.withdrawTitle}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t.risk.modals.chain}</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 h-4 w-4 text-amber-500" />
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none appearance-none text-gray-300 border-none">
                    <option>Arbitrum</option>
                    <option>Ethereum</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t.risk.modals.token}</label>
                <div className="relative">
                  <Coins className="absolute left-3 top-2.5 h-4 w-4 text-amber-500" />
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none appearance-none text-gray-300 border-none">
                    <option>USDC</option>
                    <option>USDT</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 px-1">
                   <label className="text-xs font-bold text-gray-500 uppercase">{t.common.amount}</label>
                   <span className="text-[10px] font-bold text-gray-600 uppercase">
                     {opModal.type === 'RECHARGE' ? t.risk.modals.walletBalance : t.risk.modals.fundBalance}: 
                     <span className="text-amber-500 ml-1">
                       {opModal.type === 'RECHARGE' ? walletBalance.toLocaleString() : insuranceBalanceValue.toLocaleString()} USDC
                     </span>
                   </span>
                </div>
                <div className="relative">
                   <input 
                      type="text" 
                      value={amount}
                      onChange={e => {
                        setAmount(e.target.value);
                        if (error && e.target.value.trim()) setError(false);
                      }}
                      placeholder="0.00"
                      disabled={sigCount > 0}
                      className={`w-full bg-gray-800 border ${error ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]' : 'border-gray-700'} rounded-xl py-2.5 px-4 text-sm font-bold text-white outline-none focus:border-amber-500 transition-all ${sigCount > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                   />
                   {sigCount === 0 && (
                    <button 
                      onClick={() => setAmount(opModal.type === 'RECHARGE' ? walletBalance.toString() : insuranceBalanceValue.toString())}
                      className="absolute right-3 top-2.5 text-[10px] font-black text-amber-500 hover:text-amber-400 uppercase tracking-widest"
                    >
                      Max
                    </button>
                   )}
                </div>
              </div>

              {opModal.type === 'WITHDRAW' && (
                <div className="mt-4 p-4 bg-gray-800/40 border border-gray-800 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-500 tracking-widest">
                    <div className="flex items-center space-x-2">
                       <span>{t.contract.modals.pendingSigs}</span>
                       {sigCount > 0 && (
                        <button 
                          onClick={handleResetSig}
                          className="text-amber-500 hover:text-amber-400 p-1 rounded-md bg-amber-500/5 transition-colors"
                          title={t.risk.modals.resetSig}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                       )}
                    </div>
                    <span className="text-amber-500">{sigCount} / 2</span>
                  </div>
                  <div className="flex space-x-2">
                    {[1, 2].map(n => (
                      <div key={n} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${sigCount >= n ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-gray-700'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 italic">{t.risk.modals.multiSigInfo}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-8">
              <button 
                onClick={() => setOpModal({ type: null })}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-bold text-gray-300 transition-all"
                disabled={isSigning}
              >
                {t.common.cancel}
              </button>
              
              <button 
                onClick={handleSign}
                disabled={isSigning || (opModal.type === 'WITHDRAW' && sigCount >= 2)}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg flex items-center justify-center 
                  ${isSigning ? 'bg-gray-700 cursor-not-allowed' : (opModal.type === 'WITHDRAW' && sigCount >= 2 ? 'bg-gray-800 cursor-default' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-900/20')}`}
              >
                {isSigning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span>Signing...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    <span>{opModal.type === 'WITHDRAW' ? (sigCount === 0 ? t.contract.modals.sign : t.common.confirm) : t.common.confirm}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: t.risk.avgMr, value: '34.2%', sub: t.risk.healthy, color: 'text-amber-500' },
          { label: t.risk.pendingLiq, value: '3', sub: `$12,500 ${t.risk.value}`, color: 'text-red-500' },
          { label: t.risk.inLiq, value: '1', sub: `$42,000 ${t.risk.value}`, color: 'text-orange-500' },
          { label: t.risk.liquidated, value: '142', sub: `$1.2M ${t.risk.value}`, color: 'text-blue-500' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition-all">
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tight opacity-70">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-[32px] p-8 shadow-2xl relative group">
        <h3 className="text-xl font-bold text-gray-200 mb-8 flex items-center">
          <Clock className="w-6 h-6 mr-3 text-amber-500" />
          {t.risk.timelineTitle}
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={liquidationTimelineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#4b5563', fontSize: 11, fontWeight: 700}} 
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#4b5563', fontSize: 11, fontWeight: 700}} 
                tickFormatter={(val) => `$${val}`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '16px', color: '#fff' }}
                itemStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
                cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#f59e0b" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#f59e0b', strokeWidth: 0 }}
                activeDot={{ r: 8, fill: '#fbbf24', stroke: '#fff', strokeWidth: 2 }}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-gray-500 text-xs mt-6 italic font-medium opacity-60">
          {t.risk.timelineDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-gray-300 mb-6 flex items-center">
            <TrendingDown className="w-5 h-5 mr-2 text-blue-500" />
            {t.risk.curveTitle}
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marginCurveData}>
                <defs>
                  <linearGradient id="colorMR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="size" axisLine={false} tick={{fill: '#9ca3af', fontSize: 10}} unit=" USDC" />
                <YAxis axisLine={false} tick={{fill: '#9ca3af', fontSize: 10}} tickFormatter={(val) => `${val}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="MR" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMR)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6 lg:col-span-1">
          <h3 className="text-lg font-bold text-gray-300 mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-red-500" />
            {t.risk.scatterTitle}
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis type="number" dataKey="leverage" name={t.market.leverage} unit="x" axisLine={false} tick={{fill: '#9ca3af', fontSize: 10}} domain={[0, 150]} />
                <YAxis type="number" dataKey="price" name={t.market.liqPrice} axisLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                <ZAxis type="number" dataKey="amount" range={[100, 1000]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Liquidations" data={scatterData} fill="#ef4444" fillOpacity={0.5} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskCenter;