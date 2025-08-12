export type UserRole =
  | 'USER'
  | 'ADMIN'
  | 'SUPERADMIN'
  | 'user'
  | 'admin'
  | 'superadmin';

// Raw API user response from /me endpoint
export interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  verification: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

// Raw API user response from /login endpoint
export interface ApiLoginUser {
  id: number;
  email: string;
  role: UserRole;
  verified: boolean;
  verification: string;
}

// Normalized user interface used internally
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type AuthUser = User;
