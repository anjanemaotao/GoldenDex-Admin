import React, { useState, useMemo } from 'react';
import { Bell, CheckCheck, Clock, Calendar, Filter } from 'lucide-react';
import { Alert as AlertType } from '../types';
import { useLanguage } from '../LanguageContext';

interface EnhancedAlert extends Omit<AlertType, 'type' | 'description'> {
  typeKey: string;
}

const AlertCenter: React.FC = () => {
  const { t, showTip } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD'>('ALL');
  
  // Filtering state
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Safety helper for translation access
  const safeT = useMemo(() => {
    return t.alerts?.messages || {};
  }, [t]);

  // Initial data using keys instead of translated strings to prevent crash and support language switching
  const [alerts, setAlerts] = useState<EnhancedAlert[]>([
    { 
      id: 'A001', 
      timestamp: '2025-12-10 12:45:00', 
      contract: 'XAUUSDC', 
      typeKey: 'oracleDelay', 
      level: 'MEDIUM', 
      isRead: false 
    },
    { 
      id: 'A002', 
      timestamp: '2025-12-10 12:44:12', 
      contract: 'XAUUSDC', 
      typeKey: 'highMarginRate', 
      level: 'HIGH', 
      isRead: false 
    },
    { 
      id: 'A003', 
      timestamp: '2025-12-10 12:30:05', 
      contract: 'XAUUSDC', 
      typeKey: 'liqEvent', 
      level: 'HIGH', 
      isRead: true 
    },
    { 
      id: 'A004', 
      timestamp: '2025-12-10 12:15:00', 
      contract: 'XAUUSDC', 
      typeKey: 'priceAnomaly', 
      level: 'LOW', 
      isRead: true 
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
    showTip(t.tips.success, 'success');
  };

  const handleMarkAllAsRead = () => {
    const hasUnread = alerts.some(a => !a.isRead);
    if (!hasUnread) return;
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
    showTip(t.tips.success, 'success');
  };

  const alertTypes = useMemo(() => [
    { label: t.common.all, value: 'ALL' },
    { label: safeT.oracleDelay || 'Oracle Delay', value: 'oracleDelay' },
    { label: safeT.highMarginRate || 'High MR', value: 'highMarginRate' },
    { label: safeT.liqEvent || 'Liquidation', value: 'liqEvent' },
    { label: safeT.priceAnomaly || 'Price Anomaly', value: 'priceAnomaly' },
  ], [t, safeT]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Status filter
      if (activeTab === 'UNREAD' && alert.isRead) return false;
      
      // Type filter
      if (typeFilter !== 'ALL' && alert.typeKey !== typeFilter) return false;
      
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
            {t.alerts?.title || 'Alerts'}
          </h1>
          <p className="text-gray-400">{t.alerts?.subtitle || 'System Notifications'}</p>
        </div>
        <button 
          onClick={handleMarkAllAsRead}
          className="flex items-center space-x-2 text-gray-400 hover:text-amber-500 transition-colors bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl"
        >
          <CheckCheck className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-tight">{t.alerts?.markRead || 'Ack All'}</span>
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
            {t.alerts?.allMsgs || 'All'}
          </button>
          <button 
            onClick={() => setActiveTab('UNREAD')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'UNREAD' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:text-white'}`}
          >
            {t.alerts?.unread || 'Unread'}
          </button>
        </div>

        {/* Type Filter */}
        <div className="flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-1.5 hover:border-gray-700 transition-all">
          <Filter className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{t.alerts?.filterType || 'Category'}:</span>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-transparent text-xs text-gray-300 font-bold outline-none cursor-pointer pr-4 border-none"
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
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{t.market?.dateRange || 'Range'}:</span>
            <input 
              type="date" 
              className="bg-transparent text-xs text-gray-300 outline-none [color-scheme:dark] cursor-pointer border-none"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
            <span className="text-gray-700">-</span>
            <input 
              type="date" 
              className="bg-transparent text-xs text-gray-300 outline-none [color-scheme:dark] cursor-pointer border-none"
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
                  <h4 className={`font-bold tracking-wide transition-colors ${alert.isRead ? 'text-gray-400' : 'text-white'}`}>
                    {(safeT as any)[alert.typeKey] || alert.typeKey}
                  </h4>
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
                    {(t.common?.level || 'Level')}: {(t.common?.levels as any)?.[alert.level] || alert.level}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${alert.isRead ? 'text-gray-500' : 'text-gray-300'}`}>
                  {(safeT as any)[`${alert.typeKey}Desc`] || 'Alert details...'}
                </p>
                
                {!alert.isRead && (
                  <div className="pt-4">
                    <button 
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="text-xs font-black text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-widest flex items-center group"
                    >
                      <CheckCheck className="w-3.5 h-3.5 mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {t.alerts?.ack || 'Acknowledge'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center opacity-30">
             <Bell className="w-16 h-16 mb-4" />
             <p className="text-sm font-bold uppercase tracking-widest">{t.common?.none || 'None'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertCenter;