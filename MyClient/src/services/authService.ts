import apiClient from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔐 Attempting login for:', credentials.email);
    const response = await apiClient.post('/auth/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('✅ Login successful for:', credentials.email);
    }
    
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('📝 Attempting registration for:', userData.email);
    const response = await apiClient.post('/auth/register', userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('✅ Registration successful for:', userData.email);
    }
    
    return response.data;
  },

  logout(): void {
    console.log('🚪 User logged out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};