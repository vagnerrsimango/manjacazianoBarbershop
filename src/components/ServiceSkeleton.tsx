import React from "react";
import { View } from "react-native";

const ServiceSkeleton = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="w-full max-w-[400px] space-y-4">
        <View className="h-[200px] rounded-lg bg-gray-200 animate-pulse" />
        <View className="h-[100px] rounded-lg bg-gray-200 animate-pulse" />
        <View className="h-[80px] rounded-lg bg-gray-200 animate-pulse" />
      </View>
    </View>
  );
};

export default ServiceSkeleton;
