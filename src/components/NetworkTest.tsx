import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { testAPIConnectivity } from "../utils/network/api";

const NetworkTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const testConnection = async () => {
    setIsLoading(true);
    setStatus("Testing connection...");

    try {
      console.log("🧪 Starting network test...");

      const result = await testAPIConnectivity();

      if (result.success) {
        setStatus(`✅ Connected! Status: ${result.status}`);
        Alert.alert("Success", "Connection to API server successful!");
      } else {
        setStatus(`❌ Failed: ${result.error}`);

        if (result.code === "ERR_NETWORK") {
          Alert.alert(
            "Network Error",
            "Unable to connect to the server. Please check your internet connection."
          );
        } else if (result.code === "ECONNABORTED") {
          Alert.alert(
            "Timeout",
            "Request timed out. The server may be slow or unreachable."
          );
        } else if (result.status === 404) {
          Alert.alert(
            "Server Error",
            "API endpoint not found. The server may be misconfigured."
          );
        } else if (result.status && result.status >= 500) {
          Alert.alert(
            "Server Error",
            "Server is experiencing issues. Please try again later."
          );
        } else {
          Alert.alert("Connection Error", `Failed to connect: ${result.error}`);
        }
      }
    } catch (error: any) {
      console.error("❌ Network test failed:", error);
      setStatus(`❌ Unexpected error: ${error.message}`);
      Alert.alert("Error", "An unexpected error occurred during the test.");
    } finally {
      setIsLoading(false);
    }
  };

  const testSpecificEndpoint = async () => {
    setIsLoading(true);
    setStatus("Testing specific endpoint...");

    try {
      // Import api here to avoid circular dependency
      const { default: api } = await import("../utils/network/api");
      const response = await api.get("/client/search/test");
      console.log("✅ Endpoint test successful:", response.status);
      setStatus(`✅ Endpoint working! Status: ${response.status}`);
    } catch (error: any) {
      console.error("❌ Endpoint test failed:", error);
      setStatus(
        `❌ Endpoint error: ${error.response?.status || error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="p-4 bg-white rounded-lg border border-gray-200 m-4">
      <Text className="text-lg font-bold text-gray-900 mb-4">
        Network Connection Test
      </Text>

      <Text className="text-sm text-gray-600 mb-4">
        Test your connection to the API server
      </Text>

      <View className="space-y-3">
        <TouchableOpacity
          className={`bg-blue-500 py-3 px-4 rounded-lg ${
            isLoading ? "opacity-50" : ""
          }`}
          onPress={testConnection}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text className="text-white font-semibold text-center">
            {isLoading ? "Testing..." : "Test Basic Connection"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`bg-green-500 py-3 px-4 rounded-lg ${
            isLoading ? "opacity-50" : ""
          }`}
          onPress={testSpecificEndpoint}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text className="text-white font-semibold text-center">
            {isLoading ? "Testing..." : "Test API Endpoint"}
          </Text>
        </TouchableOpacity>
      </View>

      {status && (
        <View className="mt-4 p-3 bg-gray-100 rounded-lg">
          <Text className="text-sm font-medium text-gray-800">{status}</Text>
        </View>
      )}

      <Text className="text-xs text-gray-500 mt-4 text-center">
        Server: apimanjacaziano.geome.site
      </Text>
    </View>
  );
};

export default NetworkTest;
