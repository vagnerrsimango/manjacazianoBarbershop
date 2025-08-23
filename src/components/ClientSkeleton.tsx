import React from "react";
import { View } from "react-native";

const ClientSkeleton = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="w-full max-w-[800px] rounded-md space-y-2">
        <View className="flex-1 h-[150px] rounded-md bg-gray-200 animate-pulse" />
        <View className="w-[100px] h-[100px] rounded-full bg-gray-200 animate-pulse" />
        <View className="h-[100px] flex-1 rounded-full bg-gray-200 animate-pulse" />
        <View className="h-[3px] flex-1 rounded-full bg-indigo-300 animate-pulse" />
      </View>
    </View>
  );
};

export default ClientSkeleton;
