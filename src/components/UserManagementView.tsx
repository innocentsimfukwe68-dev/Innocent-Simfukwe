import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  Unlock,
  X,
  UserCheck,
  Edit2,
  Trash2,
  ArrowRightLeft,
  Sparkles,
  Store,
} from 'lucide-react';
import { User, UserRole, UserStatus, canManageUsers } from '../types';
import { apiService } from '../services/apiService';

interface UserManagementViewProps {
  currentUser: User | null;
  onRefreshUsers: () => void;
  onSwitchUser?: (user: User) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  currentUser,
  onRefreshUsers,
  onSwitchUser,
}) => {
  const users = apiService.getUsers();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Add form state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Cashier');
  const [status, setStatus] = useState<UserStatus>('Active');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isAdmin = canManageUsers(currentUser?.Role);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim() || !username.trim() || !password.trim()) {
      setErrorMsg('Tafadhali jaza taarifa zote zinazohitajika');
      return;
    }

    const existing = users.find((u) => u.Username.toLowerCase() === username.trim().toLowerCase());
    if (existing) {
      setErrorMsg(`Jina la mtumiaji "${username}" tayari linatumiwa na mfanyakazi mwingine`);
      return;
    }

    apiService.addUser({
      FullName: fullName.trim(),
      Username: username.trim(),
      Password: password.trim(),
      Role: role,
      Status: status,
      LastLogin: 'Never',
    });

    setSuccessMsg(`Mtumiaji "${username}" amesajiliwa kikamilifu kama ${role}!`);
    setShowAddModal(false);
    setFullName('');
    setUsername('');
    setPassword('');
    setRole('Cashier');
    setStatus('Active');
    onRefreshUsers();
  };

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setErrorMsg(null);

    apiService.updateUser(editingUser);
    setSuccessMsg(`Taarifa za mtumiaji "${editingUser.Username}" zimesasishwa kikamilifu!`);
    setEditingUser(null);
    onRefreshUsers();
  };

  const handleDeleteUser = (user: User) => {
    if (user.UserID === currentUser?.UserID) {
      alert('Huwezi kufuta akaunti yako unayotumia sasa hivi.');
      return;
    }

    if (window.confirm(`Una uhakika unataka kumfuta mfanyakazi "${user.FullName}" (@${user.Username})?`)) {
      apiService.deleteUser(user.UserID);
      setSuccessMsg(`Akaunti ya "${user.Username}" imefutwa kwenye mfumo.`);
      onRefreshUsers();
    }
  };

  const handleToggleStatus = (user: User) => {
    if (user.UserID === currentUser?.UserID) {
      alert('Huwezi kusimamisha (deactivate) akaunti yako unayotumia sasa.');
      return;
    }

    const newStatus: UserStatus = user.Status === 'Active' ? 'Inactive' : 'Active';
    apiService.updateUserStatus(user.UserID, newStatus);
    onRefreshUsers();
  };

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Usimamizi wa Watumiaji (Admin Only)</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Sehemu hii inahitaji ruhusa za Msimamizi Mkuu (Admin). Wafanyakazi wa jukumu la Cashier au
            StoreKeeper hawaruhusiwi kubadilisha au kuongeza watumiaji.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900">Wafanyakazi & Ulinzi wa Mfumo</h1>
            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-xs font-semibold">
              Admin Exclusive
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Sajili akaunti za Cashier, Manager, na StoreKeeper, dhibiti hadhi zao, na linda usalama wa mauzo
          </p>
        </div>

        <button
          id="add-user-btn"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Sajili Mfanyakazi Mpya (Add User)</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 font-bold">
            ×
          </button>
        </div>
      )}

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Jumla ya Watumiaji
            </span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-2xl font-bold text-slate-900">{users.length}</span>
          <p className="text-xs text-slate-500 mt-1">Admin, Manager, Cashier, StoreKeeper</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Wanaofanya Kazi (Active)
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-emerald-600">
            {users.filter((u) => u.Status === 'Active').length}
          </span>
          <p className="text-xs text-slate-500 mt-1">Wanaruhusiwa kuingia na kufanya mauzo</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Wahudumu / Cashiers
            </span>
            <UserCheck className="w-4 h-4 text-pink-500" />
          </div>
          <span className="text-2xl font-bold text-pink-600">
            {users.filter((u) => u.Role === 'Cashier').length}
          </span>
          <p className="text-xs text-slate-500 mt-1">Wanauza na kuongeza bidhaa mpya</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Waliofungwa (Inactive)
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-bold text-rose-600">
            {users.filter((u) => u.Status === 'Inactive').length}
          </span>
          <p className="text-xs text-slate-500 mt-1">Wamezuiliwa kufanya operesheni zozote</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-slate-900 text-sm">Orodha ya Watumiaji Kwenye Kanzidata (tbl_users)</h3>
          </div>
          <span className="text-xs text-slate-400">Database: cosmetics_shop</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-12">ID</th>
                <th className="px-4 py-3">Jina Kamili</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Wadhifa (Role)</th>
                <th className="px-4 py-3">Hadhi (Status)</th>
                <th className="px-4 py-3">Kuingia Mwisho</th>
                <th className="px-4 py-3 text-right">Vitendo (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map((u) => {
                const isCurrent = u.UserID === currentUser?.UserID;
                return (
                  <tr key={u.UserID} className={`hover:bg-slate-50 transition-colors ${isCurrent ? 'bg-purple-50/40' : ''}`}>
                    <td className="px-4 py-3 font-mono font-bold text-slate-500">#{u.UserID}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          {u.FullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 flex items-center space-x-1.5">
                            <span>{u.FullName}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded bg-purple-200 text-purple-800 text-[10px] font-bold">
                                Wewe (Current)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">@{u.Username}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          u.Role === 'Admin'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : u.Role === 'Manager'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : u.Role === 'StoreKeeper'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {u.Role === 'Admin' && <Shield className="w-3 h-3 mr-1" />}
                        {u.Role === 'Manager' && <Sparkles className="w-3 h-3 mr-1" />}
                        {u.Role === 'StoreKeeper' && <Store className="w-3 h-3 mr-1" />}
                        {u.Role === 'Cashier' && <UserCheck className="w-3 h-3 mr-1" />}
                        {u.Role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          u.Status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            u.Status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        {u.Status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      {u.LastLogin || 'Never'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Quick switch button for testing */}
                        {onSwitchUser && !isCurrent && (
                          <button
                            onClick={() => onSwitchUser(u)}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-pink-100 text-slate-600 hover:text-pink-700 text-[11px] font-medium flex items-center space-x-1"
                            title="Ingia kama mtumiaji huyu kujaribu ruhusa zake"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                            <span>Jaribu</span>
                          </button>
                        )}

                        {/* Edit button */}
                        <button
                          onClick={() => setEditingUser({ ...u })}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          title="Badilisha taarifa za mtumiaji"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Status Toggle */}
                        <button
                          disabled={isCurrent}
                          onClick={() => handleToggleStatus(u)}
                          className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center space-x-1 transition-colors ${
                            u.Status === 'Active'
                              ? 'bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 disabled:opacity-40'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                          }`}
                        >
                          {u.Status === 'Active' ? (
                            <>
                              <Lock className="w-3 h-3" />
                              <span>Zima</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3" />
                              <span>Washa</span>
                            </>
                          )}
                        </button>

                        {/* Delete button */}
                        {!isCurrent && (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Futa mtumiaji"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Roles Explanation */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
        <h4 className="font-semibold text-slate-800 flex items-center space-x-1.5">
          <ShieldAlert className="w-4 h-4 text-purple-600" />
          <span>Muundo wa Majukumu na Ruhusa (Roles & Permissions)</span>
        </h4>
        <p>• <strong>Administrator:</strong> Ruhusa kamili ya kutazama faida (Profit), kufanya analytics, kuongeza na kufuta watumiaji, na kurekebisha bei zote.</p>
        <p>• <strong>Manager:</strong> Usimamizi wa duka, hesabu ya bidhaa na stoo, lakini ripoti za faida halisi ni za Admin.</p>
        <p>• <strong>Cashier:</strong> Ana uwezo wa kuuza POS, kukata risiti, na <strong>kuongeza bidhaa mpya kwenye kanzidata ya stoo</strong>. Faida na bei za jumla zimefichwa kwake.</p>
        <p>• <strong>StoreKeeper:</strong> Anasimamia idadi ya mzigo stooni (stock adjustments) na kusajili bidhaa mpya.</p>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Sajili Mtumiaji Mpya</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Jina Kamili *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="mfano: Innocent Simfukwe"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Jina la Kuingilia (Username) *</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="mfano: innocent, cashier2..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Nenosiri (Password) *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Unda nenosiri la mtumiaji"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Wadhifa (Role)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="Cashier">Cashier (Muuzaji)</option>
                    <option value="Admin">Administrator (Msimamizi)</option>
                    <option value="Manager">Manager (Meneja)</option>
                    <option value="StoreKeeper">StoreKeeper (Mstoo)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Hadhi ya Akaunti</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as UserStatus)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="Active">Active (Inafanya kazi)</option>
                    <option value="Inactive">Inactive (Imezimwa)</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold bg-pink-600 hover:bg-pink-700 text-white rounded-lg shadow-xs"
                >
                  Hifadhi Mtumiaji
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Rekebisha Mtumiaji #{editingUser.UserID}</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Jina Kamili *</label>
                <input
                  type="text"
                  required
                  value={editingUser.FullName}
                  onChange={(e) => setEditingUser({ ...editingUser, FullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Username *</label>
                <input
                  type="text"
                  required
                  value={editingUser.Username}
                  onChange={(e) => setEditingUser({ ...editingUser, Username: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Nenosiri Jipya (Password)</label>
                <input
                  type="password"
                  value={editingUser.Password}
                  onChange={(e) => setEditingUser({ ...editingUser, Password: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Wadhifa (Role)</label>
                  <select
                    value={editingUser.Role}
                    onChange={(e) => setEditingUser({ ...editingUser, Role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="Cashier">Cashier</option>
                    <option value="Admin">Administrator</option>
                    <option value="Manager">Manager</option>
                    <option value="StoreKeeper">StoreKeeper</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Hadhi ya Akaunti</label>
                  <select
                    value={editingUser.Status}
                    onChange={(e) => setEditingUser({ ...editingUser, Status: e.target.value as UserStatus })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold bg-pink-600 hover:bg-pink-700 text-white rounded-lg shadow-xs"
                >
                  Hifadhi Mabadiliko
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
