import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, KeyRound, Mail, Sparkles, User, Users } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '../types';
import { cn } from '../utils/cn';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid work email'),
  password: z
    .string()
    .min(6, 'Use at least 6 characters'),
  role: z.nativeEnum(UserRole),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-white/[0.045] px-12 py-4 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 hover:border-white/20 focus:border-violet-400/70 focus:bg-white/[0.07] focus:ring-4 focus:ring-violet-500/10';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
    register,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', role: UserRole.SALES },
    mode: 'onChange',
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const { user, token } = await authApi.register({
        ...values,
        email: values.email.trim().toLowerCase(),
        name: values.name.trim(),
      });
      login(user, token);
      toast.success(`Welcome, ${user.name}!`);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Registration failed';
      toast.error(message);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#0B0F19] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(124,58,237,0.16),transparent_28%),linear-gradient(135deg,rgba(17,24,39,0.28),rgba(11,15,25,1))]" />
      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden border-r border-white/10 px-12 py-10 lg:flex lg:flex-col">
          <Link to="/login" className="flex w-fit items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.22em]">GIGFLOW</p>
              <p className="text-xs text-[#9CA3AF]">GigFlow</p>
            </div>
          </Link>

          <div className="flex flex-1 flex-col justify-center">
            <p className="mb-4 text-sm font-medium text-violet-200">Workspace setup</p>
            <h1 className="max-w-xl text-5xl font-semibold leading-[1.08] tracking-normal">
              Start with a clean CRM foundation.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#9CA3AF]">
              Create a secure GigFlow workspace for your sales team, then invite
              reps, import leads, and keep ownership clear from day one.
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-3">
              {[
                ['Role-based access', 'Admins and reps stay in their lane.'],
                ['Secure sessions', 'Cookie-ready auth with API validation.'],
                ['CRM-ready data', 'Structured accounts, sources, and status.'],
                ['Focused pipeline', 'Less clutter, faster follow-up.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-2 text-xs leading-5 text-[#9CA3AF]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-[460px]"
          >
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-[0.22em]">GIGFLOW</p>
                <p className="text-xs text-[#9CA3AF]">GigFlow</p>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#111827]/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:p-8">
              <div className="mb-8">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-violet-100">
                  <Building2 className="h-5 w-5" />
                </div>
                <h2 className="text-3xl font-semibold tracking-normal">Create workspace</h2>
                <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">
                  Set up your GigFlow account with secure team access.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-[#9CA3AF]">
                    Full name
                  </span>
                  <span className="relative block">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                    <input className={inputClass} placeholder="Avery Stone" {...register('name')} />
                  </span>
                  {errors.name ? <span className="mt-2 block text-xs text-red-300">{errors.name.message}</span> : null}
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-[#9CA3AF]">
                    Work email
                  </span>
                  <span className="relative block">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      type="email"
                      autoComplete="email"
                      className={inputClass}
                      placeholder="avery@company.com"
                      {...register('email')}
                    />
                  </span>
                  {errors.email ? <span className="mt-2 block text-xs text-red-300">{errors.email.message}</span> : null}
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-[#9CA3AF]">
                    Password
                  </span>
                  <span className="relative block">
                    <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      type="password"
                      autoComplete="new-password"
                      className={inputClass}
                      placeholder="Minimum 6 characters"
                      {...register('password')}
                    />
                  </span>
                  {errors.password ? (
                    <span className="mt-2 block text-xs text-red-300">{errors.password.message}</span>
                  ) : null}
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-[#9CA3AF]">
                    Role
                  </span>
                  <span className="relative block">
                    <Users className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                    <select className={cn(inputClass, 'appearance-none')} {...register('role')}>
                      <option className="bg-[#111827]" value={UserRole.SALES}>
                        Sales
                      </option>
                      <option className="bg-[#111827]" value={UserRole.ADMIN}>
                        Admin
                      </option>
                    </select>
                  </span>
                </label>

                <motion.button
                  whileHover={!isValid || isSubmitting ? undefined : { scale: 1.01 }}
                  whileTap={!isValid || isSubmitting ? undefined : { scale: 0.98 }}
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold shadow-[0_14px_40px_rgba(79,70,229,0.24)] transition hover:shadow-[0_18px_50px_rgba(79,70,229,0.32)] focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : null}
                  Create workspace
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </form>

              <p className="mt-7 text-center text-sm text-[#9CA3AF]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-violet-200 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
