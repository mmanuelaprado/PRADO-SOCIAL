import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Plus,
  UserCheck,
  Shield,
  Layers,
  FileCode,
  Building2,
  Users,
  CheckCircle2,
  DollarSign,
  ChevronDown,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    users,
    notifications,
    setIsSearchOpen,
    setOpenNewItemModal,
    activeTab,
    setActiveTab,
    setSelectedLeadId
  } = useCrm();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const newMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (newMenuRef.current && !newMenuRef.current.contains(event.target as Node)) {
        setIsNewMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifCount = notifications.length;

  return (
    <header className="sticky top-0 z-40 bg-[#0B192C] text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Brand Identity */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Gold Geometric Emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B192C] rounded-[10px] flex items-center justify-center">
                <span className="font-serif font-black text-amber-400 text-lg tracking-wider group-hover:scale-105 transition-transform">
                  P
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-wider text-white font-serif">
                  PRADO SOCIAL
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-sm">
                  CRM v1.0
                </span>
              </div>
              <p className="text-[10px] tracking-wide text-slate-400 font-medium">
                Operações Comerciais & Gestão de Comissões
              </p>
            </div>
          </div>

          {/* Quick View Switcher: CRM Operacional vs Projeto & Arquitetura */}
          <div className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab !== 'architecture'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Operação CRM
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'architecture'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              Projeto Técnico & Banco
            </button>
          </div>
        </div>

        {/* Center / Search Bar */}
        <div className="flex-1 max-w-md hidden lg:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 text-xs transition-colors group"
          >
            <span className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-amber-400 group-hover:text-amber-300" />
              <span>Buscar parceiro, lead, cliente, venda ou comissão...</span>
            </span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded-md text-[10px] text-slate-300 font-mono">
              /
            </kbd>
          </button>
        </div>

        {/* Right Actions: + Novo, Notifications, User Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Mobile search trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick "+ Novo" Dropdown */}
          <div className="relative" ref={newMenuRef}>
            <button
              onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/10 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo</span>
              <ChevronDown className="w-3 h-3 text-slate-900/80" />
            </button>

            {isNewMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-fade-in text-xs">
                <button
                  onClick={() => {
                    setIsNewMenuOpen(false);
                    setOpenNewItemModal('lead');
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-amber-50/70 flex items-center gap-2.5 font-semibold text-slate-800"
                >
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>Novo Lead / Oportunidade</span>
                </button>

                <button
                  onClick={() => {
                    setIsNewMenuOpen(false);
                    setOpenNewItemModal('partner');
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-amber-50/70 flex items-center gap-2.5 font-semibold text-slate-800"
                >
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Nova Empresa Parceira</span>
                </button>

                <button
                  onClick={() => {
                    setIsNewMenuOpen(false);
                    setOpenNewItemModal('sale');
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-amber-50/70 flex items-center gap-2.5 font-semibold text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Registrar Venda & Comissão</span>
                </button>

                <button
                  onClick={() => {
                    setIsNewMenuOpen(false);
                    setOpenNewItemModal('task');
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-amber-50/70 flex items-center gap-2.5 font-semibold text-slate-800 border-t border-slate-100"
                >
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Agendar Follow-up</span>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-850 bg-slate-900 border border-slate-800 transition-colors"
              title="Alertas operacionais"
            >
              <Bell className="w-4 h-4 text-slate-300" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-xs">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-fade-in text-xs">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-600" />
                    Central de Alertas ({notifications.length})
                  </div>
                  <span className="text-[10px] text-slate-400">Data ref: 16/09/2026</span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">
                      Nenhum alerta pendente no momento.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.targetType === 'lead' && n.targetId) {
                            setSelectedLeadId(n.targetId);
                            setActiveTab('leads');
                          } else if (n.targetType === 'commission') {
                            setActiveTab('commissions');
                          }
                          setIsNotifOpen(false);
                        }}
                        className="p-3 hover:bg-slate-50 cursor-pointer flex items-start gap-2.5 transition-colors"
                      >
                        {n.type === 'commission_overdue' || n.type === 'followup_overdue' ? (
                          <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 shrink-0">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </div>
                        ) : n.type === 'followup_today' ? (
                          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-bold text-slate-800 text-xs">{n.title}</div>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">{n.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('tasks');
                      setIsNotifOpen(false);
                    }}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800"
                  >
                    Ver todas as tarefas e prazos →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-400/50"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-amber-400/20 text-amber-300 rounded-sm">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {currentUser.roleTitle.split('/')[0]}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-fade-in text-xs">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                  <div className="text-[10px] font-semibold text-amber-700 mt-1">
                    Permissão: {currentUser.roleTitle}
                  </div>
                </div>

                <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50">
                  Alternar Perfil / Função (Simulação):
                </div>

                <div className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        setIsUserMenuOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-amber-50/50 transition-colors ${
                        currentUser.id === user.id ? 'bg-amber-50/80 font-bold' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-6 h-6 rounded-md object-cover"
                        />
                        <div>
                          <div className="text-xs text-slate-900 font-semibold">{user.name}</div>
                          <div className="text-[10px] text-slate-500">{user.roleTitle}</div>
                        </div>
                      </div>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                        {user.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
