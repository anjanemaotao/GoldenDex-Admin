
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ShieldAlert, TrendingDown, Target } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const RiskCenter: React.FC = () => {
  const { t } = useLanguage();

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
    { size: 1000, mr: 5 },
    { size: 5000, mr: 6 },
    { size: 10000, mr: 8 },
    { size: 50000, mr: 12 },
    { size: 100000, mr: 18 },
    { size: 250000, mr: 25 },
    { size: 500000, mr: 40 },
  ];

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white transition-all duration-300">{t.risk.title}</h1>
          <p className="text-gray-400">{t.risk.subtitle}</p>
        </div>
        <div className="px-4 py-2 bg-red-900/20 border border-red-900/40 rounded-lg">
          <span className="text-xs font-bold text-red-500 flex items-center uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4 mr-2" />
            {t.risk.monitoring}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: t.risk.avgMr, value: '34.2%', sub: t.risk.healthy, color: 'text-amber-500' },
          { label: t.risk.pendingLiq, value: '3', sub: `$12,500 USDC`, color: 'text-red-500' },
          { label: t.risk.insuranceUsage, value: '0.45%', sub: t.risk.healthy, color: 'text-green-500' },
          { label: t.risk.adlRisk, value: t.risk.low, sub: t.risk.engineStable, color: 'text-blue-500' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl">
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tight">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-300 mb-6 flex items-center">
            <Target className="w-5 h-5 mr-2 text-red-500" />
            {t.risk.scatterTitle}
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis type="number" dataKey="leverage" name={t.market.leverage} unit="x" axisLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                <YAxis type="number" dataKey="price" name={t.common.all} unit="$" axisLine={false} tick={{fill: '#9ca3af', fontSize: 10}} domain={['dataMin - 5', 'dataMax + 5']} />
                <ZAxis type="number" dataKey="amount" range={[50, 400]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                />
                <Scatter name="Liquidations" data={scatterData} fill="#ef4444" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center italic">{t.risk.scatterDesc}</p>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-300 mb-6 flex items-center">
            <TrendingDown className="w-5 h-5 mr-2 text-blue-500" />
            {t.risk.curveTitle}
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marginCurveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="size" axisLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                <YAxis axisLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="stepAfter" dataKey="mr" stroke="#3b82f6" strokeWidth={3} dot={{fill: '#3b82f6', r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center italic">{t.risk.curveDesc}</p>
        </div>
      </div>
    </div>
  );
};

export default RiskCenter;
