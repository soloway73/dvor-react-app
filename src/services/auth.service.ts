import { User } from '../types/auth.types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authService = {
  async validateCredentials(username: string, password: string): Promise<boolean> {
    const token = btoa(`${username}:${password}`);
    
    try {
      const response = await fetch(`${BASE_URL}/api/v3/paths/list`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${token}`,
        },
      });

      if (response.ok) {
        localStorage.setItem('auth_token', token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  async getCurrentUser(token: string): Promise<User> {
    const decoded = atob(token);
    const [username] = decoded.split(':');
    return { username, role: username === 'admin' ? 'admin' : 'user' };
  },
};
