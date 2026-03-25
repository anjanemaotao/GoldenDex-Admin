import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminSettings from './pages/AdminSettings';
import MarketWatch from './pages/MarketWatch';
import RiskCenter from './pages/RiskCenter';
import SystemHealth from './pages/SystemHealth';
import AlertCenter from './pages/AlertCenter';
import UserManagement from './pages/UserManagement';
import FundRecords from './pages/FundRecords';
import AuditLogs from './pages/AuditLogs';
import ContractManager from './pages/ContractManager';
import ContractSettings from './pages/ContractSettings';
import WalletManagement from './pages/WalletManagement';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const handleLogin = (address: string) => {
    setWalletAddress(address);
    setIsAuthenticated(true);
  };

  const handleDisconnect = () => {
    setIsAuthenticated(false);
    setWalletAddress("");
  };

  if (!isAuthenticated) {
    return (
      <LanguageProvider>
        <Login onLogin={handleLogin} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <div className="flex h-screen overflow-hidden bg-[#0a0a0b] text-gray-100 font-sans">
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <Header 
              address={walletAddress}
              onDisconnect={handleDisconnect}
            />
            <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminSettings />} />
                <Route path="/market" element={<MarketWatch />} />
                <Route path="/risk" element={<RiskCenter />} />
                <Route path="/health" element={<SystemHealth />} />
                <Route path="/alerts" element={<AlertCenter />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/funds" element={<FundRecords />} />
                <Route path="/logs" element={<AuditLogs />} />
                <Route path="/contracts" element={<ContractManager />} />
                <Route path="/wallets" element={<WalletManagement />} />
                <Route path="/settings" element={<ContractSettings />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;
