export interface IStandardResponse {
  data: {};
  success: boolean;
}
export interface IServiceResponse {
  data: Array<Iservice>;
  success: boolean;
}

interface Iservice {
  id: number;
  name: string;
  price: number;
  product_categories: Array<{
    name: string;
  }>;
}

export interface ISaleCustomerHistory {
  id: number;
  paid: string;
  total_amount: string;
  finalized_at: Date;
  sold_products: Array<ISoldProducts>;
  status: string | null;
  clients: IClient;
}

export interface ISoldProducts {
  id: number;
  price: number;
  qty: number;
  products: {
    id: number;
    name: string;
  };
}

export interface IClient {
  id: number;
  name: string;
  phone: number;
}

export interface ISaleCustomerHistoryServiceResponse {
  data: Array<ISaleCustomerHistory>;
  success: boolean;
}
