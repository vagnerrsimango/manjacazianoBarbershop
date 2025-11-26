import api from "./api";
import { API_ENDPOINTS, API_CONFIG } from "./constants";
import {
  ResponseHandler,
  RetryHandler,
  ResponseTransformer,
} from "./responseHandler";
import {
  ApiResponse,
  User,
  UserCreateRequest,
  UserUpdateRequest,
  UserPasswordChangeRequest,
  UserSearchParams,
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
 * User Service - Handles all user management API operations
 * Implements caching for better performance, proper error handling, and retry logic
 * All endpoints require admin permissions (user type 20)
 */
export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Get my sales summary (profile)
   * Implements caching for better performance on slow connections
   */
  async getMySales(forceRefresh: boolean = false): Promise<any> {
    const cacheKey = getCacheKey(API_ENDPOINTS.PROFILE.MY_SALES);
    
    // Use cache if valid and not forcing refresh
    if (!forceRefresh) {
      const cached = cache.get(cacheKey);
      if (cached && isCacheValid(cached.timestamp)) {
        return cached.data;
      }
    }

    try {
      const response = await RetryHandler.executeWithRetry(
        () => api.get(API_ENDPOINTS.PROFILE.MY_SALES),
        API_CONFIG.MAX_RETRIES,
        API_CONFIG.RETRY_DELAY
      );

      const result = response.data;

      // Cache the response for 2 minutes (shorter than default for sales data)
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
      });

      return result;
    } catch (error: any) {
      throw ResponseHandler.handleError(error);
    }
  }

  /**
   * Clear sales cache (useful for manual refresh)
   */
  clearSalesCache(): void {
    clearCacheByPattern(API_ENDPOINTS.PROFILE.MY_SALES);
  }

  /**
   * Create a new user (admin only)
   */
  async createUser(data: UserCreateRequest): Promise<ApiResponse<User>> {
    try {
      const response = await RetryHandler.executeWithRetry(
        () => api.post<ApiResponse<User>>("/admin/users", data),
        API_CONFIG.MAX_RETRIES,
        API_CONFIG.RETRY_DELAY
      );

      const result = ResponseHandler.handleSuccess(response);

      // Clear user list cache when creating new user
      clearCacheByPattern("/admin/users");

      return result;
    } catch (error: any) {
      throw ResponseHandler.handleError(error);
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    const cacheKey = getCacheKey("/admin/users");
    const cached = cache.get(cacheKey);

    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await RetryHandler.executeWithRetry(
        () => api.get<ApiResponse<User[]>>("/admin/users"),
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
   * Get user by ID (admin only)
   */
  async getUserById(id: number): Promise<ApiResponse<User>> {
    const cacheKey = getCacheKey(`/admin/users/${id}`);
    const cached = cache.get(cacheKey);

    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await RetryHandler.executeWithRetry(
        () => api.get<ApiResponse<User>>(`/admin/users/${id}`),
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
   * Update user information (admin only)
   */
  async updateUser(data: UserUpdateRequest): Promise<ApiResponse<User>> {
    try {
      const response = await RetryHandler.executeWithRetry(
        () => api.put<ApiResponse<User>>("/admin/users", data),
        API_CONFIG.MAX_RETRIES,
        API_CONFIG.RETRY_DELAY
      );

      const result = ResponseHandler.handleSuccess(response);

      // Clear related caches
      clearCacheByPattern("/admin/users");
      clearCacheByPattern(`/admin/users/${data.id}`);

      return result;
    } catch (error: any) {
      throw ResponseHandler.handleError(error);
    }
  }

  /**
   * Change user password (admin only)
   */
  async changeUserPassword(
    data: UserPasswordChangeRequest
  ): Promise<ApiResponse<string>> {
    try {
      const response = await RetryHandler.executeWithRetry(
        () => api.patch<ApiResponse<string>>("/admin/users/password", data),
        API_CONFIG.MAX_RETRIES,
        API_CONFIG.RETRY_DELAY
      );

      const result = ResponseHandler.handleSuccess(response);

      // Clear related caches
      clearCacheByPattern("/admin/users");
      clearCacheByPattern(`/admin/users/${data.id}`);

      return result;
    } catch (error: any) {
      throw ResponseHandler.handleError(error);
    }
  }

  /**
   * Delete user (admin only, soft delete)
   */
  async deleteUser(id: number): Promise<ApiResponse<string>> {
    try {
      const response = await RetryHandler.executeWithRetry(
        () => api.delete<ApiResponse<string>>(`/admin/users/${id}`),
        API_CONFIG.MAX_RETRIES,
        API_CONFIG.RETRY_DELAY
      );

      const result = ResponseHandler.handleSuccess(response);

      // Clear related caches
      clearCacheByPattern("/admin/users");
      clearCacheByPattern(`/admin/users/${id}`);

      return result;
    } catch (error: any) {
      throw ResponseHandler.handleError(error);
    }
  }

  /**
   * Search users by name, surname, email, or phone (admin only)
   */
  async searchUsers(params: UserSearchParams): Promise<ApiResponse<User[]>> {
    try {
      const response = await RetryHandler.executeWithRetry(
        () => api.get<ApiResponse<User[]>>("/admin/users/search", { params }),
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
}

// Export singleton instance
export const userService = UserService.getInstance();
