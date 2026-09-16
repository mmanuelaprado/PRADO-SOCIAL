import React, { useState, useMemo } from 'react';
import {
  Building2,
  Phone,
  Mail,
  Percent,
  Clock,
  MapPin,
  Plus,
  Search,
  CheckCircle2,
  DollarSign,
  Users,
  Calendar,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { Partner } from '../types';

export const PartnersView: React.FC = () => {
  const {
    partners,
    leads,
    sales,
    commissions,
    products,
    selectedPartnerId,
    setSelectedPartnerId,
    setOpenNewItemModal,
    setActiveTab,
    setSelectedLeadId
  } = useCrm();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailPartnerId, setDetailPartnerId] = useState<string | null>(selectedPartnerId);

  // Sync with global context
  React.useEffect(() => {
    if (selectedPartnerId) setDetailPartnerId(selectedPartnerId);
  }, [selectedPartnerId]);

  const filteredPartners = useMemo(() => {
    return (partners || []).filter((p) => {
      if (!p) return false;
      const q = search.toLowerCase();
      const matchesSearch =
        (p.company || '').toLowerCase().includes(q) ||
        (p.segment || '').toLowerCase().includes(q) ||
        (p.contactName || '').toLowerCase().includes(q) ||
        (p.city || '').toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [partners, search, statusFilter]);

  const selectedPartner = (partners || []).find((p) => p && p.id === detailPartnerId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 font-serif">
              Empresas Parceiras
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
              {filteredPartners.length} parceiros
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Cadastre parceiros, controle percentuais de comissão, prazos de pagamento e fluxos de comunicação de venda.
          </p>
        </div>

        <button
          onClick={() => setOpenNewItemModal('partner')}
          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          + Cadastrar Parceiro
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar parceiro por nome, segmento, responsável ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">⚡ Todos os Status</option>
            <option value="ativo">🟢 Ativo</option>
            <option value="em_negociacao">🟡 Em Negociação</option>
            <option value="contato_realizado">🔵 Contato Realizado</option>
            <option value="prospectando">⚪ Prospectando</option>
            <option value="pausado">⏸️ Pausado</option>
            <option value="encerrado">🔴 Encerrado</option>
          </select>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPartners.map((partner) => {
          const partnerLeads = (leads || []).filter((l) => l && l.partnerId === partner.id);
          const partnerSales = (sales || []).filter((s) => s && s.partnerId === partner.id);
          const partnerComms = (commissions || []).filter((c) => c && c.partnerId === partner.id);
          const totalComms = partnerComms.reduce((acc, c) => acc + (c.commissionValue || 0), 0);

          const statusBadge = {
            ativo: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            em_negociacao: 'bg-amber-100 text-amber-800 border-amber-200',
            aguardando_aprovacao: 'bg-orange-100 text-orange-800 border-orange-200',
            contato_realizado: 'bg-blue-100 text-blue-800 border-blue-200',
            prospectando: 'bg-slate-100 text-slate-700 border-slate-200',
            pausado: 'bg-gray-100 text-gray-700 border-gray-200',
            encerrado: 'bg-rose-100 text-rose-800 border-rose-200'
          }[partner.status];

          return (
            <div
              key={partner.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 space-y-3">
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {partner.segment}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                      {partner.company}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusBadge}`}>
                    {partner.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Responsible */}
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span>{partner.contactName}</span>
                    <span className="text-slate-400 font-normal">({partner.role})</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {partner.whatsapp}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {partner.city}/{partner.state}
                    </span>
                  </div>
                </div>

                {/* Commission box */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900 flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5 text-amber-600" />
                      Comissão Prado Social:
                    </span>
                    <span className="text-sm font-black text-amber-900">
                      {partner.commissionRate}%
                    </span>
                  </div>

                  <div className="text-[11px] text-amber-800/90 flex items-center justify-between">
                    <span>Tipo: {partner.commissionType}</span>
                    <span>Prazo: {partner.paymentTermDays} dias</span>
                  </div>

                  {partner.isRecurrentCommission && (
                    <div className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md text-center">
                      ✓ Recorrente: {partner.recurrencePeriodMonths || 12} meses (MRR)
                    </div>
                  )}
                </div>

                {/* Operational metrics */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Leads</div>
                    <div className="text-sm font-extrabold text-slate-800">{partnerLeads.length}</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Vendas</div>
                    <div className="text-sm font-extrabold text-emerald-700">{partnerSales.length}</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Comissões</div>
                    <div className="text-sm font-extrabold text-amber-800 truncate">
                      R$ {totalComms.toLocaleString('pt-BR')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setOpenNewItemModal('lead');
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-amber-800"
                >
                  + Vincular Lead
                </button>

                <button
                  onClick={() => setDetailPartnerId(partner.id)}
                  className="px-3 py-1.5 bg-[#0B192C] hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                  Ver Ficha Completa <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Partner Detail Drawer Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden animate-slide-left">
            {/* Header */}
            <div className="p-6 bg-[#0B192C] text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">
                  Ficha Cadastral da Empresa Parceira
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{selectedPartner.company}</h2>
                <p className="text-xs text-slate-300">CNPJ: {selectedPartner.cnpj || 'Não informado'}</p>
              </div>
              <button
                onClick={() => setDetailPartnerId(null)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Partner Rules */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Regras Comerciais & Acordo de Comissão
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-500">Taxa de Comissão:</span>
                    <div className="text-base font-extrabold text-amber-900">
                      {selectedPartner.commissionRate}%
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Tipo:</span>
                    <div className="font-bold text-slate-800 capitalize">
                      {selectedPartner.commissionType}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Prazo de Pagto:</span>
                    <div className="font-bold text-slate-800">
                      {selectedPartner.paymentTermDays} dias
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Recorrência:</span>
                    <div className="font-bold text-slate-800">
                      {selectedPartner.isRecurrentCommission
                        ? `${selectedPartner.recurrencePeriodMonths} meses`
                        : 'Não'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Operational processes */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Processos Operacionais Alinhados
                </h3>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div>
                    <span className="font-bold text-slate-800 block">Forma de Identificação do Lead:</span>
                    <span className="text-slate-600">{selectedPartner.leadIdentificationMethod}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Processo de Comunicação da Venda:</span>
                    <span className="text-slate-600">{selectedPartner.saleCommunicationProcess}</span>
                  </div>
                </div>
              </div>

              {/* Leads linked to this partner */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-600" />
                    Leads Encaminhados ({leads.filter((l) => l.partnerId === selectedPartner.id).length})
                  </h3>
                  <button
                    onClick={() => {
                      setDetailPartnerId(null);
                      setOpenNewItemModal('lead');
                    }}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800"
                  >
                    + Novo Lead
                  </button>
                </div>

                <div className="space-y-2">
                  {leads
                    .filter((l) => l.partnerId === selectedPartner.id)
                    .map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => {
                          setDetailPartnerId(null);
                          setSelectedLeadId(lead.id);
                          setActiveTab('leads');
                        }}
                        className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-amber-50/50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{lead.company}</div>
                          <div className="text-[11px] text-slate-500">
                            {lead.name} • Etapa: {lead.funnelStage.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-right font-extrabold text-slate-900">
                          R$ {(lead.potentialValue || 0).toLocaleString('pt-BR')}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Parceria desde {selectedPartner.startDate}</span>
              <button
                onClick={() => setDetailPartnerId(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
