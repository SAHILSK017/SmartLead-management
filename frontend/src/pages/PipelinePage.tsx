import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useLeads } from '../hooks/useLeads';
import { LeadStatus } from '../types';

const columns = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
  LeadStatus.LOST,
];

const labels: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'New',
  [LeadStatus.CONTACTED]: 'Contacted',
  [LeadStatus.QUALIFIED]: 'Qualified',
  [LeadStatus.LOST]: 'Lost',
};

const PipelinePage: React.FC = () => {
  const { data, isLoading } = useLeads({ page: 1 });
  const leads = data?.data ?? [];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Pipeline
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          View leads by stage and spot stuck opportunities quickly.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((status) => {
          const stageLeads = leads.filter((lead) => lead.status === status);

          return (
            <section
              key={status}
              className="min-h-[520px] rounded-2xl border border-slate-200 bg-slate-100/70 p-3 dark:border-border dark:bg-slate-900/40"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {labels[status]}
                </h2>
                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 shadow-sm dark:bg-surface dark:text-slate-300">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-24 animate-pulse rounded-xl bg-white dark:bg-surface" />
                  ))
                ) : stageLeads.length ? (
                  stageLeads.map((lead) => (
                    <article
                      key={lead._id}
                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-surface"
                    >
                      <p className="font-semibold text-slate-950 dark:text-white">{lead.name}</p>
                      <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                        {lead.email}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium capitalize text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                          {lead.source}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-5 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-surface/50 dark:text-slate-400">
                    No leads in this stage.
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default PipelinePage;
