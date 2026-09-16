import React, { useState } from 'react';
import { Package, Plus, Building, DollarSign, Search, Sparkles } from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export const ProductsView: React.FC = () => {
  const { products, partners, addProduct } = useCrm();
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [newProd, setNewProd] = useState({
    partnerId: partners[0]?.id || '',
    name: '',
    category: 'Locação',
    description: '',
    suggestedPrice: 3500,
    commissionModel: 'percentual' as const,
    commissionValue: 10
  });

  const filtered = products.filter((p) => {
    const q = (search || '').toLowerCase();
    const partner = partners.find((pt) => pt.id === p.partnerId);
    const partnerName = (p.partnerName || partner?.company || '').toLowerCase();
    const prodName = (p.name || '').toLowerCase();
    const prodCat = (p.category || '').toLowerCase();
    return prodName.includes(q) || partnerName.includes(q) || prodCat.includes(q);
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name.trim() || !newProd.partnerId) return;

    const partner = partners.find((p) => p.id === newProd.partnerId);
    const price = Number(newProd.suggestedPrice) || 0;

    addProduct({
      partnerId: newProd.partnerId,
      partnerName: partner?.company || 'Parceiro',
      name: newProd.name,
      category: newProd.category,
      description: newProd.description,
      avgTicket: price,
      suggestedPrice: price,
      commissionModel: newProd.commissionModel,
      commissionValue: Number(newProd.commissionValue) || partner?.commissionRate || 10
    });

    setIsAdding(false);
    setNewProd({
      partnerId: partners[0]?.id || '',
      name: '',
      category: 'Locação',
      description: '',
      suggestedPrice: 3500,
      commissionModel: 'percentual',
      commissionValue: 10
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 font-serif">
              Catálogo de Produtos & Serviços dos Parceiros
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
              {products.length} itens
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Itens comercializados pela Prado Social com especificações de preço e comissões alinhadas por parceiro.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          + Cadastrar Solução
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="p-5 bg-white border border-amber-300 rounded-2xl shadow-md space-y-4 animate-fade-in">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Novo Produto / Serviço de Parceiro
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Empresa Parceira *</label>
              <select
                value={newProd.partnerId}
                onChange={(e) => setNewProd({ ...newProd, partnerId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium"
              >
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>{p.company}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1">Nome da Solução / Produto *</label>
              <input
                type="text"
                required
                placeholder="Ex: Outsourcing de Impressoras A3 Coloridas"
                value={newProd.name}
                onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Categoria</label>
              <input
                type="text"
                value={newProd.category}
                onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Ticket Médio Sugerido (R$)</label>
              <input
                type="number"
                value={newProd.suggestedPrice}
                onChange={(e) => setNewProd({ ...newProd, suggestedPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Comissão Prado Social (%)</label>
              <input
                type="number"
                value={newProd.commissionValue}
                onChange={(e) => setNewProd({ ...newProd, commissionValue: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-amber-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Descrição / Diferenciais</label>
            <input
              type="text"
              placeholder="Ex: Inclui suprimentos, peças de reposição e SLA de 4 horas"
              value={newProd.description}
              onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-lg"
            >
              Salvar Solução
            </button>
          </div>
        </form>
      )}

      {/* Grid of products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((prod) => {
          const partner = partners.find((pt) => pt.id === prod.partnerId);
          const partnerName = prod.partnerName || partner?.company || 'Empresa Parceira';
          const price = prod.avgTicket ?? prod.suggestedPrice ?? 0;

          return (
            <div key={prod.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md transition-all space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {prod.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{prod.name}</h3>
                </div>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Package className="w-4 h-4" />
                </div>
              </div>

              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{partnerName}</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {prod.description}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Ticket Médio:</span>
                  <span className="font-extrabold text-slate-900">
                    R$ {(price || 0).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Comissão:</span>
                  <span className="font-black text-amber-800 text-sm">
                    {prod.commissionValue || 0}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
