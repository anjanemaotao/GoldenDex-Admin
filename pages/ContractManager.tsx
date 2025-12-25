import React, { useState, useMemo } from 'react';
import { Coins, Plus, Edit2, Settings, Shield, Loader2, Save, X, Image as ImageIcon, Search, RotateCcw } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface ContractItem {
  id: string;
  name: string;
  symbol: string;
  icon: string;
}

interface ParamState {
  maxLeverage: string;
  minOrderQty: string;
  minNotional: string;
  maxMarketQty: string;
  maxLimitQty: string;
  maxOpenOrders: string;
  minOrderPrice: string;
  minPriceFluc: string;
  marketPriceCap: string;
  limitPriceUpper: string;
  limitPriceLower: string;
}

const DEFAULT_PARAMS: ParamState = {
  maxLeverage: '20',
  minOrderQty: '0.001',
  minNotional: '5',
  maxMarketQty: '10',
  maxLimitQty: '10',
  maxOpenOrders: '200',
  minOrderPrice: '0.01',
  minPriceFluc: '0.01',
  marketPriceCap: '3',
  limitPriceUpper: '3',
  limitPriceLower: '3',
};

const ContractManager: React.FC = () => {
  const { t, showTip } = useLanguage();
  
  const [contracts, setContracts] = useState<ContractItem[]>([
    { id: 'T001', name: '黄金', symbol: 'XAU', icon: 'https://cdn-icons-png.flaticon.com/512/2992/2992742.png' },
    { id: 'T002', name: '比特币', symbol: 'BTC', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<{ open: boolean, type: 'ADD' | 'EDIT' | 'PARAMS', selectedId?: string }>({ open: false, type: 'ADD' });
  const [form, setForm] = useState({ name: '', symbol: '', icon: '' });
  const [formErrors, setFormErrors] = useState({ name: false, symbol: false });
  
  // Params State
  const [paramValues, setParamValues] = useState<ParamState>(DEFAULT_PARAMS);
  
  // Multi-sig state simulation
  const [sigCount, setSigCount] = useState(0);
  const [isSigning, setIsSigning] = useState(false);

  const openModal = (type: 'ADD' | 'EDIT' | 'PARAMS', id?: string) => {
    const item = contracts.find(c => c.id === id);
    if (item && (type === 'EDIT' || type === 'PARAMS')) {
      setForm({ name: item.name, symbol: item.symbol, icon: item.icon });
    } else {
      setForm({ name: '', symbol: '', icon: '' });
    }
    setFormErrors({ name: false, symbol: false });
    setSigCount(0);
    setModal({ open: true, type, selectedId: id });
  };

  const handleSaveInfo = () => {
    const errors = {
      name: !form.name.trim(),
      symbol: !form.symbol.trim()
    };
    setFormErrors(errors);
    
    if (errors.name || errors.symbol) return;

    if (modal.type === 'ADD') {
      const newId = `T00${contracts.length + 1}`;
      setContracts([...contracts, { ...form, id: newId }]);
      showTip(t.tips.contractAdded, 'success');
    } else if (modal.type === 'EDIT') {
      setContracts(contracts.map(c => c.id === modal.selectedId ? { ...c, ...form } : c));
      showTip(t.tips.contractUpdated, 'success');
    }
    setModal({ ...modal, open: false });
  };

  const handleRestoreDefaults = () => {
    setParamValues(DEFAULT_PARAMS);
    showTip(t.tips.success, 'info');
  };

  const handleResetSigs = () => {
    setSigCount(0);
    showTip(t.tips.progressReset, 'info');
  };

  const isParamsValid = useMemo(() => {
    return Object.values(paramValues).every(val => val.toString().trim() !== '');
  }, [paramValues]);

  const simulateSigning = () => {
    if (!isParamsValid) return;
    
    setIsSigning(true);
    setTimeout(() => {
      const newCount = Math.min(sigCount + 1, 2);
      setSigCount(newCount);
      setIsSigning(false);
      
      if (newCount === 2) {
          showTip(t.tips.paramsMultiSigComplete, 'success');
          // Automatically close modal as per new requirement
          setTimeout(() => setModal(prev => ({ ...prev, open: false })), 1000);
      } else {
          showTip(t.tips.paramsSigRecorded.replace('{sigs}', newCount.toString()), 'info');
      }
    }, 1200);
  };

  const filteredContracts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return contracts;
    return contracts.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.symbol.toLowerCase().includes(query)
    );
  }, [contracts, searchQuery]);

  const paramConfigList = [
    { key: 'maxLeverage', label: t.contract.params.maxLeverage, unit: t.contract.params.units.times, desc: t.contract.params.desc.maxLeverage },
    { key: 'minOrderQty', label: t.contract.params.minOrderQty, unit: form.symbol, desc: t.contract.params.desc.minOrderQty },
    { key: 'minNotional', label: t.contract.params.minNotional, unit: 'USDC', desc: t.contract.params.desc.minNotional },
    { key: 'maxMarketQty', label: t.contract.params.maxMarketQty, unit: form.symbol, desc: t.contract.params.desc.maxMarketQty },
    { key: 'maxLimitQty', label: t.contract.params.maxLimitQty, unit: form.symbol, desc: t.contract.params.desc.maxLimitQty },
    { key: 'maxOpenOrders', label: t.contract.params.maxOpenOrders, unit: t.contract.params.units.count, desc: t.contract.params.desc.maxOpenOrders },
    { key: 'minOrderPrice', label: t.contract.params.minOrderPrice, unit: 'USDC', desc: t.contract.params.desc.minOrderPrice },
    { key: 'minPriceFluc', label: t.contract.params.minPriceFluc, unit: 'USDC', desc: t.contract.params.desc.minOrderPrice },
    { key: 'marketPriceCap', label: t.contract.params.marketPriceCap, unit: t.contract.params.units.pct, desc: t.contract.params.desc.marketPriceCap },
    { key: 'limitPriceUpper', label: t.contract.params.limitPriceUpper, unit: t.contract.params.units.pct, desc: t.contract.params.desc.limitPriceUpper },
    { key: 'limitPriceLower', label: t.contract.params.limitPriceLower, unit: t.contract.params.units.pct, desc: t.contract.params.desc.limitPriceLower },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center tracking-tight">
            <Coins className="w-6 h-6 mr-3 text-amber-500" />
            {t.contract.title}
          </h1>
          <p className="text-gray-400 text-sm">{t.contract.subtitle}</p>
        </div>
        <div className="flex w-full md:w-auto space-x-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input 
              type="text" 
              placeholder={t.common.search}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm text-gray-300 outline-none focus:border-amber-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => openModal('ADD')}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl font-bold flex items-center shadow-lg shadow-amber-900/20 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t.contract.addBtn}
          </button>
        </div>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-5">{t.contract.table.icon}</th>
              <th className="px-6 py-5">{t.contract.table.id}</th>
              <th className="px-6 py-5">{t.contract.table.name}</th>
              <th className="px-6 py-5">{t.contract.table.symbol}</th>
              <th className="px-6 py-5">{t.contract.table.pair}</th>
              <th className="px-6 py-5 text-right">{t.common.action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filteredContracts.length > 0 ? filteredContracts.map(item => (
              <tr key={item.id} className="hover:bg-amber-500/[0.01] transition-all group">
                <td className="px-6 py-5">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 p-2 flex items-center justify-center border border-gray-700 group-hover:border-amber-500/50 transition-colors">
                    <img src={item.icon || 'https://cdn-icons-png.flaticon.com/512/2992/2992742.png'} alt={item.symbol} className="w-full h-full object-contain" />
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-mono text-gray-500">{item.id}</td>
                <td className="px-6 py-5 text-sm font-bold text-white">{item.name}</td>
                <td className="px-6 py-5 text-sm font-black text-amber-500">{item.symbol}</td>
                <td className="px-6 py-5 text-sm font-bold text-gray-300">{item.symbol}USDC</td>
                <td className="px-6 py-5">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => openModal('EDIT', item.id)}
                      className="p-2 text-gray-400 hover:text-amber-500 bg-gray-800/50 hover:bg-amber-500/10 rounded-xl transition-all border border-gray-800 hover:border-amber-500/30"
                      title={t.contract.editBtn}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openModal('PARAMS', item.id)}
                      className="p-2 text-gray-400 hover:text-blue-500 bg-gray-800/50 hover:bg-blue-500/10 rounded-xl transition-all border border-gray-800 hover:border-blue-500/30"
                      title={t.contract.setParams}
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center opacity-30">
                  <div className="flex flex-col items-center">
                    <X className="w-10 h-10 mb-2" />
                    <span className="text-sm font-bold uppercase tracking-widest">{t.common.noData}</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(modal.open && (modal.type === 'ADD' || modal.type === 'EDIT')) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModal({ ...modal, open: false })} />
          <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-6">
              {modal.type === 'ADD' ? t.contract.modals.addTitle : t.contract.modals.editTitle}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.contract.modals.uploadIcon}</label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-600 hover:border-amber-500/50 transition-colors cursor-pointer overflow-hidden">
                    {form.icon ? <img src={form.icon} className="w-full h-full object-contain" /> : <ImageIcon className="w-6 h-6" />}
                  </div>
                  <input 
                    type="text" 
                    placeholder="URL: https://..." 
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-amber-500 transition-all"
                    value={form.icon}
                    onChange={e => setForm({...form, icon: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.contract.modals.name} <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className={`w-full bg-gray-800 border ${formErrors.name ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]' : 'border-gray-700'} rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-amber-500 transition-all`}
                  value={form.name}
                  onChange={e => {
                    setForm({...form, name: e.target.value});
                    if (formErrors.name && e.target.value.trim()) setFormErrors({...formErrors, name: false});
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t.contract.modals.symbol} <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className={`w-full bg-gray-800 border ${formErrors.symbol ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]' : 'border-gray-700'} rounded-xl px-4 py-2.5 text-sm font-black text-amber-500 uppercase outline-none focus:border-amber-500 transition-all`}
                  value={form.symbol}
                  onChange={e => {
                    setForm({...form, symbol: e.target.value});
                    if (formErrors.symbol && e.target.value.trim()) setFormErrors({...formErrors, symbol: false});
                  }}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-8">
              <button 
                onClick={() => setModal({ ...modal, open: false })}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-bold text-gray-300 transition-all"
              >
                {t.common.cancel}
              </button>
              <button 
                onClick={handleSaveInfo}
                className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-amber-900/40"
              >
                {t.common.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {(modal.open && modal.type === 'PARAMS') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModal({ ...modal, open: false })} />
          <div className="relative w-full max-w-6xl bg-gray-900 border border-gray-800 rounded-[40px] shadow-2xl p-8 animate-in slide-in-from-bottom-8 duration-300 overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-white flex items-center">
                  <Settings className="w-6 h-6 mr-3 text-blue-500" />
                  {t.contract.modals.paramsTitle} - {form.symbol}USDC
                </h3>
                <p className="text-gray-500 text-sm mt-1">{t.contract.subtitle}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleRestoreDefaults}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-white transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.params.restoreDefaults}</span>
                </button>
                <button onClick={() => setModal({ ...modal, open: false })} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4 max-h-[55vh] overflow-y-auto pr-4 custom-scrollbar">
              {paramConfigList.map((p) => (
                <div key={p.key} className="space-y-1.5 p-3 bg-gray-800/20 rounded-2xl border border-gray-800/50 transition-all">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate">{p.label}</label>
                    <span className="text-[9px] font-bold text-gray-600 uppercase flex-shrink-0 ml-2">{p.unit}</span>
                  </div>
                  <input 
                    type="text" 
                    value={paramValues[p.key as keyof ParamState]}
                    onChange={(e) => setParamValues({...paramValues, [p.key]: e.target.value})}
                    placeholder="..."
                    className={`w-full bg-gray-950 border ${paramValues[p.key as keyof ParamState].toString().trim() === '' ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.25)]' : 'border-gray-800'} rounded-xl px-4 py-2 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all`}
                  />
                  <p className="text-[9px] text-gray-600 leading-tight px-1 line-clamp-2" title={p.desc}>{p.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-8">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t.contract.modals.pendingSigs}</span>
                    {sigCount > 0 && (
                      <button onClick={handleResetSigs} className="p-1 hover:bg-white/5 rounded transition-colors text-blue-500" title="Reset Progress">
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {[1, 2].map(n => (
                      <div key={n} className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${sigCount >= n ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-gray-800 border-gray-700 text-gray-600'}`}>
                        {sigCount >= n ? <Shield className="w-4 h-4" /> : <Shield className="w-4 h-4 opacity-20" />}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-medium max-w-[180px]">
                  {t.contract.modals.sigRequired}
                </div>
              </div>

              <div className="flex space-x-4 w-full md:w-auto">
                <button 
                  onClick={simulateSigning}
                  disabled={isSigning || sigCount >= 2 || !isParamsValid}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center
                    ${sigCount >= 2 ? 'bg-gray-800 text-gray-500 cursor-default' : 
                      (!isParamsValid ? 'bg-gray-900 border border-red-500/30 text-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20 active:scale-95')}
                  `}
                >
                  {isSigning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
                  {t.contract.modals.sign}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractManager;