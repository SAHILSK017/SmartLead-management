import { motion } from 'framer-motion';
import { CircleDot, Download, Plus, Target, Users, XCircle, type LucideIcon } from 'lucide-react';
import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Button } from '../components/ui/Button';
import { LeadManagementPanel } from '../features/leads/components/LeadManagementPanel';
import { useLeadManagement } from '../features/leads/hooks/useLeadManagement';
import { useAuthStore } from '../store/auth.store';
import { LeadStatus, UserRole } from '../types';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  color: 'brand' | 'emerald' | 'amber' | 'blue';
  gradient: string;
  delay: number;
}

const MetricCard = ({ title, value, subtext, icon: Icon, color, gradient, delay }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-border dark:bg-surface"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-10`} />
    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </h3>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtext}</p>
      </div>
      <div className={`rounded-xl border border-slate-100 bg-slate-50 p-3 text-${color}-500 shadow-sm transition-transform duration-300 group-hover:scale-110 dark:border-slate-700/50 dark:bg-slate-800/50`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <div className="relative z-10 mt-5 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
      <div className={`h-full rounded-full bg-gradient-to-r ${gradient}`} />
    </div>
  </motion.div>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const leadManager = useLeadManagement();
  const visibleTotal = leadManager.leads.length;
  const total = leadManager.pagination?.total ?? visibleTotal;
  const newLeads = leadManager.leads.filter((lead) => lead.status === LeadStatus.NEW).length;
  const qualifiedLeads = leadManager.leads.filter(
    (lead) => lead.status === LeadStatus.QUALIFIED
  ).length;
  const lostLeads = leadManager.leads.filter((lead) => lead.status === LeadStatus.LOST).length;

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Leads Pipeline
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your customer acquisition from real lead records.
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

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Leads"
          value={total}
          subtext="All records matching filters"
          icon={Users}
          color="brand"
          gradient="from-brand-500 to-indigo-500"
          delay={0.1}
        />
        <MetricCard
          title="New Leads"
          value={newLeads}
          subtext={`${visibleTotal} visible on this page`}
          icon={CircleDot}
          color="blue"
          gradient="from-blue-500 to-cyan-500"
          delay={0.2}
        />
        <MetricCard
          title="Qualified"
          value={qualifiedLeads}
          subtext={`${visibleTotal} visible on this page`}
          icon={Target}
          color="emerald"
          gradient="from-emerald-500 to-teal-500"
          delay={0.3}
        />
        <MetricCard
          title="Lost"
          value={lostLeads}
          subtext={`${visibleTotal} visible on this page`}
          icon={XCircle}
          color="amber"
          gradient="from-amber-500 to-orange-500"
          delay={0.4}
        />
      </div>

      <LeadManagementPanel
        manager={leadManager}
        role={user?.role ?? UserRole.SALES}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;
