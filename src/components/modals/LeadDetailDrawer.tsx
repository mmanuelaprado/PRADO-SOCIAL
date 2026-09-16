import React, { useState } from 'react';
import {
  X,
  Phone,
  MessageSquare,
  Mail,
  Building,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FileText,
  CheckCircle2,
  ExternalLink,
  Edit3,
  Trash2,
  Save,
  RotateCcw
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { FunnelStage, Activity, LeadTemperature, LeadStatus } from '../../types';

interface LeadDetailDrawerProps {
  leadId: string;
  onClose: () => void;
  onConvertToSale: (leadId: string) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  leadId,
  onClose,
  onConvertToSale
}) => {
  const {
    leads,
    partners,
    products,
    users,
    activities,
    moveLeadFunnel,
    updateLead,
    deleteLead,
    addActivity,
    currentUser
  } = useCrm();

  const lead = leads.find((l) => l.id === leadId);
  const [newActivityType, setNewActivityType] = useState<Activity['type']>('whatsapp');
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const [isAddingActivity, setIsAddingActivity] = useState(false);

  // Edit / Save state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    company: '',
    whatsapp: '',
    email: '',
    city: '',
    state: '',
    potentialValue: 0,
    partnerId: '',
    temperature: 'morno' as LeadTemperature,
    status: 'novo' as LeadStatus,
    nextFollowUpDate: '',
    notes: ''
  });

  React.useEffect(() => {
    if (lead) {
      setEditForm({
        name: lead.name || '',
        company: lead.company || '',
        whatsapp: lead.whatsapp || '',
        email: lead.email || '',
        city: lead.city || '',
        state: lead.state || '',
        potentialValue: lead.potentialValue || 0,
        partnerId: lead.partnerId || '',
        temperature: lead.temperature || 'morno',
        status: lead.status || 'novo',
        nextFollowUpDate: lead.nextFollowUpDate || '',
        notes: lead.notes || ''
      });
    }
  }, [lead]);

  if (!lead) return null;

  const partner = partners.find((p) => p.id === lead.partnerId);
  const product = products.find((pr) => pr.id === lead.productId);
  const responsible = users.find((u) => u.id === lead.internalResponsibleId);

  const leadActivities = (activities || []).filter((a) => a && a.leadId === lead.id);

  const handleSaveLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.company.trim() || !editForm.name.trim()) {
      alert('Preencha os campos obrigatórios de Empresa e Contato.');
      return;
    }

    updateLead(lead.id, {
      name: editForm.name,
      company: editForm.company,
      whatsapp: editForm.whatsapp,
      email: editForm.email,
      city: editForm.city,
      state: editForm.state,
      potentialValue: Number(editForm.potentialValue) || 0,
      partnerId: editForm.partnerId,
      temperature: editForm.temperature,
      status: editForm.status,
      nextFollowUpDate: editForm.nextFollowUpDate,
      notes: editForm.notes
    });

    setIsEditing(false);
  };

  const handleDeleteLead = () => {
    if (confirm(`Deseja realmente apagar o lead "${lead.company}" (${lead.name})? Esta ação não pode ser desfeita.`)) {
      deleteLead(lead.id);
      onClose();
    }
  };

  const handleAddActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    addActivity({
      leadId: lead.id,
      partnerId: lead.partnerId,
      type: newActivityType,
      title: newActivityTitle,
      description: newActivityDesc
    });

    setNewActivityTitle('');
    setNewActivityDesc('');
    setIsAddingActivity(false);
  };

  const stageOptions: { key: FunnelStage; label: string }[] = [
    { key: 'novo', label: '1. Novo' },
    { key: 'contato', label: '2. Contato' },
    { key: 'qualificado', label: '3. Qualificado' },
    { key: 'enviado_ao_parceiro', label: '4. Enviado ao Parceiro' },
    { key: 'negociacao', label: '5. Negociação' },
    { key: 'proposta', label: '6. Proposta' },
    { key: 'venda', label: '7. Venda Realizada' },
    { key: 'comissao', label: '8. Comissão' }
  ];

  const tempBadge = {
    quente: 'bg-rose-100 text-rose-800 border-rose-200',
    morno: 'bg-amber-100 text-amber-800 border-amber-200',
    frio: 'bg-blue-100 text-blue-800 border-blue-200'
  }[lead.temperature];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col overflow-hidden animate-slide-left">
        {/* Top Header */}
        <div className="p-5 bg-[#0B192C] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tempBadge}`}>
                {lead.temperature}
              </span>
              <span className="text-xs text-slate-300">ID: {lead.id}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{lead.company}</h2>
            <p className="text-xs text-amber-300 font-medium">{lead.name} {lead.role ? `• ${lead.role}` : ''}</p>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                isEditing
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-500'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={isEditing ? 'Cancelar edição' : 'Editar dados do lead'}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? 'Cancelar' : 'Editar'}
            </button>

            <button
              onClick={handleDeleteLead}
              className="p-1.5 rounded-lg text-rose-300 hover:text-white hover:bg-rose-600/80 transition-colors"
              title="Apagar Lead"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Edit Form Mode */}
          {isEditing ? (
            <form onSubmit={handleSaveLead} className="p-4 bg-amber-50/50 border border-amber-300 rounded-2xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-amber-700" />
                  Editar Dados do Lead
                </span>
                <span className="text-[11px] text-slate-500">Altere os campos e clique em Salvar</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Empresa / Razão Social *</label>
                  <input
                    type="text"
                    required
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Contato Principal *</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={editForm.whatsapp}
                    onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estado (UF)</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs uppercase"
                    maxLength={2}
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Empresa Parceira Vinculada</label>
                  <select
                    value={editForm.partnerId}
                    onChange={(e) => setEditForm({ ...editForm, partnerId: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.company} ({p.commissionRate}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor Potencial Estimado (R$)</label>
                  <input
                    type="number"
                    value={editForm.potentialValue}
                    onChange={(e) => setEditForm({ ...editForm, potentialValue: Number(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Temperatura do Lead</label>
                  <select
                    value={editForm.temperature}
                    onChange={(e) => setEditForm({ ...editForm, temperature: e.target.value as LeadTemperature })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="quente">🔥 Quente (Alta conversão)</option>
                    <option value="morno">⚡ Morno (Em avaliação)</option>
                    <option value="frio">❄️ Frio (Prospecção recente)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Próximo Follow-up</label>
                  <input
                    type="date"
                    value={editForm.nextFollowUpDate}
                    onChange={(e) => setEditForm({ ...editForm, nextFollowUpDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-xs">Observações e Histórico</label>
                <textarea
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  placeholder="Detalhes, necessidades do cliente..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Salvar Alterações
                </button>
              </div>
            </form>
          ) : null}
          {/* Funnel Stage Progress Selector */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Etapa Atual do Funil Comercial
            </div>
            <select
              value={lead.funnelStage}
              onChange={(e) => moveLeadFunnel(lead.id, e.target.value as FunnelStage)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
            >
              {stageOptions.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>

            {lead.funnelStage !== 'venda' && lead.funnelStage !== 'comissao' && (
              <button
                onClick={() => {
                  onClose();
                  onConvertToSale(lead.id);
                }}
                className="w-full mt-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                Fechar Venda & Gerar Comissão Automática
              </button>
            )}
          </div>

          {/* Quick Contact & Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <a
              href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl flex flex-col items-center justify-center text-xs font-bold gap-1 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              WhatsApp
            </a>

            <a
              href={`tel:${lead.whatsapp.replace(/\D/g, '')}`}
              className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl flex flex-col items-center justify-center text-xs font-bold gap-1 transition-colors"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              Ligar
            </a>

            <a
              href={`mailto:${lead.email}`}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-xs font-bold gap-1 transition-colors"
            >
              <Mail className="w-4 h-4 text-slate-600" />
              E-mail
            </a>
          </div>

          {/* Info Cards Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Parceiro Vinculado
              </span>
              <div className="font-bold text-slate-900 text-xs truncate">
                {partner?.company || 'Sem parceiro'}
              </div>
              <div className="text-[11px] text-amber-700 font-semibold">
                Comissão contratual: {partner?.commissionRate || 0}%
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Valor Potencial
              </span>
              <div className="text-base font-extrabold text-slate-900">
                R$ {(lead.potentialValue || 0).toLocaleString('pt-BR')}
              </div>
              <div className="text-[11px] text-slate-500">
                Origem: {lead.source}
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Produto de Interesse
              </span>
              <div className="font-semibold text-slate-800 text-xs">
                {product?.name || partner?.standardProductService || 'Solução personalizada'}
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Próximo Follow-up
              </span>
              <div className="font-bold text-slate-800 text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                {lead.nextFollowUpDate}
              </div>
              <div className="text-[11px] text-slate-500">
                Resp: {responsible?.name || 'Comercial'}
              </div>
            </div>
          </div>

          {/* Context & Notes */}
          {lead.notes && (
            <div className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                Contexto Comercial & Necessidades
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {lead.notes}
              </p>
            </div>
          )}

          {/* Timeline of Activities */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Histórico & Linha do Tempo ({leadActivities.length})
              </h3>
              <button
                onClick={() => setIsAddingActivity(!isAddingActivity)}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Registrar Atividade
              </button>
            </div>

            {/* Form to add activity */}
            {isAddingActivity && (
              <form
                onSubmit={handleAddActivitySubmit}
                className="p-3.5 bg-slate-50 border border-slate-300 rounded-xl space-y-2.5 animate-fade-in"
              >
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newActivityType}
                    onChange={(e) => setNewActivityType(e.target.value as Activity['type'])}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="ligacao">Ligação Telefônica</option>
                    <option value="email">E-mail</option>
                    <option value="reuniao">Reunião / Demo</option>
                    <option value="observacao">Anotação Interna</option>
                    <option value="envio_parceiro">Envio ao Parceiro</option>
                    <option value="retorno_parceiro">Retorno do Parceiro</option>
                  </select>

                  <input
                    type="text"
                    required
                    placeholder="Título resumido..."
                    value={newActivityTitle}
                    onChange={(e) => setNewActivityTitle(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <textarea
                  rows={2}
                  placeholder="Detalhes da conversa, respostas do cliente ou feedback..."
                  value={newActivityDesc}
                  onChange={(e) => setNewActivityDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingActivity(false)}
                    className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-md text-xs font-bold"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            )}

            {/* List of activities */}
            <div className="space-y-2.5 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {leadActivities.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  Nenhuma atividade registrada ainda para este lead.
                </div>
              ) : (
                leadActivities.map((act) => (
                  <div key={act.id} className="relative pl-8 text-xs space-y-1">
                    <div className="absolute left-2 top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-white" />
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span className="font-semibold text-slate-700 capitalize">
                        {act.type.replace('_', ' ')} • {act.userName}
                      </span>
                      <span>{new Date(act.createdAt).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="font-bold text-slate-800">{act.title}</div>
                    <p className="text-slate-600 leading-relaxed">{act.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Cadastrado em {new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold flex items-center gap-1 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar Dados
            </button>
            <button
              onClick={handleDeleteLead}
              className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg font-bold flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Apagar
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
