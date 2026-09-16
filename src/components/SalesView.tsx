import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  DollarSign,
  Plus,
  Search,
  Building,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export const SalesView: React.FC = () => {
  const { sales, partners, commissions, setOpenNewItemModal, setActiveTab } = useCrm();

  const [search, setSearch] = useState('');
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const q = search.toLowerCase();
      const matchesSearch =
        sale.clientName.toLowerCase().includes(q) ||
        sale.partnerName.toLowerCase().includes(q) ||
        sale.productName.toLowerCase().includes(q);

      const matchesPartner = partnerFilter === 'all' || sale.partnerId === partnerFilter;
      const matchesType = typeFilter === 'all' || sale.saleType === typeFilter;

      return matchesSearch && matchesPartner && matchesType;
    });
  }, [sales, search, partnerFilter, typeFilter]);

  const totalSalesVal = filteredSales.reduce((sum, s) => sum + s.saleValue, 0);
  const totalCommissionGenerated = filteredSales.reduce((sum, s) => {
    const comm = commissions.find((c) => c.saleId === s.id);
    return sum + (comm?.commissionValue || 0);
  }, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 font-serif">
              Vendas & Contratos Fechados
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full">
              {filteredSales.length} contratos
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Registro consolidado de todas as transações bem-sucedidas geradas pela Prado Social para os parceiros.
          </p>
        </div>

        <button
          onClick={() => setOpenNewItemModal('sale')}
          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          + Registrar Nova Venda
        </button>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total de Vendas Fechadas
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {filteredSales.length} contratos
          </div>
          <p className="text-[11px] text-slate-400">Intermediações comerciais concluídas</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Volume Total Movimentado
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            R$ {totalSalesVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400">Faturamento direto gerado aos parceiros</p>
        </div>

        <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-300/80 rounded-xl shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
            Comissão Prado Social Gerada
          </div>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">
            R$ {totalCommissionGenerated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-amber-800">
            Receita líquida da operação (média de ~11.5% sobre vendas)
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, parceiro ou produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
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

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="all">⚡ Todos os Tipos</option>
            <option value="unica">Venda Única</option>
            <option value="recorrente">Recorrente (MRR)</option>
          </select>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-3">Cliente Contratante</th>
                <th className="py-3 px-3">Empresa Parceira</th>
                <th className="py-3 px-3">Produto / Serviço</th>
                <th className="py-3 px-3 text-center">Tipo de Venda</th>
                <th className="py-3 px-3 text-right">Valor da Venda</th>
                <th className="py-3 px-3 text-right">Comissão Prado</th>
                <th className="py-3 px-4 text-center">Status Comissão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    Nenhuma venda encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => {
                  const comm = commissions.find((c) => c.saleId === sale.id);
                  const partner = partners.find((p) => p.id === sale.partnerId);

                  const commStatusBadge = {
                    recebida: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    aguardando_pagamento: 'bg-amber-100 text-amber-800 border-amber-200',
                    faturada: 'bg-blue-100 text-blue-800 border-blue-200',
                    a_faturar: 'bg-slate-100 text-slate-800 border-slate-200',
                    prevista: 'bg-purple-100 text-purple-800 border-purple-200',
                    em_atraso: 'bg-rose-100 text-rose-800 border-rose-200 font-bold',
                    cancelada: 'bg-gray-100 text-gray-700 border-gray-200'
                  }[comm?.status || 'prevista'];

                  return (
                    <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {sale.saleDate}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900">{sale.clientName}</div>
                        <div className="text-[11px] text-slate-400">ID Venda: {sale.id}</div>
                      </td>

                      <td className="py-3.5 px-3 font-semibold text-slate-800">
                        {sale.partnerName}
                      </td>

                      <td className="py-3.5 px-3 text-slate-600">
                        {sale.productName}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            sale.saleType === 'recorrente'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {sale.saleType === 'recorrente'
                            ? `Recorrente (${sale.recurrenceMonths || 12}m)`
                            : 'Única'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                        R$ {(sale.saleValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="font-black text-amber-800 text-sm">
                          R$ {(comm?.commissionValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Taxa: {comm?.commissionRate || partner?.commissionRate || 10}%
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${commStatusBadge}`}
                        >
                          {comm?.status.replace('_', ' ') || 'Prevista'}
                        </span>
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
