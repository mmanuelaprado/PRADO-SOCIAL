import React, { useState } from 'react';
import { History, Search, ShieldCheck, User, Clock, FileText } from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export const HistoryAuditView: React.FC = () => {
  const { auditLogs } = useCrm();
  const [search, setSearch] = useState('');

  const filtered = auditLogs.filter((log) => {
    const q = search.toLowerCase();
    return (
      log.userName.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.entityType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 font-serif">
              Trilha de Auditoria & Histórico de Operações
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-slate-200 text-slate-800 rounded-full">
              {auditLogs.length} eventos registrados
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Registro imutável de todas as ações de usuários, alterações de status, criação de vendas e conciliação de comissões.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por usuário, ação, entidade ou detalhes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* Logs timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900">{log.userName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                    {log.entityType}
                  </span>
                  <span className="text-[11px] text-amber-800 font-semibold">{log.action}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{log.details}</p>
              </div>

              <div className="text-right text-slate-400 font-mono text-[11px] shrink-0">
                {log.timestamp ? new Date(log.timestamp).toLocaleString('pt-BR') : 'Data não registrada'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
