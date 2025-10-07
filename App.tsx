import "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProvider from "./src/utils/UserProvider";
import CartContextProvider from "./src/utils/CartContexProvider";
import AppRoutes from "./src/routes/AppRoutes";
import "./global.css";

enableScreens(true);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      networkMode: "online",
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <CartContextProvider>
          <AppRoutes />
        </CartContextProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
