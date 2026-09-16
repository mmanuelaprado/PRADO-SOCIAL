import React, { useState } from 'react';
import { CalendarCheck, Plus, CheckCircle2, Clock, AlertTriangle, User, Building } from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export const TasksView: React.FC = () => {
  const { tasks, completeTask, toggleTaskStatus, setOpenNewItemModal, setSelectedLeadId, setActiveTab } = useCrm();
  const [filterType, setFilterType] = useState<'all' | 'today' | 'overdue' | 'completed'>('all');

  const todayStr = '2026-09-16';
  const taskList = tasks || [];
  const handleComplete = completeTask || toggleTaskStatus;

  const filteredTasks = taskList.filter((t) => {
    if (!t) return false;
    if (filterType === 'today') return t.status === 'pendente' && t.date === todayStr;
    if (filterType === 'overdue') return t.status === 'pendente' && t.date < todayStr;
    if (filterType === 'completed') return t.status === 'concluida';
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 font-serif">
              Atividades & Follow-ups Comerciais
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
              {taskList.filter((t) => t && t.status === 'pendente').length} pendentes
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Compromissos, ligações, reuniões e alinhamentos de propostas com leads e parceiros.
          </p>
        </div>

        <button
          onClick={() => setOpenNewItemModal('task')}
          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          + Agendar Follow-up
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 text-xs border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
            filterType === 'all' ? 'bg-[#0B192C] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Todas ({taskList.length})
        </button>
        <button
          onClick={() => setFilterType('today')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
            filterType === 'today' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Para Hoje ({taskList.filter((t) => t && t.status === 'pendente' && t.date === todayStr).length})
        </button>
        <button
          onClick={() => setFilterType('overdue')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
            filterType === 'overdue' ? 'bg-rose-500 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Atrasadas ({taskList.filter((t) => t && t.status === 'pendente' && t.date < todayStr).length})
        </button>
        <button
          onClick={() => setFilterType('completed')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
            filterType === 'completed' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Concluídas ({taskList.filter((t) => t && t.status === 'concluida').length})
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            Nenhuma tarefa encontrada neste filtro.
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isToday = t.date === todayStr;
            const isOverdue = t.status === 'pendente' && t.date < todayStr;
            const isDone = t.status === 'concluida';

            return (
              <div
                key={t.id}
                className={`p-4 rounded-xl border bg-white shadow-xs flex items-center justify-between gap-4 transition-all ${
                  isOverdue
                    ? 'border-rose-300 bg-rose-50/20'
                    : isToday
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleComplete && handleComplete(t.id)}
                    disabled={isDone}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 hover:border-amber-500 text-transparent hover:text-amber-500'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-1">
                    <div className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {t.title}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {t.date} às {t.time}
                        {isToday && <span className="text-[9px] uppercase px-1 bg-amber-200 text-amber-900 rounded-sm">Hoje</span>}
                        {isOverdue && <span className="text-[9px] uppercase px-1 bg-rose-200 text-rose-900 rounded-sm">Vencida</span>}
                      </span>

                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {t.responsibleName}
                      </span>

                      {t.leadName && (
                        <button
                          onClick={() => {
                            if (t.leadId) {
                              setSelectedLeadId(t.leadId);
                              setActiveTab('leads');
                            }
                          }}
                          className="text-amber-700 hover:underline font-semibold"
                        >
                          Lead: {t.leadName}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      t.priority === 'alta'
                        ? 'bg-rose-100 text-rose-800'
                        : t.priority === 'media'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {t.priority}
                  </span>

                  {!isDone && (
                    <button
                      onClick={() => completeTask(t.id)}
                      className="px-3 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Concluir
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
