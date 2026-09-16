import React, { useMemo } from 'react';
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowRight,
  Percent,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export const DashboardView: React.FC = () => {
  const {
    partners,
    leads,
    sales,
    commissions,
    tasks,
    users,
    filters,
    setFilters,
    setActiveTab,
    setSelectedPartnerId,
    setSelectedLeadId,
    setOpenNewItemModal
  } = useCrm();

  // Filtered dataset according to active filters
  const filteredData = useMemo(() => {
    let resLeads = [...(leads || [])];
    let resSales = [...(sales || [])];
    let resCommissions = [...(commissions || [])];

    if (filters.partnerId && filters.partnerId !== 'all') {
      resLeads = resLeads.filter((l) => l && l.partnerId === filters.partnerId);
      resSales = resSales.filter((s) => s && s.partnerId === filters.partnerId);
      resCommissions = resCommissions.filter((c) => c && c.partnerId === filters.partnerId);
    }

    if (filters.segment && filters.segment !== 'all') {
      resLeads = resLeads.filter((l) => l && l.segment === filters.segment);
    }

    if (filters.responsibleId && filters.responsibleId !== 'all') {
      resLeads = resLeads.filter((l) => l && l.internalResponsibleId === filters.responsibleId);
    }

    if (filters.status && filters.status !== 'all') {
      resLeads = resLeads.filter((l) => l && l.status === filters.status);
    }

    return { leads: resLeads, sales: resSales, commissions: resCommissions };
  }, [leads, sales, commissions, filters]);

  // Unique segments for filter dropdown
  const segments = useMemo(() => {
    const list = new Set((partners || []).map((p) => p.segment).concat((leads || []).map((l) => l.segment)));
    return Array.from(list).filter(Boolean);
  }, [partners, leads]);

  // KPIs
  const activePartnersCount = (partners || []).filter((p) => p && p.status === 'ativo').length;
  const newPartnersCount = (partners || []).filter((p) => p && (p.status === 'prospectando' || p.status === 'contato_realizado' || p.status === 'em_negociacao')).length;

  const totalLeadsReceived = (filteredData.leads || []).length;
  const leadsInNegotiation = (filteredData.leads || []).filter(
    (l) => l && (l.funnelStage === 'negociacao' || l.funnelStage === 'proposta' || l.funnelStage === 'enviado_ao_parceiro')
  ).length;

  const salesClosedCount = (filteredData.sales || []).length;
  const totalSalesValue = (filteredData.sales || []).reduce((acc, s) => acc + (s.saleValue || 0), 0);

  // Commissions calculations
  const commissionsReceived = (filteredData.commissions || [])
    .filter((c) => c && c.status === 'recebida')
    .reduce((acc, c) => acc + (c.commissionValue || 0), 0);

  const commissionsPending = (filteredData.commissions || [])
    .filter((c) => c && (c.status === 'prevista' || c.status === 'a_faturar' || c.status === 'faturada' || c.status === 'aguardando_pagamento'))
    .reduce((acc, c) => acc + (c.commissionValue || 0), 0);

  const commissionsOverdue = (filteredData.commissions || [])
    .filter((c) => c && c.status === 'em_atraso')
    .reduce((acc, c) => acc + (c.commissionValue || 0), 0);

  const totalCommissionsExpected = commissionsReceived + commissionsPending + commissionsOverdue;

  // Follow-ups & tasks
  const todayStr = '2026-09-16';
  const followUpsToday = (tasks || []).filter((t) => t && t.status === 'pendente' && t.date === todayStr);
  const followUpsOverdue = (tasks || []).filter((t) => t && t.status === 'pendente' && t.date < todayStr);

  const leadsWithoutFollowUp = (filteredData.leads || []).filter(
    (l) => l && (!l.nextFollowUpDate || l.nextFollowUpDate < todayStr)
  ).length;

  // Conversion rate
  const convertedLeadsCount = (filteredData.leads || []).filter(
    (l) => l && (l.funnelStage === 'venda' || l.funnelStage === 'comissao' || l.status === 'venda_realizada')
  ).length;
  const conversionRate = totalLeadsReceived > 0 ? (convertedLeadsCount / totalLeadsReceived) * 100 : 0;

  // Top partners ranking
  const partnerRanking = useMemo(() => {
    return (partners || []).map((p) => {
      const pLeads = (leads || []).filter((l) => l && l.partnerId === p.id);
      const pSales = (sales || []).filter((s) => s && s.partnerId === p.id);
      const pSalesVal = pSales.reduce((sum, s) => sum + (s.saleValue || 0), 0);
      const pComms = (commissions || []).filter((c) => c && c.partnerId === p.id);
      const pCommsReceived = pComms
        .filter((c) => c && c.status === 'recebida')
        .reduce((sum, c) => sum + (c.commissionValue || 0), 0);
      const pCommsPending = pComms
        .filter((c) => c && c.status !== 'recebida' && c.status !== 'cancelada')
        .reduce((sum, c) => sum + (c.commissionValue || 0), 0);

      return {
        partner: p,
        leadsCount: pLeads.length,
        salesCount: pSales.length,
        salesVal: pSalesVal,
        commissionsReceived: pCommsReceived,
        commissionsPending: pCommsPending,
        totalCommissions: pCommsReceived + pCommsPending
      };
    }).sort((a, b) => b.totalCommissions - a.totalCommissions);
  }, [partners, leads, sales, commissions]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="bg-gradient-to-r from-[#0B192C] via-[#102A45] to-[#0B192C] rounded-2xl p-6 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
              Painel de Controle Comercial
            </span>
            <span className="text-xs text-slate-400 font-mono">16 de Setembro de 2026</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white font-serif">
            Operação Comercial & Comissões
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Acompanhe em tempo real a geração de leads, avanço de propostas com empresas parceiras e a previsão de receita da Prado Social.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setOpenNewItemModal('lead')}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            + Novo Lead
          </button>
          <button
            onClick={() => setOpenNewItemModal('sale')}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            + Registrar Venda
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            Ver Funil Kanban →
          </button>
        </div>
      </div>

      {/* Filter Bar (Required by prompt: Data, Parceiro, Segmento, Responsável, Status) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-amber-600" />
          <span>Filtros Operacionais:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 flex-1 max-w-4xl text-xs">
          {/* Período */}
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as any })}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
          >
            <option value="all">📅 Todo o Período</option>
            <option value="today">Hoje (16/09)</option>
            <option value="7days">Últimos 7 dias</option>
            <option value="month">Mês Atual (Setembro)</option>
            <option value="quarter">Trimestre Atual</option>
            <option value="year">Ano de 2026</option>
          </select>

          {/* Parceiro */}
          <select
            value={filters.partnerId}
            onChange={(e) => setFilters({ ...filters, partnerId: e.target.value })}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
          >
            <option value="all">🏢 Todos os Parceiros</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.company}
              </option>
            ))}
          </select>

          {/* Segmento */}
          <select
            value={filters.segment}
            onChange={(e) => setFilters({ ...filters, segment: e.target.value })}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
          >
            <option value="all">🏷️ Todos os Segmentos</option>
            {segments.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Responsável */}
          <select
            value={filters.responsibleId}
            onChange={(e) => setFilters({ ...filters, responsibleId: e.target.value })}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
          >
            <option value="all">👤 Todos os Responsáveis</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
          >
            <option value="all">⚡ Todos os Status</option>
            <option value="novo">Novo</option>
            <option value="em_contato">Em contato</option>
            <option value="qualificado">Qualificado</option>
            <option value="enviado_ao_parceiro">Enviado ao parceiro</option>
            <option value="em_negociacao">Em negociação</option>
            <option value="proposta">Proposta</option>
            <option value="venda_realizada">Venda realizada</option>
          </select>
        </div>

        {(filters.partnerId !== 'all' || filters.segment !== 'all' || filters.responsibleId !== 'all' || filters.status !== 'all') && (
          <button
            onClick={() =>
              setFilters({
                dateRange: 'all',
                partnerId: 'all',
                segment: 'all',
                responsibleId: 'all',
                status: 'all'
              })
            }
            className="text-xs text-amber-700 hover:text-amber-800 font-bold underline"
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {/* KPI Cards Grid - Full set requested by user */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Comissões Recebidas (Receita Prado Social) */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Comissões Recebidas
            </span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-emerald-700">
            R$ {(commissionsReceived || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Previstas: R$ {(commissionsPending || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span className="text-emerald-600 font-semibold">100% Pago</span>
          </div>
        </div>

        {/* Card 2: Vendas Realizadas & Volume */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Vendas Realizadas
            </span>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {salesClosedCount} contratos
          </div>
          <div className="text-[11px] text-slate-500 truncate">
            Volume total: <strong className="text-slate-800">R$ {(totalSalesValue || 0).toLocaleString('pt-BR')}</strong>
          </div>
        </div>

        {/* Card 3: Leads no Pipeline & Em Negociação */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Leads Recebidos
            </span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {totalLeadsReceived} leads
          </div>
          <div className="text-[11px] text-amber-800 flex items-center gap-1 font-semibold">
            <span>{leadsInNegotiation} em negociação ativa</span>
          </div>
        </div>

        {/* Card 4: Taxa de Conversão */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Taxa de Conversão
            </span>
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-purple-700">
            {conversionRate.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500">
            {convertedLeadsCount} convertidos de {totalLeadsReceived}
          </div>
        </div>
      </div>

      {/* Secondary Financial & Partner Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Parceiros Ativos */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Parceiros Ativos / Novos
          </div>
          <div className="text-lg font-bold text-slate-800 mt-1 flex items-baseline gap-1.5">
            <span>{activePartnersCount} ativos</span>
            <span className="text-xs font-normal text-slate-500">({newPartnersCount} em onboarding)</span>
          </div>
        </div>

        {/* Comissões Pendentes */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Comissões a Receber
          </div>
          <div className="text-lg font-bold text-amber-700 mt-1">
            R$ {(commissionsPending || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Comissões em Atraso */}
        <div className={`p-3.5 rounded-xl border ${commissionsOverdue > 0 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700 flex items-center justify-between">
            <span>Comissões em Atraso</span>
            {commissionsOverdue > 0 && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
          </div>
          <div className="text-lg font-bold text-rose-800 mt-1">
            R$ {(commissionsOverdue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Follow-ups Hoje & Atrasados */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Follow-ups para Hoje</span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 mt-1 flex items-baseline gap-2">
            <span>{followUpsToday.length} hoje</span>
            {followUpsOverdue.length > 0 && (
              <span className="text-xs font-bold text-rose-600">
                ({followUpsOverdue.length} atrasadas)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Operational Action Center & Funnel/Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Commercial Funnel Snapshot & Top Partners */}
        <div className="lg:col-span-2 space-y-6">
          {/* Funnel Progress Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  Visão Resumida do Funil Comercial
                </h3>
                <p className="text-xs text-slate-500">Distribuição dos leads nas 8 etapas operacionais</p>
              </div>
              <button
                onClick={() => setActiveTab('kanban')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                Abrir Kanban Completo <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Funnel Horizontal Bar Steps */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs">
              {[
                { stage: 'novo', label: '1. NOVO', count: (leads || []).filter((l) => l && l.funnelStage === 'novo').length, color: 'bg-slate-100 text-slate-800 border-slate-300' },
                { stage: 'contato', label: '2. CONTATO', count: (leads || []).filter((l) => l && l.funnelStage === 'contato').length, color: 'bg-blue-50 text-blue-800 border-blue-200' },
                { stage: 'qualificado', label: '3. QUALIF.', count: (leads || []).filter((l) => l && l.funnelStage === 'qualificado').length, color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
                { stage: 'enviado_ao_parceiro', label: '4. ENVIADO', count: (leads || []).filter((l) => l && l.funnelStage === 'enviado_ao_parceiro').length, color: 'bg-amber-50 text-amber-800 border-amber-300 font-bold' },
                { stage: 'negociacao', label: '5. NEGOC.', count: (leads || []).filter((l) => l && l.funnelStage === 'negociacao').length, color: 'bg-amber-100 text-amber-900 border-amber-400 font-bold' },
                { stage: 'proposta', label: '6. PROPOSTA', count: (leads || []).filter((l) => l && l.funnelStage === 'proposta').length, color: 'bg-purple-50 text-purple-800 border-purple-200 font-bold' },
                { stage: 'venda', label: '7. VENDA', count: (leads || []).filter((l) => l && l.funnelStage === 'venda').length, color: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' },
                { stage: 'comissao', label: '8. COMISSÃO', count: (leads || []).filter((l) => l && l.funnelStage === 'comissao').length, color: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black' },
              ].map((step) => (
                <div
                  key={step.stage}
                  onClick={() => setActiveTab('kanban')}
                  className={`p-2.5 rounded-xl border ${step.color} cursor-pointer hover:shadow-xs transition-all flex flex-col justify-between`}
                >
                  <span className="text-[10px] font-bold truncate">{step.label}</span>
                  <span className="text-base font-extrabold mt-1">{step.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Partners Performance Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  Performance das Empresas Parceiras
                </h3>
                <p className="text-xs text-slate-500">Volume gerado e comissões da Prado Social por parceiro</p>
              </div>
              <button
                onClick={() => setActiveTab('partners')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                Ver Todos os Parceiros <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="pb-2">Empresa Parceira</th>
                    <th className="pb-2 text-center">Leads</th>
                    <th className="pb-2 text-center">Vendas</th>
                    <th className="pb-2 text-right">Volume Vendido</th>
                    <th className="pb-2 text-right">Comissão Prado</th>
                    <th className="pb-2 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {partnerRanking.slice(0, 4).map((r) => (
                    <tr key={r.partner.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{r.partner.company}</div>
                        <div className="text-[11px] text-slate-500">
                          {r.partner.segment} • {r.partner.commissionRate}% de comissão
                        </div>
                      </td>
                      <td className="py-3 text-center font-semibold text-slate-700">
                        {r.leadsCount}
                      </td>
                      <td className="py-3 text-center font-bold text-emerald-700">
                        {r.salesCount}
                      </td>
                      <td className="py-3 text-right font-semibold text-slate-800">
                        R$ {(r.salesVal || 0).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 text-right font-extrabold text-amber-700">
                        R$ {(r.totalCommissions || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedPartnerId(r.partner.id);
                            setActiveTab('partners');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-md font-bold text-[11px] transition-colors"
                        >
                          Ver Perfil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Urgent Operational Action Center */}
        <div className="space-y-6">
          {/* Follow-ups Today Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Follow-ups para Hoje ({followUpsToday.length})
              </h3>
              <span className="text-[10px] text-slate-400">16/09</span>
            </div>

            <div className="space-y-2">
              {followUpsToday.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  Nenhum follow-up agendado para hoje.
                </div>
              ) : (
                followUpsToday.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-amber-50/40 border border-amber-200/80 rounded-xl space-y-1 hover:bg-amber-50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-amber-900">{task.time}</span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        Resp: {task.responsibleName}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 leading-snug">
                      {task.title}
                    </div>
                    {task.leadId && (
                      <button
                        onClick={() => {
                          setSelectedLeadId(task.leadId!);
                          setActiveTab('leads');
                        }}
                        className="text-[11px] text-amber-700 font-bold hover:underline inline-flex items-center gap-1 pt-1"
                      >
                        Abrir Lead <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Overdue Alerts (Commissions or Follow-ups) */}
          {(followUpsOverdue.length > 0 || commissionsOverdue > 0) && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Pendências com Atenção Prioritária
              </div>

              {commissionsOverdue > 0 && (
                <div className="p-2.5 bg-white/80 rounded-xl text-xs space-y-1 border border-rose-200">
                  <div className="font-bold text-rose-900">
                    R$ {(commissionsOverdue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em comissões vencidas
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Cobrança pendente com parceiros. Notificação já acionada.
                  </p>
                  <button
                    onClick={() => setActiveTab('commissions')}
                    className="text-[11px] text-rose-700 font-bold underline"
                  >
                    Ver comissões em atraso →
                  </button>
                </div>
              )}

              {followUpsOverdue.length > 0 && (
                <div className="p-2.5 bg-white/80 rounded-xl text-xs space-y-1 border border-rose-200">
                  <div className="font-bold text-rose-900">
                    {followUpsOverdue.length} follow-up(s) com data expirada
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Leads aguardando contato da equipe.
                  </p>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="text-[11px] text-rose-700 font-bold underline"
                  >
                    Abrir lista de tarefas →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quick Architecture Spec Prompt Notice */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-indigo-200/80 space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Projeto Técnico & Especificação
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Consulte a modelagem das 14 entidades, comparativo de tecnologias (Supabase, Firebase, SQL, No-Code) e fases do roadmap.
            </p>
            <button
              onClick={() => setActiveTab('architecture')}
              className="w-full py-2 bg-[#0B192C] text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors flex items-center justify-center gap-1.5"
            >
              Acessar Dicionário & Arquitetura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
