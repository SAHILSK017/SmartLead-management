import React from 'react';
import { Lead, UserRole } from '../../types';
import { LeadRow } from './LeadRow';
import { Spinner } from '../ui/Spinner';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  role: UserRole;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  isLoading,
  role,
  onEdit,
  onDelete,
  deletingId,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-slate-900 dark:text-white">No leads found</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          Try adjusting your filters or click "Add Lead" to start building your pipeline.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-slate-50/50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-border/50">
          <tr>
            <th scope="col" className="px-5 py-4 font-semibold tracking-wider">Lead</th>
            <th scope="col" className="px-5 py-4 font-semibold tracking-wider">Status</th>
            <th scope="col" className="px-5 py-4 font-semibold tracking-wider">Source</th>
            <th scope="col" className="px-5 py-4 font-semibold tracking-wider">Created</th>
            <th scope="col" className="px-5 py-4 font-semibold tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-transparent divide-y divide-slate-100 dark:divide-border/50">
          {leads.map((lead) => (
            <LeadRow
              key={lead._id}
              lead={lead}
              role={role}
              onEdit={onEdit}
              onDelete={onDelete}
              isDeleting={deletingId === lead._id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
