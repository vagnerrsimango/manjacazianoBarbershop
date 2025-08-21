export interface User {
  id: number;
  name: string;
  surname?: string;
  genre?: string;
  phone?: string;
  birthday?: string;
  balance: number;
  type: number;
  email?: string;
  email_verified_at?: string;
  licenseStart?: string;
  licenseEnd?: string;
  remember_token?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface UserCreateRequest {
  name: string;
  surname?: string;
  genre?: string;
  phone?: string;
  birthday?: string;
  type: number;
  email?: string;
  password: string;
  licenseStart?: string;
  licenseEnd?: string;
}

export interface UserUpdateRequest {
  id: number;
  name?: string;
  surname?: string;
  genre?: string;
  phone?: string;
  birthday?: string;
  type?: number;
  email?: string;
  licenseStart?: string;
  licenseEnd?: string;
}

export interface UserPasswordChangeRequest {
  id: number;
  newPassword: string;
}
