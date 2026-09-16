import React, { useState, useMemo } from 'react';
import { Search, X, Users, Building, DollarSign, CheckCircle2, ChevronRight } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    partners,
    leads,
    clients,
    sales,
    commissions,
    setSelectedPartnerId,
    setSelectedLeadId,
    setActiveTab
  } = useCrm();

  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return { partners: [], leads: [], clients: [], sales: [], commissions: [] };
    const q = query.toLowerCase().trim();

    return {
      partners: (partners || []).filter(
        (p) =>
          p &&
          ((p.company || '').toLowerCase().includes(q) ||
            (p.segment || '').toLowerCase().includes(q) ||
            (p.contactName || '').toLowerCase().includes(q))
      ),
      leads: (leads || []).filter(
        (l) =>
          l &&
          ((l.name || '').toLowerCase().includes(q) ||
            (l.company || '').toLowerCase().includes(q) ||
            (l.segment || '').toLowerCase().includes(q) ||
            (l.city || '').toLowerCase().includes(q))
      ),
      clients: (clients || []).filter(
        (c) =>
          c &&
          ((c.name || '').toLowerCase().includes(q) ||
            (c.company || '').toLowerCase().includes(q) ||
            (c.segment || '').toLowerCase().includes(q))
      ),
      sales: (sales || []).filter(
        (s) =>
          s &&
          ((s.clientName || '').toLowerCase().includes(q) ||
            (s.partnerName || '').toLowerCase().includes(q) ||
            (s.productName || '').toLowerCase().includes(q))
      ),
      commissions: (commissions || []).filter(
        (cm) =>
          cm &&
          ((cm.clientName || '').toLowerCase().includes(q) ||
            (cm.partnerName || '').toLowerCase().includes(q) ||
            (cm.status || '').toLowerCase().includes(q))
      )
    };
  }, [query, partners, leads, clients, sales, commissions]);

  if (!isSearchOpen) return null;

  const totalResults =
    results.partners.length +
    results.leads.length +
    results.clients.length +
    results.sales.length +
    results.commissions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            type="text"
            placeholder="Pesquisar parceiros, leads, clientes, vendas, comissões..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-hidden text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 text-xs"
            >
              Limpar
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              Digite qualquer termo para buscar em toda a base da Prado Social...
              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                <span className="px-2 py-1 bg-slate-100 rounded-md">Parceiros</span>
                <span className="px-2 py-1 bg-slate-100 rounded-md">Leads</span>
                <span className="px-2 py-1 bg-slate-100 rounded-md">Vendas</span>
                <span className="px-2 py-1 bg-slate-100 rounded-md">Comissões</span>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              Nenhum resultado encontrado para &ldquo;<span className="font-semibold">{query}</span>&rdquo;.
            </div>
          ) : (
            <>
              {/* Leads */}
              {results.leads.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    Leads ({results.leads.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.leads.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => {
                          setSelectedLeadId(lead.id);
                          setActiveTab('leads');
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{lead.company}</div>
                          <div className="text-xs text-slate-500">
                            {lead.name} • {lead.segment} • {lead.city}/{lead.state}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-700">
                            R$ {(lead.potentialValue || 0).toLocaleString('pt-BR')}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Partners */}
              {results.partners.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-amber-600" />
                    Parceiros ({results.partners.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.partners.map((partner) => (
                      <button
                        key={partner.id}
                        onClick={() => {
                          setSelectedPartnerId(partner.id);
                          setActiveTab('partners');
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-amber-50/50 border border-transparent hover:border-amber-200 flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{partner.company}</div>
                          <div className="text-xs text-slate-500">
                            Resp: {partner.contactName} • Comissão: {partner.commissionRate}%
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sales & Commissions */}
              {results.commissions.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    Comissões ({results.commissions.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.commissions.map((comm) => (
                      <button
                        key={comm.id}
                        onClick={() => {
                          setActiveTab('commissions');
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-emerald-50/50 border border-transparent hover:border-emerald-200 flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-800">
                            R$ {(comm.commissionValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} • {comm.clientName}
                          </div>
                          <div className="text-xs text-slate-500">
                            Parceiro: {comm.partnerName} • Status: {comm.status}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Pressione Esc para fechar</span>
          <span>Prado Social CRM Inteligente</span>
        </div>
      </div>
    </div>
  );
};
