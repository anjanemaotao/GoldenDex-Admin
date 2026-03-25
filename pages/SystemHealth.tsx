import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, RefreshCcw, LayoutGrid, ChevronDown, TrendingUp, TrendingDown, Minus, Info, HeartPulse } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import axios from 'axios';

const SystemHealth: React.FC = () => {
  const { t, showTip } = useLanguage();
  const [selectedContract, setSelectedContract] = useState('XAUUSDC');
  const [refreshing, setRefreshing] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const contracts = ['XAUUSDC', 'BTCUSDC', 'ETHUSDC', 'SOLUSDC'];
  
  const fetchHealth = async (showToast = false) => {
    try {
      setRefreshing(true);
      const response = await axios.get('/api/system/health');
      setHealthData(response.data);
      if (showToast) showTip(t.tips.success, 'success');
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      showTip('Failed to fetch system health', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(() => fetchHealth(), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchHealth(true);
  };

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
        { label: t.health.labels.insRatio, value: healthData?.insRatio || '...', status: 'green', desc: t.health.labels.insRatioDesc },
        { label: t.health.labels.avgMr, value: healthData?.avgMr || '...', status: 'green', desc: t.health.labels.avgMrDesc },
        { label: t.health.labels.liqRate, value: healthData?.liqRate || '...', status: 'green', desc: t.health.labels.liqRateDesc },
      ]
    },
    {
      title: t.health.cat2,
      metrics: [
        { label: t.health.labels.vaultDep, value: healthData?.vaultDep || '...', status: 'green', desc: t.health.labels.vaultDepDesc },
        { label: t.health.labels.withCount, value: healthData?.withCount?.toString() || '...', status: 'green', desc: t.health.labels.withCountDesc },
      ]
    },
    {
      title: t.health.cat3,
      metrics: [
        { label: t.health.labels.matchingLat, value: healthData?.matchingLat || '...', status: 'green', desc: t.health.labels.matchingLatDesc },
        { label: t.health.labels.apiDelay, value: healthData?.apiDelay || '...', status: 'amber', desc: t.health.labels.apiDelayDesc },
      ]
    },
    {
      title: t.health.cat4,
      isContractDependent: true,
      metrics: [
        { label: t.health.labels.priceDev, value: healthData?.priceDev || '...', status: 'green', desc: t.health.labels.priceDevDesc },
      ]
    },
    {
      title: t.health.cat5,
      metrics: [
        { label: t.health.labels.newUsers24h, value: healthData?.newUsers24h?.toLocaleString() || '...', trend: 12.5, desc: t.health.labels.newUsers24hDesc, status: getStatusFromTrend(12.5) },
        { label: t.health.labels.vol24h, value: healthData?.vol24h || '...', trend: 1.2, desc: t.health.labels.vol24hDesc, status: getStatusFromTrend(1.2) },
        { label: t.health.labels.fees24h, value: healthData?.fees24h || '...', trend: -8.4, desc: t.health.labels.fees24hDesc, status: getStatusFromTrend(-8.4) },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <HeartPulse className="w-6 h-6 mr-3 text-amber-500" />
            {t.health.title}
          </h1>
          <p className="text-gray-400">{t.health.subtitle}</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-sm hover:border-amber-500 transition-all text-gray-300 disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 text-amber-500 ${refreshing ? 'animate-spin' : ''}`} />
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
                    className="bg-gray-800 border border-gray-700 rounded-lg py-1 pl-8 pr-8 text-xs font-bold text-amber-500 focus:border-amber-500 outline-none appearance-none cursor-pointer hover:bg-gray-700 transition-colors border-none"
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
                      <div 
                        className={`text-xl font-black transition-all duration-500 ${metric.status === 'green' ? 'text-white' : (metric.status === 'red' ? 'text-red-500' : 'text-amber-500')} ${refreshing ? 'opacity-30 blur-[2px] translate-y-2' : 'opacity-100 blur-0 translate-y-0 animate-in slide-in-from-bottom-2'}`}
                      >
                        {metric.value}
                      </div>
                      {metric.trend !== undefined && (
                        <div className={`flex items-center justify-end text-[10px] font-bold ${getTrendColorClass(metric.trend)} ${refreshing ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}>
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