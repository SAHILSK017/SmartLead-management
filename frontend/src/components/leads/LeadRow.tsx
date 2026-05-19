import React from 'react';
import { Lead, UserRole } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/formatDate';
import { Edit2, Trash2 } from 'lucide-react';

interface LeadRowProps {
  lead: Lead;
  role: UserRole;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const LeadRow: React.FC<LeadRowProps> = ({
  lead,
  role,
  onEdit,
  onDelete,
  isDeleting,
}) => (
  <tr className="group border-b border-slate-100 dark:border-border/50 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-200">
    <td className="px-5 py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm shadow-sm border border-slate-200/50 dark:border-slate-600/50 group-hover:scale-105 transition-transform">
          {lead.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{lead.name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{lead.email}</div>
        </div>
      </div>
    </td>
    <td className="px-5 py-4">
      <Badge value={lead.status} />
    </td>
    <td className="px-5 py-4">
      <Badge value={lead.source} />
    </td>
    <td className="px-5 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
      {formatDate(lead.createdAt)}
    </td>
    <td className="px-5 py-4">
      <div className="flex items-center gap-2">
        <Button
          id={`edit-lead-${lead._id}`}
          variant="ghost"
          size="sm"
          onClick={() => onEdit(lead)}
          className="h-8 w-8 p-0 rounded-full hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        {role === UserRole.ADMIN && (
          <Button
            id={`delete-lead-${lead._id}`}
            variant="ghost"
            size="sm"
            loading={isDeleting}
            onClick={() => onDelete(lead._id)}
            className="h-8 w-8 p-0 rounded-full text-slate-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
          >
            {isDeleting ? null : <Trash2 className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </td>
  </tr>
);
