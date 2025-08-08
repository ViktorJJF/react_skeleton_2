import apiClient from "@/services/api/apiClient";
import type {
  AuthSuccessResponse,
  MeResponse,
  TokenResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/types/api/auth";

const authApi = {
  login(payload: LoginRequest) {
    return apiClient
      .post<AuthSuccessResponse>("/api/login", payload)
      .then((r) => r.data);
  },
  register(payload: RegisterRequest) {
    return apiClient
      .post<AuthSuccessResponse>("/api/register", payload)
      .then((r) => r.data);
  },
  me() {
    return apiClient.get<MeResponse>("/api/me").then((r) => r.data);
  },
  refreshToken() {
    return apiClient.get<TokenResponse>("/api/token").then((r) => r.data);
  },
  updateProfile(payload: UpdateProfileRequest) {
    return apiClient.patch<MeResponse>("/api/me", payload).then((r) => r.data);
  },
  changePassword(payload: ChangePasswordRequest) {
    return apiClient
      .patch<{ success: boolean; message: string }>("/api/me/password", payload)
      .then((r) => r.data);
  },
};

export default authApi;
