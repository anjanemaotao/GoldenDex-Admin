import React, { useState, useMemo } from 'react';
import { UserPlus, Shield, Trash2, Edit2, ShieldAlert, X, Check, ListChecks, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface Role {
  id: string;
  name: string;
  isSuper?: boolean;
  permissions: string[];
}

interface Admin {
  id: string;
  name: string;
  wallet: string;
  roleId: string;
}

const AdminSettings: React.FC = () => {
  const { t, showTip } = useLanguage();

  const [roles, setRoles] = useState<Role[]>([
    { id: 'role-1', name: t.admin.roles.super, isSuper: true, permissions: ['*'] },
    { id: 'role-2', name: t.admin.roles.risk, permissions: ['/dashboard', '/market', '/risk', '/health'] },
    { id: 'role-3', name: t.admin.roles.finance, permissions: ['/funds', '/logs'] },
  ]);

  const [admins, setAdmins] = useState<Admin[]>([
    { id: '1', name: 'Root Admin', wallet: '0x71C7...d8976F', roleId: 'role-1' },
    { id: '2', name: 'Risk Lead A', wallet: '0xRisk...1111', roleId: 'role-2' },
    { id: '3', name: 'Finance Lead', wallet: '0xFin...2222', roleId: 'role-3' },
  ]);

  const [adminModal, setAdminModal] = useState<{ open: boolean, editId?: string, isSubmitted?: boolean }>({ open: false });
  const [roleModal, setRoleModal] = useState<{ open: boolean, editId?: string, isSubmitted?: boolean }>({ open: false });

  const [adminForm, setAdminForm] = useState({ name: '', wallet: '', roleId: 'role-2' });
  const [roleForm, setRoleForm] = useState<{ name: string, permissions: string[] }>({ name: '', permissions: [] });

  const allPerms = [
    { path: '/dashboard', label: t.nav.dashboard },
    { path: '/admin', label: t.nav.admin },
    { path: '/market', label: t.nav.market },
    { path: '/risk', label: t.nav.risk },
    { path: '/health', label: t.nav.health },
    { path: '/alerts', label: t.nav.alerts },
    { path: '/users', label: t.nav.users },
    { path: '/funds', label: t.nav.funds },
    { path: '/logs', label: t.nav.logs },
    { path: '/contracts', label: t.nav.contractManager },
    { path: '/settings', label: t.nav.params },
  ];

  const openAdminModal = (editId?: string) => {
    if (editId) {
      const admin = admins.find(a => a.id === editId);
      if (admin) setAdminForm({ name: admin.name, wallet: admin.wallet, roleId: admin.roleId });
    } else {
      setAdminForm({ name: '', wallet: '', roleId: roles[1]?.id || 'role-2' });
    }
    setAdminModal({ open: true, editId, isSubmitted: false });
  };

  const handleAdminSubmit = () => {
    setAdminModal(prev => ({ ...prev, isSubmitted: true }));
    const isValid = adminForm.name.trim() !== '' && adminForm.wallet.trim() !== '';
    if (!isValid) return;
    
    if (adminModal.editId) {
      setAdmins(admins.map(a => a.id === adminModal.editId ? { ...a, ...adminForm } : a));
      showTip(t.tips.adminUpdated, 'success');
    } else {
      setAdmins([...admins, { id: Math.random().toString(36).substr(2, 9), ...adminForm }]);
      showTip(t.tips.adminAdded, 'success');
    }
    setAdminModal({ open: false });
  };

  const handleDeleteAdmin = (id: string) => {
    setAdmins(admins.filter(a => a.id !== id));
    showTip(t.tips.adminDeleted, 'info');
  };

  const openRoleModal = (editId?: string) => {
    if (editId) {
      const role = roles.find(r => r.id === editId);
      if (role) setRoleForm({ name: role.name, permissions: role.permissions });
    } else {
      setRoleForm({ name: '', permissions: [] });
    }
    setRoleModal({ open: true, editId, isSubmitted: false });
  };

  const handleRoleSubmit = () => {
    setRoleModal(prev => ({ ...prev, isSubmitted: true }));
    const isValid = roleForm.name.trim() !== '' && roleForm.permissions.length > 0;
    if (!isValid) return;
    
    if (roleModal.editId) {
      setRoles(roles.map(r => r.id === roleModal.editId ? { ...r, ...roleForm } : r));
      showTip(t.tips.roleUpdated, 'success');
    } else {
      setRoles([...roles, { id: Math.random().toString(36).substr(2, 9), ...roleForm }]);
      showTip(t.tips.roleAdded, 'success');
    }
    setRoleModal({ open: false });
  };

  const handleDeleteRole = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
    showTip(t.tips.roleDeleted, 'info');
  };

  const togglePermission = (path: string) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(path) 
        ? prev.permissions.filter(p => p !== path) 
        : [...prev.permissions, path]
    }));
  };

  const toggleAllPermissions = () => {
    if (roleForm.permissions.length === allPerms.length) {
      setRoleForm(prev => ({ ...prev, permissions: [] }));
    } else {
      setRoleForm(prev => ({ ...prev, permissions: allPerms.map(p => p.path) }));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <ShieldCheck className="w-6 h-6 mr-3 text-amber-500" />
            {t.admin.title}
          </h1>
          <p className="text-gray-400">{t.admin.subtitle}</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => openRoleModal()}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-white font-semibold transition-all"
          >
            <Shield className="w-4 h-4 text-amber-500" />
            <span>{t.admin.addRoleBtn}</span>
          </button>
          <button 
            onClick={() => openAdminModal()}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg text-white font-semibold transition-all shadow-lg shadow-amber-900/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.admin.addBtn}</span>
          </button>
        </div>
      </div>

      <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-xl flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-400">
          <p className="font-semibold mb-1">{t.admin.policyNote}</p>
          <p>{t.admin.policyDesc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-300">{t.admin.activeAdmins}</h2>
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-800 text-gray-400 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">{t.admin.headers.nameId}</th>
                  <th className="px-6 py-4">{t.admin.headers.wallet}</th>
                  <th className="px-6 py-4">{t.admin.headers.role}</th>
                  <th className="px-6 py-4">{t.common.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {admins.map((admin) => {
                  const role = roles.find(r => r.id === admin.roleId);
                  return (
                    <tr key={admin.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{admin.name}</div>
                        <div className="text-xs text-gray-500">UID: {admin.id}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-amber-500">{admin.wallet}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${role?.isSuper ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'}`}>
                          {role?.name || t.common.none}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {!role?.isSuper && (
                          <div className="flex space-x-3">
                            <button onClick={() => openAdminModal(admin.id)} className="text-gray-400 hover:text-amber-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteAdmin(admin.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-300">{t.admin.roleDefs}</h2>
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 space-y-4">
            {roles.map(role => (
              <div key={role.id} className="p-4 bg-gray-800/40 rounded-xl border border-gray-800 hover:border-amber-500/50 transition-all relative group">
                <div className="flex items-center justify-between mb-2">
                  <span className={`${role.isSuper ? 'text-amber-500' : 'text-blue-500'} font-bold text-sm uppercase`}>{role.name}</span>
                  {!role.isSuper && (
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openRoleModal(role.id)} className="text-gray-400 hover:text-white"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDeleteRole(role.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                   {role.isSuper ? <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded">{t.admin.allAccess}</span> : role.permissions.map(p => (
                     <span key={p} className="text-[10px] bg-gray-700/50 text-gray-400 px-1.5 py-0.5 rounded">{allPerms.find(item => item.path === p)?.label || p}</span>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {adminModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setAdminModal({ open: false })} />
          <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-6">{adminModal.editId ? t.admin.modals.editAdmin : t.admin.modals.addAdmin}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t.admin.modals.fields.name}</label>
                <input 
                  type="text" 
                  value={adminForm.name}
                  onChange={e => setAdminForm({...adminForm, name: e.target.value})}
                  className={`w-full bg-gray-800 border ${adminModal.isSubmitted && adminForm.name.trim() === '' ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]' : 'border-gray-700'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all`}
                  placeholder="e.g. Satoshi"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t.admin.modals.fields.wallet}</label>
                <input 
                  type="text" 
                  value={adminForm.wallet}
                  onChange={e => setAdminForm({...adminForm, wallet: e.target.value})}
                  className={`w-full bg-gray-800 border ${adminModal.isSubmitted && adminForm.wallet.trim() === '' ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]' : 'border-gray-700'} rounded-xl px-4 py-2.5 text-sm outline-none font-mono focus:border-amber-500 transition-all`}
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t.admin.modals.fields.role}</label>
                <select value={adminForm.roleId} onChange={e => setAdminForm({...adminForm, roleId: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all appearance-none">
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-8">
              <button onClick={() => setAdminModal({ open: false })} className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-bold text-gray-300 transition-all">{t.common.cancel}</button>
              <button onClick={handleAdminSubmit} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-lg shadow-amber-900/20">{t.common.confirm}</button>
            </div>
          </div>
        </div>
      )}

      {roleModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setRoleModal({ open: false })} />
          <div className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-6">{roleModal.editId ? t.admin.modals.editRole : t.admin.modals.addRole}</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t.admin.modals.fields.name}</label>
                <input 
                  type="text" 
                  value={roleForm.name}
                  onChange={e => setRoleForm({...roleForm, name: e.target.value})}
                  className={`w-full bg-gray-800 border ${roleModal.isSubmitted && roleForm.name.trim() === '' ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]' : 'border-gray-700'} rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all`}
                  placeholder="e.g. Risk Manager"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={`block text-xs font-bold ${roleModal.isSubmitted && roleForm.permissions.length === 0 ? 'text-red-500' : 'text-gray-500'} uppercase`}>{t.admin.modals.fields.permissions}</label>
                  <button onClick={toggleAllPermissions} className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-[10px] font-black uppercase text-amber-500 transition-all">
                    <ListChecks className="w-3.5 h-3.5" />
                    <span>{roleForm.permissions.length === allPerms.length ? t.admin.modals.deselectAll : t.admin.modals.selectAll}</span>
                  </button>
                </div>
                <div className={`grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scroll border p-2 rounded-xl transition-all ${roleModal.isSubmitted && roleForm.permissions.length === 0 ? 'border-red-500' : 'border-transparent'}`}>
                  {allPerms.map(p => (
                    <button key={p.path} onClick={() => togglePermission(p.path)} className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${roleForm.permissions.includes(p.path) ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-gray-800/40 border-gray-800 text-gray-500 hover:border-gray-700'}`}>
                      <span className="text-xs font-medium">{p.label}</span>
                      {roleForm.permissions.includes(p.path) && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-8">
              <button onClick={() => setRoleModal({ open: false })} className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-bold text-gray-300 transition-all">{t.common.cancel}</button>
              <button onClick={handleRoleSubmit} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-lg shadow-amber-900/20">{t.common.confirm}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
