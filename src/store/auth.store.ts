import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthCredentials } from '../types/auth.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (credentials) => {
        // Токен уже сохранен в authService.validateCredentials
        // Здесь только обновляем состояние
        set({
          user: { username: credentials.username, role: credentials.username === 'admin' ? 'admin' : 'user' },
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: () => {
        const token = localStorage.getItem('auth_token');
        return !!token;
      },

      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },
    }),
    { name: 'auth-storage' }
  )
);
