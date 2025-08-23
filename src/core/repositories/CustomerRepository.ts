import {
  Customer,
  CustomerCreateRequest,
  CustomerUpdateRequest,
} from "../entities/Customer";

export interface CustomerRepository {
  getAllCustomers(): Promise<Customer[]>;
  getCustomerById(id: number): Promise<Customer>;
  createCustomer(data: CustomerCreateRequest): Promise<Customer>;
  updateCustomer(data: CustomerUpdateRequest): Promise<Customer>;
  deleteCustomer(id: number): Promise<string>;
  searchCustomers(query: string): Promise<Customer[]>;
}
