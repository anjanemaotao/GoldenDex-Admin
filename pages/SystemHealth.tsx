
import React from 'react';
import { CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const SystemHealth: React.FC = () => {
  const { t } = useLanguage();
  
  const healthCategories = [
    {
      title: t.health.cat1,
      metrics: [
        { label: t.health.labels.insRatio, value: '10.2%', status: 'green', desc: 'Target > 8%' },
        { label: t.health.labels.avgMr, value: '34.5%', status: 'green', desc: 'Safe < 40%' },
        { label: t.health.labels.adlTriggers, value: '0', status: 'green', desc: 'Normal = 0' },
        { label: t.health.labels.liqRate, value: '0.12%', status: 'green', desc: 'Target < 0.3%' },
      ]
    },
    {
      title: t.health.cat2,
      metrics: [
        { label: t.health.labels.vaultDep, value: '1.2%', status: 'green', desc: 'Warning > 3%' },
        { label: t.health.labels.withCount, value: '124', status: 'green', desc: 'Cap 500' },
      ]
    },
    {
      title: t.health.cat3,
      metrics: [
        { label: t.health.labels.matchingLat, value: '45ms', status: 'green', desc: 'Target < 80ms' },
        { label: t.health.labels.apiDelay, value: '1.1s', status: 'amber', desc: 'Warning > 1.2s' },
      ]
    },
    {
      title: t.health.cat4,
      metrics: [
        { label: t.health.labels.priceDev, value: '0.15%', status: 'green', desc: 'Threshold 0.3%' },
        { label: t.health.labels.exposure, value: '8.4%', status: 'green', desc: 'Cap 12%' },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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

      <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-3xl p-8 mb-8 text-center relative overflow-hidden">
        <h2 className="text-gray-400 uppercase tracking-widest font-bold text-xs mb-2">{t.health.overallIndex}</h2>
        <div className="text-6xl font-black text-white mb-4">98.4<span className="text-2xl text-amber-500">/100</span></div>
        <p className="text-green-500 font-semibold text-lg">{t.health.optimal}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
        {healthCategories.map((category, idx) => (
          <div key={idx} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-200 mb-6 border-b border-gray-800 pb-4">{category.title}</h3>
            <div className="space-y-4">
              {category.metrics.map((metric, mIdx) => (
                <div key={mIdx} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30">
                  <div className="flex items-center space-x-3">
                    {metric.status === 'green' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-amber-500" />}
                    <div>
                      <p className="text-sm font-medium text-gray-300">{metric.label}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{metric.desc}</p>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${metric.status === 'green' ? 'text-white' : 'text-amber-500'}`}>
                    {metric.value}
                  </div>
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
