import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { Users, DollarSign, Activity, AlertCircle, TrendingUp, ShieldCheck, Layers, Users2, Timer, AlertTriangle, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [selectedContract, setSelectedContract] = useState('XAUUSDC');

  // Mock Data
  const stats = [
    { title: t.dashboard.stats.active60s, value: '1,284', change: '+12%', icon: Activity, color: 'text-blue-500' },
    { title: t.dashboard.stats.active24h, value: '45,829', change: '+5.4%', icon: Users, color: 'text-green-500' },
    { title: t.dashboard.stats.totalUsers, value: '892,102', change: '+1.2%', icon: Users, color: 'text-purple-500' },
    { title: t.dashboard.stats.vaultTvl, value: '$124.5M', change: '-2.1%', icon: DollarSign, color: 'text-amber-500' },
    { title: t.dashboard.stats.oi, value: '$452.1M', change: '+15.2%', icon: TrendingUp, color: 'text-orange-500' },
    { title: t.dashboard.stats.oiCount, value: '42,910', change: '+8.4%', icon: Layers, color: 'text-emerald-500' },
    { title: t.dashboard.stats.oiUsers, value: '18,521', change: '+10.1%', icon: Users2, color: 'text-cyan-500' },
    { title: t.dashboard.stats.insurance, value: '$12.8M', change: '+0.4%', icon: ShieldCheck, color: 'text-pink-500' },
  ];

  const positionDistData = [
    { name: 'Long', value: 260.5, color: '#10b981' },
    { name: 'Short', value: 191.6, color: '#ef4444' },
  ];

  const marginDistData = [
    { range: '1-10%', count: 450 },
    { range: '11-20%', count: 820 },
    { range: '21-30%', count: 310 },
    { range: '31-40%', count: 150 },
    { range: '41-50%', count: 80 },
    { range: '51-60%', count: 40 },
    { range: '61-70%', count: 20 },
    { range: '71-80%', count: 15 },
    { range: '81-90%', count: 12 },
    { range: '91-100%', count: 8 },
  ];

  const fundingRateData = [
    { time: '00:00', rate: 0.0001 },
    { time: '04:00', rate: -0.0002 },
    { time: '08:00', rate: 0.00015 },
    { time: '12:00', rate: 0.0003 },
    { time: '16:00', rate: 0.0001 },
    { time: '20:00', rate: -0.0001 },
    { time: '24:00', rate: 0.0002 },
  ];

  const formatPercent = (value: number) => `${(value * 100).toFixed(4)}%`;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white transition-all duration-300 flex items-center">
            <LayoutDashboard className="w-8 h-8 mr-4 text-amber-500" />
            {t.dashboard.title}
          </h1>
          <p className="text-gray-400 mt-1">{t.dashboard.subtitle}</p>
        </div>
        <div className="flex space-x-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2" /> {t.dashboard.engineStatus}</span>
          <span className="px-2">|</span>
          <span>{t.dashboard.lastUpdated}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5 hover:border-amber-500/30 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl bg-gray-800 group-hover:bg-amber-500/10 transition-colors`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-400 h-10 line-clamp-2">{stat.title}</h3>
            <p className="text-2xl font-bold mt-1 text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Position Distribution */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-amber-500" />
            {t.dashboard.charts.posDist}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={positionDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {positionDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Margin Rate Histogram */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            {t.dashboard.charts.marginDist}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marginDistData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#1f2937'}}
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funding Rate Trends */}
        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              {t.dashboard.charts.fundingTrend}
            </h3>
            <select 
              className="bg-gray-800 border border-gray-700 text-xs rounded px-2 py-1 outline-none text-gray-300 focus:border-amber-500"
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
            >
              <option value="XAUUSDC">XAUUSDC</option>
              <option value="ETHUSDC">ETHUSDC</option>
              <option value="BTCUSDC">BTCUSDC</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fundingRateData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12}} 
                  tickFormatter={formatPercent}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px' }}
                  formatter={(value: number) => formatPercent(value)}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#fbbf24" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#fbbf24' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Timer className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t.dashboard.footer.latency}</p>
              <p className="text-2xl font-black text-white">0.045 <span className="text-xs text-gray-500">SEC</span></p>
            </div>
          </div>
          <div className="text-right">
             <span className="text-[10px] font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded uppercase">Stable</span>
          </div>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t.dashboard.footer.riskIndex}</p>
              <p className="text-2xl font-black text-white">34.2 <span className="text-xs text-gray-500">%</span></p>
            </div>
          </div>
          <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
             <div className="h-full bg-amber-500 w-[34.2%]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;