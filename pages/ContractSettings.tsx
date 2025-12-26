import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  AlertTriangle, 
  ToggleLeft, 
  ToggleRight, 
  Save, 
  Loader2, 
  CheckCircle,
  Database,
  Globe,
  Coins,
  Percent,
  ArrowRightLeft,
  Users,
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

type TabType = 'ON_CHAIN' | 'OFF_CHAIN';

interface OnChainParams {
  vaultDepositArb: boolean;
  vaultWithdrawArb: boolean;
  liqPenaltyRatio: string;
  insFundSplit: string;
  keeperSplit: string;
  withdrawFee: string;
  singleWithdrawLimit: string;
  dailyWithdrawLimit: string;
  approvalThreshold: string;
  delayThreshold: string;
}

interface OffChainParams {
  globalTrading: boolean;
  regSwitch: boolean;
  mmrRatio: string;
  fundingCap: string;
  maxUserPos: string;
  makerFee: string;
  takerFee: string;
  interestRate: string;
  fundingFreq: string;
  orderFreqLimit: string;
}

const ON_CHAIN_DEFAULTS: OnChainParams = {
  vaultDepositArb: true,
  vaultWithdrawArb: true,
  liqPenaltyRatio: '10',
  insFundSplit: '50',
  keeperSplit: '50',
  withdrawFee: '0.5',
  singleWithdrawLimit: '100000',
  dailyWithdrawLimit: '500000',
  approvalThreshold: '500000',
  delayThreshold: '1000000',
};

const OFF_CHAIN_DEFAULTS: OffChainParams = {
  globalTrading: true,
  regSwitch: true,
  mmrRatio: '50',
  fundingCap: '0.05',
  maxUserPos: '200',
  makerFee: '0.010',
  takerFee: '0.035',
  interestRate: '0.01',
  fundingFreq: '1',
  orderFreqLimit: '1000',
};

