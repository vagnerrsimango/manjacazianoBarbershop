import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
  title: string;
  back?: boolean;
}

export default function Header({ title, back }: HeaderProps) {
  const navigation = useNavigation();

  return (
    <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
      {back && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-3 p-1"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
      )}
      
      <Text className="text-xl font-bold text-gray-900 flex-1">
        {title}
      </Text>
    </View>
  );
}
