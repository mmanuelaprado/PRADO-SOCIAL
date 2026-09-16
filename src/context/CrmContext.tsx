import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  Partner,
  Product,
  Lead,
  Sale,
  Commission,
  Client,
  Task,
  Activity,
  AuditLog,
  AutomationRule,
  NotificationItem,
  FilterState,
  FunnelStage,
  CommissionStatus,
  LeadStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PARTNERS,
  INITIAL_PRODUCTS,
  INITIAL_LEADS,
  INITIAL_SALES,
  INITIAL_COMMISSIONS,
  INITIAL_CLIENTS,
  INITIAL_TASKS,
  INITIAL_ACTIVITIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_AUTOMATIONS
} from '../data/seedData';

interface CrmContextType {
  currentUser: User;
  setCurrentUser: (u: User) => void;
  users: User[];
  partners: Partner[];
  products: Product[];
  leads: Lead[];
  clients: Client[];
  sales: Sale[];
  commissions: Commission[];
  tasks: Task[];
  activities: Activity[];
  auditLogs: AuditLog[];
  automations: AutomationRule[];
  notifications: NotificationItem[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedPartnerId: string | null;
  setSelectedPartnerId: (id: string | null) => void;
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  openNewItemModal: 'lead' | 'partner' | 'sale' | 'task' | null;
  setOpenNewItemModal: (modal: 'lead' | 'partner' | 'sale' | 'task' | null) => void;
  
  // Actions
  addPartner: (partner: Omit<Partner, 'id' | 'createdAt'>) => Partner;
  updatePartner: (id: string, updates: Partial<Partner>) => void;
  deletePartner: (id: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  moveLeadFunnel: (id: string, newStage: FunnelStage) => void;
  convertLeadToSale: (
    leadId: string,
    saleData: {
      saleValue: number;
      saleType: 'unica' | 'recorrente';
      recurrenceMonths?: number;
      conditions: string;
      notes: string;
      customCommissionRate?: number;
    }
  ) => Sale;
  addSale: (sale: Omit<Sale, 'id' | 'createdAt' | 'registeredByUserId' | 'registeredByUserName'>) => Sale;
  updateSale: (id: string, updates: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  addCommission: (comm: Omit<Commission, 'id' | 'createdAt'>) => Commission;
  updateCommission: (id: string, updates: Partial<Commission>) => void;
  deleteCommission: (id: string) => void;
  updateCommissionStatus: (
    id: string,
    status: CommissionStatus,
    receivedDate?: string,
    paymentMethod?: string
  ) => void;
  generateNextRecurrence: (commissionId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'responsibleName'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  addActivity: (act: Omit<Activity, 'id' | 'createdAt' | 'userId' | 'userName'>) => Activity;
  toggleAutomation: (id: string) => void;
  toggleAutomationRule: (id: string) => void;
  automationRules: AutomationRule[];
  markNotificationRead: (id: string) => void;
  resetToInitialData: () => void;
  hasPermission: (module: string) => boolean;
  addUser: (u: Omit<User, 'id'>) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  completeTask: (id: string) => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'prado_social_crm_data_v1';

function loadStorageArray<T>(key: string, fallback: T[]): T[] {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_current_user');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch {}
    return INITIAL_USERS[0];
  });
  const [users, setUsers] = useState<User[]>(() => loadStorageArray(LOCAL_STORAGE_KEY + '_users', INITIAL_USERS));
  
  // Load initial state or local storage with defensive array guarantees
  const [partners, setPartners] = useState<Partner[]>(() => loadStorageArray(LOCAL_STORAGE_KEY + '_partners', INITIAL_PARTNERS));
  const [products, setProducts] = useState<Product[]>(() => loadStorageArray(LOCAL_STORAGE_KEY + '_products', INITIAL_PRODUCTS));
  const [leads, setLeads] = useState<Lead[]>(() => loadStorageArray(LOCAL_STORAGE_KEY + '_leads', INITIAL_LEADS));
  const [clients, setClients] = useState<Client[]>(() => loadStorageArray(LOCAL_STORAGE_KEY + '_clients', INITIAL_CLIENTS));
  const [sales, setSales] = useState<Sale[]>(() => loadStorageArray(LOCAL_STORAGE_KEY + '_sales', INITIAL_SALES));
  const [commissions, setCommissions] = useState<Commission[]>(() => loadStorageArray(LOCAL_STORAGE_KEY + '_commissions', INITIAL_COMMISSIONS));
  const [tasks, setTasks] = useState<Task[]>(() => loadStorageArray(LOCAL_STORAGE_KEY + '_tasks', INITIAL_TASKS));
  const [activities, setActivities] = useState<Activity[]>(() => loadStorageArray(LOCAL_STORAGE_KEY + '_activities', INITIAL_ACTIVITIES));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStorageArray(LOCAL_STORAGE_KEY + '_auditLogs', INITIAL_AUDIT_LOGS));
  const [automations, setAutomations] = useState<AutomationRule[]>(() => loadStorageArray(LOCAL_STORAGE_KEY + '_automations', INITIAL_AUTOMATIONS));
  
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openNewItemModal, setOpenNewItemModal] = useState<'lead' | 'partner' | 'sale' | 'task' | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'all',
    partnerId: 'all',
    segment: 'all',
    responsibleId: 'all',
    status: 'all'
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_current_user', JSON.stringify(currentUser));
  }, [currentUser]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_partners', JSON.stringify(partners));
  }, [partners]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_leads', JSON.stringify(leads));
  }, [leads]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_clients', JSON.stringify(clients));
  }, [clients]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_sales', JSON.stringify(sales));
  }, [sales]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_commissions', JSON.stringify(commissions));
  }, [commissions]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_activities', JSON.stringify(activities));
  }, [activities]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_automations', JSON.stringify(automations));
  }, [automations]);

  // Compute live notifications based on tasks and commissions
  const notifications = useMemo(() => {
    const items: NotificationItem[] = [];
    const todayStr = '2026-09-16'; // Current simulation date
    
    // Follow-ups today
    (tasks || [])
      .filter((t) => t && t.status === 'pendente' && t.date === todayStr)
      .forEach((t) => {
        items.push({
          id: `notif_task_${t.id}`,
          title: 'Follow-up para Hoje',
          message: `${t.title} (${t.time})`,
          type: 'followup_today',
          targetId: t.leadId,
          targetType: 'lead',
          isRead: false,
          createdAt: t.createdAt
        });
      });

    // Follow-ups overdue
    (tasks || [])
      .filter((t) => t && t.status === 'pendente' && t.date < todayStr)
      .forEach((t) => {
        items.push({
          id: `notif_overdue_${t.id}`,
          title: 'Follow-up Atrasado',
          message: `${t.title} (Venceu em ${t.date})`,
          type: 'followup_overdue',
          targetId: t.leadId,
          targetType: 'lead',
          isRead: false,
          createdAt: t.createdAt
        });
      });

    // Stalled leads (last contact > 7 days ago and still in pipeline)
    (leads || [])
      .filter((l) => l && l.funnelStage !== 'venda' && l.funnelStage !== 'comissao' && l.status !== 'perdido')
      .forEach((l) => {
        const last = new Date(l.lastContactDate).getTime();
        const now = new Date(todayStr).getTime();
        const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
        if (diffDays >= 7) {
          items.push({
            id: `notif_stalled_${l.id}`,
            title: `Lead Parado há ${diffDays} dias`,
            message: `${l.company} (${l.name}) não tem contato recente.`,
            type: 'lead_stalled',
            targetId: l.id,
            targetType: 'lead',
            isRead: false,
            createdAt: l.updatedAt
          });
        }
      });

    // Commissions overdue
    (commissions || [])
      .filter((c) => c && (c.status === 'em_atraso' || (c.status !== 'recebida' && c.status !== 'cancelada' && c.expectedDate < todayStr)))
      .forEach((c) => {
        items.push({
          id: `notif_comm_overdue_${c.id}`,
          title: 'Comissão em Atraso',
          message: `R$ ${(c.commissionValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} devida por ${c.partnerName} (${c.clientName})`,
          type: 'commission_overdue',
          targetId: c.id,
          targetType: 'commission',
          isRead: false,
          createdAt: c.createdAt
        });
      });

    return items;
  }, [tasks, leads, commissions]);

  // Role Permissions Checker
  const hasPermission = (module: string): boolean => {
    const role = currentUser.role;
    if (role === 'admin' || role === 'gestor') return true;

    switch (module) {
      case 'dashboard':
        return true;
      case 'kanban':
      case 'leads':
      case 'tasks':
      case 'activities':
        return role === 'comercial' || role === 'sdr';
      case 'partners':
      case 'products':
        return role === 'comercial';
      case 'sales':
      case 'commissions':
      case 'clients':
      case 'reports':
        return role === 'comercial' || role === 'financeiro';
      case 'users':
        return role === 'admin' || role === 'gestor';
      case 'automations':
      case 'history':
      case 'architecture':
        return true;
      default:
        return true;
    }
  };

  // Log an audit trail
  const logAudit = (
    action: string,
    details: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    previousValue?: string,
    newValue?: string
  ) => {
    const newLog: AuditLog = {
      id: 'aud_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      details,
      entityType,
      entityId,
      previousValue,
      newValue,
      timestamp: new Date().toISOString()
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // ACTIONS

  const addPartner = (data: Omit<Partner, 'id' | 'createdAt'>): Partner => {
    const newId = 'p_' + Date.now();
    const newPartner: Partner = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPartners((prev) => [newPartner, ...prev]);
    logAudit(
      'Cadastro de Parceiro',
      `Cadastrou nova empresa parceira: ${newPartner.company}`,
      'partner',
      newId
    );
    return newPartner;
  };

  const updatePartner = (id: string, updates: Partial<Partner>) => {
    setPartners((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          logAudit(
            'Atualização de Parceiro',
            `Atualizou dados cadastrais do parceiro ${updated.company}`,
            'partner',
            id
          );
          return updated;
        }
        return p;
      })
    );
  };

  const deletePartner = (id: string) => {
    const p = partners.find((x) => x.id === id);
    setPartners((prev) => prev.filter((x) => x.id !== id));
    if (p) {
      logAudit(
        'Exclusão de Parceiro',
        `Removeu a empresa parceira ${p.company}`,
        'partner',
        id
      );
    }
  };

  const addProduct = (data: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newId = 'prod_' + Date.now();
    const newProduct: Product = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts((prev) => [newProduct, ...prev]);
    logAudit(
      'Cadastro de Produto/Serviço',
      `Adicionou produto "${newProduct.name}" ao catálogo do parceiro`,
      'product',
      newId
    );
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((pr) => (pr.id === id ? { ...pr, ...updates } : pr))
    );
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (prod) {
      logAudit(
        'Exclusão de Produto/Serviço',
        `Removeu o produto "${prod.name}" do catálogo`,
        'product',
        id
      );
    }
  };

  const addLead = (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead => {
    const newId = 'ld_' + Date.now();
    const nowIso = new Date().toISOString();
    const newLead: Lead = {
      ...data,
      id: newId,
      createdAt: nowIso,
      updatedAt: nowIso
    };
    setLeads((prev) => [newLead, ...prev]);

    // Add activity
    const newAct: Activity = {
      id: 'act_' + Date.now(),
      leadId: newId,
      partnerId: data.partnerId,
      type: 'observacao',
      title: 'Lead Cadastrado no Sistema',
      description: `Origem: ${data.source}. Empresa: ${data.company}. Valor potencial estimado: R$ ${(data.potentialValue || 0).toLocaleString('pt-BR')}`,
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: nowIso
    };
    setActivities((prev) => [newAct, ...prev]);

    // Schedule task if next follow-up specified
    if (data.nextFollowUpDate) {
      const partner = partners.find((p) => p.id === data.partnerId);
      const newTask: Task = {
        id: 'tsk_' + Date.now(),
        title: `Primeiro Follow-up: ${data.company} (${data.name})`,
        responsibleId: data.internalResponsibleId,
        responsibleName: users.find((u) => u.id === data.internalResponsibleId)?.name || currentUser.name,
        date: data.nextFollowUpDate,
        time: '10:00',
        leadId: newId,
        leadName: `${data.name} (${data.company})`,
        partnerId: data.partnerId,
        partnerName: partner?.company,
        priority: 'alta',
        status: 'pendente',
        createdAt: nowIso
      };
      setTasks((prev) => [newTask, ...prev]);
    }

    logAudit(
      'Cadastro de Lead',
      `Criou lead para ${data.company} (${data.name}) vinculado ao parceiro`,
      'lead',
      newId
    );

    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const updated = { ...l, ...updates, updatedAt: new Date().toISOString() };
          logAudit(
            'Atualização de Lead',
            `Atualizou dados do lead ${updated.company}`,
            'lead',
            id
          );
          return updated;
        }
        return l;
      })
    );
  };

  const deleteLead = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (lead) {
      logAudit(
        'Exclusão de Lead',
        `Removeu o lead "${lead.company}" (${lead.name})`,
        'lead',
        id
      );
    }
  };

  const stageLabels: Record<FunnelStage, string> = {
    novo: 'Novo',
    contato: 'Contato',
    qualificado: 'Qualificado',
    enviado_ao_parceiro: 'Enviado ao Parceiro',
    negociacao: 'Negociação',
    proposta: 'Proposta',
    venda: 'Venda Realizada',
    comissao: 'Comissão'
  };

  const moveLeadFunnel = (id: string, newStage: FunnelStage) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;

    const oldStage = lead.funnelStage;
    if (oldStage === newStage) return;

    let newStatus: LeadStatus = lead.status;
    if (newStage === 'novo') newStatus = 'novo';
    else if (newStage === 'contato') newStatus = 'em_contato';
    else if (newStage === 'qualificado') newStatus = 'qualificado';
    else if (newStage === 'enviado_ao_parceiro') newStatus = 'enviado_ao_parceiro';
    else if (newStage === 'negociacao') newStatus = 'em_negociacao';
    else if (newStage === 'proposta') newStatus = 'proposta';
    else if (newStage === 'venda' || newStage === 'comissao') newStatus = 'venda_realizada';

    const nowIso = new Date().toISOString();

    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              funnelStage: newStage,
              status: newStatus,
              updatedAt: nowIso,
              lastContactDate: nowIso.split('T')[0]
            }
          : l
      )
    );

    // Register activity
    const activityType =
      newStage === 'enviado_ao_parceiro'
        ? 'envio_parceiro'
        : newStage === 'venda'
        ? 'venda'
        : 'alteracao_status';

    const newAct: Activity = {
      id: 'act_' + Date.now(),
      leadId: id,
      partnerId: lead.partnerId,
      type: activityType,
      title: `Etapa alterada para: ${stageLabels[newStage]}`,
      description: `${currentUser.name} moveu o lead de "${stageLabels[oldStage]}" para "${stageLabels[newStage]}".`,
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: nowIso
    };
    setActivities((prev) => [newAct, ...prev]);

    // Mandatory Audit Log format requested by user:
    // "João alterou o lead Clínica ABC de 'Negociação' para 'Venda realizada' em dd/mm/aaaa às hh:mm"
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('pt-BR');
    const timeFormatted = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const formattedAuditMessage = `${currentUser.name} alterou o lead ${lead.company} de '${stageLabels[oldStage]}' para '${stageLabels[newStage]}' em ${dateFormatted} às ${timeFormatted}.`;

    logAudit(
      'Movimentação no Funil',
      formattedAuditMessage,
      'lead',
      id,
      stageLabels[oldStage],
      stageLabels[newStage]
    );
  };

  const addSale = (
    data: Omit<Sale, 'id' | 'createdAt' | 'registeredByUserId' | 'registeredByUserName'>
  ): Sale => {
    const saleId = 'sale_' + Date.now();
    const nowIso = new Date().toISOString();
    const partner = partners.find((p) => p.id === data.partnerId);

    const newSale: Sale = {
      ...data,
      id: saleId,
      registeredByUserId: currentUser.id,
      registeredByUserName: currentUser.name,
      createdAt: nowIso
    };

    setSales((prev) => [newSale, ...prev]);

    // AUTOMATION 1: Criar comissão automaticamente após uma venda
    // Valor da comissão = Valor da venda × percentual da comissão
    const commRate = partner ? partner.commissionRate : 10;
    const commValue = Number(((data.saleValue * commRate) / 100).toFixed(2));

    // Calculate expected date (e.g. 15 or 30 days after sale date)
    const saleDateObj = new Date(data.saleDate || nowIso);
    const termDays = partner?.paymentTermDays || 15;
    saleDateObj.setDate(saleDateObj.getDate() + termDays);
    const expectedDateStr = saleDateObj.toISOString().split('T')[0];

    const newCommission: Commission = {
      id: 'com_' + Date.now(),
      saleId,
      clientId: data.clientId,
      clientName: data.clientName,
      partnerId: data.partnerId,
      partnerName: data.partnerName,
      productId: data.productId,
      productName: data.productName,
      saleValue: data.saleValue,
      commissionRate: commRate,
      commissionValue: commValue,
      isRecurrent: data.saleType === 'recorrente',
      recurrenceNumber: 1,
      totalRecurrences: data.recurrenceMonths || (data.saleType === 'recorrente' ? 12 : undefined),
      expectedDate: expectedDateStr,
      status: 'prevista',
      paymentMethod: 'Pix / Transferência Bancária',
      notes: `Gerada automaticamente da Venda #${saleId}. Taxa: ${commRate}%`,
      createdAt: nowIso
    };

    setCommissions((prev) => [newCommission, ...prev]);

    // AUTOMATION 2: Criar/atualizar Cliente
    const existingClient = clients.find(
      (c) => c.company.toLowerCase() === data.clientName.toLowerCase() || (data.clientId && c.id === data.clientId)
    );
    if (existingClient) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === existingClient.id
            ? {
                ...c,
                totalValueGenerated: c.totalValueGenerated + data.saleValue,
                totalCommissionsGenerated: c.totalCommissionsGenerated + commValue,
                purchaseCount: c.purchaseCount + 1,
                acquiredProducts: Array.from(new Set([...c.acquiredProducts, data.productName]))
              }
            : c
        )
      );
    } else {
      const newClient: Client = {
        id: 'c_' + Date.now(),
        name: data.clientName,
        company: data.clientName,
        segment: partner?.segment || 'Serviços Corporativos',
        contact: data.clientName,
        whatsapp: '',
        email: '',
        city: partner?.city || 'São Paulo',
        state: partner?.state || 'SP',
        partnerId: data.partnerId,
        partnerName: data.partnerName,
        acquiredProducts: [data.productName],
        totalValueGenerated: data.saleValue,
        totalCommissionsGenerated: commValue,
        purchaseCount: 1,
        notes: `Cliente originado do fechamento da Venda #${saleId}`,
        createdAt: data.saleDate
      };
      setClients((prev) => [newClient, ...prev]);
    }

    // Update lead status to venda_realizada
    if (data.leadId) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === data.leadId
            ? {
                ...l,
                funnelStage: 'venda',
                status: 'venda_realizada',
                updatedAt: nowIso
              }
            : l
        )
      );

      // Register activity
      const newAct: Activity = {
        id: 'act_' + Date.now(),
        leadId: data.leadId,
        partnerId: data.partnerId,
        type: 'venda',
        title: `Venda Registrada: R$ ${(data.saleValue || 0).toLocaleString('pt-BR')}`,
        description: `Venda confirmada para ${data.clientName}. Produto: ${data.productName}. Comissão Prado Social: R$ ${(commValue || 0).toLocaleString('pt-BR')} (${commRate}%).`,
        userId: currentUser.id,
        userName: currentUser.name,
        createdAt: nowIso
      };
      setActivities((prev) => [newAct, ...prev]);
    }

    logAudit(
      'Registro de Venda',
      `Registrou venda de R$ ${(data.saleValue || 0).toLocaleString('pt-BR')} para ${data.clientName} e gerou comissão de R$ ${(commValue || 0).toLocaleString('pt-BR')}`,
      'sale',
      saleId
    );

    return newSale;
  };

  const convertLeadToSale = (
    leadId: string,
    saleData: {
      saleValue: number;
      saleType: 'unica' | 'recorrente';
      recurrenceMonths?: number;
      conditions: string;
      notes: string;
      customCommissionRate?: number;
    }
  ): Sale => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead não encontrado');

    const partner = partners.find((p) => p.id === lead.partnerId);
    const product = products.find((pr) => pr.id === lead.productId);

    return addSale({
      leadId,
      clientName: lead.company,
      partnerId: lead.partnerId,
      partnerName: partner?.company || 'Parceiro',
      productId: lead.productId,
      productName: product?.name || partner?.standardProductService || 'Solução Contratada',
      saleDate: new Date().toISOString().split('T')[0],
      saleValue: saleData.saleValue,
      saleType: saleData.saleType,
      recurrenceMonths: saleData.recurrenceMonths,
      conditions: saleData.conditions,
      notes: saleData.notes
    });
  };

  const updateSale = (id: string, updates: Partial<Sale>) => {
    setSales((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...updates };
          logAudit(
            'Atualização de Venda',
            `Atualizou dados da venda #${id} (${updated.clientName})`,
            'sale',
            id
          );
          return updated;
        }
        return s;
      })
    );
  };

  const deleteSale = (id: string) => {
    const sale = sales.find((s) => s.id === id);
    setSales((prev) => prev.filter((s) => s.id !== id));
    if (sale) {
      logAudit(
        'Exclusão de Venda',
        `Removeu o registro de venda #${id} (${sale.clientName} - R$ ${(sale.saleValue || 0).toLocaleString('pt-BR')})`,
        'sale',
        id
      );
    }
  };

  const addCommission = (data: Omit<Commission, 'id' | 'createdAt'>): Commission => {
    const newId = 'com_' + Date.now();
    const newComm: Commission = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString()
    };
    setCommissions((prev) => [newComm, ...prev]);
    logAudit(
      'Inclusão de Comissão',
      `Incluiu lançamento de comissão no valor de R$ ${(data.commissionValue || 0).toLocaleString('pt-BR')} para ${data.partnerName} (${data.clientName})`,
      'commission',
      newId
    );
    return newComm;
  };

  const updateCommission = (id: string, updates: Partial<Commission>) => {
    setCommissions((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          logAudit(
            'Atualização de Comissão',
            `Atualizou dados da comissão #${id} (${updated.clientName})`,
            'commission',
            id
          );
          return updated;
        }
        return c;
      })
    );
  };

  const deleteCommission = (id: string) => {
    const comm = commissions.find((c) => c.id === id);
    setCommissions((prev) => prev.filter((c) => c.id !== id));
    if (comm) {
      logAudit(
        'Exclusão de Comissão',
        `Removeu comissão #${id} (${comm.clientName} - R$ ${(comm.commissionValue || 0).toLocaleString('pt-BR')})`,
        'commission',
        id
      );
    }
  };

  const updateCommissionStatus = (
    id: string,
    newStatus: CommissionStatus,
    receivedDate?: string,
    paymentMethod?: string
  ) => {
    setCommissions((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const prevStatus = c.status;
          const updated: Commission = {
            ...c,
            status: newStatus,
            receivedDate: newStatus === 'recebida' ? receivedDate || new Date().toISOString().split('T')[0] : c.receivedDate,
            paymentMethod: paymentMethod || c.paymentMethod
          };
          logAudit(
            'Atualização de Comissão',
            `Alterou status da comissão de R$ ${(c.commissionValue || 0).toLocaleString('pt-BR')} (${c.clientName}) de "${prevStatus}" para "${newStatus}".`,
            'commission',
            id,
            prevStatus,
            newStatus
          );
          return updated;
        }
        return c;
      })
    );
  };

  const generateNextRecurrence = (commissionId: string) => {
    const baseComm = commissions.find((c) => c.id === commissionId);
    if (!baseComm || !baseComm.isRecurrent) return;

    const currentNumber = baseComm.recurrenceNumber || 1;
    const total = baseComm.totalRecurrences || 12;

    if (currentNumber >= total) {
      alert(`Todas as ${total} parcelas de recorrência desta comissão já foram projetadas.`);
      return;
    }

    const nextNumber = currentNumber + 1;
    const nextDate = new Date(baseComm.expectedDate);
    nextDate.setMonth(nextDate.getMonth() + 1);

    const newRecurrentComm: Commission = {
      id: 'com_rec_' + Date.now(),
      saleId: baseComm.saleId,
      clientId: baseComm.clientId,
      clientName: baseComm.clientName,
      partnerId: baseComm.partnerId,
      partnerName: baseComm.partnerName,
      productId: baseComm.productId,
      productName: baseComm.productName,
      saleValue: baseComm.saleValue,
      commissionRate: baseComm.commissionRate,
      commissionValue: baseComm.commissionValue,
      isRecurrent: true,
      recurrenceNumber: nextNumber,
      totalRecurrences: total,
      expectedDate: nextDate.toISOString().split('T')[0],
      status: 'prevista',
      paymentMethod: baseComm.paymentMethod,
      notes: `Parcela recorrente #${nextNumber} de ${total}. Gerada automaticamente.`,
      createdAt: new Date().toISOString()
    };

    setCommissions((prev) => [newRecurrentComm, ...prev]);

    logAudit(
      'Geração de Recorrência',
      `Gerou parcela ${nextNumber}/${total} de comissão recorrente (R$ ${(baseComm.commissionValue || 0).toLocaleString('pt-BR')}) para ${baseComm.partnerName}.`,
      'commission',
      newRecurrentComm.id
    );
  };

  const addTask = (data: Omit<Task, 'id' | 'createdAt' | 'responsibleName'>): Task => {
    const newId = 'tsk_' + Date.now();
    const responsible = users.find((u) => u.id === data.responsibleId);
    const newTask: Task = {
      ...data,
      id: newId,
      responsibleName: responsible?.name || currentUser.name,
      createdAt: new Date().toISOString()
    };
    setTasks((prev) => [newTask, ...prev]);
    logAudit(
      'Agendamento de Tarefa/Follow-up',
      `Criou tarefa "${newTask.title}" para ${newTask.date} às ${newTask.time}`,
      'task',
      newId
    );
    return newTask;
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus = t.status === 'pendente' ? 'concluida' : 'pendente';
          logAudit(
            'Status de Tarefa',
            `Marcou tarefa "${t.title}" como ${newStatus}`,
            'task',
            id
          );
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          logAudit(
            'Atualização de Tarefa',
            `Atualizou dados da tarefa "${updated.title}"`,
            'task',
            id
          );
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    const t = tasks.find((x) => x.id === id);
    setTasks((prev) => prev.filter((x) => x.id !== id));
    if (t) {
      logAudit(
        'Exclusão de Tarefa',
        `Removeu a tarefa "${t.title}"`,
        'task',
        id
      );
    }
  };

  const addActivity = (
    data: Omit<Activity, 'id' | 'createdAt' | 'userId' | 'userName'>
  ): Activity => {
    const newId = 'act_' + Date.now();
    const newAct: Activity = {
      ...data,
      id: newId,
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: new Date().toISOString()
    };
    setActivities((prev) => [newAct, ...prev]);
    return newAct;
  };

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const markNotificationRead = (id: string) => {
    // handled in state if we want persistence or we can simply clear
  };

  const addUser = (data: Omit<User, 'id'>): User => {
    const newId = 'u_' + Date.now();
    const newUser: User = { ...data, id: newId };
    setUsers((prev) => [...prev, newUser]);
    logAudit('Cadastro de Usuário', `Cadastrou novo usuário: ${newUser.name} (${newUser.role})`, 'user', newId);
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updated = { ...u, ...updates };
          if (currentUser.id === id) {
            setCurrentUser(updated);
          }
          logAudit('Atualização de Usuário', `Atualizou dados do usuário ${updated.name}`, 'user', id);
          return updated;
        }
        return u;
      })
    );
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) {
      alert('Não é possível excluir o único usuário do sistema.');
      return;
    }
    const u = users.find((x) => x.id === id);
    setUsers((prev) => prev.filter((x) => x.id !== id));
    if (u) {
      logAudit(
        'Exclusão de Usuário',
        `Removeu o usuário "${u.name}" (${u.role})`,
        'user',
        id
      );
    }
  };

  const resetToInitialData = () => {
    if (confirm('Deseja restaurar os dados originais da demonstração da Prado Social? Todas as alterações manuais serão resetadas.')) {
      localStorage.clear();
      setPartners(INITIAL_PARTNERS);
      setProducts(INITIAL_PRODUCTS);
      setLeads(INITIAL_LEADS);
      setClients(INITIAL_CLIENTS);
      setSales(INITIAL_SALES);
      setCommissions(INITIAL_COMMISSIONS);
      setTasks(INITIAL_TASKS);
      setActivities(INITIAL_ACTIVITIES);
      setAuditLogs(INITIAL_AUDIT_LOGS);
      setAutomations(INITIAL_AUTOMATIONS);
      window.location.reload();
    }
  };

  return (
    <CrmContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        partners,
        products,
        leads,
        clients,
        sales,
        commissions,
        tasks,
        activities,
        auditLogs,
        automations,
        notifications,
        filters,
        setFilters,
        activeTab,
        setActiveTab,
        selectedPartnerId,
        setSelectedPartnerId,
        selectedLeadId,
        setSelectedLeadId,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        openNewItemModal,
        setOpenNewItemModal,
        addPartner,
        updatePartner,
        deletePartner,
        addProduct,
        updateProduct,
        deleteProduct,
        addLead,
        updateLead,
        deleteLead,
        moveLeadFunnel,
        convertLeadToSale,
        addSale,
        updateSale,
        deleteSale,
        addCommission,
        updateCommission,
        deleteCommission,
        updateCommissionStatus,
        generateNextRecurrence,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        addActivity,
        toggleAutomation,
        toggleAutomationRule: toggleAutomation,
        automationRules: automations,
        markNotificationRead,
        resetToInitialData,
        hasPermission,
        addUser,
        updateUser,
        deleteUser,
        completeTask: toggleTaskStatus
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) throw new Error('useCrm must be used within CrmProvider');
  return context;
};