const ContractSettings: React.FC = () => {
  const { t, showTip } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('ON_CHAIN');

  // Multi-sig states
  const [onChainSigs, setOnChainSigs] = useState(0);
  const [offChainSigs, setOffChainSigs] = useState(0);
  const [isSigning, setIsSigning] = useState(false);

  // Form states
  const [onChainForm, setOnChainForm] = useState<OnChainParams>(ON_CHAIN_DEFAULTS);
  const [offChainForm, setOffChainForm] = useState<OffChainParams>(OFF_CHAIN_DEFAULTS);

  const isOnChainValid = useMemo(() => {
    return Object.values(onChainForm).every(val => val.toString().trim() !== '');
  }, [onChainForm]);

  const isOffChainValid = useMemo(() => {
    return Object.values(offChainForm).every(val => val.toString().trim() !== '');
  }, [offChainForm]);

  const handleSign = () => {
    const isValid = activeTab === 'ON_CHAIN' ? isOnChainValid : isOffChainValid;
    if (!isValid) return;

    setIsSigning(true);
    setTimeout(() => {
      if (activeTab === 'ON_CHAIN') {
        const nextSigs = onChainSigs + 1;
        if (nextSigs >= 2) {
          setOnChainSigs(0);
          showTip(t.tips.globalParamsUpdated, "success");
        } else {
          setOnChainSigs(nextSigs);
          showTip(t.tips.paramsSigRecorded.replace('{sigs}', nextSigs.toString()), "info");
        }
      } else {
        const nextSigs = offChainSigs + 1;
        if (nextSigs >= 2) {
            setOffChainSigs(0);
            showTip(t.tips.globalParamsUpdated, "success");
        } else {
            setOffChainSigs(nextSigs);
            showTip(t.tips.paramsSigRecorded.replace('{sigs}', nextSigs.toString()), "info");
        }
      }
      setIsSigning(false);
    }, 1000);
  };

  const handleResetProgress = () => {
    if (activeTab === 'ON_CHAIN') setOnChainSigs(0);
    else setOffChainSigs(0);
    showTip(t.tips.progressReset, "info");
  };

  const handleRestoreDefaults = () => {
    if (activeTab === 'ON_CHAIN') {
      setOnChainForm(ON_CHAIN_DEFAULTS);
      setOnChainSigs(0);
    } else {
      setOffChainForm(OFF_CHAIN_DEFAULTS);
      setOffChainSigs(0);
    }
    showTip(t.tips.success, "info");
  };

  const Switch = ({ active, onClick, label, disabled }: { active: boolean, onClick: () => void, label: string, disabled?: boolean }) => (
    <div className={`flex items-center justify-between p-4 bg-gray-900/60 border border-gray-800 rounded-xl transition-all ${disabled ? 'opacity-50' : 'hover:border-amber-500/30'}`}>
      <span className="text-sm font-bold text-gray-400 uppercase tracking-tight">{label}</span>
      <button onClick={onClick} disabled={disabled} className="focus:outline-none">
        {active 
          ? <ToggleRight className="w-10 h-10 text-amber-500" /> 
          : <ToggleLeft className="w-10 h-10 text-gray-600" />
        }
      </button>
    </div>
  );

  const InputField = ({ label, value, onChange, unit, desc, disabled }: { label: string, value: string, onChange: (v: string) => void, unit?: string, desc?: string, disabled?: boolean }) => {
    const isEmpty = value.toString().trim() === '';
    return (
      <div className={`space-y-1.5 p-4 bg-gray-900/40 border ${isEmpty ? 'border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.15)]' : 'border-gray-800'} rounded-xl group transition-all ${disabled ? 'opacity-50' : 'hover:border-blue-500/30'}`}>
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</label>
          {unit && <span className="text-[9px] font-bold text-gray-600 uppercase">{unit}</span>}
        </div>
        <input 
          type="text" 
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-gray-950 border ${isEmpty ? 'border-red-500' : 'border-gray-800'} rounded-lg px-3 py-2 text-sm font-bold text-white outline-none focus:border-amber-500 transition-all`}
        />
        {desc && <p className="text-[9px] text-gray-600 leading-tight italic">{desc}</p>}
      </div>
    );
  };

  const curSigs = activeTab === 'ON_CHAIN' ? onChainSigs : offChainSigs;
  const isCurrentFormValid = activeTab === 'ON_CHAIN' ? isOnChainValid : isOffChainValid;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 relative">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center">
            <Settings className="w-8 h-8 mr-3 text-amber-500" />
            {t.params.title}
          </h1>
          <p className="text-gray-400 mt-1">{t.params.subtitle}</p>
        </div>

        <div className="flex bg-gray-900 border border-gray-800 p-1.5 rounded-2xl shadow-inner">
          <button 
            onClick={() => setActiveTab('ON_CHAIN')}
            className={`flex items-center px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ON_CHAIN' ? 'bg-amber-500 text-white shadow-lg shadow-amber-900/40' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Database className="w-3.5 h-3.5 mr-2" />
            {t.params.onChainTab}
          </button>
          <button 
            onClick={() => setActiveTab('OFF_CHAIN')}
            className={`flex items-center px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'OFF_CHAIN' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Globe className="w-3.5 h-3.5 mr-2" />
            {t.params.offChainTab}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <div className="flex-1 bg-red-900/10 border border-red-900/30 p-5 rounded-3xl flex items-start space-x-4 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-black text-red-500 uppercase tracking-tight mb-1">{t.params.warningTitle}</p>
            <p className="text-red-400/80 leading-relaxed">{t.params.warningDesc}</p>
          </div>
        </div>
        <button 
          onClick={handleRestoreDefaults}
          className="lg:w-48 flex flex-col items-center justify-center p-5 bg-gray-900 border border-gray-800 hover:border-amber-500/50 rounded-3xl group transition-all"
        >
          <RotateCcw className="w-6 h-6 text-gray-500 group-hover:text-amber-500 mb-2 transition-colors" />
          <span className="text-[10px] font-black uppercase text-gray-500 group-hover:text-white tracking-widest">{t.params.restoreDefaults}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'ON_CHAIN' ? (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 flex items-center">
                    <ArrowRightLeft className="w-4 h-4 mr-2 text-amber-500" />
                    {t.params.switches}
                  </h3>
                  <Switch 
                    label={t.params.labels.vaultDeposit} 
                    active={onChainForm.vaultDepositArb} 
                    onClick={() => setOnChainForm({...onChainForm, vaultDepositArb: !onChainForm.vaultDepositArb})} 
                    disabled={curSigs > 0}
                  />
                  <Switch 
                    label={t.params.labels.vaultWithdraw} 
                    active={onChainForm.vaultWithdrawArb} 
                    onClick={() => setOnChainForm({...onChainForm, vaultWithdrawArb: !onChainForm.vaultWithdrawArb})}
                    disabled={curSigs > 0}
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 flex items-center">
                    <Coins className="w-4 h-4 mr-2 text-amber-500" />
                    {t.params.fees}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputField 
                      label={t.params.labels.liqPenalty} 
                      unit="%"
                      value={onChainForm.liqPenaltyRatio} 
                      onChange={(v) => setOnChainForm({...onChainForm, liqPenaltyRatio: v})}
                      disabled={curSigs > 0}
                    />
                    <InputField 
                      label={t.params.labels.withdrawFee} 
                      unit="USDC"
                      value={onChainForm.withdrawFee} 
                      onChange={(v) => setOnChainForm({...onChainForm, withdrawFee: v})}
                      disabled={curSigs > 0}
                    />
                    <InputField 
                      label={t.health.labels.insRatio} 
                      unit="%"
                      value={onChainForm.insFundSplit} 
                      onChange={(v) => setOnChainForm({...onChainForm, insFundSplit: v})}
                      disabled={curSigs > 0}
                    />
                    <InputField 
                      label={t.params.labels.keeperSplit} 
                      unit="%"
                      value={onChainForm.keeperSplit} 
                      onChange={(v) => setOnChainForm({...onChainForm, keeperSplit: v})}
                      disabled={curSigs > 0}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-2 text-amber-500" />
                  {t.params.riskControl}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   <InputField label={t.params.labels.singleWithdrawLimit} unit="USDC" value={onChainForm.singleWithdrawLimit} onChange={(v) => setOnChainForm({...onChainForm, singleWithdrawLimit: v})} disabled={curSigs > 0} />
                   <InputField label={t.params.labels.dailyWithdrawLimit} unit="USDC" value={onChainForm.dailyWithdrawLimit} onChange={(v) => setOnChainForm({...onChainForm, dailyWithdrawLimit: v})} disabled={curSigs > 0} />
                   <InputField label={t.params.labels.approvalThreshold} unit="USDC" value={onChainForm.approvalThreshold} onChange={(v) => setOnChainForm({...onChainForm, approvalThreshold: v})} disabled={curSigs > 0} />
                   <InputField label={t.params.labels.delayThreshold} unit="USDC" value={onChainForm.delayThreshold} onChange={(v) => setOnChainForm({...onChainForm, delayThreshold: v})} disabled={curSigs > 0} />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 flex items-center">
                      <ArrowRightLeft className="w-4 h-4 mr-2 text-blue-500" />
                      {t.params.switches}
                    </h3>
                    <Switch 
                      label={t.params.labels.trading} 
                      active={offChainForm.globalTrading} 
                      onClick={() => setOffChainForm({...offChainForm, globalTrading: !offChainForm.globalTrading})}
                      disabled={curSigs > 0}
                    />
                    <Switch 
                      label={t.params.labels.reg} 
                      active={offChainForm.regSwitch} 
                      onClick={() => setOffChainForm({...offChainForm, regSwitch: !offChainForm.regSwitch})}
                      disabled={curSigs > 0}
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 flex items-center">
                      <Percent className="w-4 h-4 mr-2 text-blue-500" />
                      {t.params.constants}
                    </h3>
                    <InputField 
                      label={t.params.labels.mmr} 
                      unit="% of IMR"
                      value={offChainForm.mmrRatio} 
                      onChange={(v) => setOffChainForm({...offChainForm, mmrRatio: v})}
                      disabled={curSigs > 0}
                    />
                    <InputField 
                      label={t.params.labels.fundingCap} 
                      unit="%"
                      value={offChainForm.fundingCap} 
                      onChange={(v) => setOffChainForm({...offChainForm, fundingCap: v})}
                      disabled={curSigs > 0}
                    />
                  </div>
               </div>

               <div className="space-y-4">
                 <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-500" />
                    {t.params.tradingParams}
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label={t.params.labels.maxUserPos} unit="M USDC" value={offChainForm.maxUserPos} onChange={(v) => setOffChainForm({...offChainForm, maxUserPos: v})} disabled={curSigs > 0} />
                    <InputField label={t.params.labels.makerFee} unit="%" value={offChainForm.makerFee} onChange={(v) => setOffChainForm({...offChainForm, makerFee: v})} disabled={curSigs > 0} />
                    <InputField label={t.params.labels.takerFee} unit="%" value={offChainForm.takerFee} onChange={(v) => setOffChainForm({...offChainForm, takerFee: v})} disabled={curSigs > 0} />
                    <InputField label={t.params.labels.interestRate} unit="%/H" value={offChainForm.interestRate} onChange={(v) => setOffChainForm({...offChainForm, interestRate: v})} disabled={curSigs > 0} />
                    <InputField label={t.params.labels.settleFreq} unit="H" value={offChainForm.fundingFreq} onChange={(v) => setOffChainForm({...offChainForm, fundingFreq: v})} disabled={curSigs > 0} />
                    <InputField label={t.params.labels.orderFreq} unit="笔/秒/IP" value={offChainForm.orderFreqLimit} onChange={(v) => setOffChainForm({...offChainForm, orderFreqLimit: v})} disabled={curSigs > 0} />
                 </div>
               </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-900 border border-gray-800 rounded-[32px] p-8 sticky top-24 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-amber-500" />
                {t.params.govStatus}
              </h2>
              {curSigs > 0 && (
                <button 
                  onClick={handleResetProgress}
                  className="text-gray-500 hover:text-amber-500 transition-colors p-1"
                  title="Reset Progress"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  <span>{t.params.authSigs}</span>
                  <span>{curSigs} / 2</span>
                </div>
                <div className="flex space-x-2">
                  {[1, 2].map(n => (
                    <div key={n} className={`h-3 flex-1 rounded-full transition-all duration-700 ${curSigs >= n ? (activeTab === 'ON_CHAIN' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]') : 'bg-gray-800'}`} />
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button 
                  onClick={handleSign}
                  disabled={isSigning || curSigs >= 2 || !isCurrentFormValid}
                  className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center transition-all
                    ${curSigs >= 2 ? 'bg-gray-800 text-gray-500 cursor-default border border-gray-700' : 
                      (!isCurrentFormValid 
                        ? 'bg-gray-950 text-gray-700 border border-gray-800 cursor-not-allowed'
                        : (activeTab === 'ON_CHAIN' 
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xl shadow-amber-900/20 active:scale-95' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-900/20 active:scale-95'))}
                  `}
                >
                  {isSigning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {isSigning ? t.params.requesting : t.params.reqSign}
                </button>
              </div>

              <div className="p-4 bg-gray-950/50 rounded-2xl border border-gray-800">
                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">{t.params.pendingLog}</h4>
                {curSigs > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 opacity-60">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <p className="text-[10px] text-gray-400">{t.params.logSigned.replace('{admin}', 'Admin A').replace('{id}', 'P-0012')}</p>
                    </div>
                    {curSigs > 1 && (
                      <div className="flex items-center space-x-3 animate-in fade-in">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <p className="text-[10px] text-gray-400">{t.params.logSigned.replace('{admin}', 'Admin B').replace('{id}', 'P-0012')}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-700 italic">{t.params.noSigs}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractSettings;