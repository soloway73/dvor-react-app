export interface User {
  username: string;
  role: 'admin' | 'user';
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
