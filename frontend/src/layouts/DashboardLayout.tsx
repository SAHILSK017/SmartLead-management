import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, BarChart3, 
  GitMerge, Users2, Settings, 
  Search, Bell, Moon, Sun, Menu, ChevronLeft, LogOut, Settings as SettingsIcon, UserRound
} from 'lucide-react';
import { cn } from '../utils/cn';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setDark((prev) => !prev);
  };

  useEffect(() => {
    if (!profileOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProfileOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileOpen]);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Leads', icon: Users, path: '/leads' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Pipeline', icon: GitMerge, path: '/pipeline' },
    { name: 'Team', icon: Users2, path: '/team' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-background overflow-hidden selection:bg-brand-500/30">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: sidebarOpen ? 260 : 80 }}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative z-40 hidden h-screen flex-col border-r border-slate-200 dark:border-border bg-white dark:bg-surface/80 dark:backdrop-blur-xl md:flex shadow-xl shadow-brand-500/5"
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-border/50">
          <Link to="/dashboard" className="flex items-center gap-3 group overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-glow-brand group-hover:scale-105 transition-transform duration-300">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="whitespace-nowrap font-bold text-lg text-slate-900 dark:text-white tracking-tight"
                >
                  Smart<span className="text-brand-600 dark:text-brand-400">Leads</span>
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-5 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 dark:border-border bg-white dark:bg-surface text-slate-500 shadow-sm hover:text-brand-500 transition-colors"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", !sidebarOpen && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 group",
                  isActive
                    ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                )}
                title={!sidebarOpen ? item.name : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500/10 to-transparent border-l-2 border-brand-500"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300", isActive ? "scale-110 shadow-glow-brand rounded-full" : "group-hover:scale-110")} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap font-medium text-sm"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-border/50">
          <div className={cn("flex items-center rounded-xl bg-slate-100 dark:bg-slate-800/50 p-2 transition-all", sidebarOpen ? "gap-3" : "justify-center")}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 text-white font-bold text-sm shadow-md">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</span>
                <span className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.role}</span>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Sticky Navbar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200/80 dark:border-border/80 bg-white/80 dark:bg-surface/60 px-4 shadow-sm backdrop-blur-xl transition-all sm:gap-x-6 sm:px-6 lg:px-8">
          <button className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            <Menu className="h-6 w-6" />
          </button>

          {/* Global Search */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <form className="relative flex flex-1" action="#" method="GET">
              <label htmlFor="search-field" className="sr-only">Search</label>
              <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400" aria-hidden="true" />
              <input
                id="search-field"
                className="block h-full w-full border-0 py-0 pl-8 pr-0 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm"
                placeholder="Search leads, pipelines, or command... (⌘K)"
                type="search"
                name="search"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 font-sans text-xs font-medium text-slate-400">
                  ⌘ K
                </kbd>
              </div>
            </form>
          </div>

          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleDark}
              className="relative p-2 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={dark ? "dark" : "light"}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {dark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-500 shadow-glow-brand animate-pulse"></span>
            </button>

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-700" aria-hidden="true" />

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="flex items-center gap-x-3 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    role="menu"
                    className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 dark:border-border dark:bg-surface dark:shadow-black/30"
                  >
                    <div className="border-b border-slate-100 p-4 dark:border-border/60">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 text-sm font-bold text-white shadow-glow-brand">
                          {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                            {user?.name}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold capitalize text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                        {user?.role}
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/settings');
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/70"
                      >
                        <SettingsIcon className="h-4 w-4 text-slate-400" />
                        Account settings
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/team');
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/70"
                      >
                        <UserRound className="h-4 w-4 text-slate-400" />
                        Team profile
                      </button>
                    </div>

                    <div className="border-t border-slate-100 p-2 dark:border-border/60">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};
