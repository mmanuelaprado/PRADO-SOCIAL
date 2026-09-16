import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building,
  Filter,
  Search,
  MessageSquare,
  FileCheck,
  Receipt,
  Sparkles,
  Clock
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { CommissionStatus, Commission } from '../types';

export const CommissionsView: React.FC = () => {
  const { commissions, partners, updateCommissionStatus } = useCrm();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [partnerFilter, setPartnerFilter] = useState('all');

  const filteredCommissions = useMemo(() => {
    return (commissions || []).filter((c) => {
      if (!c) return false;
      const q = search.toLowerCase();
      const matchesSearch =
        (c.clientName || '').toLowerCase().includes(q) ||
        (c.partnerName || '').toLowerCase().includes(q) ||
        (c.id || '').toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesPartner = partnerFilter === 'all' || c.partnerId === partnerFilter;

      return matchesSearch && matchesStatus && matchesPartner;
    });
  }, [commissions, search, statusFilter, partnerFilter]);

  // Financial totals
  const totalReceived = (commissions || [])
    .filter((c) => c && c.status === 'recebida')
    .reduce((sum, c) => sum + (c.commissionValue || 0), 0);

  const totalPending = (commissions || [])
    .filter((c) => c && (c.status === 'prevista' || c.status === 'a_faturar' || c.status === 'faturada' || c.status === 'aguardando_pagamento'))
    .reduce((sum, c) => sum + (c.commissionValue || 0), 0);

  const totalOverdue = (commissions || [])
    .filter((c) => c && c.status === 'em_atraso')
    .reduce((sum, c) => sum + (c.commissionValue || 0), 0);

  const totalAll = totalReceived + totalPending + totalOverdue;

  // Quick WhatsApp reminder message generator
  const getWhatsAppReminderUrl = (c: Commission) => {
    const partner = partners.find((p) => p.id === c.partnerId);
    const phone = partner?.whatsapp ? partner.whatsapp.replace(/\D/g, '') : '';
    const message = encodeURIComponent(
      `Olá ${partner?.contactName || 'Parceiro'}, tudo bem? Aqui é da Prado Social.\n\nConstatamos no nosso sistema financeiro que a comissão ref. à venda do cliente *${c.clientName}* no valor de *R$ ${(c.commissionValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*, com vencimento previsto em *${c.expectedDate}*, consta como pendente de baixa.\n\nPoderia por gentileza nos atualizar com o comprovante de pagamento ou espelho da NF? Agradecemos a parceria!`
    );
    return `https://wa.me/55${phone}?text=${message}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 font-serif">
              Gestão Financeira de Comissões
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
              Receita Prado Social
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Controle de lançamentos, conciliação bancária, datas previstas e cobrança de comissões devidas pelas empresas parceiras.
          </p>
        </div>
      </div>

      {/* Financial Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Recebidas */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Comissões Recebidas
            </span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400">Valores já compensados em conta</p>
        </div>

        {/* Previstas / A Receber */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Comissões a Receber
            </span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-700">
            R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400">Dentro do prazo contratual</p>
        </div>

        {/* Em Atraso */}
        <div className={`p-4 rounded-2xl border shadow-xs space-y-1 ${
          totalOverdue > 0 ? 'bg-rose-50/70 border-rose-200' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
              Comissões em Atraso
            </span>
            <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-800">
            R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-rose-700 font-medium">Requer contato imediato de cobrança</p>
        </div>

        {/* Total Geral da Operação */}
        <div className="p-4 bg-gradient-to-br from-[#0B192C] to-[#162D4A] rounded-2xl shadow-xs text-white space-y-1">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Total Faturado Prado
            </span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            R$ {totalAll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-300">Receita total acumulada da carteira</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, parceiro ou ID da comissão..."
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
            <option value="em_atraso">🔴 Em Atraso</option>
            <option value="aguardando_pagamento">🟡 Aguardando Pagamento</option>
            <option value="faturada">🔵 Faturada</option>
            <option value="a_faturar">⚪ A Faturar</option>
            <option value="prevista">🟣 Prevista</option>
            <option value="recebida">🟢 Recebida (Paga)</option>
          </select>

          <select
            value={partnerFilter}
            onChange={(e) => setPartnerFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">🏢 Todos os Parceiros</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.company}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Commissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Lançamento / ID</th>
                <th className="py-3 px-3">Cliente Contratante</th>
                <th className="py-3 px-3">Empresa Parceira</th>
                <th className="py-3 px-3 text-right">Valor da Venda</th>
                <th className="py-3 px-3 text-center">Taxa (%)</th>
                <th className="py-3 px-3 text-right">Comissão Prado</th>
                <th className="py-3 px-3">Data Prevista</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCommissions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    Nenhuma comissão encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredCommissions.map((c) => {
                  const isOverdue = c.status === 'em_atraso';
                  const isReceived = c.status === 'recebida';

                  const statusBadge = {
                    recebida: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    aguardando_pagamento: 'bg-amber-100 text-amber-800 border-amber-200',
                    faturada: 'bg-blue-100 text-blue-800 border-blue-200',
                    a_faturar: 'bg-slate-100 text-slate-700 border-slate-200',
                    prevista: 'bg-purple-100 text-purple-800 border-purple-200',
                    em_atraso: 'bg-rose-100 text-rose-800 border-rose-200 font-black',
                    cancelada: 'bg-gray-100 text-gray-700 border-gray-200'
                  }[c.status];

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isOverdue ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        <span className="font-bold text-slate-700 block">{c.id}</span>
                        <span>Venda: {c.saleDate}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{c.clientName}</div>
                        {c.invoiceNumber && (
                          <div className="text-[10px] text-slate-400">NF: {c.invoiceNumber}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-3 font-semibold text-slate-800">
                        {c.partnerName}
                      </td>

                      <td className="py-3.5 px-3 text-right font-medium text-slate-600">
                        R$ {(c.saleValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-3 text-center font-bold text-slate-700">
                        {c.commissionRate}%
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <span className="text-sm font-black text-amber-800">
                          R$ {(c.commissionValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-medium">
                        <div className={isOverdue ? 'text-rose-700 font-bold' : 'text-slate-700'}>
                          {c.expectedDate}
                        </div>
                        {c.receivedDate && (
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            Pago em {c.receivedDate}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusBadge}`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {!isReceived && (
                          <button
                            onClick={() => {
                              const today = new Date().toISOString().split('T')[0];
                              updateCommissionStatus(c.id, 'recebida', today);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-bold transition-colors shadow-2xs"
                            title="Confirmar recebimento bancário"
                          >
                            ✓ Recebido
                          </button>
                        )}

                        {isOverdue && (
                          <a
                            href={getWhatsAppReminderUrl(c)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[11px] font-bold transition-colors shadow-2xs"
                            title="Cobrar parceiro via WhatsApp"
                          >
                            <MessageSquare className="w-3 h-3" />
                            Cobrar
                          </a>
                        )}

                        <select
                          value={c.status}
                          onChange={(e) =>
                            updateCommissionStatus(c.id, e.target.value as CommissionStatus)
                          }
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md text-[11px] font-medium text-slate-700"
                        >
                          <option value="prevista">Prevista</option>
                          <option value="a_faturar">A faturar</option>
                          <option value="faturada">Faturada</option>
                          <option value="aguardando_pagamento">Aguardando Pagamento</option>
                          <option value="em_atraso">Em atraso</option>
                          <option value="recebida">Recebida</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
