import { FileSpreadsheet } from 'lucide-react';
import { LeadFiltersBar } from '../../../components/leads/LeadFilters';
import { LeadModal } from '../../../components/leads/LeadModal';
import { LeadTable } from '../../../components/leads/LeadTable';
import { Pagination } from '../../../components/leads/Pagination';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { UserRole } from '../../../types';
import { LeadManagementState } from '../hooks/useLeadManagement';

interface LeadManagementPanelProps {
  manager: LeadManagementState;
  role: UserRole;
}

export const LeadManagementPanel = ({ manager, role }: LeadManagementPanelProps) => {
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-border dark:bg-surface">
        <div className="border-b border-slate-200 p-5 dark:border-border/50">
          <LeadFiltersBar
            filters={{ ...manager.filters, search: manager.rawSearch }}
            onChange={manager.handleFilterChange}
          />
        </div>

        <LeadTable
          leads={manager.leads}
          isLoading={manager.isLoading}
          role={role}
          onEdit={manager.openEditModal}
          onDelete={manager.handleDelete}
          deletingId={manager.deletingId}
        />

        {manager.pagination ? (
          <div className="border-t border-slate-200 bg-slate-50/60 p-5 dark:border-border/50 dark:bg-background/30">
            <Pagination
              page={manager.pagination.page}
              totalPages={manager.pagination.totalPages}
              total={manager.pagination.total}
              onPageChange={(page) => manager.setFilters((prev) => ({ ...prev, page }))}
            />
          </div>
        ) : null}
      </div>

      <LeadModal
        isOpen={manager.modalOpen}
        onClose={() => manager.setModalOpen(false)}
        lead={manager.editingLead}
      />

      <Modal
        isOpen={manager.exportModalOpen}
        onClose={() => manager.setExportModalOpen(false)}
        title="Export Leads"
      >
        <form onSubmit={manager.handleExport} className="space-y-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Active filters will be included in the exported file.
          </p>
          <Input
            id="leads-export-filename"
            label="File name"
            value={manager.exportFilename}
            onChange={(event) => manager.setExportFilename(event.target.value)}
            leftIcon={<FileSpreadsheet className="h-4 w-4" />}
            required
          />
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => manager.setExportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={manager.exportLoading}>
              Export
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
