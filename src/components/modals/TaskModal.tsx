import React, { useState } from 'react';
import { X, Calendar, Clock, User, AlertCircle, Building } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { TaskPriority } from '../../types';

interface TaskModalProps {
  onClose: () => void;
  initialLeadId?: string;
  initialPartnerId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  onClose,
  initialLeadId,
  initialPartnerId
}) => {
  const { leads, partners, users, currentUser, addTask } = useCrm();

  const selectedLead = leads.find((l) => l.id === initialLeadId);
  const selectedPartner = partners.find((p) => p.id === (initialPartnerId || selectedLead?.partnerId));

  const [title, setTitle] = useState(
    selectedLead ? `Follow-up com ${selectedLead.company} (${selectedLead.name})` : ''
  );
  const [responsibleId, setResponsibleId] = useState(currentUser.id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [leadId, setLeadId] = useState(initialLeadId || '');
  const [partnerId, setPartnerId] = useState(selectedPartner?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('alta');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Preencha o título da tarefa.');
      return;
    }

    const curLead = leads.find((l) => l.id === leadId);
    const curPartner = partners.find((p) => p.id === partnerId);

    addTask({
      title,
      responsibleId,
      date,
      time,
      leadId: leadId || undefined,
      leadName: curLead ? `${curLead.name} (${curLead.company})` : undefined,
      partnerId: partnerId || undefined,
      partnerName: curPartner?.company,
      priority,
      status: 'pendente'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">Agendar Follow-up / Tarefa Comercial</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Título da Tarefa / Ação Comercial *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Ligar para alinhar feedback da proposta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Data *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Horário
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Responsável
              </label>
              <select
                value={responsibleId}
                onChange={(e) => setResponsibleId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="alta">🔴 Alta Prioridade</option>
                <option value="media">🟡 Média Prioridade</option>
                <option value="baixa">🟢 Baixa Prioridade</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Lead Relacionado (Opcional)
            </label>
            <select
              value={leadId}
              onChange={(e) => {
                setLeadId(e.target.value);
                const l = leads.find((x) => x.id === e.target.value);
                if (l && l.partnerId) setPartnerId(l.partnerId);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="">Nenhum lead específico</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.company} ({l.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Parceiro Relacionado (Opcional)
            </label>
            <select
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="">Nenhum parceiro específico</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.company}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-lg shadow-xs"
            >
              Agendar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
