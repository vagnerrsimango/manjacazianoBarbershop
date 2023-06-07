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
