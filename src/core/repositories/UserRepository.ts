import {
  User,
  UserCreateRequest,
  UserUpdateRequest,
  UserPasswordChangeRequest,
} from "../entities/User";

export interface UserRepository {
  getAllUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User>;
  createUser(data: UserCreateRequest): Promise<User>;
  updateUser(data: UserUpdateRequest): Promise<User>;
  deleteUser(id: number): Promise<string>;
  changeUserPassword(data: UserPasswordChangeRequest): Promise<string>;
  searchUsers(query: string): Promise<User[]>;
}
