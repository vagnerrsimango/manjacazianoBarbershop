import { useState, useCallback, useRef } from "react";
import { userService } from "../network/userService";
import {
  User,
  UserCreateRequest,
  UserUpdateRequest,
  UserPasswordChangeRequest,
  UserSearchParams,
  ApiError,
} from "../../@types/api";

interface UseUserServiceReturn {
  // State
  users: User[];
  user: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  getAllUsers: () => Promise<void>;
  getUserById: (id: number) => Promise<void>;
  createUser: (data: UserCreateRequest) => Promise<boolean>;
  updateUser: (data: UserUpdateRequest) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
  changeUserPassword: (data: UserPasswordChangeRequest) => Promise<boolean>;
  searchUsers: (params: UserSearchParams) => Promise<User[]>;

  // Utilities
  clearError: () => void;
  clearCache: () => void;
}

/**
 * Custom hook for user service operations
 * Provides state management, error handling, and caching for all user operations
 * All operations require admin permissions (user type 20)
 */
export const useUserService = (): UseUserServiceReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
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
    userService.clearCache();
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

  // Get all users
  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const response = await userService.getAllUsers();

      if (response.success) {
        setUsers(response.data);
      } else {
        setError("Failed to fetch users");
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        handleError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Get user by ID
  const getUserById = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);

        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        const response = await userService.getUserById(id);

        if (response.success) {
          setUser(response.data);
        } else {
          setError("Failed to fetch user");
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

  // Create user
  const createUser = useCallback(
    async (data: UserCreateRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await userService.createUser(data);

        if (response.success) {
          // Refresh users list
          await getAllUsers();
          return true;
        } else {
          setError("Failed to create user");
          return false;
        }
      } catch (error: any) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getAllUsers, handleError]
  );

  // Update user
  const updateUser = useCallback(
    async (data: UserUpdateRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await userService.updateUser(data);

        if (response.success) {
          // Update local state
          setUser(response.data);
          setUsers((prev) =>
            prev.map((u) => (u.id === data.id ? response.data : u))
          );
          return true;
        } else {
          setError("Failed to update user");
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

  // Delete user
  const deleteUser = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await userService.deleteUser(id);

        if (response.success) {
          // Remove from local state
          setUsers((prev) => prev.filter((u) => u.id !== id));
          if (user?.id === id) {
            setUser(null);
          }
          return true;
        } else {
          setError("Failed to delete user");
          return false;
        }
      } catch (error: any) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user, handleError]
  );

  // Change user password
  const changeUserPassword = useCallback(
    async (data: UserPasswordChangeRequest): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await userService.changeUserPassword(data);

        if (response.success) {
          return true;
        } else {
          setError("Failed to change password");
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

  // Search users
  const searchUsers = useCallback(
    async (params: UserSearchParams): Promise<User[]> => {
      try {
        setError(null);

        const response = await userService.searchUsers(params);

        if (response.success) {
          return response.data;
        } else {
          setError("Failed to search users");
          return [];
        }
      } catch (error: any) {
        handleError(error);
        return [];
      }
    },
    [handleError]
  );

  return {
    // State
    users,
    user,
    loading,
    error,

    // Actions
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changeUserPassword,
    searchUsers,

    // Utilities
    clearError,
    clearCache,
  };
};
