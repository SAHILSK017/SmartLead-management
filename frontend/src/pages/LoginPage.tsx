import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GitBranch,
  KeyRound,
  LockKeyhole,
  Mail,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { cn } from '../utils/cn';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid work email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Use at least 6 characters'),
  remember: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type FieldName = 'email' | 'password';

const inputBase =
  'peer w-full rounded-2xl border border-white/10 bg-white/[0.045] px-12 pb-3.5 pt-6 text-sm text-[#F9FAFB] outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-transparent hover:border-white/20 focus:border-violet-400/70 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(124,58,237,0.12),0_0_34px_rgba(124,58,237,0.18)]';

const fieldVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const passwordChecks = [
  { label: '6+ characters', test: (value: string) => value.length >= 6 },
];

const FloatingField = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
    icon: React.ReactNode;
    label: string;
    name: FieldName;
    isValid?: boolean;
    rightSlot?: React.ReactNode;
  }
>(({ error, icon, id, isValid, label, rightSlot, ...props }, ref) => (
  <div className="space-y-2">
    <div className="group relative">
      <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-[#9CA3AF] transition-colors group-focus-within:text-violet-300">
        {icon}
      </span>
      <input
        ref={ref}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          inputBase,
          rightSlot ? 'pr-24' : 'pr-12',
          error &&
            'border-red-400/70 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.12)]',
          isValid && !error && 'border-emerald-400/40'
        )}
        placeholder={label}
        {...props}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-12 top-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-[#9CA3AF] transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2.5 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.16em] peer-focus:text-violet-200"
      >
        {label}
      </label>
      <div className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2">
        {isValid && !error ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : null}
        {rightSlot}
      </div>
    </div>
    <AnimatePresence initial={false}>
      {error ? (
        <motion.p
          id={`${id}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="flex items-center gap-2 text-xs text-red-300"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </motion.p>
      ) : null}
    </AnimatePresence>
  </div>
));
FloatingField.displayName = 'FloatingField';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    formState: { errors, isSubmitting, isValid, touchedFields },
    handleSubmit,
    register,
    trigger,
    control,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const email = useWatch({ control, name: 'email' });
  const password = useWatch({ control, name: 'password' });
  const passedChecks = useMemo(
    () => passwordChecks.filter((check) => check.test(password)).length,
    [password]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (email || touchedFields.email) void trigger('email');
      if (password || touchedFields.password) void trigger('password');
    }, 250);

    return () => window.clearTimeout(timer);
  }, [email, password, touchedFields.email, touchedFields.password, trigger]);

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitState('idle');
    try {
      const { user, token } = await authApi.login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      login(user, token, values.remember);
      setSubmitState('success');
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'We could not verify those credentials.';
      setSubmitState('error');
      toast.error(message);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#0B0F19] text-[#F9FAFB]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(124,58,237,0.18),transparent_30%),linear-gradient(135deg,rgba(17,24,39,0.24),rgba(11,15,25,1))]" />
      <motion.div
        aria-hidden="true"
        className="absolute left-[8%] top-[12%] h-48 w-48 rounded-full bg-violet-600/10 blur-3xl"
        animate={{ y: [0, 22, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[12%] right-[10%] h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl"
        animate={{ y: [0, -24, 0], x: [0, 14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden min-h-screen border-r border-white/10 px-10 py-10 lg:flex lg:flex-col xl:px-16">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/30 bg-gradient-to-br from-violet-600 to-indigo-600 shadow-[0_0_34px_rgba(124,58,237,0.45)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-white">GIGFLOW</p>
              <p className="text-xs text-[#9CA3AF]">GigFlow</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center py-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-slate-300 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.9)]" />
                Trusted workspace access
              </div>
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-normal text-white xl:text-6xl">
                Manage leads without the busywork
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#9CA3AF]">
                GigFlow gives sales teams one clear place to qualify accounts,
                protect follow-ups, and understand pipeline health.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.12 } } }}
              className="relative mt-12 max-w-3xl"
            >
              <motion.div
                variants={fieldVariants}
                className="rounded-[28px] border border-white/10 bg-[#111827]/80 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur-2xl"
              >
                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">GigFlow workspace</p>
                      <p className="text-xs text-[#9CA3AF]">Lead management overview</p>
                    </div>
                    <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">
                      Live
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      ['Capture', 'Ready', 'website forms'],
                      ['Qualify', 'Focused', 'sales stages'],
                      ['Follow up', 'Tracked', 'team activity'],
                    ].map(([label, value, meta]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/10 bg-white/[0.045] p-4"
                      >
                        <p className="text-xs text-[#9CA3AF]">{label}</p>
                        <p className="mt-2 text-xl font-semibold text-white">{value}</p>
                        <p className="mt-1 text-[11px] text-violet-200/80">{meta}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 grid grid-cols-[1fr_0.65fr] gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex h-32 items-end gap-2">
                        {[42, 58, 36, 74, 66, 88, 78, 96, 82].map((height, index) => (
                          <motion.span
                            key={height + index}
                            className="flex-1 rounded-t-lg bg-gradient-to-t from-violet-700 to-indigo-300"
                            initial={{ height: 12 }}
                            animate={{ height }}
                            transition={{ duration: 0.7, delay: index * 0.05 }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <Users className="h-4 w-4 text-violet-200" />
                        <p className="mt-3 text-lg font-semibold">Team</p>
                        <p className="text-xs text-[#9CA3AF]">Assigned ownership</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <TrendingUp className="h-4 w-4 text-emerald-200" />
                        <p className="mt-3 text-lg font-semibold">Pipeline</p>
                        <p className="text-xs text-[#9CA3AF]">Status tracking</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
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
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <h2 className="text-3xl font-semibold tracking-normal text-white">
                  Welcome Back
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#9CA3AF]">
                  Continue to your workspace with secure CRM access.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.075] focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                  <span className="text-base font-semibold">G</span>
                  Google
                </button>
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.075] focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                  <GitBranch className="h-4 w-4" />
                  GitHub
                </button>
              </div>

              <div className="my-6 flex items-center gap-3 text-xs text-[#9CA3AF]">
                <span className="h-px flex-1 bg-white/10" />
                <span>or continue with email</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <motion.form
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                <motion.div variants={fieldVariants}>
                  <FloatingField
                    id="login-email"
                    label="Work email"
                    type="email"
                    autoComplete="email"
                    icon={<Mail className="h-4 w-4" />}
                    error={errors.email?.message}
                    isValid={Boolean(email) && !errors.email}
                    {...register('email')}
                  />
                </motion.div>

                <motion.div variants={fieldVariants} className="space-y-3">
                  <FloatingField
                    id="login-password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    icon={<KeyRound className="h-4 w-4" />}
                    error={errors.password?.message}
                    isValid={Boolean(password) && !errors.password}
                    rightSlot={
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((value) => !value)}
                        className="rounded-lg p-1 text-[#9CA3AF] transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                    {...register('password')}
                  />
                  <div className="grid grid-cols-4 gap-2" aria-hidden="true">
                    {passwordChecks.map((check, index) => (
                      <span
                        key={check.label}
                        className={cn(
                          'h-1 rounded-full bg-white/10 transition-all duration-300',
                          passedChecks > index &&
                            'bg-gradient-to-r from-violet-500 to-indigo-400 shadow-[0_0_16px_rgba(124,58,237,0.45)]'
                        )}
                      />
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  variants={fieldVariants}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <label className="inline-flex cursor-pointer items-center gap-2 text-[#9CA3AF]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500"
                      {...register('remember')}
                    />
                    Remember me
                  </label>
                  <Link
                    to="/forgot-password"
                    className="font-medium text-violet-200 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                <motion.button
                  variants={fieldVariants}
                  whileHover={!isValid || isSubmitting ? undefined : { scale: 1.01 }}
                  whileTap={!isValid || isSubmitting ? undefined : { scale: 0.98 }}
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  className="group relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-2xl border border-violet-300/20 bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(79,70,229,0.24)] transition duration-300 hover:shadow-[0_18px_50px_rgba(79,70,229,0.32)] focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 group-hover:translate-x-[120%]" />
                  <span className="relative flex items-center gap-2">
                    {isSubmitting ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : submitState === 'success' ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : null}
                    {isSubmitting ? 'Securing session...' : 'Sign in securely'}
                    {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
                  </span>
                </motion.button>

                <AnimatePresence initial={false}>
                  {submitState === 'error' ? (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                    >
                      Sign-in failed. Check your email and password, then try again.
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </motion.form>

              <p className="mt-7 text-center text-sm text-[#9CA3AF]">
                New to GigFlow?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-violet-200 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                >
                  Create workspace
                </Link>
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
