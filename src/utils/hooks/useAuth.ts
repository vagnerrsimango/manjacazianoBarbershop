import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: number;
  name: string;
  type: number;
  email?: string;
}

interface UseAuthReturn {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

/**
 * Simple authentication hook for managing user state and permissions
 * In a real app, this would integrate with your authentication system
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.type === 20;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const userData = await AsyncStorage.getItem("user_data");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User) => {
    try {
      await AsyncStorage.setItem("user_data", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user_data");
      setUser(null);
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  };

  return {
    user,
    isAdmin,
    isLoading,
    login,
    logout,
    checkAuth,
  };
};
