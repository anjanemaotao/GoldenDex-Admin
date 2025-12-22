
import React, { useState } from 'react';
import { Bell, Filter, CheckCheck, Trash2, Clock, MapPin } from 'lucide-react';
import { Alert } from '../types';
import { useLanguage } from '../LanguageContext';

const AlertCenter: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const mockAlerts: Alert[] = [
    { id: 'A001', timestamp: '2025-12-10 12:45:00', contract: 'XAUUSDC', type: 'Oracle Delay', description: 'Chainlink feed delay detected: 8s. System threshold is 5s.', level: 'MEDIUM', isRead: false },
    { id: 'A002', timestamp: '2025-12-10 12:44:12', contract: 'XAUUSDC', type: 'High Margin Rate', description: 'Account 0xd3e...58e3 margin rate exceeded 80% (MR: 82.4%)', level: 'HIGH', isRead: false },
    { id: 'A003', timestamp: '2025-12-10 12:30:05', contract: 'XAUUSDC', type: 'Liquidation Event', description: 'Forced liquidation triggered for 0x8a2...3211. Value: 2,000 USDC.', level: 'HIGH', isRead: true },
    { id: 'A004', timestamp: '2025-12-10 12:15:00', contract: 'XAUUSDC', type: 'Price Anomaly', description: 'Mark price vs Last price deviation > 1.2%. Monitoring active.', level: 'LOW', isRead: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Bell className="w-6 h-6 mr-3 text-amber-500" />
            {t.alerts.title}
          </h1>
          <p className="text-gray-400">{t.alerts.subtitle}</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <CheckCheck className="w-4 h-4" />
            <span className="text-sm">{t.alerts.markRead}</span>
          </button>
          <div className="h-4 w-px bg-gray-800 self-center" />
          <button className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
            <span className="text-sm">{t.alerts.clearAll}</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-1 rounded-lg flex w-fit">
        <button 
          onClick={() => setFilter('ALL')}
          className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:text-white'}`}
        >
          {t.alerts.allMsgs}
        </button>
        <button 
          onClick={() => setFilter('UNREAD')}
          className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === 'UNREAD' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:text-white'}`}
        >
          {t.alerts.unread}
        </button>
      </div>

      <div className="space-y-4">
        {mockAlerts
          .filter(a => filter === 'ALL' || !a.isRead)
          .map((alert) => (
            <div 
              key={alert.id} 
              className={`bg-gray-900/40 border rounded-2xl p-5 transition-all flex items-start space-x-4
                ${alert.isRead ? 'border-gray-800 opacity-70' : 'border-amber-500/30 ring-1 ring-amber-500/10'}
              `}
            >
              <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0
                ${alert.level === 'HIGH' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                  alert.level === 'MEDIUM' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                  'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}
              `} />
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-white font-bold tracking-wide">{alert.type}</h4>
                  <div className="flex items-center text-xs text-gray-500 font-mono">
                    <Clock className="w-3 h-3 mr-1" />
                    {alert.timestamp}
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-[10px] font-bold bg-gray-800 text-amber-500 px-1.5 py-0.5 rounded tracking-tighter uppercase">{alert.contract}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-tighter uppercase
                    ${alert.level === 'HIGH' ? 'bg-red-900/20 text-red-500' : 
                      alert.level === 'MEDIUM' ? 'bg-amber-900/20 text-amber-500' : 
                      'bg-blue-900/20 text-blue-500'}
                  `}>
                    {t.common.level}: {alert.level}
                  </span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{alert.description}</p>
                
                <div className="pt-4 flex items-center space-x-4">
                  <button className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-widest">{t.alerts.detailCtx}</button>
                  <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">{t.alerts.ack}</button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AlertCenter;
