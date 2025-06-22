import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'guest' | 'host' | 'both';
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  verified: boolean;
  phone?: string;
  bio?: string;
  location?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    const authData = response.data.data;
    
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    
    return authData;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    const authData = response.data.data;
    
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    
    return authData;
  }

  async getMe(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile', data);
    const user = response.data.data.user;
    
    localStorage.setItem('user', JSON.stringify(user));
    
    return user;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();