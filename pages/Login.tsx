import React, { useState } from 'react';
import { Trophy, ShieldCheck, Loader2, Shield, AlertCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { ethers } from 'ethers';

interface LoginProps {
  onLogin: (address: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [connecting, setConnecting] = useState(false);
  const [signing, setSigning] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wallets = [
    { 
      name: t.login.metamask, 
      id: 'metamask', 
      icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
    },
    { 
      name: t.login.okx, 
      id: 'okx', 
      icon: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/294.png" 
    },
    { 
      name: t.login.binance, 
      id: 'binance', 
      icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png" 
    },
    { 
      name: t.login.walletconnect, 
      id: 'wc', 
      icon: "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg" 
    },
  ];

  const handleConnect = async (id: string) => {
    setError(null);
    setSelectedWallet(id);
    setConnecting(true);
    
    try {
      if (!(window as any).ethereum) {
        throw new Error('No Web3 wallet detected. Please install MetaMask or OKX Wallet.');
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length > 0) {
        setConnecting(false);
        setSigning(true);
        
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const message = `GoldenDex Admin Login\nTimestamp: ${Date.now()}\nWallet: ${address}`;
        const signature = await signer.signMessage(message);
        
        console.log('Signature:', signature);
        onLogin(address);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to connect or sign');
      setConnecting(false);
      setSigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-4xl space-y-8 animate-in fade-in zoom-in-95 duration-700 relative">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 gold-gradient rounded-3xl shadow-2xl shadow-amber-900/40 mb-2 ring-1 ring-white/20">
            <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black gold-text tracking-tighter">GoldenDex Admin</h1>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">{t.login.title}</h2>
            <p className="text-sm text-gray-400 whitespace-nowrap px-4 w-full text-center">
              {t.login.subtitle}
            </p>
          </div>
        </div>

        <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-[32px] p-8 shadow-2xl mx-auto max-w-md">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-start space-x-3 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-200 font-medium leading-relaxed">{error}</p>
            </div>
          )}
          {!connecting && !signing ? (
            <div className="space-y-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">{t.login.selectWallet}</p>
              <div className="grid grid-cols-2 gap-4">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleConnect(wallet.id)}
                    className="flex flex-col items-center justify-center p-4 bg-gray-800/40 border border-gray-800 rounded-2xl hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <img src={wallet.icon} alt={wallet.name} className="w-10 h-10 object-contain rounded-md" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-xs font-bold text-gray-300">{wallet.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-amber-500 animate-spin" strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShieldCheck className={`w-6 h-6 text-amber-500 ${signing ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} transition-all duration-500`} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">
                  {signing ? t.login.signing : t.login.connecting}
                </h3>
                <p className="text-sm text-gray-400 max-w-[200px] mx-auto">
                  {signing ? t.login.signingDesc : `${t.login.connecting.split('...')[0]} ${wallets.find(w => w.id === selectedWallet)?.name}...`}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center justify-center">
            <ShieldCheck className="w-3 h-3 mr-1.5" />
            {t.login.footer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;