import React from 'react';
import { Sparkles, CheckCircle2, Zap, ArrowRight, ShieldCheck, ToggleLeft, ToggleRight, Clock } from 'lucide-react';
import { useCrm } from '../context/CrmContext';

export const AutomationsView: React.FC = () => {
  const { automations, automationRules, toggleAutomation, toggleAutomationRule } = useCrm();
  const rules = (automationRules || automations || []);
  const handleToggle = toggleAutomationRule || toggleAutomation;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 font-serif">
              Motor de Automações Comerciais
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">
              {rules.filter((r) => r.isActive).length} regras ativas
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Gatilhos de follow-up, cálculo de comissões, alertas de SLA e criação automática de clientes.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-5 rounded-2xl border transition-all ${
              rule.isActive ? 'bg-white border-amber-300 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl ${rule.isActive ? 'bg-amber-50 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                  <Zap className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{rule.name}</h3>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                      {rule.triggerEvent}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleToggle && handleToggle(rule.id)}
                className={`p-1 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold ${
                  rule.isActive ? 'text-amber-700 hover:text-amber-900' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {rule.isActive ? (
                  <>
                    <ToggleRight className="w-8 h-8 text-amber-500" />
                    <span className="hidden sm:inline">Ativa</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-8 h-8 text-slate-300" />
                    <span className="hidden sm:inline">Pausada</span>
                  </>
                )}
              </button>
            </div>

            {/* Action flow preview */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-slate-400">Ação Disparada:</span>
                <span className="text-slate-800 font-semibold">{rule.action}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>Último disparo: {rule.lastTriggeredAt ? new Date(rule.lastTriggeredAt).toLocaleString('pt-BR') : 'Nunca'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
