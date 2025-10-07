import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import useUser from "../utils/hooks/UserHook";

type RootStackParamList = {
  Home: undefined;
  Checkout: undefined;
  Clients: undefined;
  Users: undefined;
  Profile: undefined;
  Products: undefined;
  ServiceSelection: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface GlobalNavigationProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function GlobalNavigation({
  title,
  showBack = false,
  onBack,
}: GlobalNavigationProps) {
  const navigation = useNavigation<NavigationProp>();
  const [showMenu, setShowMenu] = useState(false);
  const [menuAnim] = useState(new Animated.Value(0));
  const { user, setUser } = useUser();

  // Check if user is admin (type 20)
  const isAdmin = user?.type === 20;

  // Animate menu
  const toggleMenu = () => {
    if (showMenu) {
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowMenu(false));
    } else {
      setShowMenu(true);
      Animated.timing(menuAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowMenu(false);
  };

  const navigateToScreen = (screen: keyof RootStackParamList) => {
    setShowMenu(false);
    navigation.navigate(screen);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (showBack) {
      navigation.goBack();
    }
  };

  return (
    <>
      {/* Navigation Bar with Hamburger Menu - Available for all users */}
      <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row items-center justify-between">
        {showBack ? (
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
        ) : (
          <View className="w-6" />
        )}

        <Text className="text-lg font-semibold text-gray-800">{title}</Text>

        {/* Hamburger menu available for all users */}
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Animated Side Menu - Available for all users */}
      {showMenu && (
        <Animated.View
          style={{
            position: "absolute",
            top: 60, // Made higher to account for navigation bar height
            right: 0,
            bottom: 0,
            width: 250,
            backgroundColor: "white",
            zIndex: 1000,
            transform: [
              {
                translateX: menuAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [250, 0],
                }),
              },
            ],
            shadowColor: "#000",
            shadowOffset: {
              width: -2,
              height: 0,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <View className="flex-1 p-4">
            {/* Menu Header */}
            <View className="border-b border-gray-200 pb-4 mb-4">
              <Text className="text-xl font-bold text-gray-800">Menu</Text>
            </View>

            {/* Menu Items */}
            <View className="space-y-2">
              {/* Profile - Available for all users */}
              <TouchableOpacity
                onPress={() => navigateToScreen("Profile")}
                className="flex-row items-center p-3 rounded-lg hover:bg-gray-50"
              >
                <Ionicons name="person-circle" size={20} color="#374151" />
                <Text className="text-gray-700 ml-3 text-base font-medium">
                  Perfil
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigateToScreen("Clients")}
                className="flex-row items-center p-3 rounded-lg hover:bg-gray-50"
              >
                <Ionicons name="people" size={20} color="#374151" />
                <Text className="text-gray-700 ml-3 text-base font-medium">
                  Gestão de Clientes
                </Text>
              </TouchableOpacity>

              {/* User Management - Only for admin users */}
              {isAdmin && (
                <>
                  <TouchableOpacity
                    onPress={() => navigateToScreen("Users")}
                    className="flex-row items-center p-3 rounded-lg hover:bg-gray-50"
                  >
                    <Ionicons name="person" size={20} color="#374151" />
                    <Text className="text-gray-700 ml-3 text-base font-medium">
                      Gestão de Usuários
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigateToScreen("Products")}
                    className="flex-row items-center p-3 rounded-lg hover:bg-gray-50"
                  >
                    <Ionicons name="cube" size={20} color="#374151" />
                    <Text className="text-gray-700 ml-3 text-base font-medium">
                      Gestão de Produtos
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                onPress={handleLogout}
                className="flex-row items-center p-3 rounded-lg hover:bg-gray-50"
              >
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text className="text-red-500 ml-3 text-base font-medium">
                  Sair
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Overlay when menu is open - Available for all users */}
      {showMenu && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 60, // Match the menu position
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onPress={toggleMenu}
        />
      )}
    </>
  );
}
