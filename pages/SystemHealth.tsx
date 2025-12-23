import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, RefreshCcw, LayoutGrid, ChevronDown, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const SystemHealth: React.FC = () => {
  const { t } = useLanguage();
  const [selectedContract, setSelectedContract] = useState('XAUUSDC');
  const contracts = ['XAUUSDC', 'BTCUSDC', 'ETHUSDC', 'SOLUSDC'];
  
  // Trend color helper: Green > +5%, Yellow ±5%, Red < -5%
  const getTrendColorClass = (pctChange: number) => {
    if (pctChange > 5) return 'text-green-500';
    if (pctChange < -5) return 'text-red-500';
    return 'text-amber-500';
  };

  const getStatusFromTrend = (pctChange: number): 'green' | 'amber' | 'red' => {
    if (pctChange > 5) return 'green';
    if (pctChange < -5) return 'red';
    return 'amber';
  };

  const getTrendIcon = (pctChange: number) => {
    if (pctChange > 5) return <TrendingUp className="w-3 h-3 ml-1" />;
    if (pctChange < -5) return <TrendingDown className="w-3 h-3 ml-1" />;
    return <Minus className="w-3 h-3 ml-1" />;
  };

  const healthCategories = [
    {
      title: t.health.cat1,
      metrics: [
        { label: t.health.labels.insRatio, value: '10.2%', status: 'green', desc: t.health.labels.insRatioDesc },
        { label: t.health.labels.avgMr, value: '34.5%', status: 'green', desc: t.health.labels.avgMrDesc },
        { label: t.health.labels.liqRate, value: '0.12%', status: 'green', desc: t.health.labels.liqRateDesc },
      ]
    },
    {
      title: t.health.cat2,
      metrics: [
        { label: t.health.labels.vaultDep, value: '1.2%', status: 'green', desc: t.health.labels.vaultDepDesc },
        { label: t.health.labels.withCount, value: '124', status: 'green', desc: t.health.labels.withCountDesc },
      ]
    },
    {
      title: t.health.cat3,
      metrics: [
        { label: t.health.labels.matchingLat, value: '45ms', status: 'green', desc: t.health.labels.matchingLatDesc },
        { label: t.health.labels.apiDelay, value: '1.1s', status: 'amber', desc: t.health.labels.apiDelayDesc },
      ]
    },
    {
      title: t.health.cat4,
      isContractDependent: true,
      metrics: [
        { label: t.health.labels.priceDev, value: '0.15%', status: 'green', desc: t.health.labels.priceDevDesc },
      ]
    },
    {
      title: t.health.cat5,
      metrics: [
        { label: t.health.labels.newUsers24h, value: '1,284', trend: 12.5, desc: t.health.labels.newUsers24hDesc, status: getStatusFromTrend(12.5) },
        { label: t.health.labels.vol24h, value: '$45.2M', trend: 1.2, desc: t.health.labels.vol24hDesc, status: getStatusFromTrend(1.2) },
        { label: t.health.labels.fees24h, value: '$22.5K', trend: -8.4, desc: t.health.labels.fees24hDesc, status: getStatusFromTrend(-8.4) },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.health.title}</h1>
          <p className="text-gray-400">{t.health.subtitle}</p>
        </div>
        <button className="flex items-center space-x-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-sm hover:border-amber-500 transition-all text-gray-300">
          <RefreshCcw className="w-4 h-4 text-amber-500" />
          <span>{t.health.refresh}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {healthCategories.map((category, idx) => (
          <div key={idx} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 relative">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <h3 className="text-lg font-bold text-gray-200">{category.title}</h3>
              {category.isContractDependent && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <LayoutGrid className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <select 
                    value={selectedContract}
                    onChange={(e) => setSelectedContract(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg py-1 pl-8 pr-8 text-xs font-bold text-amber-500 focus:border-amber-500 outline-none appearance-none cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    {contracts.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                    <ChevronDown className="h-3 w-3 text-amber-500" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid gap-4 grid-cols-1">
              {category.metrics.map((metric, mIdx) => (
                <div key={mIdx} className="p-4 rounded-xl bg-gray-800/30 border border-transparent hover:border-gray-700 transition-colors group/card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {metric.status === 'green' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : metric.status === 'red' ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-200 truncate" title={metric.label}>{metric.label}</p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-xl font-black ${metric.status === 'green' ? 'text-white' : (metric.status === 'red' ? 'text-red-500' : 'text-amber-500')}`}>
                        {metric.value}
                      </div>
                      {metric.trend !== undefined && (
                        <div className={`flex items-center justify-end text-[10px] font-bold ${getTrendColorClass(metric.trend)}`}>
                          {metric.trend > 0 ? '+' : ''}{metric.trend}%
                          {getTrendIcon(metric.trend)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {metric.desc && (
                    <div className="mt-2 pt-2 border-t border-gray-800/50">
                      <div className="flex items-start space-x-2">
                        <Info className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                        <p className="text-[10px] text-gray-500 leading-relaxed font-medium italic">
                          <span className="text-gray-600 not-italic font-bold uppercase tracking-tighter mr-1">Definition:</span>
                          {metric.desc}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemHealth;