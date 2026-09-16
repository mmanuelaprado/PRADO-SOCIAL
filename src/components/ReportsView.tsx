import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Building, PieChart, Sparkles, ArrowUpRight } from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export const ReportsView: React.FC = () => {
  const { partners, leads, sales, commissions, users } = useCrm();

  const leadsList = leads || [];
  const salesList = sales || [];
  const commsList = commissions || [];
  const usersList = users || [];

  // Calculations
  const totalSalesVal = salesList.reduce((sum, s) => sum + (s.saleValue || 0), 0);
  const totalCommsVal = commsList.reduce((sum, c) => sum + (c.commissionValue || 0), 0);
  const totalReceived = commsList.filter((c) => c && c.status === 'recebida').reduce((sum, c) => sum + (c.commissionValue || 0), 0);
  const totalPending = commsList.filter((c) => c && c.status !== 'recebida' && c.status !== 'cancelada').reduce((sum, c) => sum + (c.commissionValue || 0), 0);

  interface SourceStat {
    total: number;
    converted: number;
    value: number;
  }

  // Conversion by source
  const sourceStats = leadsList.reduce<Record<string, SourceStat>>((acc, lead) => {
    if (!lead) return acc;
    const src = lead.source || 'Outros';
    if (!acc[src]) acc[src] = { total: 0, converted: 0, value: 0 };
    acc[src].total += 1;
    if (lead.funnelStage === 'venda' || lead.funnelStage === 'comissao' || lead.status === 'venda_realizada') {
      acc[src].converted += 1;
      acc[src].value += (lead.potentialValue || 0);
    }
    return acc;
  }, {});

  // Performance by SDR / Responsible
  const userStats = usersList.map((u) => {
    const userLeads = leadsList.filter((l) => l && l.internalResponsibleId === u.id);
    const converted = userLeads.filter((l) => l && (l.funnelStage === 'venda' || l.funnelStage === 'comissao'));
    return {
      user: u,
      leadsCount: userLeads.length,
      convertedCount: converted.length,
      rate: userLeads.length > 0 ? (converted.length / userLeads.length) * 100 : 0
    };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 font-serif">
              Relatórios Executivos & Business Intelligence
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded-full">
              BI Prado Social
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Métricas de conversão de canais, receita por parceiro e indicadores consolidados de intermediação comercial.
          </p>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Faturamento Intermediado
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            R$ {(totalSalesVal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Média de R$ {((totalSalesVal / (salesList.length || 1)) || 0).toLocaleString('pt-BR')} por contrato
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Receita Efetiva Prado
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            R$ {(totalReceived || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Previsão pendente: R$ {(totalPending || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Conversão Global do Pipeline
          </span>
          <div className="text-2xl font-black text-purple-700 mt-1">
            {((salesList.length / (leadsList.length || 1)) * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {salesList.length} vendas de {leadsList.length} oportunidades mapeadas
          </div>
        </div>
      </div>

      {/* Two-Column Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Conversion by Origin / Source */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-600" />
            Performance por Origem de Lead
          </h3>

          <div className="space-y-3">
            {(Object.entries(sourceStats) as [string, SourceStat][]).map(([source, data]) => {
              const rate = data.total > 0 ? (data.converted / data.total) * 100 : 0;
              return (
                <div key={source} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{source}</span>
                    <span>{rate.toFixed(0)}% conversão</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(8, rate))}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{data.total} leads gerados</span>
                    <span>{data.converted} contratos fechados</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Responsible Performance */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            Atendimento Comercial & SDRs
          </h3>

          <div className="space-y-3">
            {userStats.map((st) => (
              <div key={st.user.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img src={st.user.avatar} alt={st.user.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <div className="font-bold text-slate-900">{st.user.name}</div>
                    <div className="text-[11px] text-slate-500">{st.user.roleTitle}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-slate-900">{st.convertedCount} vendas</div>
                  <div className="text-[11px] text-slate-500">{st.leadsCount} leads sob gestão</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
