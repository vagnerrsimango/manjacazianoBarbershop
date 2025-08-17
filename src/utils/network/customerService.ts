import api from "./api";
import { API_ENDPOINTS, API_CONFIG } from "./constants";
import {
  ResponseHandler,
  RetryHandler,
  ResponseTransformer,
} from "./responseHandler";
import {
  ApiResponse,
  Customer,
  CustomerCreateRequest,
  CustomerUpdateRequest,
  DebtRequest,
  PaymentRequest,
  DebtResponse,
  DebtHistoryResponse,
  CustomerSearchParams,
  DebtsListParams,
  DebtsListResponse,
  ApiError,
} from "../../@types/api";

// Cache for performance optimization
const cache = new Map<string, { data: any; timestamp: number }>();

// Helper function to get cache key
const getCacheKey = (endpoint: string, params?: any): string => {
  return `${endpoint}${params ? JSON.stringify(params) : ""}`;
};

// Helper function to check if cache is valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < API_CONFIG.CACHE_DURATION;
};

// Helper function to clear cache
export const clearCache = (): void => {
  cache.clear();
};

// Helper function to clear specific cache entries
export const clearCacheByPattern = (pattern: string): void => {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
};

/**
 * Customer Service - Handles all customer-related API operations
 * Implements caching for better performance, proper error handling, and retry logic
 */
export class CustomerService {
  private static instance: CustomerService;

  private constructor() {}

  public static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  /**
   * Create a new customer
   */
  async createCustomer(
    data: CustomerCreateRequest
  ): Promise<ApiResponse<Customer>> {
    try {
      const response = await RetryHandler.executeWithRetry(
        () =>
          api.post<ApiResponse<Customer>>(API_ENDPOINTS.CUSTOMERS.CREATE, data),
        API_CONFIG.MAX_RETRIES,
        API_CONFIG.RETRY_DELAY
      );

      const result = ResponseHandler.handleSuccess(response);

      // Clear customer list cache when creating new customer
      clearCacheByPattern(API_ENDPOINTS.CUSTOMERS.BASE);

      return result;
    } catch (error: any) {
      throw ResponseHandler.handleError(error);
    }
  }

