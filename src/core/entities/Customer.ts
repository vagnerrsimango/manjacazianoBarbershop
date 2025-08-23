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
