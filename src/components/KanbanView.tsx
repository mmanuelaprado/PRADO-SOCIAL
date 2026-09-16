import React, { useState } from 'react';
import {
  Users,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Calendar,
  Building,
  CheckCircle2,
  Flame,
  ArrowRight,
  Sparkles,
  Plus
} from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { FunnelStage, Lead } from '../types';

export const KanbanView: React.FC = () => {
  const {
    leads,
    partners,
    moveLeadFunnel,
    setSelectedLeadId,
    setActiveTab,
    setOpenNewItemModal
  } = useCrm();

  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const columns: { id: FunnelStage; label: string; color: string; headerBg: string }[] = [
    { id: 'novo', label: 'NOVO', color: 'border-slate-300', headerBg: 'bg-slate-100 text-slate-800' },
    { id: 'contato', label: 'CONTATO', color: 'border-blue-300', headerBg: 'bg-blue-50 text-blue-900' },
    { id: 'qualificado', label: 'QUALIFICADO', color: 'border-indigo-300', headerBg: 'bg-indigo-50 text-indigo-900' },
    { id: 'enviado_ao_parceiro', label: 'ENVIADO AO PARCEIRO', color: 'border-amber-300', headerBg: 'bg-amber-100 text-amber-950 font-bold' },
    { id: 'negociacao', label: 'NEGOCIAÇÃO', color: 'border-amber-400', headerBg: 'bg-amber-200 text-amber-950 font-bold' },
    { id: 'proposta', label: 'PROPOSTA', color: 'border-purple-300', headerBg: 'bg-purple-50 text-purple-900' },
    { id: 'venda', label: 'VENDA', color: 'border-emerald-300', headerBg: 'bg-emerald-50 text-emerald-900 font-bold' },
    { id: 'comissao', label: 'COMISSÃO', color: 'border-emerald-400', headerBg: 'bg-emerald-100 text-emerald-950 font-black' }
  ];

  const stageOrder: FunnelStage[] = [
    'novo',
    'contato',
    'qualificado',
    'enviado_ao_parceiro',
    'negociacao',
    'proposta',
    'venda',
    'comissao'
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedLeadId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: FunnelStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (id) {
      moveLeadFunnel(id, targetStage);
    }
    setDraggedLeadId(null);
  };

  const moveForward = (lead: Lead) => {
    const currentIndex = stageOrder.indexOf(lead.funnelStage);
    if (currentIndex < stageOrder.length - 1) {
      moveLeadFunnel(lead.id, stageOrder[currentIndex + 1]);
    }
  };

  const moveBackward = (lead: Lead) => {
    const currentIndex = stageOrder.indexOf(lead.funnelStage);
    if (currentIndex > 0) {
      moveLeadFunnel(lead.id, stageOrder[currentIndex - 1]);
    }
  };

  return (
    <div className="p-6 max-w-full space-y-4 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 font-serif">
              Funil Comercial (Kanban)
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
              8 Etapas Operacionais
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Arraste os cards entre as colunas ou utilize as setas de avanço. Toda movimentação é auditada automaticamente com carimbo de data e hora.
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

      {/* Kanban Board Columns Container */}
      <div className="flex gap-3 overflow-x-auto pb-6 pt-1 min-h-[calc(100vh-14rem)]">
        {columns.map((col, colIdx) => {
          const columnLeads = (leads || []).filter((l) => l && l.funnelStage === col.id);
          const totalValue = columnLeads.reduce((sum, l) => sum + (l.potentialValue || 0), 0);

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="w-72 shrink-0 flex flex-col bg-slate-100/90 rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs"
            >
              {/* Column Header */}
              <div className={`px-3.5 py-3 border-b border-slate-200/80 ${col.headerBg} flex items-center justify-between`}>
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider">
                    {col.label}
                  </div>
                  <div className="text-[11px] opacity-80 font-medium">
                    R$ {(totalValue || 0).toLocaleString('pt-BR')}
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-white/80 rounded-full text-xs font-black text-slate-800 shadow-2xs">
                  {columnLeads.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="p-2.5 flex-1 overflow-y-auto space-y-2.5">
                {columnLeads.length === 0 ? (
                  <div className="h-28 border border-dashed border-slate-300 rounded-xl flex items-center justify-center text-[11px] text-slate-400 text-center p-3">
                    Nenhum lead nesta etapa. Arraste até aqui.
                  </div>
                ) : (
                  columnLeads.map((lead) => {
                    const partner = partners.find((p) => p.id === lead.partnerId);
                    const isToday = lead.nextFollowUpDate === '2026-09-16';
                    const isOverdue = lead.nextFollowUpDate && lead.nextFollowUpDate < '2026-09-16';

                    return (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing space-y-2 group"
                      >
                        {/* Company & Temperature */}
                        <div className="flex items-start justify-between gap-1">
                          <h4
                            onClick={() => {
                              setSelectedLeadId(lead.id);
                              setActiveTab('leads');
                            }}
                            className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition-colors cursor-pointer line-clamp-1"
                          >
                            {lead.company}
                          </h4>

                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm shrink-0 ${
                              lead.temperature === 'quente'
                                ? 'bg-rose-100 text-rose-800'
                                : lead.temperature === 'morno'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {lead.temperature}
                          </span>
                        </div>

                        {/* Contact Name & Segment */}
                        <div className="text-[11px] text-slate-500">
                          {lead.name} {lead.segment ? `• ${lead.segment}` : ''}
                        </div>

                        {/* Partner Link */}
                        <div className="text-[10px] px-2 py-1 bg-amber-50/70 border border-amber-200/80 rounded-md text-amber-900 font-semibold flex items-center gap-1 truncate">
                          <Building className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="truncate">{partner?.company || 'Sem parceiro'}</span>
                        </div>

                        {/* Value & Next Follow-up */}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                          <span className="font-extrabold text-slate-900">
                            R$ {(lead.potentialValue || 0).toLocaleString('pt-BR')}
                          </span>

                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-sm flex items-center gap-1 ${
                              isOverdue
                                ? 'bg-rose-100 text-rose-800 font-bold'
                                : isToday
                                ? 'bg-amber-100 text-amber-800 font-bold'
                                : 'text-slate-500'
                            }`}
                          >
                            <Calendar className="w-3 h-3" />
                            {lead.nextFollowUpDate}
                          </span>
                        </div>

                        {/* Step Advance / Back Buttons */}
                        <div className="flex items-center justify-between pt-1 text-slate-400">
                          <button
                            disabled={colIdx === 0}
                            onClick={() => moveBackward(lead)}
                            className="p-1 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded-md transition-colors"
                            title="Voltar etapa"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedLeadId(lead.id);
                              setActiveTab('leads');
                            }}
                            className="text-[10px] font-bold text-slate-600 hover:text-amber-800"
                          >
                            Ver Detalhes
                          </button>

                          <button
                            disabled={colIdx === columns.length - 1}
                            onClick={() => moveForward(lead)}
                            className="p-1 hover:text-amber-700 disabled:opacity-20 hover:bg-amber-50 rounded-md transition-colors"
                            title="Avançar etapa"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
