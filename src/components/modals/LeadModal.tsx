import React, { useState } from 'react';
import { X, Building, User, Phone, Mail, MapPin, DollarSign, Calendar, Tag } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { LeadStatus, LeadTemperature, FunnelStage } from '../../types';

interface LeadModalProps {
  onClose: () => void;
  initialPartnerId?: string;
}

export const LeadModal: React.FC<LeadModalProps> = ({ onClose, initialPartnerId }) => {
  const { partners, products, users, currentUser, addLead } = useCrm();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    cnpj: '',
    segment: '',
    role: '',
    whatsapp: '',
    phone: '',
    email: '',
    city: 'São Paulo',
    state: 'SP',
    source: 'Prospecção Ativa',
    partnerId: initialPartnerId || (partners[0]?.id || ''),
    productId: '',
    internalResponsibleId: currentUser.id,
    status: 'novo' as LeadStatus,
    funnelStage: 'novo' as FunnelStage,
    temperature: 'morno' as LeadTemperature,
    potentialValue: 10000,
    entryDate: new Date().toISOString().split('T')[0],
    lastContactDate: new Date().toISOString().split('T')[0],
    nextFollowUpDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const availableProducts = products.filter((p) => p.partnerId === formData.partnerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim() || !formData.partnerId) {
      alert('Por favor, preencha o Nome do contato, Empresa e selecione o Parceiro.');
      return;
    }

    addLead({
      name: formData.name,
      company: formData.company,
      cnpj: formData.cnpj,
      segment: formData.segment || 'Serviços Gerais',
      role: formData.role,
      whatsapp: formData.whatsapp,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      state: formData.state,
      source: formData.source,
      partnerId: formData.partnerId,
      productId: formData.productId || undefined,
      internalResponsibleId: formData.internalResponsibleId,
      status: formData.status,
      funnelStage: formData.funnelStage,
      temperature: formData.temperature,
      potentialValue: Number(formData.potentialValue) || 0,
      entryDate: formData.entryDate,
      lastContactDate: formData.lastContactDate,
      nextFollowUpDate: formData.nextFollowUpDate,
      notes: formData.notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 bg-navy-950 bg-[#0B192C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Novo Lead / Oportunidade</h2>
              <p className="text-xs text-slate-300">Cadastre a empresa e associe ao parceiro correspondente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Nome da Empresa *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Clínica Alpha Imagem"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Contato Principal / Nome *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Dr. Roberto Martins"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Cargo / Função
              </label>
              <input
                type="text"
                placeholder="Ex: Diretor Clínico"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Segmento de Atuação
              </label>
              <input
                type="text"
                placeholder="Ex: Saúde, Varejo, Jurídico..."
                value={formData.segment}
                onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                CNPJ (Opcional)
              </label>
              <input
                type="text"
                placeholder="00.000.000/0001-00"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                WhatsApp / Celular *
              </label>
              <input
                type="text"
                required
                placeholder="(11) 99999-8888"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                E-mail Corporativo
              </label>
              <input
                type="email"
                placeholder="contato@empresa.com.br"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Cidade / Estado
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Cidade"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-3/4 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="UF"
                  maxLength={2}
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                  className="w-1/4 px-3 py-2 border border-slate-300 rounded-lg text-sm text-center uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Origem do Lead
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="Prospecção Ativa">Prospecção Ativa</option>
                <option value="Indicação">Indicação</option>
                <option value="Google Ads">Google Ads</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Instagram / Redes Sociais">Instagram / Redes Sociais</option>
                <option value="Evento / Feira">Evento / Feira</option>
                <option value="Base Própria">Base Própria</option>
              </select>
            </div>
          </div>

          {/* Partner & Product Linking */}
          <div className="p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-amber-600" />
              Parceiro Destinatário & Solução de Interesse
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  Empresa Parceira *
                </label>
                <select
                  required
                  value={formData.partnerId}
                  onChange={(e) =>
                    setFormData({ ...formData, partnerId: e.target.value, productId: '' })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.company} ({p.commissionRate}% comissão)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  Produto / Serviço de Interesse
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="">Selecione a solução (opcional)...</option>
                  {availableProducts.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} (Ticket Médio: R$ {(prod.avgTicket ?? prod.suggestedPrice ?? 0).toLocaleString('pt-BR')})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Financial & Pipeline Data */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Valor Potencial (R$)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={formData.potentialValue}
                onChange={(e) => setFormData({ ...formData, potentialValue: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Temperatura
              </label>
              <select
                value={formData.temperature}
                onChange={(e) =>
                  setFormData({ ...formData, temperature: e.target.value as LeadTemperature })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="quente">🔥 Quente (Alta intenção)</option>
                <option value="morno">⚡ Morno (Em avaliação)</option>
                <option value="frio">❄️ Frio (Contato inicial)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Responsável Interno
              </label>
              <select
                value={formData.internalResponsibleId}
                onChange={(e) => setFormData({ ...formData, internalResponsibleId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.roleTitle})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Etapa do Funil Comercial
              </label>
              <select
                value={formData.funnelStage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    funnelStage: e.target.value as FunnelStage,
                    status: (e.target.value === 'venda' ? 'venda_realizada' : e.target.value) as LeadStatus
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="novo">NOVO</option>
                <option value="contato">CONTATO</option>
                <option value="qualificado">QUALIFICADO</option>
                <option value="enviado_ao_parceiro">ENVIADO AO PARCEIRO</option>
                <option value="negociacao">NEGOCIAÇÃO</option>
                <option value="proposta">PROPOSTA</option>
                <option value="venda">VENDA REALIZADA</option>
                <option value="comissao">COMISSÃO</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Próximo Follow-up *
              </label>
              <input
                type="date"
                required
                value={formData.nextFollowUpDate}
                onChange={(e) => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Observações e Contexto Comercial
            </label>
            <textarea
              rows={3}
              placeholder="Detalhes sobre a dor do cliente, número de equipamentos necessários, urgência, etc..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-navy-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 rounded-lg shadow-sm transition-all"
            >
              Cadastrar Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
