import React, { useState, useMemo } from 'react';
import { Search, Wallet as WalletIcon, Plus, Trash2, ShieldCheck, AlertCircle, X, Copy, CheckCircle2, QrCode, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { Wallet } from '../types';
import { QRCodeSVG } from 'qrcode.react';

const WalletManagement: React.FC = () => {
  const { t, showTip } = useLanguage();
  
  const initialWallets: Wallet[] = [
    { 
      id: 'W1001', 
      name: 'GAS Hot Wallet 1', 
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 
      privateKey: '********************************', 
      balance: 1.25, 
      remark: 'Main GAS wallet for Arbitrum', 
      addedAt: '2025-12-01 10:00:00' 
    },
    { 
      id: 'W1002', 
      name: 'Backup GAS Wallet', 
      address: '0x4f1234567890abcdef1234567890abcdef123456', 
      privateKey: '********************************', 
      balance: 0.045, 
      remark: 'Secondary backup', 
      addedAt: '2025-12-05 14:20:00' 
    },
    { 
      id: 'W1003', 
      name: 'Low Balance Wallet', 
      address: '0x8a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', 
      privateKey: '********************************', 
      balance: 0.008, 
      remark: 'Needs recharge soon', 
      addedAt: '2025-12-10 11:00:00' 
    },
  ];

  const [wallets, setWallets] = useState<Wallet[]>(initialWallets);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWallet, setNewWallet] = useState({ name: '', address: '', privateKey: '', remark: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // New states for confirmation and recharge
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [rechargeWallet, setRechargeWallet] = useState<Wallet | null>(null);

  const filteredWallets = useMemo(() => {
    return wallets
      .filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
  }, [wallets, searchQuery]);

  const validateAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);
  const validatePrivateKey = (key: string) => /^(0x)?[a-fA-F0-9]{64}$/.test(key);

  const handleAddWallet = () => {
    setIsSubmitted(true);
    
    // Basic required check
    if (!newWallet.name.trim() || !newWallet.address.trim() || !newWallet.privateKey.trim()) {
      return;
    }

    // Length checks
    if (newWallet.name.length > 20 || newWallet.remark.length > 200) {
      return;
    }

    // Format checks
    if (!validateAddress(newWallet.address)) {
      showTip(t.wallets.modal.invalidAddress, 'error');
      return;
    }
    if (!validatePrivateKey(newWallet.privateKey)) {
      showTip(t.wallets.modal.invalidKey, 'error');
      return;
    }

    const nextIdNum = Math.max(...wallets.map(w => parseInt(w.id.substring(1))), 1000) + 1;
    const nextId = `W${nextIdNum}`;
    
    const walletToAdd: Wallet = {
      id: nextId,
      name: newWallet.name,
      address: newWallet.address,
      privateKey: newWallet.privateKey,
      balance: 0,
      remark: newWallet.remark,
      addedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setWallets([walletToAdd, ...wallets]);
    showTip(t.wallets.modal.success, 'success');
    closeModal();
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      setWallets(prev => prev.filter(w => w.id !== deleteConfirm));
      showTip(t.tips.success, 'info');
      setDeleteConfirm(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewWallet({ name: '', address: '', privateKey: '', remark: '' });
    setIsSubmitted(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showTip(t.header.copied, 'success');
  };

  const getStatus = (balance: number) => {
    if (balance > 0.1) return { label: t.wallets.status.normal, desc: t.wallets.status.normalDesc, color: 'text-green-500 bg-green-500/10 ring-green-500/20' };
    if (balance >= 0.05) return { label: t.wallets.status.low, desc: t.wallets.status.lowDesc, color: 'text-blue-400 bg-blue-400/10 ring-blue-400/20' };
    if (balance >= 0.01) return { label: t.wallets.status.medium, desc: t.wallets.status.mediumDesc, color: 'text-amber-500 bg-amber-500/10 ring-amber-500/20' };
    return { label: t.wallets.status.high, desc: t.wallets.status.highDesc, color: 'text-red-500 bg-red-500/10 ring-red-500/20' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <WalletIcon className="w-6 h-6 mr-3 text-amber-500" />
            {t.wallets.title}
          </h1>
          <p className="text-gray-400">{t.wallets.subtitle}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-900/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.wallets.addBtn}
        </button>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder={t.wallets.placeholder} 
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-10 text-sm focus:border-amber-500 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">{t.wallets.table.id}</th>
              <th className="px-6 py-4">{t.wallets.table.name}</th>
              <th className="px-6 py-4">{t.wallets.table.address}</th>
              <th className="px-6 py-4">{t.wallets.table.status}</th>
              <th className="px-6 py-4">{t.wallets.table.balance}</th>
              <th className="px-6 py-4">{t.wallets.table.remark}</th>
              <th className="px-6 py-4">{t.wallets.table.time}</th>
              <th className="px-6 py-4 text-right">{t.wallets.table.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filteredWallets.map((wallet) => {
              const status = getStatus(wallet.balance);
              return (
                <tr key={wallet.id} className="hover:bg-amber-500/[0.01] transition-all group">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-gray-500">{wallet.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors">
                      {wallet.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-xs font-mono text-gray-400">
                      {`${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                      <Copy 
                        className="w-3 h-3 ml-2 text-gray-600 cursor-pointer hover:text-amber-500 transition-colors" 
                        onClick={() => handleCopy(wallet.address)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative group/status inline-block">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ring-1 cursor-help ${status.color}`}>
                        {status.label}
                      </span>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/status:block z-50 transition-all">
                        <div className="bg-gray-800 text-white text-[10px] font-bold py-2 px-3 rounded-xl shadow-2xl border border-gray-700 whitespace-nowrap">
                          {status.desc}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-800" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-black text-amber-500">{wallet.balance} ETH</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-400 max-w-[150px] truncate">{wallet.remark || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 font-mono">{wallet.addedAt}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => setRechargeWallet(wallet)}
                        className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all border border-transparent hover:border-amber-500/30"
                        title={t.wallets.table.recharge}
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(wallet.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/30"
                        title={t.common.action}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredWallets.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500 text-sm italic">
                  {t.common.noData}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Wallet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <ShieldCheck className="w-6 h-6 mr-2 text-amber-500" />
                {t.wallets.modal.title}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {t.wallets.modal.name} <span className="text-red-500">*</span>
                  </label>
                  {newWallet.name.length > 20 && (
                    <span className="text-[10px] text-red-500 font-bold uppercase">{t.wallets.modal.nameTooLong}</span>
                  )}
                </div>
                <input 
                  type="text" 
                  value={newWallet.name}
                  onChange={(e) => setNewWallet({...newWallet, name: e.target.value})}
                  className={`w-full bg-gray-950 border ${isSubmitted && (!newWallet.name.trim() || newWallet.name.length > 20) ? 'border-red-500' : 'border-gray-800'} rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition-all`}
                  placeholder="e.g. Hot Wallet A"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">
                  {t.wallets.modal.address} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={newWallet.address}
                  onChange={(e) => setNewWallet({...newWallet, address: e.target.value})}
                  className={`w-full bg-gray-950 border ${isSubmitted && (!newWallet.address.trim() || !validateAddress(newWallet.address)) ? 'border-red-500' : 'border-gray-800'} rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition-all`}
                  placeholder="0x..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest px-1">
                  {t.wallets.modal.privateKey} <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password" 
                  value={newWallet.privateKey}
                  onChange={(e) => setNewWallet({...newWallet, privateKey: e.target.value})}
                  className={`w-full bg-gray-950 border ${isSubmitted && (!newWallet.privateKey.trim() || !validatePrivateKey(newWallet.privateKey)) ? 'border-red-500' : 'border-gray-800'} rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition-all`}
                  placeholder="Enter private key"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {t.wallets.modal.remark}
                  </label>
                  {newWallet.remark.length > 200 && (
                    <span className="text-[10px] text-red-500 font-bold uppercase">{t.wallets.modal.remarkTooLong}</span>
                  )}
                </div>
                <textarea 
                  value={newWallet.remark}
                  onChange={(e) => setNewWallet({...newWallet, remark: e.target.value})}
                  className={`w-full bg-gray-950 border ${isSubmitted && newWallet.remark.length > 200 ? 'border-red-500' : 'border-gray-800'} rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500/50 transition-all resize-none h-24`}
                  placeholder="Optional notes..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button 
                onClick={closeModal}
                className="flex-1 px-4 py-3 bg-gray-800/60 hover:bg-gray-700/60 rounded-2xl text-sm font-bold text-gray-300 transition-all border border-gray-700"
              >
                {t.common.cancel}
              </button>
              <button 
                onClick={handleAddWallet}
                className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 rounded-2xl text-sm font-bold text-black transition-all shadow-lg shadow-amber-900/20"
              >
                {t.common.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative w-full max-w-sm bg-gray-900 border border-gray-800 rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-3xl bg-red-500/10 text-red-500">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{t.wallets.delete.title}</h3>
                <p className="text-sm text-gray-400">{t.wallets.delete.desc}</p>
              </div>
            </div>
            <div className="flex space-x-3 mt-8">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-gray-800/60 hover:bg-gray-700/60 rounded-2xl text-sm font-bold text-gray-300 transition-all border border-gray-700"
              >
                {t.common.cancel}
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-2xl text-sm font-bold text-white transition-all shadow-lg shadow-red-900/20"
              >
                {t.common.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recharge QR Modal */}
      {rechargeWallet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setRechargeWallet(null)} />
          <div className="relative w-full max-w-sm bg-gray-900 border border-gray-800 rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">{t.wallets.recharge.title}</h3>
              <button onClick={() => setRechargeWallet(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex flex-col items-center space-y-6">
              <div className="p-4 bg-white rounded-2xl shadow-inner">
                <QRCodeSVG value={rechargeWallet.address} size={200} />
              </div>
              
              <div className="w-full space-y-2">
                <p className="text-xs text-center text-gray-500 uppercase font-bold tracking-widest">{t.wallets.recharge.desc}</p>
                <div className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-2xl px-4 py-3 group">
                  <span className="text-xs font-mono text-gray-300 break-all mr-2">{rechargeWallet.address}</span>
                  <button 
                    onClick={() => handleCopy(rechargeWallet.address)}
                    className="p-2 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-black transition-all flex-shrink-0"
                    title={t.wallets.recharge.copy}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setRechargeWallet(null)}
              className="w-full mt-8 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-2xl text-sm font-bold text-white transition-all"
            >
              {t.common.confirm}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletManagement;
