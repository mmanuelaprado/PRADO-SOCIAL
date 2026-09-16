import React, { useState } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  UserPlus,
  Mail,
  Phone,
  Check,
  X,
  CheckCircle2,
  Sparkles,
  Lock,
  Eye,
  KeyRound,
  UserCheck
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { User, UserRole } from '../types';

export const UsersView: React.FC = () => {
  const { users, currentUser, setCurrentUser, addUser, updateUser } = useCrm();
  const [isAdding, setIsAdding] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'comercial' as UserRole,
    roleTitle: 'Executivo de Vendas',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
  });

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrador Geral',
    gestor: 'Gestor de Operações',
    comercial: 'Executivo Comercial',
    sdr: 'SDR / Pré-Vendas',
    financeiro: 'Financeiro / Controladoria'
  };

  const roleColors: Record<UserRole, { badge: string; border: string }> = {
    admin: { badge: 'bg-amber-100 text-amber-900 border-amber-300', border: 'border-amber-400' },
    gestor: { badge: 'bg-indigo-100 text-indigo-900 border-indigo-300', border: 'border-indigo-400' },
    comercial: { badge: 'bg-blue-100 text-blue-900 border-blue-300', border: 'border-blue-400' },
    sdr: { badge: 'bg-emerald-100 text-emerald-900 border-emerald-300', border: 'border-emerald-400' },
    financeiro: { badge: 'bg-purple-100 text-purple-900 border-purple-300', border: 'border-purple-400' }
  };

  const permissionsMatrix = [
    { module: '1. Dashboard Geral', admin: true, gestor: true, comercial: true, sdr: true, financeiro: true },
    { module: '2. Funil Comercial (Kanban)', admin: true, gestor: true, comercial: true, sdr: true, financeiro: false },
    { module: '3. CRM de Leads', admin: true, gestor: true, comercial: true, sdr: true, financeiro: false },
    { module: '4. Empresas Parceiras', admin: true, gestor: true, comercial: true, sdr: false, financeiro: false },
    { module: '5. Catálogo de Produtos & Serviços', admin: true, gestor: true, comercial: true, sdr: false, financeiro: false },
    { module: '6. Registro de Vendas', admin: true, gestor: true, comercial: true, sdr: false, financeiro: true },
    { module: '7. Comissões Prado Social', admin: true, gestor: true, comercial: true, sdr: false, financeiro: true },
    { module: '8. Carteira de Clientes Conquistados', admin: true, gestor: true, comercial: true, sdr: false, financeiro: true },
    { module: '9. Tarefas & Follow-up', admin: true, gestor: true, comercial: true, sdr: true, financeiro: false },
    { module: '10. Gestão de Usuários & RBAC', admin: true, gestor: true, comercial: false, sdr: false, financeiro: false },
    { module: '11. Relatórios Gerenciais & BI', admin: true, gestor: true, comercial: true, sdr: false, financeiro: true },
    { module: '12. Motor de Automações', admin: true, gestor: true, comercial: false, sdr: false, financeiro: false },
    { module: '13. Auditoria & Logs do Sistema', admin: true, gestor: true, comercial: false, sdr: false, financeiro: false }
  ];

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;

    addUser({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      roleTitle: newUser.roleTitle || roleLabels[newUser.role],
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
    });

    setIsAdding(false);
    setNewUser({
      name: '',
      email: '',
      phone: '',
      role: 'comercial',
      roleTitle: 'Executivo de Vendas',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 font-serif">
              Gestão de Usuários & Controle de Acesso (RBAC)
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
              {(users || []).length} usuários
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Controle de permissões por perfil (Admin, Gestor, Comercial, SDR e Financeiro) com auditoria de ações.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          + Convidar Usuário
        </button>
      </div>

      {/* Simulator Switcher Banner */}
      <div className="p-4 bg-gradient-to-r from-[#0B192C] to-slate-900 text-white rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-amber-500/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <KeyRound className="w-4 h-4" />
            Simulador de Sessão Ativa (Teste Rápido de Permissões)
          </div>
          <p className="text-xs text-slate-300">
            Você está operando como <strong className="text-white">{currentUser?.name || 'Administrador'}</strong> ({roleLabels[currentUser?.role || 'admin']}).
            Alterne o usuário ativo abaixo para verificar como o menu e as telas se adaptam instantaneamente:
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {(users || []).map((u) => {
            const isSelected = u.id === currentUser?.id;
            return (
              <button
                key={u.id}
                onClick={() => setCurrentUser(u)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-sm ring-2 ring-white/20'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20 hover:text-white'
                }`}
              >
                <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover" />
                <span>{u.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75 font-normal">({u.role})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add User Modal / Form */}
      {isAdding && (
        <form onSubmit={handleSaveUser} className="p-5 bg-white border border-amber-300 rounded-2xl shadow-md space-y-4 animate-fade-in">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Cadastrar Novo Membro da Equipe
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nome Completo *</label>
              <input
                type="text"
                required
                placeholder="Ex: Mariana Silva"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">E-mail Corporativo *</label>
              <input
                type="email"
                required
                placeholder="mariana@pradosocial.com.br"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                placeholder="(11) 99999-8888"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Perfil de Acesso (RBAC) *</label>
              <select
                value={newUser.role}
                onChange={(e) => {
                  const r = e.target.value as UserRole;
                  setNewUser({ ...newUser, role: r, roleTitle: roleLabels[r] });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium"
              >
                <option value="admin">Administrador Geral (Acesso Total)</option>
                <option value="gestor">Gestor de Operações (Acesso Estratégico)</option>
                <option value="comercial">Executivo Comercial (Funil, Vendas, Parceiros)</option>
                <option value="sdr">SDR / Pré-vendas (Prospecção & Qualificação)</option>
                <option value="financeiro">Financeiro (Comissões & Faturamento)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Cargo / Título Exibido</label>
              <input
                type="text"
                placeholder="Ex: Executiva de Contas Sênior"
                value={newUser.roleTitle}
                onChange={(e) => setNewUser({ ...newUser, roleTitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-lg"
            >
              Salvar Usuário
            </button>
          </div>
        </form>
      )}

      {/* Grid of Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(users || []).map((user) => {
          const isCurrent = user.id === currentUser?.id;
          const roleCfg = roleColors[user.role] || { badge: 'bg-slate-100 text-slate-800 border-slate-300', border: 'border-slate-300' };

          return (
            <div
              key={user.id}
              className={`p-5 bg-white border rounded-2xl shadow-xs transition-all space-y-3 relative ${
                isCurrent ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {isCurrent && (
                <span className="absolute top-4 right-4 text-[10px] font-black px-2 py-0.5 bg-amber-400 text-slate-950 rounded-full flex items-center gap-1 shadow-2xs">
                  <UserCheck className="w-3 h-3" />
                  Sua Sessão
                </span>
              )}

              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/50 shadow-xs"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
                  <p className="text-xs text-slate-500">{user.roleTitle || roleLabels[user.role]}</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleCfg.badge}`}>
                    {roleLabels[user.role]}
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Perfil Ativo</span>
                </div>

                {!isCurrent ? (
                  <button
                    onClick={() => setCurrentUser(user)}
                    className="px-2.5 py-1 text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                  >
                    Trocar para este usuário
                  </button>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Conectado
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix (RBAC) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Matriz de Permissões por Perfil de Acesso (RBAC)
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">
            Regras automáticas aplicadas em tempo real na navegação
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Módulo do Sistema</th>
                <th className="py-3 px-3 text-center">Admin</th>
                <th className="py-3 px-3 text-center">Gestor</th>
                <th className="py-3 px-3 text-center">Comercial</th>
                <th className="py-3 px-3 text-center">SDR</th>
                <th className="py-3 px-3 text-center">Financeiro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-800">
                    {item.module}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.admin ? (
                      <span className="inline-flex p-1 bg-emerald-100 text-emerald-700 rounded-md">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 bg-slate-100 text-slate-400 rounded-md">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.gestor ? (
                      <span className="inline-flex p-1 bg-emerald-100 text-emerald-700 rounded-md">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 bg-slate-100 text-slate-400 rounded-md">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.comercial ? (
                      <span className="inline-flex p-1 bg-emerald-100 text-emerald-700 rounded-md">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 bg-slate-100 text-slate-400 rounded-md">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.sdr ? (
                      <span className="inline-flex p-1 bg-emerald-100 text-emerald-700 rounded-md">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 bg-slate-100 text-slate-400 rounded-md">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {item.financeiro ? (
                      <span className="inline-flex p-1 bg-emerald-100 text-emerald-700 rounded-md">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 bg-slate-100 text-slate-400 rounded-md">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
