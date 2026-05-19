import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Lead, LeadSource, LeadStatus } from '../../types';
import { useCreateLead, useUpdateLead } from '../../hooks/useLeads';
import toast from 'react-hot-toast';
import { AtSign, ChevronDown, Globe2, Mail, UserRound } from 'lucide-react';
import { cn } from '../../utils/cn';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  status: z.nativeEnum(LeadStatus),
  source: z.nativeEnum(LeadSource),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, lead }) => {
  const isEditing = !!lead;
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: lead?.name ?? '',
      email: lead?.email ?? '',
      status: lead?.status ?? LeadStatus.NEW,
      source: lead?.source ?? LeadSource.WEBSITE,
    },
    values: lead
      ? { name: lead.name, email: lead.email, status: lead.status, source: lead.source }
      : undefined,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (values: LeadFormValues) => {
    try {
      if (isEditing && lead) {
        await updateLead.mutateAsync({ id: lead._id, payload: values });
        toast.success('Lead updated successfully');
      } else {
        await createLead.mutateAsync(values);
        toast.success('Lead created successfully');
      }
      handleClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Something went wrong';
      toast.error(message);
    }
  };

  const isPending = createLead.isPending || updateLead.isPending;
  const fieldClass =
    'h-12 w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-11 text-sm text-slate-950 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/[0.045] dark:text-white dark:placeholder:text-slate-500 dark:hover:border-white/20 dark:focus:border-violet-400 dark:focus:bg-white/[0.07] dark:focus:ring-violet-500/10';

  const renderError = (message?: string) =>
    message ? <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-300">{message}</p> : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Lead' : 'Add New Lead'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.035]">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white shadow-glow-brand">
              <AtSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                {isEditing ? 'Update contact details' : 'Create a qualified lead record'}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Keep the lead name, source, and stage clean so the pipeline stays easy to scan.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Lead name
            </span>
            <span className="relative block">
              <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="lead-name"
                className={cn(fieldClass, errors.name && 'border-red-400 focus:border-red-400 focus:ring-red-500/10')}
                placeholder="John Doe"
                autoComplete="name"
                {...register('name')}
              />
            </span>
            {renderError(errors.name?.message)}
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Email address
            </span>
            <span className="relative block">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="lead-email"
                type="email"
                className={cn(fieldClass, errors.email && 'border-red-400 focus:border-red-400 focus:ring-red-500/10')}
                placeholder="john@example.com"
                autoComplete="email"
                {...register('email')}
              />
            </span>
            {renderError(errors.email?.message)}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Status
              </span>
              <span className="relative block">
                <AtSign className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  id="lead-status"
                  className={cn(fieldClass, 'appearance-none pr-10 capitalize')}
                  {...register('status')}
                >
                  {Object.values(LeadStatus).map((s) => (
                    <option key={s} value={s} className="bg-white text-slate-950 dark:bg-[#111827] dark:text-white">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </span>
              {renderError(errors.status?.message)}
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Source
              </span>
              <span className="relative block">
                <Globe2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  id="lead-source"
                  className={cn(fieldClass, 'appearance-none pr-10 capitalize')}
                  {...register('source')}
                >
                  {Object.values(LeadSource).map((s) => (
                    <option key={s} value={s} className="bg-white text-slate-950 dark:bg-[#111827] dark:text-white">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </span>
              {renderError(errors.source?.message)}
            </label>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-white/10 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={handleClose} className="sm:min-w-24">
            Cancel
          </Button>
          <Button type="submit" loading={isPending} className="sm:min-w-36">
            {isEditing ? 'Update Lead' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
