import React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, Target, TrendingUp, Users, type LucideIcon } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useLeads } from '../hooks/useLeads';
import { LeadStatus } from '../types';

const trend = [
  { month: 'Jan', leads: 42, qualified: 12 },
  { month: 'Feb', leads: 58, qualified: 18 },
  { month: 'Mar', leads: 74, qualified: 26 },
  { month: 'Apr', leads: 68, qualified: 24 },
  { month: 'May', leads: 91, qualified: 36 },
  { month: 'Jun', leads: 108, qualified: 44 },
];

const metrics: Array<[string, string | number, LucideIcon]> = [
  ['Total leads', 0, Users],
  ['Qualified', 0, Target],
  ['Contacted', 0, Activity],
  ['Conversion', '0%', TrendingUp],
];

const AnalyticsPage: React.FC = () => {
  const { data } = useLeads({ page: 1 });
  const leads = data?.data ?? [];
  const total = data?.pagination.total ?? leads.length;
  const qualified = leads.filter((lead) => lead.status === LeadStatus.QUALIFIED).length;
  const contacted = leads.filter((lead) => lead.status === LeadStatus.CONTACTED).length;
  const conversion = total ? Math.round((qualified / total) * 100) : 0;

  const sourceData = Object.entries(
    leads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.source] = (acc[lead.source] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([source, count]) => ({ source, count }));

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track lead volume, qualification, and source performance.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([label, , Icon]) => {
          const value =
            label === 'Total leads'
              ? total
              : label === 'Qualified'
                ? qualified
                : label === 'Contacted'
                  ? contacted
                  : `${conversion}%`;

          return (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-border dark:bg-surface">
            <Icon className="h-5 w-5 text-brand-500" />
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
          </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-border dark:bg-surface">
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">Lead trend</h2>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.22)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area dataKey="leads" stroke="#6366f1" fill="url(#leadsGradient)" strokeWidth={2} />
                <Area dataKey="qualified" stroke="#10b981" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-border dark:bg-surface">
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">Sources</h2>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData.length ? sourceData : [{ source: 'No data', count: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.22)" />
                <XAxis dataKey="source" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
