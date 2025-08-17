import { useState, useCallback, useRef } from "react";
import { customerService } from "../network/customerService";
import {
  Customer,
  CustomerCreateRequest,
  CustomerUpdateRequest,
  DebtRequest,
  PaymentRequest,
  DebtHistoryResponse,
  CustomerSearchParams,
  DebtsListParams,
  DebtsListResponse,
  ApiError,
} from "../../@types/api";

interface UseCustomerServiceReturn {
  // State
  customers: Customer[];
  customer: Customer | null;
  debts: DebtsListResponse | null;
  debtHistory: DebtHistoryResponse | null;
  loading: boolean;
  error: string | null;

  // Actions
  getAllCustomers: () => Promise<void>;
  getCustomerById: (id: number) => Promise<void>;
  createCustomer: (data: CustomerCreateRequest) => Promise<boolean>;
  updateCustomer: (data: CustomerUpdateRequest) => Promise<boolean>;
  deleteCustomer: (id: number) => Promise<boolean>;
  addDebt: (data: DebtRequest) => Promise<boolean>;
  payDebt: (data: PaymentRequest) => Promise<boolean>;
  getCustomerDebtHistory: (id: number) => Promise<void>;
  searchCustomers: (params: CustomerSearchParams) => Promise<Customer[]>;
  getAllDebts: (params?: DebtsListParams) => Promise<void>;

  // Utilities
  clearError: () => void;
  clearCache: () => void;
}

/**
 * Custom hook for customer service operations
 * Provides state management, error handling, and caching for all customer operations
 */
export const useCustomerService = (): UseCustomerServiceReturn => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [debts, setDebts] = useState<DebtsListResponse | null>(null);
  const [debtHistory, setDebtHistory] = useState<DebtHistoryResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Abort controller for canceling requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clear error message
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    customerService.clearCache();
  }, []);

  // Handle API errors
  const handleError = useCallback((error: any) => {
    let errorMessage = "An unexpected error occurred";

    if (error?.data) {
      errorMessage = error.data;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    setError(errorMessage);
    setLoading(false);
  }, []);

  // Get all customers
  const getAllCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const response = await customerService.getAllCustomers();

      if (response.success) {
        setCustomers(response.data);
      } else {
        setError("Failed to fetch customers");
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        handleError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Get customer by ID
  const getCustomerById = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);

        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        const response = await customerService.getCustomerById(id);

        if (response.success) {
          setCustomer(response.data);
        } else {
          setError("Failed to fetch customer");
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          handleError(error);
        }
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Create customer
  const createCustomer = useCallback(
    async (data: CustomerCreateRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await customerService.createCustomer(data);

        if (response.success) {
          // Refresh customers list
          await getAllCustomers();
          return true;
        } else {
          setError("Failed to create customer");
          return false;
        }
      } catch (error: any) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAllCustomers, handleError]
  );

  // Update customer
  const updateCustomer = useCallback(
    async (data: CustomerUpdateRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await customerService.updateCustomer(data);

        if (response.success) {
          // Update local state
          setCustomer(response.data);
          setCustomers((prev) =>
            prev.map((c) => (c.id === data.id ? response.data : c))
          );
          return true;
        } else {
          setError("Failed to update customer");
          return false;
        }
      } catch (error: any) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Delete customer
  const deleteCustomer = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await customerService.deleteCustomer(id);

        if (response.success) {
          // Remove from local state
          setCustomers((prev) => prev.filter((c) => c.id !== id));
          if (customer?.id === id) {
            setCustomer(null);
          }
          return true;
        } else {
          setError("Failed to delete customer");
          return false;
        }
      } catch (error: any) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [customer, handleError]
  );

  // Add debt
  const addDebt = useCallback(
    async (data: DebtRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await customerService.addDebt(data);

        if (response.success) {
          // Refresh related data
          await getAllCustomers();
          if (customer?.id === data.clientId) {
            await getCustomerById(data.clientId);
          }
          return true;
        } else {
          setError("Failed to add debt");
          return false;
        }
      } catch (error: any) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAllCustomers, getCustomerById, customer, handleError]
  );

  // Pay debt
  const payDebt = useCallback(
    async (data: PaymentRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await customerService.payDebt(data);

        if (response.success) {
          // Refresh related data
          await getAllCustomers();
          if (customer?.id === data.clientId) {
            await getCustomerById(data.clientId);
          }
          return true;
        } else {
          setError("Failed to process payment");
          return false;
        }
      } catch (error: any) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAllCustomers, getCustomerById, customer, handleError]
  );

  // Get customer debt history
  const getCustomerDebtHistory = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);

        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        const response = await customerService.getCustomerDebtHistory(id);

        if (response.success) {
          setDebtHistory(response.data);
        } else {
          setError("Failed to fetch debt history");
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          handleError(error);
        }
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Search customers
  const searchCustomers = useCallback(
    async (params: CustomerSearchParams): Promise<Customer[]> => {
      try {
        setError(null);

        const response = await customerService.searchCustomers(params);

        if (response.success) {
          return response.data;
        } else {
          setError("Failed to search customers");
          return [];
        }
      } catch (error: any) {
        handleError(error);
        return [];
      }
    },
    [handleError]
  );

  // Get all debts
  const getAllDebts = useCallback(
    async (params?: DebtsListParams) => {
      try {
        setLoading(true);
        setError(null);

        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        const response = await customerService.getAllDebts(params);

        if (response.success) {
          setDebts(response.data);
        } else {
          setError("Failed to fetch debts");
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          handleError(error);
        }
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  return {
    // State
    customers,
    customer,
    debts,
    debtHistory,
    loading,
    error,

    // Actions
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    addDebt,
    payDebt,
    getCustomerDebtHistory,
    searchCustomers,
    getAllDebts,

    // Utilities
    clearError,
    clearCache,
  };
};
