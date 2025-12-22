
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
  Trophy
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Sidebar: React.FC = () => {
  const { t } = useLanguage();

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
    { name: t.nav.params, path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-[#111827] border-r border-gray-800 flex flex-col transition-all duration-300">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/20">
          <Trophy className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold gold-text tracking-tight">GoldenDex</span>
      </div>

      <nav className="flex-1 mt-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-amber-900/20 text-amber-500 border-l-4 border-amber-500' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }
            `}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">{t.nav.loggedAs}</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-gray-300">0xRoot...8888</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
