import { AxiosError, AxiosResponse } from "axios";
import { HTTP_STATUS, ERROR_MESSAGES } from "./constants";
import { ApiError } from "../../@types/api";

/**
 * Response Handler Utility
 * Provides consistent error handling, response processing, and retry logic
 */
export class ResponseHandler {
  /**
   * Process successful API response
   */
  static handleSuccess<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  /**
   * Handle API errors consistently
   */
  static handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;

      return {
        data: this.getErrorMessage(status, data?.data),
        success: false,
        status,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        data: ERROR_MESSAGES.NETWORK_ERROR,
        success: false,
      };
    } else {
      // Something else happened
      return {
        data: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
        success: false,
      };
    }
  }

  /**
   * Get appropriate error message based on status code
   */
  private static getErrorMessage(
    status: number,
    serverMessage?: string
  ): string {
    if (serverMessage) {
      return serverMessage;
    }

    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case HTTP_STATUS.UNAUTHORIZED:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case HTTP_STATUS.FORBIDDEN:
        return ERROR_MESSAGES.FORBIDDEN;
      case HTTP_STATUS.NOT_FOUND:
        return ERROR_MESSAGES.NOT_FOUND;
      case HTTP_STATUS.CONFLICT:
        return "Conflito de dados. Verifique as informações.";
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return ERROR_MESSAGES.SERVER_ERROR;
      case HTTP_STATUS.BAD_GATEWAY:
        return "Servidor temporariamente indisponível.";
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return "Serviço temporariamente indisponível.";
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }

  /**
   * Check if error is retryable
   */
  static isRetryableError(error: AxiosError): boolean {
    if (!error.response) {
      // Network errors are retryable
      return true;
    }

    const status = error.response.status;

    // Retry on server errors and some client errors
    return (
      status >= 500 || // Server errors
      status === HTTP_STATUS.BAD_REQUEST || // 408
      status === HTTP_STATUS.UNAUTHORIZED // 429
    );
  }

  /**
   * Get retry delay with exponential backoff
   */
  static getRetryDelay(attempt: number, baseDelay: number = 1000): number {
    return Math.min(baseDelay * Math.pow(2, attempt), 30000); // Max 30 seconds
  }

  /**
   * Validate API response structure
   */
  static validateResponse(response: any): boolean {
    return (
      response &&
      typeof response === "object" &&
      typeof response.success === "boolean" &&
      response.hasOwnProperty("data")
    );
  }

  /**
   * Extract data from API response
   */
  static extractData<T>(response: any): T | null {
    if (this.validateResponse(response) && response.success) {
      return response.data;
    }
    return null;
  }

  /**
   * Check if response indicates success
   */
  static isSuccess(response: any): boolean {
    return this.validateResponse(response) && response.success === true;
  }

  /**
   * Format error for display
   */
  static formatError(error: ApiError): string {
    if (error.status) {
      return `Erro ${error.status}: ${error.data}`;
    }
    return error.data;
  }

  /**
   * Log error for debugging
   */
  static logError(error: ApiError, context?: string): void {
    const logMessage = context
      ? `[${context}] ${this.formatError(error)}`
      : this.formatError(error);

    console.error(logMessage);

    // In production, you might want to send this to a logging service
    if (__DEV__) {
      console.group("API Error Details");
      console.error("Error:", error);
      console.error("Context:", context);
      console.groupEnd();
    }
  }

  /**
   * Handle timeout errors
   */
  static handleTimeout(): ApiError {
    return {
      data: ERROR_MESSAGES.TIMEOUT_ERROR,
      success: false,
    };
  }

  /**
   * Handle network errors
   */
  static handleNetworkError(): ApiError {
    return {
      data: ERROR_MESSAGES.NETWORK_ERROR,
      success: false,
    };
  }

  /**
   * Handle validation errors
   */
  static handleValidationError(
    fieldErrors?: Record<string, string[]>
  ): ApiError {
    if (fieldErrors) {
      const errorMessages = Object.entries(fieldErrors)
        .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
        .join("; ");

      return {
        data: errorMessages,
        success: false,
      };
    }

    return {
      data: ERROR_MESSAGES.VALIDATION_ERROR,
      success: false,
    };
  }
}

/**
 * Retry utility for failed requests
 */
export class RetryHandler {
  /**
   * Execute function with retry logic
   */
  static async executeWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;

        if (
          attempt === maxRetries ||
          !ResponseHandler.isRetryableError(error)
        ) {
          throw error;
        }

        const delay = ResponseHandler.getRetryDelay(attempt, baseDelay);
        await this.delay(delay);
      }
    }

    throw lastError;
  }

  /**
   * Delay execution for specified milliseconds
   */
  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Response transformer utilities
 */
export class ResponseTransformer {
  /**
   * Transform date strings to Date objects
   */
  static transformDates<T>(data: T): T {
    if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) {
        return data.map((item) => this.transformDates(item)) as T;
      }

      const transformed = { ...data } as any;
      for (const key in transformed) {
        if (transformed.hasOwnProperty(key)) {
          const value = transformed[key];
          if (typeof value === "string" && this.isDateString(value)) {
            transformed[key] = new Date(value);
          } else if (typeof value === "object" && value !== null) {
            transformed[key] = this.transformDates(value);
          }
        }
      }
      return transformed;
    }

    return data;
  }

  /**
   * Check if string looks like a date
   */
  private static isDateString(str: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}/;
    return dateRegex.test(str);
  }

  /**
   * Transform amount to proper currency format
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("pt-MZ", {
      style: "currency",
      currency: "MZN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Transform date to display format
   */
  static formatDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("pt-MZ");
  }

  /**
   * Transform datetime to display format
   */
  static formatDateTime(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString("pt-MZ");
  }
}
