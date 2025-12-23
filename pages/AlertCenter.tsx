import React, { useState, useMemo } from 'react';
import { Bell, CheckCheck, Clock, Calendar, Filter } from 'lucide-react';
import { Alert } from '../types';
import { useLanguage } from '../LanguageContext';

const AlertCenter: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD'>('ALL');
  
  // Filtering state
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Initial data shifted to state to support read status updates
  const [alerts, setAlerts] = useState<Alert[]>([
    { 
      id: 'A001', 
      timestamp: '2025-12-10 12:45:00', 
      contract: 'XAUUSDC', 
      type: t.alerts.messages.oracleDelay, 
      description: t.alerts.messages.oracleDelayDesc, 
      level: 'MEDIUM', 
      isRead: false 
    },
    { 
      id: 'A002', 
      timestamp: '2025-12-10 12:44:12', 
      contract: 'XAUUSDC', 
      type: t.alerts.messages.highMarginRate, 
      description: t.alerts.messages.highMarginRateDesc, 
      level: 'HIGH', 
      isRead: false 
    },
    { 
      id: 'A003', 
      timestamp: '2025-12-10 12:30:05', 
      contract: 'XAUUSDC', 
      type: t.alerts.messages.liqEvent, 
      description: t.alerts.messages.liqEventDesc, 
      level: 'HIGH', 
      isRead: true 
    },
    { 
      id: 'A004', 
      timestamp: '2025-12-10 12:15:00', 
      contract: 'XAUUSDC', 
      type: t.alerts.messages.priceAnomaly, 
      description: t.alerts.messages.priceAnomalyDesc, 
      level: 'LOW', 
      isRead: true 
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const handleMarkAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const alertTypes = [
    { label: t.common.all, value: 'ALL' },
    { label: t.alerts.messages.oracleDelay, value: t.alerts.messages.oracleDelay },
    { label: t.alerts.messages.highMarginRate, value: t.alerts.messages.highMarginRate },
    { label: t.alerts.messages.liqEvent, value: t.alerts.messages.liqEvent },
    { label: t.alerts.messages.priceAnomaly, value: t.alerts.messages.priceAnomaly },
  ];

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Status filter
      if (activeTab === 'UNREAD' && alert.isRead) return false;
      
      // Type filter
      if (typeFilter !== 'ALL' && alert.type !== typeFilter) return false;
      
      // Date filter
      if (dateRange.start) {
        const alertDate = alert.timestamp.split(' ')[0];
        if (alertDate < dateRange.start) return false;
      }
      if (dateRange.end) {
        const alertDate = alert.timestamp.split(' ')[0];
        if (alertDate > dateRange.end) return false;
      }
      
      return true;
    });
  }, [alerts, activeTab, typeFilter, dateRange]);

  const getUnreadBorderStyle = (level: string) => {
    switch (level) {
      case 'HIGH': return 'border-red-500/50 ring-1 ring-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
      case 'MEDIUM': return 'border-amber-500/50 ring-1 ring-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
      case 'LOW': return 'border-green-500/50 ring-1 ring-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]';
      default: return 'border-gray-800';
    }
  };

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
        <button 
          onClick={handleMarkAllAsRead}
          className="flex items-center space-x-2 text-gray-400 hover:text-amber-500 transition-colors bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
        >
          <CheckCheck className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-tight">{t.alerts.markRead}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
        {/* Unread Switcher */}
        <div className="bg-gray-900 border border-gray-800 p-1 rounded-xl flex shrink-0">
          <button 
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'ALL' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:text-white'}`}
          >
            {t.alerts.allMsgs}
          </button>
          <button 
            onClick={() => setActiveTab('UNREAD')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'UNREAD' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:text-white'}`}
          >
            {t.alerts.unread}
          </button>
        </div>

        {/* Type Filter */}
        <div className="flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-1.5 hover:border-gray-700 transition-all">
          <Filter className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{t.alerts.filterType}:</span>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-transparent text-xs text-gray-300 font-bold outline-none cursor-pointer pr-4"
          >
            {alertTypes.map(type => (
              <option key={type.value} value={type.value} className="bg-gray-900">{type.label}</option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl px-4 py-1.5 space-x-3 group hover:border-gray-700 transition-all">
          <Calendar className="w-4 h-4 text-gray-500 group-hover:text-amber-500 transition-colors" />
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{t.market.dateRange}:</span>
            <input 
              type="date" 
              className="bg-transparent text-xs text-gray-300 outline-none [color-scheme:dark] cursor-pointer"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
            <span className="text-gray-700">-</span>
            <input 
              type="date" 
              className="bg-transparent text-xs text-gray-300 outline-none [color-scheme:dark] cursor-pointer"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`bg-gray-900/40 border rounded-2xl p-5 transition-all flex items-start space-x-4
                ${alert.isRead ? 'border-gray-800 opacity-60 grayscale-[0.3]' : getUnreadBorderStyle(alert.level)}
              `}
            >
              <div className={`mt-1.5 h-3 w-3 rounded-full flex-shrink-0
                ${alert.level === 'HIGH' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                  alert.level === 'MEDIUM' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                  'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'}
              `} />
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className={`font-bold tracking-wide transition-colors ${alert.isRead ? 'text-gray-400' : 'text-white'}`}>{alert.type}</h4>
                  <div className="flex items-center text-[10px] text-gray-500 font-mono">
                    <Clock className="w-3 h-3 mr-1" />
                    {alert.timestamp}
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded tracking-tighter uppercase ${alert.isRead ? 'bg-gray-800 text-gray-600' : 'bg-amber-500/10 text-amber-500'}`}>{alert.contract}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded tracking-tighter uppercase
                    ${alert.isRead ? 'bg-gray-800 text-gray-600' : (
                      alert.level === 'HIGH' ? 'bg-red-900/20 text-red-500' : 
                      alert.level === 'MEDIUM' ? 'bg-amber-900/20 text-amber-500' : 
                      'bg-green-900/20 text-green-500'
                    )}
                  `}>
                    {t.common.level}: {t.common.levels[alert.level as keyof typeof t.common.levels]}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${alert.isRead ? 'text-gray-500' : 'text-gray-300'}`}>{alert.description}</p>
                
                {!alert.isRead && (
                  <div className="pt-4">
                    <button 
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="text-xs font-black text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-widest flex items-center group"
                    >
                      <CheckCheck className="w-3.5 h-3.5 mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {t.alerts.ack}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
             <Bell className="w-16 h-16 mb-4" />
             <p className="text-sm font-bold uppercase tracking-widest">{t.common.none}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertCenter;