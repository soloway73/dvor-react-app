import { useCallback } from 'react';
import { useAuthStore } from '../store/auth.store';
import { authService } from '../services/auth.service';
import { AuthCredentials } from '../types/auth.types';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout, setUser } = useAuthStore();

  const validateCredentials = useCallback(async (credentials: AuthCredentials): Promise<boolean> => {
    return authService.validateCredentials(credentials.username, credentials.password);
  }, []);

  const checkAuth = useCallback(() => {
    return useAuthStore.getState().checkAuth();
  }, []);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    setUser,
    validateCredentials,
    checkAuth,
  };
};
