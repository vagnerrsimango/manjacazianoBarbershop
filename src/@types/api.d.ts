// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
}

// Customer Types
export interface Customer {
  id: number;
  name: string;
  phone: string;
  birthday: string;
  balance: number;
  total_purchases: number;
  total_paid: number;
  last_purchase?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreateRequest {
  name: string;
  phone: string;
  birthday: string;
}

export interface CustomerUpdateRequest {
  id: number;
  name: string;
  phone: string;
  birthday: string;
}

// User Management Types
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

// Transaction Types
export interface Transaction {
  id: number;
  type: "DEBT" | "PAYMENT";
  title: string;
  reference: string;
  client_id: number;
  payment_method_id: number;
  amount: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface TransactionWithRelations extends Transaction {
  clients: {
    id: number;
    name: string;
    phone: string;
    balance: number;
  };
  payment_methods: {
    name: string;
  };
  users: {
    name: string;
  };
}

// Debt Management Types
export interface DebtRequest {
  clientId: number;
  amount: number;
  description: string;
  paymentMethodId: number;
  userId: number;
}

export interface PaymentRequest {
  clientId: number;
  amount: number;
  description: string;
  paymentMethodId: number;
  userId: number;
}

export interface DebtResponse {
  customer: Customer;
  transaction: Transaction;
}

export interface DebtHistoryResponse {
  customer: {
    id: number;
    name: string;
    current_balance: number;
  };
  transactions: TransactionWithRelations[];
}

// Search and List Types
export interface CustomerSearchParams {
  query: string;
}

export interface UserSearchParams {
  query: string;
}

export interface DebtsListParams {
  sort?: "asc" | "desc";
}

export interface DebtsListResponse {
  total_debts: number;
  total_amount: number;
  debts: TransactionWithRelations[];
}

// Error Types
export interface ApiError {
  data: string;
  success: false;
  status?: number;
}
