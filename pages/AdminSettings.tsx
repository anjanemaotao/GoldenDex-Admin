import React, { useState, useMemo } from 'react';
import { UserPlus, Shield, Trash2, Edit2, ShieldAlert, X, Check, ListChecks, ShieldCheck, ChevronRight, LayoutGrid } from 'lucide-react';
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

interface PermissionItem {
  id: string;
  label: string;
  category: string;
}

const AdminSettings: React.FC = () => {
  const { t, showTip } = useLanguage();

  const [roles, setRoles] = useState<Role[]>([
    { id: 'role-1', name: t.admin.roles.super, isSuper: true, permissions: ['*'] },
    { id: 'role-2', name: t.admin.roles.risk, permissions: ['/dashboard', '/market', 'market:view_pos', '/risk', 'risk:recharge'] },
    { id: 'role-3', name: t.admin.roles.finance, permissions: ['/funds', 'funds:view_deposits', '/logs'] },
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

  // Categorized Permission List for Finer Granularity
  const permissionGroups = useMemo(() => [
    {
      title: t.nav.dashboard,
      perms: [{ id: '/dashboard', label: t.common.view }]
    },
    {
      title: t.nav.admin,
      perms: [
        { id: '/admin', label: t.common.view },
        { id: 'admin:add_role', label: t.admin.addRoleBtn },
        { id: 'admin:edit_role', label: t.admin.modals.editRole },
        { id: 'admin:delete_role', label: '删除角色' },
        { id: 'admin:add_admin', label: t.admin.addBtn },
        { id: 'admin:edit_admin', label: t.admin.modals.editAdmin },
        { id: 'admin:delete_admin', label: '删除管理员' },
      ]
    },
    {
      title: t.nav.market,
      perms: [
        { id: '/market', label: t.common.view },
        { id: 'market:view_pos', label: t.market.openPositions },
        { id: 'market:view_history', label: t.market.closedHistory },
      ]
    },
    {
      title: t.nav.risk,
      perms: [
        { id: '/risk', label: t.common.view },
        { id: 'risk:recharge', label: '保险基金充值' },
        { id: 'risk:withdraw', label: '保险基金提取' },
      ]
    },
    {
      title: t.nav.health,
      perms: [
        { id: '/health', label: t.common.view },
      ]
    },
    {
      title: t.nav.alerts,
      perms: [
        { id: '/alerts', label: t.common.view },
        { id: 'alerts:ack', label: t.alerts.ack },
        { id: 'alerts:read_all', label: t.alerts.markRead },
      ]
    },
    {
      title: t.nav.users,
      perms: [
        { id: '/users', label: t.common.view },
        { id: 'users:freeze', label: t.users.freezeTitle },
        { id: 'users:unfreeze', label: t.users.unfreezeTitle },
      ]
    },
    {
      title: t.nav.funds,
      perms: [
        { id: '/funds', label: t.common.view },
        { id: 'funds:view_deposits', label: t.funds.recharge },
        { id: 'funds:view_withdrawals', label: t.funds.withdrawals },
        { id: 'funds:approve_withdraw', label: '提现审核' },
      ]
    },
    {
      title: t.nav.contractManager,
      perms: [
        { id: '/contracts', label: t.common.view },
        { id: 'contracts:add', label: t.contract.addBtn },
        { id: 'contracts:edit', label: t.contract.editBtn },
        { id: 'contracts:params', label: t.contract.setParams },
      ]
    },
    {
      title: t.nav.params,
      perms: [
        { id: '/settings', label: t.common.view },
        { id: 'params:onchain_view', label: '查看链上多签参数' },
        { id: 'params:onchain_sign', label: t.params.onChainTab + '签名' },
        { id: 'params:offchain_view', label: '查看链下多签参数' },
        { id: 'params:offchain_sign', label: t.params.offChainTab + '签名' },
      ]
    },
    {
      title: t.nav.logs,
      perms: [{ id: '/logs', label: t.common.view }]
    },
  ], [t]);

  const allPermIds = useMemo(() => 
    permissionGroups.flatMap(g => g.perms.map(p => p.id)), 
  [permissionGroups]);

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
    const isNameValid = roleForm.name.trim() !== '';
    const arePermsValid = roleForm.permissions.length > 0;

    if (!isNameValid) return;
    
    if (!arePermsValid) {
      showTip(t.tips.selectPerms, 'info');
      return;
    }
    
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

  const togglePermission = (id: string) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(id) 
        ? prev.permissions.filter(p => p !== id) 
        : [...prev.permissions, id]
    }));
  };

  const toggleAllPermissions = () => {
    if (roleForm.permissions.length === allPermIds.length) {
      setRoleForm(prev => ({ ...prev, permissions: [] }));
    } else {
      setRoleForm(prev => ({ ...prev, permissions: [...allPermIds] }));
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
                <div className="flex flex-wrap gap-1 mt-2 max-h-24 overflow-y-auto custom-scroll">
                   {role.isSuper ? (
                     <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded">{t.admin.allAccess}</span>
                   ) : (
                     role.permissions.map(p => {
                       const found = allPermIds.includes(p);
                       if (!found) return null;
                       const group = permissionGroups.find(g => g.perms.some(item => item.id === p));
                       const perm = group?.perms.find(item => item.id === p);
                       return (
                         <span key={p} className="text-[9px] bg-gray-700/50 text-gray-400 px-1.5 py-0.5 rounded flex items-center whitespace-nowrap">
                           {group?.title}: {perm?.label}
                         </span>
                       );
                     })
                   )}
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
                <select value={adminForm.roleId} onChange={e => setAdminForm({...adminForm, roleId: e.target.value})} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-all appearance-none border-none">
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
          <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">{roleModal.editId ? t.admin.modals.editRole : t.admin.modals.addRole}</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 px-1">{t.admin.modals.fields.name}</label>
                <input 
                  type="text" 
                  value={roleForm.name}
                  onChange={e => setRoleForm({...roleForm, name: e.target.value})}
                  className={`w-full bg-gray-800 border ${roleModal.isSubmitted && roleForm.name.trim() === '' ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]' : 'border-gray-700'} rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-amber-500 transition-all`}
                  placeholder="e.g. Compliance Auditor"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 px-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.admin.modals.fields.permissions}</label>
                  <button onClick={toggleAllPermissions} className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-[10px] font-black uppercase text-amber-500 transition-all">
                    <ListChecks className="w-3.5 h-3.5" />
                    <span>{roleForm.permissions.length === allPermIds.length ? t.admin.modals.deselectAll : t.admin.modals.selectAll}</span>
                  </button>
                </div>
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4 custom-scroll">
                  {permissionGroups.map((group) => (
                    <div key={group.title} className="bg-gray-800/20 border border-gray-800 rounded-2xl p-4">
                      <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-4 flex items-center">
                        <LayoutGrid className="w-3 h-3 mr-2 text-amber-500" />
                        {group.title}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {group.perms.map((perm) => (
                          <button 
                            key={perm.id} 
                            onClick={() => togglePermission(perm.id)} 
                            className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all group/item
                              ${roleForm.permissions.includes(perm.id) 
                                ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.05)]' 
                                : 'bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-300'}
                            `}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                                ${roleForm.permissions.includes(perm.id) ? 'bg-amber-500 border-amber-500' : 'border-gray-700 group-hover/item:border-amber-500/50'}
                              `}>
                                {roleForm.permissions.includes(perm.id) && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                              </div>
                              <span className="text-xs font-bold truncate">{perm.label}</span>
                            </div>
                            {perm.id.startsWith('/') && <ChevronRight className="w-3 h-3 opacity-30" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-10">
              <button onClick={() => setRoleModal({ open: false })} className="flex-1 px-4 py-3.5 bg-gray-800 hover:bg-gray-700 rounded-2xl text-sm font-bold text-gray-300 transition-all">{t.common.cancel}</button>
              <button onClick={handleRoleSubmit} className="flex-1 px-4 py-3.5 rounded-2xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-xl shadow-amber-900/30">{t.common.confirm}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
