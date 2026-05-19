import { Download, Plus } from 'lucide-react';
import React from 'react';
import { Button } from '../components/ui/Button';
import { LeadManagementPanel } from '../features/leads/components/LeadManagementPanel';
import { useLeadManagement } from '../features/leads/hooks/useLeadManagement';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '../types';

const LeadsPage: React.FC = () => {
  const { user } = useAuthStore();
  const leadManager = useLeadManagement();

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Leads
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Search, filter, edit, delete, and export your lead database.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => leadManager.setExportModalOpen(true)}
            loading={leadManager.exportLoading}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={leadManager.openCreateModal}>
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      <LeadManagementPanel
        manager={leadManager}
        role={user?.role ?? UserRole.SALES}
      />
    </DashboardLayout>
  );
};

export default LeadsPage;
