export type UserRole = 'admin' | 'sdr' | 'comercial' | 'gestor' | 'financeiro';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  phone?: string;
}

export type PartnerStatus = 
  | 'prospectando'
  | 'contato_realizado'
  | 'em_negociacao'
  | 'aguardando_aprovacao'
  | 'ativo'
  | 'pausado'
  | 'encerrado';

export interface PartnerContact {
  id: string;
  partnerId: string;
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  email: string;
  isPrimary: boolean;
  notes?: string;
}

export interface Partner {
  id: string;
  company: string;
  cnpj: string;
  segment: string;
  contactName: string;
  role: string;
  whatsapp: string;
  phone: string;
  email: string;
  website: string;
  city: string;
  state: string;
  regionServed: string;
  standardProductService: string;
  targetAudience: string;
  commissionRate: number; // e.g., 10 for 10%
  commissionType: 'percentual' | 'fixo' | 'misto';
  isRecurrentCommission: boolean;
  recurrencePeriodMonths?: number;
  paymentTermDays: number; // e.g., 15 days after partner receives
  leadIdentificationMethod: string; // e.g. "WhatsApp dedicado", "E-mail com cópia", "Portal"
  saleCommunicationProcess: string; // e.g. "Notificação semanal de fechamento com espelho de NF"
  startDate: string;
  status: PartnerStatus;
  notes: string;
  createdAt: string;
}

export interface Product {
  id: string;
  partnerId: string;
  partnerName?: string;
  name: string;
  category: string;
  description: string;
  targetAudience?: string;
  regionServed?: string;
  avgTicket: number;
  suggestedPrice?: number;
  commissionModel: 'percentual' | 'fixo';
  commissionValue: number; // % or R$
  isRecurrent?: boolean;
  recurrencePeriodMonths?: number;
  notes?: string;
  createdAt: string;
}

export type LeadStatus =
  | 'novo'
  | 'primeiro_contato'
  | 'em_contato'
  | 'qualificado'
  | 'enviado_ao_parceiro'
  | 'em_negociacao'
  | 'proposta'
  | 'venda_realizada'
  | 'perdido'
  | 'sem_resposta';

export type LeadTemperature = 'frio' | 'morno' | 'quente';

// 8 Funnel Kanban stages specified by user:
// NOVO -> CONTATO -> QUALIFICADO -> ENVIADO AO PARCEIRO -> NEGOCIAÇÃO -> PROPOSTA -> VENDA -> COMISSÃO
export type FunnelStage =
  | 'novo'
  | 'contato'
  | 'qualificado'
  | 'enviado_ao_parceiro'
  | 'negociacao'
  | 'proposta'
  | 'venda'
  | 'comissao';

export interface Lead {
  id: string;
  entryDate: string;
  name: string;
  company: string;
  cnpj?: string;
  segment: string;
  role?: string;
  whatsapp: string;
  phone?: string;
  email: string;
  city: string;
  state: string;
  source: string; // e.g., 'Google Ads', 'Indicação', 'Prospecção Ativa', 'LinkedIn', 'Instagram'
  partnerId: string;
  productId?: string;
  internalResponsibleId: string;
  status: LeadStatus;
  funnelStage: FunnelStage;
  temperature: LeadTemperature;
  potentialValue: number;
  lastContactDate: string;
  nextFollowUpDate: string;
  notes: string;
  lossReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  leadId: string;
  partnerId?: string;
  type: 
    | 'ligacao'
    | 'whatsapp'
    | 'email'
    | 'reuniao'
    | 'observacao'
    | 'alteracao_status'
    | 'envio_parceiro'
    | 'retorno_parceiro'
    | 'venda'
    | 'perda';
  title: string;
  description: string;
  userName: string;
  userId: string;
  createdAt: string;
}

export type TaskPriority = 'alta' | 'media' | 'baixa';
export type TaskStatus = 'pendente' | 'concluida' | 'cancelada';

export interface Task {
  id: string;
  title: string;
  responsibleId: string;
  responsibleName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  leadId?: string;
  leadName?: string;
  partnerId?: string;
  partnerName?: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
}

export interface Sale {
  id: string;
  clientId?: string;
  clientName: string;
  leadId: string;
  partnerId: string;
  partnerName: string;
  productId?: string;
  productName: string;
  saleDate: string;
  saleValue: number;
  saleType: 'unica' | 'recorrente';
  recurrenceMonths?: number;
  conditions: string;
  notes: string;
  registeredByUserId: string;
  registeredByUserName: string;
  createdAt: string;
}

export type CommissionStatus =
  | 'prevista'
  | 'a_faturar'
  | 'faturada'
  | 'aguardando_pagamento'
  | 'recebida'
  | 'em_atraso'
  | 'cancelada';

export interface Commission {
  id: string;
  saleId: string;
  saleDate?: string;
  clientId?: string;
  clientName: string;
  partnerId: string;
  partnerName: string;
  productId?: string;
  productName: string;
  saleValue: number;
  commissionRate: number; // percentage, e.g. 10
  commissionValue: number; // Calculated: saleValue * commissionRate / 100
  isRecurrent: boolean;
  recurrenceNumber?: number; // 1, 2, 3...
  totalRecurrences?: number;
  expectedDate: string; // YYYY-MM-DD
  expectedPaymentDate?: string;
  receivedDate?: string; // YYYY-MM-DD
  actualPaymentDate?: string;
  invoiceNumber?: string;
  status: CommissionStatus;
  paymentMethod?: string; // e.g. Pix, TED, Boleto
  notes?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  cnpj?: string;
  segment: string;
  contact: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  partnerId: string;
  partnerName: string;
  acquiredProducts: string[];
  totalValueGenerated: number;
  totalCommissionsGenerated: number;
  purchaseCount: number;
  notes: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'followup_today' | 'followup_overdue' | 'lead_stalled' | 'commission_due' | 'commission_overdue' | 'general';
  targetId?: string;
  targetType?: 'lead' | 'commission' | 'task' | 'partner';
  isRead: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  entityType: 'lead' | 'partner' | 'sale' | 'commission' | 'task' | 'client' | 'product' | 'user';
  entityId: string;
  previousValue?: string;
  newValue?: string;
  timestamp: string;
}

export interface FilterState {
  dateRange: 'all' | 'today' | '7days' | 'month' | 'quarter' | 'year';
  partnerId: string;
  segment: string;
  responsibleId: string;
  status: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  isActive: boolean;
  executionsCount: number;
  lastExecutedAt?: string;
}