  /**
   * Get all customers with caching for performance
   */
  async getAllCustomers(): Promise<ApiResponse<Customer[]>> {
    const cacheKey = getCacheKey(API_ENDPOINTS.CUSTOMERS.GET_ALL);
    const cached = cache.get(cacheKey);

    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await RetryHandler.executeWithRetry(
        () => api.get<ApiResponse<Customer[]>>(API_ENDPOINTS.CUSTOMERS.GET_ALL),
        API_CONFIG.MAX_RETRIES,
        API_CONFIG.RETRY_DELAY
      );

      const result = ResponseHandler.handleSuccess(response);

      // Transform dates and cache the response
      const transformedResult = {
        ...result,
        data: ResponseTransformer.transformDates(result.data),
      };

      cache.set(cacheKey, {
        data: transformedResult,
        timestamp: Date.now(),
      });

      return transformedResult;
    } catch (error: any) {
      throw ResponseHandler.handleError(error);
    }
  }

  /**
   * Get customer by ID with caching
   */
  async getCustomerById(id: number): Promise<ApiResponse<Customer>> {
    const cacheKey = getCacheKey(API_ENDPOINTS.CUSTOMERS.GET_BY_ID(id));
    const cached = cache.get(cacheKey);

    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await RetryHandler.executeWithRetry(
        () =>
          api.get<ApiResponse<Customer>>(API_ENDPOINTS.CUSTOMERS.GET_BY_ID(id)),
        API_CONFIG.MAX_RETRIES,
        API_CONFIG.RETRY_DELAY
      );

      const result = ResponseHandler.handleSuccess(response);

      // Transform dates and cache the response
      const transformedResult = {
        ...result,
        data: ResponseTransformer.transformDates(result.data),
      };

      cache.set(cacheKey, {
        data: transformedResult,
        timestamp: Date.now(),
      });

      return transformedResult;
    } catch (error: any) {
      throw ResponseHandler.handleError(error);
    }
  }

  /**
   * Update customer information
   */
  async updateCustomer(
    data: CustomerUpdateRequest
  ): Promise<ApiResponse<Customer>> {
    try {
      const response = await RetryHandler.executeWithRetry(
        () =>
          api.put<ApiResponse<Customer>>(API_ENDPOINTS.CUSTOMERS.UPDATE, data),
        API_CONFIG.MAX_RETRIES,
        API_CONFIG.RETRY_DELAY
      );

      const result = ResponseHandler.handleSuccess(response);

      // Clear related caches
      clearCacheByPattern(API_ENDPOINTS.CUSTOMERS.BASE);
      clearCacheByPattern(API_ENDPOINTS.CUSTOMERS.GET_BY_ID(data.id));

      return result;
    } catch (error: any) {
      throw ResponseHandler.handleError(error);
    }
  }

  /**
   * Delete customer (soft delete)
   */
  async deleteCustomer(id: number): Promise<ApiResponse<string>> {
    try {
      const response = await RetryHandler.executeWithRetry(
        () =>
          api.delete<ApiResponse<string>>(API_ENDPOINTS.CUSTOMERS.DELETE(id)),
        API_CONFIG.MAX_RETRIES,
        API_CONFIG.RETRY_DELAY
      );

      const result = ResponseHandler.handleSuccess(response);

      // Clear related caches
      clearCacheByPattern(API_ENDPOINTS.CUSTOMERS.BASE);
      clearCacheByPattern(API_ENDPOINTS.CUSTOMERS.GET_BY_ID(id));

      return result;
    } catch (error: any) {
      throw ResponseHandler.handleError(error);
    }
  }

  /**
   * Add debt to customer account
   */
  async addDebt(data: DebtRequest): Promise<ApiResponse<DebtResponse>> {
    try {
      const response = await RetryHandler.executeWithRetry(
        () =>
          api.post<ApiResponse<DebtResponse>>(
            API_ENDPOINTS.CUSTOMERS.DEBT,
            data
          ),
        API_CONFIG.MAX_RETRIES,
        API_CONFIG.RETRY_DELAY
      );

      const result = ResponseHandler.handleSuccess(response);

      // Clear related caches
      clearCacheByPattern(API_ENDPOINTS.CUSTOMERS.BASE);
      clearCacheByPattern(API_ENDPOINTS.CUSTOMERS.GET_BY_ID(data.clientId));
      clearCacheByPattern(API_ENDPOINTS.DEBTS.BASE);

      return result;
    } catch (error: any) {
      throw ResponseHandler.handleError(error);
    }
  }

  /**
   * Pay customer debt
   */
  async payDebt(data: PaymentRequest): Promise<ApiResponse<DebtResponse>> {
    try {
      const response = await RetryHandler.executeWithRetry(
        () =>
          api.post<ApiResponse<DebtResponse>>(
            API_ENDPOINTS.CUSTOMERS.PAY_DEBT,
            data
          ),
        API_CONFIG.MAX_RETRIES,
        API_CONFIG.RETRY_DELAY
      );

      const result = ResponseHandler.handleSuccess(response);

      // Clear related caches
      clearCacheByPattern(API_ENDPOINTS.CUSTOMERS.BASE);
      clearCacheByPattern(API_ENDPOINTS.CUSTOMERS.GET_BY_ID(data.clientId));
      clearCacheByPattern(API_ENDPOINTS.DEBTS.BASE);

      return result;
    } catch (error: any) {
      throw ResponseHandler.handleError(error);
    }
  }

  /**
   * Get customer debt history
   */
  async getCustomerDebtHistory(
    id: number
  ): Promise<ApiResponse<DebtHistoryResponse>> {
    const cacheKey = getCacheKey(API_ENDPOINTS.CUSTOMERS.DEBT_HISTORY(id));
    const cached = cache.get(cacheKey);

    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await RetryHandler.executeWithRetry(
        () =>
          api.get<ApiResponse<DebtHistoryResponse>>(
            API_ENDPOINTS.CUSTOMERS.DEBT_HISTORY(id)
          ),
        API_CONFIG.MAX_RETRIES,
        API_CONFIG.RETRY_DELAY
      );

      const result = ResponseHandler.handleSuccess(response);

      // Transform dates and cache the response
      const transformedResult = {
        ...result,
        data: ResponseTransformer.transformDates(result.data),
      };

      cache.set(cacheKey, {
        data: transformedResult,
        timestamp: Date.now(),
      });

      return transformedResult;
    } catch (error: any) {
      throw ResponseHandler.handleError(error);
    }
  }

  /**
   * Search customers by name or phone
   */
  async searchCustomers(
    params: CustomerSearchParams
  ): Promise<ApiResponse<Customer[]>> {
    try {
      const response = await RetryHandler.executeWithRetry(
        () =>
          api.get<ApiResponse<Customer[]>>(API_ENDPOINTS.CUSTOMERS.SEARCH, {
            params,
          }),
        API_CONFIG.MAX_RETRIES,
        API_CONFIG.RETRY_DELAY
      );

      const result = ResponseHandler.handleSuccess(response);

      // Transform dates
      return {
        ...result,
        data: ResponseTransformer.transformDates(result.data),
      };
    } catch (error: any) {
      throw ResponseHandler.handleError(error);
    }
  }

  /**
   * Get all debts with sorting options
   */
  async getAllDebts(
    params?: DebtsListParams
  ): Promise<ApiResponse<DebtsListResponse>> {
    const cacheKey = getCacheKey(API_ENDPOINTS.DEBTS.GET_ALL, params);
    const cached = cache.get(cacheKey);

    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await RetryHandler.executeWithRetry(
        () =>
          api.get<ApiResponse<DebtsListResponse>>(API_ENDPOINTS.DEBTS.GET_ALL, {
            params,
          }),
        API_CONFIG.MAX_RETRIES,
        API_CONFIG.RETRY_DELAY
      );

      const result = ResponseHandler.handleSuccess(response);

      // Transform dates and cache the response
      const transformedResult = {
        ...result,
        data: ResponseTransformer.transformDates(result.data),
      };

      cache.set(cacheKey, {
        data: transformedResult,
        timestamp: Date.now(),
      });

      return transformedResult;
    } catch (error: any) {
      throw ResponseHandler.handleError(error);
    }
  }
}

// Export singleton instance
export const customerService = CustomerService.getInstance();
