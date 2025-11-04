import apiClient from './client';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  TokenRefreshRequest,
} from '../types/auth';

// 로그인
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', data);
  return response.data;
};

// 회원가입
export const signup = async (data: SignupRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/signup', data);
  return response.data;
};

// 로그아웃
export const logout = async (data: TokenRefreshRequest): Promise<void> => {
  await apiClient.post('/auth/logout', data);
};

// 회원 탈퇴
export const quitUser = async (): Promise<void> => {
  await apiClient.delete('/auth/quit');
};

