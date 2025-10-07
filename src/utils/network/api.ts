import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API Configuration
const API_BASE_URL = "https://apimanjacaziano.geome.online";
// const API_BASE_URL = "http://localhost:7777";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  async (config) => {
    try {
      console.log(
        `🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
      console.log(`📍 Base URL: ${API_BASE_URL}`);
      console.log(`🔗 Full URL: ${config.baseURL}${config.url}`);

      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("🔑 Token added to request");
      }
    } catch (error) {
      console.error("❌ Error getting auth token:", error);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    console.error("❌ API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      code: error.code,
      data: error.response?.data,
      baseURL: error.config?.baseURL,
    });

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && originalRequest) {
      try {
        await AsyncStorage.removeItem("auth_token");
        console.log("🔑 Authentication failed, token cleared");
      } catch (storageError) {
        console.error("❌ Error clearing auth token:", storageError);
      }
    }

    // Handle network errors
    if (error.code === "ECONNABORTED") {
      console.error("⏰ Request timeout - server may be slow or unreachable");
    }

    if (error.code === "ERR_NETWORK") {
      console.error("🌐 Network error - check internet connection");
    }

    // Handle specific HTTP errors
    if (error.response?.status === 404) {
      console.error("🔍 Endpoint not found - check API documentation");
    }

    if (error.response?.status && error.response.status >= 500) {
      console.error("🚨 Server error - backend may be down");
    }

    return Promise.reject(error);
  }
);

// Test function to verify API connectivity
export const testAPIConnectivity = async () => {
  try {
    console.log("🧪 Testing API connectivity...");
    console.log(`📍 Testing connection to: ${API_BASE_URL}`);

    const response = await api.get("/");
    console.log("✅ API connectivity test successful:", response.status);
    return { success: true, status: response.status };
  } catch (error: any) {
    console.error("❌ API connectivity test failed:", error);
    return {
      success: false,
      error: error.message,
      code: error.code,
      status: error.response?.status,
    };
  }
};

export default api;
