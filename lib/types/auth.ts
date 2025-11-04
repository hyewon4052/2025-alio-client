// Auth API Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  tokenResponse: TokenResponse;
  detail: boolean;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

