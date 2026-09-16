import React from 'react';
import { CrmProvider, useCrm } from './context/CrmContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { KanbanView } from './components/KanbanView';
import { LeadsView } from './components/LeadsView';
import { PartnersView } from './components/PartnersView';
import { ProductsView } from './components/ProductsView';
import { SalesView } from './components/SalesView';
import { CommissionsView } from './components/CommissionsView';
import { ClientsView } from './components/ClientsView';
import { TasksView } from './components/TasksView';
import { UsersView } from './components/UsersView';
import { ReportsView } from './components/ReportsView';
import { AutomationsView } from './components/AutomationsView';
import { HistoryAuditView } from './components/HistoryAuditView';
import { ArchitectureView } from './components/ArchitectureView';

import { LeadModal } from './components/modals/LeadModal';
import { PartnerModal } from './components/modals/PartnerModal';
import { SaleModal } from './components/modals/SaleModal';
import { TaskModal } from './components/modals/TaskModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';

const MainLayout: React.FC = () => {
  const { activeTab, isSearchOpen, setIsSearchOpen, openNewItemModal, setOpenNewItemModal } = useCrm();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'kanban':
        return <KanbanView />;
      case 'leads':
        return <LeadsView />;
      case 'partners':
        return <PartnersView />;
      case 'products':
        return <ProductsView />;
      case 'sales':
        return <SalesView />;
      case 'commissions':
        return <CommissionsView />;
      case 'clients':
        return <ClientsView />;
      case 'tasks':
        return <TasksView />;
      case 'users':
        return <UsersView />;
      case 'reports':
        return <ReportsView />;
      case 'automations':
        return <AutomationsView />;
      case 'history':
        return <HistoryAuditView />;
      case 'architecture':
        return <ArchitectureView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-white">
      {/* Header */}
      <Header />

      {/* Main workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        {/* Dynamic content view */}
        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-4rem)]">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals */}
      {isSearchOpen && <GlobalSearchModal onClose={() => setIsSearchOpen(false)} />}
      {openNewItemModal === 'lead' && <LeadModal onClose={() => setOpenNewItemModal(null)} />}
      {openNewItemModal === 'partner' && <PartnerModal onClose={() => setOpenNewItemModal(null)} />}
      {openNewItemModal === 'sale' && <SaleModal onClose={() => setOpenNewItemModal(null)} />}
      {openNewItemModal === 'task' && <TaskModal onClose={() => setOpenNewItemModal(null)} />}
    </div>
  );
};

export default function App() {
  return (
    <CrmProvider>
      <MainLayout />
    </CrmProvider>
  );
}
