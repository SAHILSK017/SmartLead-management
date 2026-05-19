import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  rememberSession: boolean;
  login: (user: User, token: string, remember?: boolean) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      rememberSession: true,

      login: (user, token, remember = true) => {
        set({ user, token, rememberSession: remember });
      },

      logout: () => set({ user: null, token: null, rememberSession: true }),

      isAuthenticated: () => !!get().token && !!get().user,
    }),
    {
      name: 'smart-leads-auth',
      partialize: (state) =>
        state.rememberSession
          ? {
              user: state.user,
              token: state.token,
              rememberSession: state.rememberSession,
            }
          : { user: null, token: null, rememberSession: true },
    }
  )
);
