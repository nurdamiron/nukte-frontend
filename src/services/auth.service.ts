import BaseService from './base.service';
import { API_ENDPOINTS } from '../config/api.config';
import { setAuthToken, removeAuthToken } from '../config/axios.config';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '../types/api.types';


class AuthService extends BaseService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    
    // Save tokens
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    setAuthToken(response.accessToken);
    
    return response;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    
    // Save tokens
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    setAuthToken(response.accessToken);
    
    return response;
  }

  async getMe(): Promise<User> {
    const user = await this.get<User>(API_ENDPOINTS.AUTH.ME);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const user = await this.put<User>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  async logout(): Promise<void> {
    try {
      await this.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return await this.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    return await this.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
  }

  async sendVerificationCode(): Promise<{ message: string }> {
    return await this.post(API_ENDPOINTS.AUTH.SEND_VERIFICATION);
  }

  async verifyEmail(code: string): Promise<{ user: User; message: string }> {
    const response = await this.post<{ user: User; message: string }>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { code });
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  }
}

export const authService = new AuthService();
export default authService;