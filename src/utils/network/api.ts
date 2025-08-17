import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API Configuration
const api: AxiosInstance = axios.create({
  baseURL: "https://apimanjacaziano.geome.site",
  timeout: 10000, // 10 second timeout for better UX
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && originalRequest) {
      try {
        // Clear invalid token
        await AsyncStorage.removeItem("auth_token");
        // Redirect to login or handle authentication failure
        console.log("Authentication failed, redirecting to login");
      } catch (storageError) {
        console.error("Error clearing auth token:", storageError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
