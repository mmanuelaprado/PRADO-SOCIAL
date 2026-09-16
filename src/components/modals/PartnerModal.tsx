import React, { useState } from 'react';
import { X, Building2, User, Phone, Mail, Globe, MapPin, Percent, DollarSign, Calendar } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { PartnerStatus } from '../../types';

interface PartnerModalProps {
  onClose: () => void;
}

export const PartnerModal: React.FC<PartnerModalProps> = ({ onClose }) => {
  const { addPartner } = useCrm();

  const [formData, setFormData] = useState({
    company: '',
    cnpj: '',
    segment: '',
    contactName: '',
    role: 'Diretor Comercial',
    whatsapp: '',
    phone: '',
    email: '',
    website: '',
    city: 'São Paulo',
    state: 'SP',
    regionServed: 'São Paulo e Região Metropolitana',
    standardProductService: '',
    targetAudience: '',
    commissionRate: 10,
    commissionType: 'percentual' as 'percentual' | 'fixo' | 'misto',
    isRecurrentCommission: false,
    recurrencePeriodMonths: 12,
    paymentTermDays: 15,
    leadIdentificationMethod: 'WhatsApp comercial dedicado e cópia por e-mail',
    saleCommunicationProcess: 'Aviso imediato via WhatsApp e espelho de NF/Contrato até dia 25',
    startDate: new Date().toISOString().split('T')[0],
    status: 'ativo' as PartnerStatus,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.contactName.trim() || !formData.whatsapp.trim()) {
      alert('Preencha os campos obrigatórios: Empresa, Responsável e WhatsApp.');
      return;
    }

    addPartner({
      company: formData.company,
      cnpj: formData.cnpj,
      segment: formData.segment || 'Serviços Corporativos',
      contactName: formData.contactName,
      role: formData.role,
      whatsapp: formData.whatsapp,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      city: formData.city,
      state: formData.state,
      regionServed: formData.regionServed,
      standardProductService: formData.standardProductService,
      targetAudience: formData.targetAudience,
      commissionRate: Number(formData.commissionRate) || 10,
      commissionType: formData.commissionType,
      isRecurrentCommission: formData.isRecurrentCommission,
      recurrencePeriodMonths: formData.isRecurrentCommission ? Number(formData.recurrencePeriodMonths) : undefined,
      paymentTermDays: Number(formData.paymentTermDays) || 15,
      leadIdentificationMethod: formData.leadIdentificationMethod,
      saleCommunicationProcess: formData.saleCommunicationProcess,
      startDate: formData.startDate,
      status: formData.status,
      notes: formData.notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-6 animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Cadastrar Empresa Parceira</h2>
              <p className="text-xs text-slate-300">Estruture as regras comerciais e condições de comissão</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Company identity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Nome da Empresa Parceira *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: PrintPrime Outsourcing de Impressão"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                CNPJ
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
                Segmento de Atuação *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Tecnologia, Locação de Impressoras, Energia Solar..."
                value={formData.segment}
                onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Status da Parceria
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as PartnerStatus })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-medium"
              >
                <option value="ativo">🟢 Ativo (Operando normalmente)</option>
                <option value="em_negociacao">🟡 Em Negociação</option>
                <option value="aguardando_aprovacao">🟠 Aguardando Aprovação</option>
                <option value="contato_realizado">🔵 Contato Realizado</option>
                <option value="prospectando">⚪ Prospectando</option>
                <option value="pausado">⏸️ Pausado</option>
                <option value="encerrado">🔴 Encerrado</option>
              </select>
            </div>
          </div>

          {/* Responsible person */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-600" />
              Responsável / Ponto de Contato no Parceiro
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  Nome do Responsável *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Barreto"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  Cargo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Diretor Comercial"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  placeholder="(11) 99999-7777"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  Telefone Fixo
                </label>
                <input
                  type="text"
                  placeholder="(11) 3333-2222"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="contato@parceiro.com.br"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>
            </div>
          </div>

          {/* Regional coverage & website */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Cidade / UF
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
                Região Atendida
              </label>
              <input
                type="text"
                placeholder="Ex: Grande SP, Todo o Brasil..."
                value={formData.regionServed}
                onChange={(e) => setFormData({ ...formData, regionServed: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Website
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Commercial & Commission Agreement */}
          <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-amber-600" />
              Regras Financeiras de Comissão da Prado Social
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  Comissão (%) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={formData.commissionRate}
                  onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  Tipo de Comissão
                </label>
                <select
                  value={formData.commissionType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commissionType: e.target.value as 'percentual' | 'fixo' | 'misto'
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="percentual">Percentual sobre a venda (%)</option>
                  <option value="fixo">Valor Fixo por contrato</option>
                  <option value="misto">Misto (Fixo + %)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  Prazo de Pagto (Dias)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.paymentTermDays}
                  onChange={(e) => setFormData({ ...formData, paymentTermDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  placeholder="Ex: 15 dias"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  Data Início
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isRecurrentCommission}
                  onChange={(e) =>
                    setFormData({ ...formData, isRecurrentCommission: e.target.checked })
                  }
                  className="w-4 h-4 text-amber-600 rounded-sm border-slate-300 focus:ring-amber-500"
                />
                Possui Comissão Recorrente Mensal (MRR)?
              </label>

              {formData.isRecurrentCommission && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span>Duração:</span>
                  <input
                    type="number"
                    min="1"
                    max="48"
                    value={formData.recurrencePeriodMonths}
                    onChange={(e) =>
                      setFormData({ ...formData, recurrencePeriodMonths: Number(e.target.value) })
                    }
                    className="w-16 px-2 py-1 border border-slate-300 rounded-md text-xs bg-white text-center font-bold"
                  />
                  <span>meses</span>
                </div>
              )}
            </div>
          </div>

          {/* Operational fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Forma de Identificação do Lead
              </label>
              <input
                type="text"
                placeholder="Ex: WhatsApp do gestor, e-mail com cópia, link rastreado..."
                value={formData.leadIdentificationMethod}
                onChange={(e) => setFormData({ ...formData, leadIdentificationMethod: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Processo de Comunicação da Venda
              </label>
              <input
                type="text"
                placeholder="Ex: Espelho de contrato por e-mail até o dia 25..."
                value={formData.saleCommunicationProcess}
                onChange={(e) => setFormData({ ...formData, saleCommunicationProcess: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Produto/Serviço Principal
              </label>
              <input
                type="text"
                placeholder="Ex: Locação de Multifuncionais A3"
                value={formData.standardProductService}
                onChange={(e) => setFormData({ ...formData, standardProductService: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Público-Alvo Ideal
              </label>
              <input
                type="text"
                placeholder="Ex: Clínicas, escolas e escritórios com alto volume"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Observações Comerciais & Alinhamentos
            </label>
            <textarea
              rows={2}
              placeholder="Critérios de pagamento, notas sobre relacionamento, restrições..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          {/* Footer */}
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
              className="px-5 py-2 text-sm font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-lg shadow-sm transition-all"
            >
              Salvar Parceiro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
