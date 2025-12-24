import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Eye, 
  Activity, 
  HeartPulse, 
  Bell, 
  Users, 
  Wallet, 
  ScrollText, 
  Settings,
  Coins,
  Shield,
  User
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const walletAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
  const shortenedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  const navItems = [
    { name: t.nav.dashboard, path: '/dashboard', icon: LayoutDashboard },
    { name: t.nav.admin, path: '/admin', icon: ShieldCheck },
    { name: t.nav.market, path: '/market', icon: Eye },
    { name: t.nav.risk, path: '/risk', icon: Activity },
    { name: t.nav.health, path: '/health', icon: HeartPulse },
    { name: t.nav.alerts, path: '/alerts', icon: Bell },
    { name: t.nav.users, path: '/users', icon: Users },
    { name: t.nav.funds, path: '/funds', icon: Wallet },
    { name: t.nav.logs, path: '/logs', icon: ScrollText },
    { name: t.nav.contractManager, path: '/contracts', icon: Coins },
    { name: t.nav.params, path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-[#0d1117] border-r border-gray-800/50 flex flex-col transition-all duration-300">
      {/* Premium Logo Section */}
      <div className="p-8 flex items-center space-x-3">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-yellow-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-11 h-11 gold-gradient rounded-xl flex items-center justify-center shadow-2xl shadow-amber-900/40 ring-1 ring-white/20">
            <Shield className="text-white w-6 h-6" strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black text-white tracking-tighter leading-none">GoldenDex</span>
          <span className="text-[10px] font-black gold-text uppercase tracking-[0.2em] mt-1">Admin</span>
        </div>
      </div>

      <nav className="flex-1 mt-2 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300
              ${isActive 
                ? 'bg-amber-500/10 text-amber-500 shadow-sm border border-amber-500/20' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/40'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-amber-500' : 'opacity-70'}`} strokeWidth={2.5} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Redesigned Profile Section */}
      <div className="p-4 border-t border-gray-800/50 bg-gray-900/20">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-xs font-black text-white uppercase truncate tracking-wide">Root Administrator</p>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-mono text-gray-500 font-bold">{shortenedAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;