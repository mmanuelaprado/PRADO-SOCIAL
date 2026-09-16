import React, { useState } from 'react';
import { Briefcase, Search, Phone, Mail, MapPin, Building, DollarSign } from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export const ClientsView: React.FC = () => {
  const { clients } = useCrm();
  const [search, setSearch] = useState('');

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.company.toLowerCase().includes(q) ||
      c.contactName.toLowerCase().includes(q) ||
      c.partnerName.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  const totalContracted = clients.reduce((sum, c) => sum + c.totalSalesValue, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 font-serif">
              Base de Clientes Conquistados
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full">
              {clients.length} clientes ativos
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Contas convertidas pela Prado Social gerando faturamento para os parceiros e receita de comissão.
          </p>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-right">
          <span className="text-emerald-800 font-semibold block">Volume Total Conquistado:</span>
          <span className="text-base font-extrabold text-emerald-900">
            R$ {(totalContracted || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, parceiro atendente, cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Cliente / Contato</th>
                <th className="py-3 px-3">Parceiro Atendente</th>
                <th className="py-3 px-3">Localização</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Volume Contratado</th>
                <th className="py-3 px-4">Primeira Venda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cli) => (
                <tr key={cli.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{cli.company}</div>
                    <div className="text-[11px] text-slate-500">
                      {cli.contactName} • {cli.whatsapp}
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    {cli.partnerName}
                  </td>

                  <td className="py-3.5 px-3 text-slate-600">
                    {cli.city}/{cli.state}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                      {cli.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                    R$ {(cli.totalSalesValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    {cli.firstSaleDate}
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
