import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { ShieldAlert, TrendingDown, Target, LayoutGrid, ChevronDown, Clock, ShieldCheck, Activity } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const RiskCenter: React.FC = () => {
  const { t } = useLanguage();
  const [selectedContract, setSelectedContract] = useState('XAUUSDC');

  const contracts = ['XAUUSDC', 'BTCUSDC', 'ETHUSDC', 'SOLUSDC'];

  // Global Insurance Data
  const globalInsurance = {
    balance: '$12,850,200',
    usageRate: '0.45%',
    totalPaid: '$420,500'
  };

  // Mock Data per Contract
  const scatterData = [
    { leverage: 10, price: 2600, amount: 50000 },
    { leverage: 20, price: 2615, amount: 20000 },
    { leverage: 50, price: 2635, amount: 150000 },
    { leverage: 100, price: 2638, amount: 80000 },
    { leverage: 125, price: 2640, amount: 250000 },
    { leverage: 25, price: 2620, amount: 30000 },
    { leverage: 75, price: 2630, amount: 120000 },
  ];

  const marginCurveData = [
    { size: 1000, MR: 5 },
    { size: 15000, MR: 5.5 },
    { size: 45000, MR: 7.2 },
    { size: 85000, MR: 10.5 },
    { size: 150000, MR: 16.8 },
    { size: 280000, MR: 24.5 },
    { size: 450000, MR: 36.2 },
    { size: 600000, MR: 45.0 },
  ];

  const timelineData = [
    { time: '12-10 09:00', amount: 5000 },
    { time: '12-10 10:00', amount: 12000 },
    { time: '12-10 11:00', amount: 45000 },
    { time: '12-10 11:30', amount: 2500 },
    { time: '12-10 12:00', amount: 85000 },
    { time: '12-10 12:45', amount: 15000 },
  ];

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white transition-all duration-300">{t.risk.title}</h1>
          <p className="text-gray-400">{t.risk.subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
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
          <div className="px-4 py-2 bg-red-900/20 border border-red-900/40 rounded-lg">
            <span className="text-xs font-bold text-red-500 flex items-center uppercase tracking-widest">
              <ShieldAlert className="w-4 h-4 mr-2" />
              {t.risk.monitoring}
            </span>
          </div>
        </div>
      </div>

      {/* Global Insurance Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: t.risk.insuranceBalance, value: globalInsurance.balance, icon: ShieldCheck, color: 'text-green-500' },
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

      {/* Contract Specific Stats */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Margin Rate Grading Curve */}
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
                <XAxis 
                  dataKey="size" 
                  axisLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 10}} 
                  unit=" USDC" 
                  name={t.risk.nominalValue}
                />
                <YAxis 
                  axisLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 10}} 
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip 
                  labelFormatter={(val) => `${t.risk.nominalValue}: ${val} USDC`}
                  formatter={(value: number) => [`${value}%`, 'MR']}
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="MR" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMR)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center italic font-medium">{t.risk.curveDesc}</p>
        </div>

        {/* Liquidation Timeline */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-gray-300 mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-amber-500" />
            {t.risk.timelineTitle}
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                <YAxis axisLine={false} tick={{fill: '#9ca3af', fontSize: 10}} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()} USDC`, t.risk.liqValue]}
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#f59e0b" strokeWidth={3} dot={{fill: '#f59e0b', r: 4}} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center italic font-medium">{t.risk.timelineDesc}</p>
        </div>

        {/* Liquidation Distribution Scatter */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-300 mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-red-500" />
            {t.risk.scatterTitle}
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis type="number" dataKey="leverage" name={t.market.leverage} unit="x" axisLine={false} tick={{fill: '#9ca3af', fontSize: 10}} domain={[0, 150]} />
                <YAxis type="number" dataKey="price" name={t.market.liqPrice} axisLine={false} tick={{fill: '#9ca3af', fontSize: 10}} domain={['dataMin - 10', 'dataMax + 10']} />
                <ZAxis type="number" dataKey="amount" range={[100, 1000]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  formatter={(value: any, name: string) => {
                    if (name === t.market.liqPrice) return [`$${value.toLocaleString()} USDC`, name];
                    if (name === 'amount' || name === t.common.amount) return [`$${value.toLocaleString()} USDC`, t.common.amount];
                    if (name === t.market.leverage) return [`${value}x`, name];
                    return [value, name];
                  }}
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Scatter name="Liquidations" data={scatterData} fill="#ef4444" fillOpacity={0.5} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center italic font-medium">{t.risk.scatterDesc}</p>
        </div>
      </div>
    </div>
  );
};

export default RiskCenter;