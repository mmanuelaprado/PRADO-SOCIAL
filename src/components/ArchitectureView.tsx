import React, { useState } from 'react';
import {
  FileCode,
  Database,
  Layers,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Shield,
  Table,
  Workflow,
  Sparkles,
  GitBranch,
  BookOpen
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'conceptual' | 'database' | 'stack' | 'roadmap'>('conceptual');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 font-serif">
              Especificação Arquitetural & Banco de Dados
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded-full">
              SISTEMA PRADO SOCIAL v1.0
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Documento de Engenharia de Software com modelo de dados relacional, fluxo conceitual, comparativo de tecnologias e fases de maturidade.
          </p>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveSection('conceptual')}
          className={`px-3 py-2 rounded-xl transition-all ${
            activeSection === 'conceptual'
              ? 'bg-[#0B192C] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          1. Modelo Conceitual & Negócio
        </button>
        <button
          onClick={() => setActiveSection('database')}
          className={`px-3 py-2 rounded-xl transition-all ${
            activeSection === 'database'
              ? 'bg-[#0B192C] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          2. Dicionário de Dados (14 Entidades)
        </button>
        <button
          onClick={() => setActiveSection('stack')}
          className={`px-3 py-2 rounded-xl transition-all ${
            activeSection === 'stack'
              ? 'bg-[#0B192C] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          3. Comparativo de Tecnologias
        </button>
        <button
          onClick={() => setActiveSection('roadmap')}
          className={`px-3 py-2 rounded-xl transition-all ${
            activeSection === 'roadmap'
              ? 'bg-[#0B192C] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          4. Roadmap (MVP → V2 → V3)
        </button>
      </div>

      {/* SECTION 1: MODELO CONCEITUAL */}
      {activeSection === 'conceptual' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-amber-600" />
              Arquitetura Operacional do Negócio Prado Social
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              A Prado Social atua no centro de um ecossistema B2B de alta conversão comercial. O sistema opera como uma engrenagem de originação, qualificação, encaminhamento e controle financeiro de comissões sobre contratos efetivados.
            </p>

            {/* Architecture diagram cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Box 1: Empresas Parceiras */}
              <div className="p-5 rounded-xl border border-amber-300 bg-amber-50/50 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Nó 1: Empresas Parceiras
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Empresas fornecedoras de produtos e serviços (Ex: locação de impressoras, energia solar, software ERP). Possuem regras contratuais, prazos de pagamento e taxas de comissão combinadas (ex: 10% a 15%).
                </p>
                <div className="text-[11px] font-mono font-semibold text-amber-800 bg-amber-100 p-2 rounded-md">
                  Regras: % comissão, periodicidade, SLA de retorno
                </div>
              </div>

              {/* Box 2: Prado Social (O Núcleo) */}
              <div className="p-5 rounded-xl border border-slate-800 bg-[#0B192C] text-white space-y-2 shadow-md">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Nó 2: Prado Social (CRM & Motor)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Centraliza a prospecção ativa, qualificação de leads, encaminhamento seguro aos parceiros, acompanhamento das reuniões e cobrança automatizada das faturas de comissão.
                </p>
                <div className="text-[11px] font-mono font-semibold text-amber-300 bg-slate-900 p-2 rounded-md border border-slate-800">
                  Pipeline: Lead → Parceria → Venda → Comissão
                </div>
              </div>

              {/* Box 3: Clientes / Leads */}
              <div className="p-5 rounded-xl border border-blue-300 bg-blue-50/50 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  Nó 3: Clientes / Compradores
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Clínicas, escritórios, indústrias e empresas com demandas reais. Recebem atendimento consultivo da Prado Social e proposta customizada do parceiro especializado.
                </p>
                <div className="text-[11px] font-mono font-semibold text-blue-800 bg-blue-100 p-2 rounded-md">
                  Resultado: Contrato assinado e cliente conquistado
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: DICIONÁRIO DE DADOS */}
      {activeSection === 'database' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-600" />
              Modelo Entidade-Relacionamento (14 Entidades Mapeadas)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Estrutura relacional normalizada em 3ª Forma Normal (3NF) pronta para ser persistida em PostgreSQL / Supabase ou Cloud SQL.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Table 1: Parceiros */}
              <div className="p-4 border border-slate-200 rounded-xl space-y-2 bg-slate-50/50">
                <div className="font-mono font-bold text-slate-900 flex items-center justify-between">
                  <span>1. partners (Empresas Parceiras)</span>
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-sm">PK: id</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                  <li><code>id</code> (UUID / VARCHAR, PK)</li>
                  <li><code>company</code> (VARCHAR 255)</li>
                  <li><code>cnpj</code> (VARCHAR 18)</li>
                  <li><code>segment</code> (VARCHAR 100)</li>
                  <li><code>contact_name</code>, <code>role</code>, <code>whatsapp</code>, <code>email</code></li>
                  <li><code>commission_rate</code> (DECIMAL 5,2)</li>
                  <li><code>commission_type</code> (ENUM: percentual, fixo, misto)</li>
                  <li><code>is_recurrent</code> (BOOLEAN), <code>recurrence_months</code> (INT)</li>
                  <li><code>payment_term_days</code> (INT)</li>
                  <li><code>status</code> (ENUM: ativo, em_negociacao, pausado, etc.)</li>
                </ul>
              </div>

              {/* Table 2: Leads */}
              <div className="p-4 border border-slate-200 rounded-xl space-y-2 bg-slate-50/50">
                <div className="font-mono font-bold text-slate-900 flex items-center justify-between">
                  <span>2. leads (Leads Comerciais)</span>
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-sm">PK: id | FK: partner_id</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                  <li><code>id</code> (UUID / VARCHAR, PK)</li>
                  <li><code>name</code>, <code>company</code>, <code>cnpj</code></li>
                  <li><code>whatsapp</code>, <code>email</code>, <code>city</code>, <code>state</code></li>
                  <li><code>source</code> (Indicação, Anúncio, WhatsApp, etc.)</li>
                  <li><code>partner_id</code> (FK → partners.id)</li>
                  <li><code>product_id</code> (FK → products.id)</li>
                  <li><code>funnel_stage</code> (ENUM: 8 etapas)</li>
                  <li><code>temperature</code> (ENUM: frio, morno, quente)</li>
                  <li><code>potential_value</code> (DECIMAL 12,2)</li>
                  <li><code>next_follow_up_date</code> (DATE)</li>
                </ul>
              </div>

              {/* Table 3: Sales */}
              <div className="p-4 border border-slate-200 rounded-xl space-y-2 bg-slate-50/50">
                <div className="font-mono font-bold text-slate-900 flex items-center justify-between">
                  <span>3. sales (Vendas Realizadas)</span>
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-sm">PK: id | FK: partner_id, lead_id</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                  <li><code>id</code> (UUID / VARCHAR, PK)</li>
                  <li><code>lead_id</code> (FK → leads.id)</li>
                  <li><code>partner_id</code> (FK → partners.id)</li>
                  <li><code>client_name</code> (VARCHAR 255)</li>
                  <li><code>sale_date</code> (DATE)</li>
                  <li><code>sale_value</code> (DECIMAL 12,2)</li>
                  <li><code>sale_type</code> (ENUM: unica, recorrente)</li>
                  <li><code>conditions</code>, <code>notes</code> (TEXT)</li>
                </ul>
              </div>

              {/* Table 4: Commissions */}
              <div className="p-4 border border-slate-200 rounded-xl space-y-2 bg-slate-50/50">
                <div className="font-mono font-bold text-slate-900 flex items-center justify-between">
                  <span>4. commissions (Comissões Prado)</span>
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-sm">PK: id | FK: sale_id, partner_id</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                  <li><code>id</code> (UUID / VARCHAR, PK)</li>
                  <li><code>sale_id</code> (FK → sales.id)</li>
                  <li><code>partner_id</code> (FK → partners.id)</li>
                  <li><code>sale_value</code>, <code>commission_rate</code> (DECIMAL)</li>
                  <li><code>commission_value</code> (DECIMAL 12,2)</li>
                  <li><code>expected_payment_date</code> (DATE)</li>
                  <li><code>actual_payment_date</code> (DATE, NULLABLE)</li>
                  <li><code>status</code> (ENUM: prevista, a_faturar, faturada, etc.)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: COMPARATIVO TECNOLÓGICO */}
      {activeSection === 'stack' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-600" />
              Comparativo de Tecnologias para a Prado Social
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Avaliação de viabilidade técnica, custo, escalabilidade e manutenibilidade para orientar a evolução da Prado Social.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-[#0B192C] text-white">
                  <tr>
                    <th className="p-3">Tecnologia</th>
                    <th className="p-3">Vantagens para a Prado Social</th>
                    <th className="p-3">Desvantagens / Riscos</th>
                    <th className="p-3">Veredito do Arquiteto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-amber-50/40">
                    <td className="p-3 font-bold text-slate-900">
                      PostgreSQL + React / TypeScript (Atual)
                    </td>
                    <td className="p-3 text-slate-700">
                      Controle 100% próprio, sem vendor lock-in, banco relacional com integridade referencial forte para comissões e vendas, custo zero de licenças.
                    </td>
                    <td className="p-3 text-slate-600">
                      Requer equipe ou desenvolvedor para manutenções de backend.
                    </td>
                    <td className="p-3 font-bold text-emerald-800">
                      ⭐⭐⭐⭐⭐ Recomendada (Ideal para sistema próprio da Prado Social).
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-bold text-slate-900">
                      Supabase (PostgreSQL Gerenciado)
                    </td>
                    <td className="p-3 text-slate-700">
                      PostgreSQL completo, autenticação embutida, Row Level Security (RLS) e API REST automática.
                    </td>
                    <td className="p-3 text-slate-600">
                      Custo a partir de $25/mês após o free tier.
                    </td>
                    <td className="p-3 font-bold text-blue-800">
                      ⭐⭐⭐⭐ Excelente para acelerar V2 mantendo o mesmo banco.
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-bold text-slate-900">
                      No-Code (Bubble / Airtable)
                    </td>
                    <td className="p-3 text-slate-700">
                      Prototipação rápida sem código.
                    </td>
                    <td className="p-3 text-rose-700">
                      Falta de controle de regras financeiras estritas, custo exponencial por usuário, dados presos na plataforma.
                    </td>
                    <td className="p-3 font-bold text-rose-800">
                      ❌ Não recomendado para core financeiro de comissões.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: ROADMAP */}
      {activeSection === 'roadmap' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-amber-600" />
              Fases de Desenvolvimento do CRM Prado Social
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* MVP */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-300 rounded-xl space-y-2">
                <div className="font-bold text-emerald-950 flex items-center justify-between">
                  <span>Fase 1: MVP (Entregue Hoje)</span>
                  <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-md text-[10px]">100% Operacional</span>
                </div>
                <ul className="space-y-1.5 text-emerald-900 text-[11px]">
                  <li>✓ Cadastro de Parceiros com regras de comissão</li>
                  <li>✓ CRM de Leads com 8 etapas de funil (Kanban)</li>
                  <li>✓ Registro de vendas e cálculo de comissões</li>
                  <li>✓ Follow-ups e alertas de hoje/atrasados</li>
                  <li>✓ Gestão de comissões e cobrança via WhatsApp</li>
                  <li>✓ Dashboard com KPIs e trilha de auditoria</li>
                </ul>
              </div>

              {/* V2 */}
              <div className="p-4 bg-amber-50/60 border border-amber-300 rounded-xl space-y-2">
                <div className="font-bold text-amber-950 flex items-center justify-between">
                  <span>Fase 2: V2 (Próximo Passo)</span>
                  <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md text-[10px]">Evolução</span>
                </div>
                <ul className="space-y-1.5 text-amber-900 text-[11px]">
                  <li>• Portal de Acesso Restrito para Empresas Parceiras</li>
                  <li>• Webhook para captura de leads do Facebook/Meta Ads</li>
                  <li>• Envio automático de e-mail ao parceiro no fechamento</li>
                  <li>• Exportação de relatórios em PDF e Excel</li>
                  <li>• Anexos de contratos e notas fiscais</li>
                </ul>
              </div>

              {/* V3 */}
              <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Fase 3: V3 (Escala & IA)</span>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md text-[10px]">Futuro</span>
                </div>
                <ul className="space-y-1.5 text-slate-700 text-[11px]">
                  <li>• Score preditivo de leads via Inteligência Artificial</li>
                  <li>• Integração bancária automática (Open Finance / Pix)</li>
                  <li>• Aplicativo Mobile dedicado para SDRs</li>
                  <li>• Split de comissão automatizado na emissão de NF</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
