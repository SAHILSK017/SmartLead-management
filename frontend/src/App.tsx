import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './routes/AppRouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AppRouter />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        className: 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/60 dark:border-slate-800/50 shadow-xl dark:shadow-slate-950/40 rounded-2xl px-4.5 py-3.5 font-medium text-sm tracking-wide flex items-center gap-3 transition-all duration-300',
        success: {
          iconTheme: {
            primary: '#6366f1',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  </QueryClientProvider>
);

export default App;
