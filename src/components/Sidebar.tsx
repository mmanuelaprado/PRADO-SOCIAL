import React from 'react';
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Building2,
  Package,
  CheckCircle2,
  DollarSign,
  Briefcase,
  CalendarCheck,
  BarChart3,
  Sparkles,
  History,
  FileCode,
  RotateCcw,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    leads,
    partners,
    commissions,
    tasks,
    resetToInitialData,
    hasPermission
  } = useCrm();

  const openFollowUpsCount = (tasks || []).filter((t) => t && t.status === 'pendente' && t.date <= '2026-09-16').length;
  const overdueCommissionsCount = (commissions || []).filter((c) => c && c.status === 'em_atraso').length;
  const activeLeadsCount = (leads || []).filter((l) => l && l.funnelStage !== 'venda' && l.funnelStage !== 'comissao').length;

  const navItems = [
    {
      id: 'dashboard',
      label: '1. Dashboard Geral',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'kanban',
      label: '2. Funil Comercial',
      icon: KanbanSquare,
      badge: activeLeadsCount > 0 ? `${activeLeadsCount}` : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'leads',
      label: '3. CRM de Leads',
      icon: Users,
      badge: leads.length
    },
    {
      id: 'partners',
      label: '4. Empresas Parceiras',
      icon: Building2,
      badge: partners.length
    },
    {
      id: 'products',
      label: '5. Produtos & Serviços',
      icon: Package,
      badge: null
    },
    {
      id: 'sales',
      label: '6. Vendas Realizadas',
      icon: CheckCircle2,
      badge: null
    },
    {
      id: 'commissions',
      label: '7. Comissões Prado',
      icon: DollarSign,
      badge: overdueCommissionsCount > 0 ? `! ${overdueCommissionsCount}` : null,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold'
    },
    {
      id: 'clients',
      label: '8. Clientes Conquistados',
      icon: Briefcase,
      badge: null
    },
    {
      id: 'tasks',
      label: '9. Tarefas & Follow-up',
      icon: CalendarCheck,
      badge: openFollowUpsCount > 0 ? `${openFollowUpsCount}` : null,
      badgeColor: 'bg-amber-400 text-slate-900 font-bold'
    },
    {
      id: 'users',
      label: '10. Usuários & Acessos',
      icon: ShieldCheck,
      badge: 'RBAC',
      badgeColor: 'bg-amber-100 text-amber-900 font-semibold'
    },
    {
      id: 'reports',
      label: '11. Relatórios & BI',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'automations',
      label: '12. Motor de Automações',
      icon: Sparkles,
      badge: '5 ativas',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'history',
      label: '13. Histórico & Auditoria',
      icon: History,
      badge: null
    },
    {
      id: 'architecture',
      label: '14. Arquitetura & Banco',
      icon: FileCode,
      badge: 'DOC',
      badgeColor: 'bg-indigo-100 text-indigo-800 font-mono'
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Operation badge */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
            Operação Ativa
          </span>
        </div>
        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md border border-amber-300/50">
          MVP Live
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Módulos do Sistema
        </div>

        {navItems.map((item) => {
          const isAllowed = hasPermission(item.id);
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          if (!isAllowed) return null;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group text-left ${
                isActive
                  ? 'bg-[#0B192C] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md shrink-0 ${
                    item.badgeColor || (isActive ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-200 text-slate-700')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info & Reset Data */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900">
          <div className="font-bold flex items-center gap-1.5 mb-0.5">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            Operação Prado Social
          </div>
          <p className="text-[10px] text-amber-800/90 leading-tight">
            Parceiros → Prado Social → Clientes & Comissões automáticas.
          </p>
        </div>

        <button
          onClick={resetToInitialData}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
          title="Restaura a base demonstrativa completa"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Restaurar Demonstração</span>
        </button>
      </div>
    </aside>
  );
};
