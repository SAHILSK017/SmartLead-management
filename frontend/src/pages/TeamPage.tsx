import React from 'react';
import { Mail, Shield, UserPlus } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/auth.store';

const TeamPage: React.FC = () => {
  const { user } = useAuthStore();
  const members = [
    {
      name: user?.name ?? 'Current User',
      email: user?.email ?? 'you@company.com',
      role: user?.role ?? 'sales',
      status: 'Active',
    },
    { name: 'Pipeline Owner', email: 'owner@gigflow.local', role: 'admin', status: 'Pending' },
    { name: 'Sales Rep', email: 'rep@gigflow.local', role: 'sales', status: 'Invited' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Team
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage workspace members and sales roles.
          </p>
        </div>
        <Button onClick={() => window.alert('Invite flow placeholder: connect email provider or backend invite endpoint.')}>
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-border dark:bg-surface">
        <div className="grid grid-cols-[1fr_140px_120px] border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:border-border/50 dark:text-slate-400">
          <span>Member</span>
          <span>Role</span>
          <span>Status</span>
        </div>
        {members.map((member) => (
          <div
            key={member.email}
            className="grid grid-cols-[1fr_140px_120px] items-center border-b border-slate-100 px-5 py-4 last:border-0 dark:border-border/40"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 text-sm font-bold text-white">
                {member.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{member.name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Mail className="h-3.5 w-3.5" />
                  {member.email}
                </p>
              </div>
            </div>
            <span className="flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-700 dark:bg-white/10 dark:text-slate-200">
              <Shield className="h-3.5 w-3.5" />
              {member.role}
            </span>
            <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              {member.status}
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default TeamPage;
