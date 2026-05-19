import { type FormEvent, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { leadsApi } from '../../../api/leads.api';
import { useDeleteLead, useLeads } from '../../../hooks/useLeads';
import { useDebounce } from '../../../hooks/useDebounce';
import { Lead, LeadFilters, LeadSource, LeadStatus } from '../../../types';
import { downloadCsv } from '../../../utils/csvExport';

const defaultFilters: LeadFilters = {
  status: '',
  source: '',
  sort: undefined,
  page: 1,
};

export const useLeadManagement = () => {
  const [rawSearch, setRawSearch] = useState('');
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFilename, setExportFilename] = useState('leads.csv');

  const debouncedSearch = useDebounce(rawSearch, 500);
  const activeFilters = useMemo<LeadFilters>(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  );
  const leadsQuery = useLeads(activeFilters);
  const deleteLead = useDeleteLead();

  const handleFilterChange = (updated: Partial<LeadFilters>) => {
    if ('search' in updated) setRawSearch(updated.search ?? '');
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const openCreateModal = () => {
    setEditingLead(null);
    setModalOpen(true);
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteLead.mutateAsync(id);
      toast.success('Lead deleted');
    } catch {
      toast.error('Failed to delete lead');
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async (event: FormEvent) => {
    event.preventDefault();
    setExportModalOpen(false);

    const finalFilename = exportFilename.trim()
      ? exportFilename.trim().endsWith('.csv')
        ? exportFilename.trim()
        : `${exportFilename.trim()}.csv`
      : 'leads.csv';

    setExportLoading(true);
    try {
      const blob = await leadsApi.exportCsv({
        status: filters.status as LeadStatus | undefined,
        source: filters.source as LeadSource | undefined,
        search: debouncedSearch || undefined,
      });
      downloadCsv(blob, finalFilename);
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Export failed');
    } finally {
      setExportLoading(false);
    }
  };

  const leads = leadsQuery.data?.data ?? [];
  const pagination = leadsQuery.data?.pagination;

  return {
    rawSearch,
    filters,
    leads,
    pagination,
    isLoading: leadsQuery.isLoading,
    modalOpen,
    editingLead,
    deletingId,
    exportFilename,
    exportLoading,
    exportModalOpen,
    setExportFilename,
    setExportModalOpen,
    setFilters,
    setModalOpen,
    handleDelete,
    handleExport,
    handleFilterChange,
    openCreateModal,
    openEditModal,
  };
};

export type LeadManagementState = ReturnType<typeof useLeadManagement>;
