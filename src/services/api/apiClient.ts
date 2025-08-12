import axios from 'axios';
import config from '@/config';
import { useAuthStore } from '@/store/authStore';

// Create Axios instance
export const apiClient = axios.create({
  baseURL: `${config.BACKEND_BASE_URL}`,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Attach access token
apiClient.interceptors.request.use((request) => {
  const token = useAuthStore.getState().token;
  if (token) {
    request.headers = request.headers || {};
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

// Handle 401 by trying refresh once
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  pendingQueue = [];
};

// Helper function to redirect to login
const redirectToLogin = (reason = 'unauthorized') => {
  // Clear auth store
  useAuthStore.getState().logout();

  // Navigate to login with reason
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname + window.location.search;
    const loginUrl = `/login?reason=${reason}&redirect=${encodeURIComponent(
      currentPath,
    )}`;

    // Use window.location.href for immediate redirect
    window.location.href = loginUrl;
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isMeEndpoint = originalRequest?.url?.includes('/api/me');
    const isTokenEndpoint = originalRequest?.url?.includes('/api/token');

    if (isUnauthorized && !originalRequest._retry) {
      // Special handling for /me endpoint - immediate redirect without retry
      if (isMeEndpoint) {
        console.warn(
          'Unauthorized access to /me endpoint - redirecting to login',
        );
        redirectToLogin('session_expired');
        return Promise.reject(error);
      }

      // For other endpoints, try refresh token flow
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token) => {
              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await apiClient.get('/api/token');
        const newToken = res.data?.token as string | undefined;
        if (newToken) {
          useAuthStore.getState().setToken(newToken);
        }
        processQueue(null, newToken || null);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);

        // If refresh token also fails, redirect to login
        console.warn('Refresh token failed - redirecting to login');
        redirectToLogin('token_expired');
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
