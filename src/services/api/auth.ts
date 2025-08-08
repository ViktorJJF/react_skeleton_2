import apiClient from "@/services/api/apiClient";
import type {
  AuthSuccessResponse,
  MeResponse,
  TokenResponse,
  LoginRequest,
  RegisterRequest,
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
};

export default authApi;
