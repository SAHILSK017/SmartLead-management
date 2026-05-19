import React from 'react';
import { LeadFilters, LeadSource, LeadStatus, SortOrder } from '../../types';
import { Search, Filter, SortDesc } from 'lucide-react';

interface LeadFiltersProps {
  filters: LeadFilters;
  onChange: (updated: Partial<LeadFilters>) => void;
}

const selectClass =
  'appearance-none rounded-xl border border-slate-200/80 bg-white/50 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-md focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-border dark:bg-surface/50 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-surface transition-all';

export const LeadFiltersBar: React.FC<LeadFiltersProps> = ({ filters, onChange }) => {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
      {/* Search */}
      <div className="relative flex-1 min-w-[240px] w-full">
        <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
          <Search className="h-4 w-4" />
        </span>
        <input
          id="leads-search"
          type="text"
          placeholder="Search leads by name or email..."
          value={filters.search ?? ''}
          onChange={(e) => onChange({ search: e.target.value, page: 1 })}
          className="w-full rounded-xl border border-slate-200/80 bg-white/50 py-2.5 pl-10 pr-4 text-sm font-medium placeholder:text-slate-400 shadow-sm backdrop-blur-md focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-border dark:bg-surface/50 dark:text-slate-100 transition-all hover:bg-slate-50 dark:hover:bg-surface"
        />
      </div>

      <div className="flex w-full sm:w-auto items-center gap-3">
        {/* Status filter */}
        <div className="relative flex-1 sm:flex-none">
          <select
            id="leads-status-filter"
            value={filters.status ?? ''}
            onChange={(e) => onChange({ status: e.target.value as LeadStatus | '', page: 1 })}
            className={`${selectClass} w-full pl-9 pr-8`}
          >
            <option value="">All Statuses</option>
            {Object.values(LeadStatus).map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Source filter */}
        <div className="relative flex-1 sm:flex-none">
          <select
            id="leads-source-filter"
            value={filters.source ?? ''}
            onChange={(e) => onChange({ source: e.target.value as LeadSource | '', page: 1 })}
            className={`${selectClass} w-full pr-8`}
          >
            <option value="">All Sources</option>
            {Object.values(LeadSource).map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="relative flex-1 sm:flex-none">
          <select
            id="leads-sort"
            value={filters.sort ?? SortOrder.LATEST}
            onChange={(e) => onChange({ sort: e.target.value as SortOrder })}
            className={`${selectClass} w-full pl-9 pr-8`}
          >
            <option value={SortOrder.LATEST}>Latest First</option>
            <option value={SortOrder.OLDEST}>Oldest First</option>
          </select>
          <SortDesc className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
