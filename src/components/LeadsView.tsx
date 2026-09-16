import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Building,
  Phone,
  Calendar,
  DollarSign,
  ArrowUpDown,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { LeadStatus, LeadTemperature } from '../types';
import { LeadDetailDrawer } from './modals/LeadDetailDrawer';

export const LeadsView: React.FC = () => {
  const {
    leads,
    partners,
    users,
    selectedLeadId,
    setSelectedLeadId,
    setOpenNewItemModal,
    deleteLead
  } = useCrm();

  const [search, setSearch] = useState('');
  const [filterTemp, setFilterTemp] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPartner, setFilterPartner] = useState<string>('all');
  const [viewLeadId, setViewLeadId] = useState<string | null>(selectedLeadId);

  // Sync when global context changes selected lead
  React.useEffect(() => {
    if (selectedLeadId) setViewLeadId(selectedLeadId);
  }, [selectedLeadId]);

  const filteredLeads = useMemo(() => {
    return (leads || []).filter((lead) => {
      if (!lead) return false;
      const q = search.toLowerCase();
      const matchesSearch =
        (lead.company || '').toLowerCase().includes(q) ||
        (lead.name || '').toLowerCase().includes(q) ||
        (lead.city || '').toLowerCase().includes(q) ||
        (lead.segment || '').toLowerCase().includes(q);

      const matchesTemp = filterTemp === 'all' || lead.temperature === filterTemp;
      const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
      const matchesPartner = filterPartner === 'all' || lead.partnerId === filterPartner;

      return matchesSearch && matchesTemp && matchesStatus && matchesPartner;
    });
  }, [leads, search, filterTemp, filterStatus, filterPartner]);

  const statusLabels: Record<LeadStatus, string> = {
    novo: 'Novo',
    primeiro_contato: 'Primeiro Contato',
    em_contato: 'Em Contato',
    qualificado: 'Qualificado',
    enviado_ao_parceiro: 'Enviado ao Parceiro',
    em_negociacao: 'Em Negociação',
    proposta: 'Proposta',
    venda_realizada: 'Venda Realizada',
    perdido: 'Perdido',
    sem_resposta: 'Sem Resposta'
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 font-serif">
              Gestão de Leads & Oportunidades
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded-full">
              {filteredLeads.length} de {leads.length} leads
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Cadastre leads, acompanhe temperaturas, encaminhe para parceiros e converta em vendas comissíveis.
          </p>
        </div>

        <button
          onClick={() => setOpenNewItemModal('lead')}
          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          + Cadastrar Lead
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por empresa, contato, cidade ou segmento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Temperatura */}
          <select
            value={filterTemp}
            onChange={(e) => setFilterTemp(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">🌡️ Temperatura: Todas</option>
            <option value="quente">🔥 Quente</option>
            <option value="morno">⚡ Morno</option>
            <option value="frio">❄️ Frio</option>
          </select>

          {/* Parceiro */}
          <select
            value={filterPartner}
            onChange={(e) => setFilterPartner(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">🏢 Todos os Parceiros</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.company}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">⚡ Todos os Status</option>
            {Object.entries(statusLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Empresa / Contato</th>
                <th className="py-3 px-3">Parceiro Vinculado</th>
                <th className="py-3 px-3">Origem & Cidade</th>
                <th className="py-3 px-3 text-center">Temperatura</th>
                <th className="py-3 px-3 text-center">Status no CRM</th>
                <th className="py-3 px-3 text-right">Valor Potencial</th>
                <th className="py-3 px-3">Próximo Follow-up</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    Nenhum lead encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const partner = partners.find((p) => p.id === lead.partnerId);
                  const isToday = lead.nextFollowUpDate === '2026-09-16';
                  const isOverdue = lead.nextFollowUpDate && lead.nextFollowUpDate < '2026-09-16';

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => {
                        setViewLeadId(lead.id);
                        setSelectedLeadId(lead.id);
                      }}
                      className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                    >
                      {/* Empresa & Contato */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-amber-900 transition-colors">
                          {lead.company}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {lead.name} {lead.role ? `• ${lead.role}` : ''} • {lead.whatsapp}
                        </div>
                      </td>

                      {/* Parceiro */}
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800 line-clamp-1">
                          {partner?.company || 'Sem parceiro'}
                        </span>
                        <span className="text-[10px] text-amber-700 font-semibold">
                          Comissão: {partner?.commissionRate || 0}%
                        </span>
                      </td>

                      {/* Origem & Local */}
                      <td className="py-3 px-3 text-slate-600">
                        <div>{lead.source}</div>
                        <div className="text-[11px] text-slate-400">
                          {lead.city}/{lead.state}
                        </div>
                      </td>

                      {/* Temperatura */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            lead.temperature === 'quente'
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : lead.temperature === 'morno'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}
                        >
                          {lead.temperature}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {statusLabels[lead.status] || lead.status}
                        </span>
                      </td>

                      {/* Valor Potencial */}
                      <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                        R$ {(lead.potentialValue || 0).toLocaleString('pt-BR')}
                      </td>

                      {/* Próximo Follow-up */}
                      <td className="py-3 px-3">
                        <span
                          className={`text-[11px] font-semibold flex items-center gap-1 ${
                            isOverdue
                              ? 'text-rose-600 font-bold'
                              : isToday
                              ? 'text-amber-700 font-bold'
                              : 'text-slate-600'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          {lead.nextFollowUpDate}
                          {isToday && <span className="text-[9px] uppercase px-1 bg-amber-200 rounded-sm">Hoje</span>}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewLeadId(lead.id);
                            setSelectedLeadId(lead.id);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-lg text-xs font-bold transition-colors"
                        >
                          Detalhes →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Drawer Modal */}
      {viewLeadId && (
        <LeadDetailDrawer
          leadId={viewLeadId}
          onClose={() => {
            setViewLeadId(null);
            setSelectedLeadId(null);
          }}
          onConvertToSale={(id) => {
            setOpenNewItemModal('sale');
          }}
        />
      )}
    </div>
  );
};
