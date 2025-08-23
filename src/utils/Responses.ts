export interface IStandardResponse {
  data: {};
  success: boolean;
}

interface IService {
  id: number;
  name: string;
  price: number;
  product_categories: Array<{
    name: string;
  }>;
}

interface IServiceCategories {
  comboService?: IService[];
  beardService?: IService[];
  hairService?: IService[];
  extraService?: IService[];
}

export interface IServiceResponse {
  data: IServiceCategories;
  success: boolean;
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
