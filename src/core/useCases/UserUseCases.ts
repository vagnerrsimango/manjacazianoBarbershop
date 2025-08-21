import { UserRepository } from "../repositories/UserRepository";
import {
  User,
  UserCreateRequest,
  UserUpdateRequest,
  UserPasswordChangeRequest,
} from "../entities/User";

export class UserUseCases {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async getUserById(id: number): Promise<User> {
    if (id <= 0) {
      throw new Error("Invalid user ID");
    }
    return this.userRepository.getUserById(id);
  }

  async createUser(data: UserCreateRequest): Promise<User> {
    this.validateUserData(data);
    return this.userRepository.createUser(data);
  }

  async updateUser(data: UserUpdateRequest): Promise<User> {
    if (data.id <= 0) {
      throw new Error("Invalid user ID");
    }
    this.validateUserUpdateData(data);
    return this.userRepository.updateUser(data);
  }

  async deleteUser(id: number): Promise<string> {
    if (id <= 0) {
      throw new Error("Invalid user ID");
    }
    return this.userRepository.deleteUser(id);
  }

  async changeUserPassword(data: UserPasswordChangeRequest): Promise<string> {
    if (data.id <= 0) {
      throw new Error("Invalid user ID");
    }
    if (data.newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    return this.userRepository.changeUserPassword(data);
  }

  async searchUsers(query: string): Promise<User[]> {
    if (query.length < 2) {
      throw new Error("Search query must be at least 2 characters");
    }
    return this.userRepository.searchUsers(query);
  }

  private validateUserData(data: UserCreateRequest): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Name is required");
    }
    if (!data.type || data.type < 1) {
      throw new Error("Valid user type is required");
    }
    if (!data.password || data.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
  }

  private validateUserUpdateData(data: UserUpdateRequest): void {
    if (data.name && data.name.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }
    if (data.type && data.type < 1) {
      throw new Error("User type must be at least 1");
    }
  }
}
