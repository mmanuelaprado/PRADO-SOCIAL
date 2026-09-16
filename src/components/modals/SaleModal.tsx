import React, { useState, useMemo } from 'react';
import { X, CheckCircle2, DollarSign, Building, Calendar, Percent, Sparkles } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

interface SaleModalProps {
  onClose: () => void;
  initialLeadId?: string;
}

export const SaleModal: React.FC<SaleModalProps> = ({ onClose, initialLeadId }) => {
  const { leads, partners, products, addSale } = useCrm();

  const selectedInitialLead = leads.find((l) => l.id === initialLeadId);

  const [leadId, setLeadId] = useState(initialLeadId || '');
  const [partnerId, setPartnerId] = useState(
    selectedInitialLead?.partnerId || partners[0]?.id || ''
  );
  const [clientName, setClientName] = useState(
    selectedInitialLead?.company || ''
  );
  const [productId, setProductId] = useState(
    selectedInitialLead?.productId || ''
  );
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [saleValue, setSaleValue] = useState<number>(
    selectedInitialLead?.potentialValue || 20000
  );
  const [saleType, setSaleType] = useState<'unica' | 'recorrente'>('unica');
  const [recurrenceMonths, setRecurrenceMonths] = useState<number>(12);
  const [conditions, setConditions] = useState('Contrato assinado em conformidade comercial');
  const [notes, setNotes] = useState('');

  // When lead changes, auto-fill partner & company
  const handleLeadChange = (id: string) => {
    setLeadId(id);
    const l = leads.find((x) => x.id === id);
    if (l) {
      setClientName(l.company);
      setPartnerId(l.partnerId);
      if (l.productId) setProductId(l.productId);
      if (l.potentialValue) setSaleValue(l.potentialValue);
    }
  };

  const currentPartner = partners.find((p) => p.id === partnerId);
  const partnerProducts = products.filter((p) => p.partnerId === partnerId);
  const currentProduct = products.find((p) => p.id === productId);

  // Commission calculation
  const commissionRate = currentPartner?.commissionRate || 10;
  const calculatedCommission = useMemo(() => {
    const val = Number(saleValue) || 0;
    return (val * commissionRate) / 100;
  }, [saleValue, commissionRate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !partnerId || saleValue <= 0) {
      alert('Preencha os campos obrigatórios: Cliente, Parceiro e Valor da venda.');
      return;
    }

    addSale({
      leadId: leadId || 'lead_direto',
      clientName,
      partnerId,
      partnerName: currentPartner?.company || 'Parceiro',
      productId: productId || undefined,
      productName: currentProduct?.name || currentPartner?.standardProductService || 'Solução Comercial',
      saleDate,
      saleValue: Number(saleValue),
      saleType,
      recurrenceMonths: saleType === 'recorrente' ? Number(recurrenceMonths) : undefined,
      conditions,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6 animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B192C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Registrar Venda & Gerar Comissão</h2>
              <p className="text-xs text-slate-300">Concretize o contrato e lance a comissão automática da Prado Social</p>
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
          {/* Link to existing lead */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Origem do Lead no CRM (Opcional se for direto)
            </label>
            <select
              value={leadId}
              onChange={(e) => handleLeadChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="">-- Venda direta sem lead prévio ou selecione um lead --</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.company} ({l.name}) - Etapa atual: {l.funnelStage.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Nome do Cliente / Empresa *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Hospital São Lucas"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Empresa Parceira *
              </label>
              <select
                required
                value={partnerId}
                onChange={(e) => {
                  setPartnerId(e.target.value);
                  setProductId('');
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-medium"
              >
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.company} ({p.commissionRate}% comissão)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Produto / Serviço Contratado
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="">Padrão do Parceiro ({currentPartner?.standardProductService})</option>
                {partnerProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Data da Venda / Fechamento *
              </label>
              <input
                type="date"
                required
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Valor Total da Venda (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">R$</span>
                <input
                  type="number"
                  required
                  min="1"
                  step="100"
                  value={saleValue}
                  onChange={(e) => setSaleValue(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-base font-bold text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Tipo de Venda
              </label>
              <select
                value={saleType}
                onChange={(e) => setSaleType(e.target.value as 'unica' | 'recorrente')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="unica">Venda Única / Projeto Pontual</option>
                <option value="recorrente">Contrato com Recorrência Mensal</option>
              </select>
            </div>
          </div>

          {saleType === 'recorrente' && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-900">
                Quantidade de Meses de Recorrência da Comissão:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={recurrenceMonths}
                  onChange={(e) => setRecurrenceMonths(Number(e.target.value))}
                  className="w-20 px-2.5 py-1 border border-blue-300 rounded-lg text-sm font-bold text-center bg-white"
                />
                <span className="text-xs text-blue-800">meses</span>
              </div>
            </div>
          )}

          {/* Automatic Commission Preview Box */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-300/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Cálculo Automático da Comissão Prado Social
              </span>
              <span className="text-xs font-extrabold px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full">
                Taxa: {commissionRate}%
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xs text-slate-600">
                Valor previsto ({((Number(saleValue) || 0)).toLocaleString('pt-BR')} × {commissionRate}%):
              </span>
              <span className="text-xl font-extrabold text-amber-900">
                R$ {(calculatedCommission || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              * O lançamento será gerado automaticamente com status &ldquo;Prevista&rdquo; no módulo financeiro.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Condições Comerciais & Pagamento
            </label>
            <input
              type="text"
              placeholder="Ex: 12 parcelas mensais com vencimento dia 10"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Observações
            </label>
            <textarea
              rows={2}
              placeholder="Notas adicionais sobre a venda..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              Confirmar Venda e Gerar Comissão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
