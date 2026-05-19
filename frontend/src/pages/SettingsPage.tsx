import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Bell, Building2, Moon, Save, Shield } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/auth.store';

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [workspace, setWorkspace] = useState('GigFlow Workspace');
  const [notify, setNotify] = useState(true);
  const [compact, setCompact] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    window.localStorage.setItem(
      'gigflow-settings',
      JSON.stringify({ workspace, notify, compact })
    );
    toast.success('Settings saved');
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure workspace preferences and account security.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-border dark:bg-surface">
          <div className="mb-5 flex items-center gap-3">
            <Building2 className="h-5 w-5 text-brand-500" />
            <h2 className="font-semibold text-slate-950 dark:text-white">Workspace</h2>
          </div>
          <div className="space-y-5">
            <Input
              id="workspace-name"
              label="Workspace name"
              value={workspace}
              onChange={(event) => setWorkspace(event.target.value)}
            />
            <Input id="account-email" label="Account email" value={user?.email ?? ''} readOnly />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-border dark:bg-surface">
          <div className="mb-5 flex items-center gap-3">
            <Shield className="h-5 w-5 text-brand-500" />
            <h2 className="font-semibold text-slate-950 dark:text-white">Preferences</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-border">
              <span className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-slate-400" />
                <span>
                  <span className="block text-sm font-medium text-slate-900 dark:text-white">
                    Lead notifications
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Alert me when new leads arrive.
                  </span>
                </span>
              </span>
              <input
                type="checkbox"
                checked={notify}
                onChange={(event) => setNotify(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-border">
              <span className="flex items-center gap-3">
                <Moon className="h-4 w-4 text-slate-400" />
                <span>
                  <span className="block text-sm font-medium text-slate-900 dark:text-white">
                    Compact tables
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Reduce row spacing for dense workflows.
                  </span>
                </span>
              </span>
              <input
                type="checkbox"
                checked={compact}
                onChange={(event) => setCompact(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </label>
          </div>
          <Button type="submit" className="mt-6 w-full">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </section>
      </form>
    </DashboardLayout>
  );
};

export default SettingsPage;
