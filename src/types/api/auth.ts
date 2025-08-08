import type { ApiUser, ApiLoginUser } from "@/types/entities/user";

// Actual login response format
export interface AuthSuccessResponse {
  token: string;
  user: ApiLoginUser;
}

// Actual /me response format
export interface MeResponse extends ApiUser {}

// Actual /token response format
export interface TokenResponse {
  token: string;
}

export interface AuthErrorField {
  field: string;
  message: string;
}

export interface AuthValidationErrorResponse {
  success: false;
  errors: AuthErrorField[];
}

export interface AuthMessageErrorResponse {
  success: false;
  errors: { msg: string };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  bio?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SocialLoginRequest {
  accessToken: string;
  provider?: "google";
}
