import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserUseCases } from "../../core/useCases/UserUseCases";
import {
  User,
  UserCreateRequest,
  UserUpdateRequest,
  UserPasswordChangeRequest,
} from "../../core/entities/User";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

export const useUsers = (userUseCases: UserUseCases) => {
  const queryClient = useQueryClient();

  // Get all users
  const useGetAllUsers = () => {
    return useQuery({
      queryKey: userKeys.lists(),
      queryFn: () => userUseCases.getAllUsers(),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // Get user by ID
  const useGetUserById = (id: number) => {
    return useQuery({
      queryKey: userKeys.detail(id),
      queryFn: () => userUseCases.getUserById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });
  };

  // Search users
  const useSearchUsers = (query: string) => {
    return useQuery({
      queryKey: userKeys.list(query),
      queryFn: () => userUseCases.searchUsers(query),
      enabled: query.length >= 2,
      staleTime: 2 * 60 * 1000, // 2 minutes for search results
      gcTime: 5 * 60 * 1000,
    });
  };

  // Create user
  const useCreateUser = () => {
    return useMutation({
      mutationFn: (data: UserCreateRequest) => userUseCases.createUser(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      },
    });
  };

  // Update user
  const useUpdateUser = () => {
    return useMutation({
      mutationFn: (data: UserUpdateRequest) => userUseCases.updateUser(data),
      onSuccess: (updatedUser) => {
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      },
    });
  };

  // Delete user
  const useDeleteUser = () => {
    return useMutation({
      mutationFn: (id: number) => userUseCases.deleteUser(id),
      onSuccess: (_, deletedId) => {
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
      },
    });
  };

  // Change password
  const useChangePassword = () => {
    return useMutation({
      mutationFn: (data: UserPasswordChangeRequest) =>
        userUseCases.changeUserPassword(data),
    });
  };

  return {
    useGetAllUsers,
    useGetUserById,
    useSearchUsers,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
    useChangePassword,
  };
};
