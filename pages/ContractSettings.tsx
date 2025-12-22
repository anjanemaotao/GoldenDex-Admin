
import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Save, Info, Key, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const ContractSettings: React.FC = () => {
  const { t } = useLanguage();
  const [switches, setSwitches] = useState({
    trading: true,
    vaultDeposit: true,
    vaultWithdraw: true,
    newUser: true,
  });

  const toggle = (key: keyof typeof switches) => {
    setSwitches(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Switch = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
    <div className="flex items-center justify-between p-4 bg-gray-900/60 border border-gray-800 rounded-xl hover:border-amber-500/30 transition-all">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <button onClick={onClick} className="focus:outline-none">
        {active 
          ? <ToggleRight className="w-10 h-10 text-amber-500" /> 
          : <ToggleLeft className="w-10 h-10 text-gray-600" />
        }
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.params.title}</h1>
          <p className="text-gray-400">{t.params.subtitle}</p>
        </div>
        <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-amber-900/20 transition-all flex items-center">
          <Save className="w-4 h-4 mr-2" />
          {t.params.commit}
        </button>
      </div>

      <div className="bg-red-900/10 border border-red-900/30 p-5 rounded-2xl flex items-start space-x-4">
        <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
        <div className="text-sm text-red-400">
          <p className="font-bold mb-1">{t.params.warningTitle}</p>
          <p>{t.params.warningDesc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Global Switches */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-300 flex items-center">
            <Key className="w-5 h-5 mr-2 text-amber-500" />
            {t.params.switches}
          </h2>
          <div className="space-y-3">
            <Switch label={t.params.labels.trading} active={switches.trading} onClick={() => toggle('trading')} />
            <Switch label={t.params.labels.deposit} active={switches.vaultDeposit} onClick={() => toggle('vaultDeposit')} />
            <Switch label={t.params.labels.withdraw} active={switches.vaultWithdraw} onClick={() => toggle('vaultWithdraw')} />
            <Switch label={t.params.labels.reg} active={switches.newUser} onClick={() => toggle('newUser')} />
          </div>
        </div>

        {/* Core Risk Factors */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-300 flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-500" />
            {t.params.constants} (XAUUSDC)
          </h2>
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">{t.params.labels.imr}</label>
              <div className="flex items-center space-x-3">
                <input type="text" defaultValue="5%" className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-amber-500" />
                <span className="text-xs text-gray-400">Fixed</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">{t.params.labels.mmr}</label>
              <div className="flex items-center space-x-3">
                <input type="text" defaultValue="2.5%" className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-amber-500" />
                <span className="text-xs text-gray-400">2/3 SIG</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">{t.params.labels.penalty}</label>
              <div className="flex items-center space-x-3">
                <input type="text" defaultValue="10%" className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-amber-500" />
                <span className="text-xs text-gray-400">2/3 SIG</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contract-specific constraints */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8 space-y-6">
        <h3 className="text-lg font-bold text-white">{t.params.marketLimits}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { label: t.params.labels.minOrder, value: '0.001', unit: 'XAU' },
            { label: t.params.labels.minNotional, value: '5', unit: 'USDC' },
            { label: t.params.labels.maxMarket, value: '10', unit: 'XAU' },
            { label: t.params.labels.maxLimit, value: '10', unit: 'XAU' },
            { label: t.params.labels.priceDev, value: '3', unit: '%' },
            { label: t.params.labels.maxOi, value: '500,000', unit: 'USDC' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-xs font-medium text-gray-500">{item.label}</p>
              <div className="flex items-center space-x-2">
                <input type="text" defaultValue={item.value} className="bg-gray-800/50 border border-gray-800 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-amber-500" />
                <span className="text-xs font-bold text-gray-400">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractSettings;
