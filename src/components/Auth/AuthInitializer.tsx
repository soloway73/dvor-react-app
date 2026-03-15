import { useEffect } from 'react';
import { useAuthStore } from '../../store/auth.store';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token && !isAuthenticated) {
      try {
        const decoded = atob(token);
        const [username] = decoded.split(':');
        if (username) {
          setUser({
            username,
            role: username === 'admin' ? 'admin' : 'user',
          });
        }
      } catch (error) {
        console.error('Failed to parse auth token:', error);
        localStorage.removeItem('auth_token');
      }
    }
  }, [setUser, isAuthenticated]);

  return <>{children}</>;
};
