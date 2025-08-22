import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Input from "../components/Input";
import MyButton from "../components/MyButton";
import CustomModal from "../components/CustomModal";
import { Lock, User } from "phosphor-react-native";
import { BubblesBG } from "../utils/Icons";
import useUser from "../utils/hooks/UserHook";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [pin, setPin] = useState(""); // State to store the input value

  const { loginWithPin, loading } = useUser();

  const handleInputChange = (value: string) => {
    setPin(value); // Update the input value state
  };

  const handlePinRecover = () => {
    setShowModal(true);
  };

  return (
    <View className="flex-1 bg-white w-full h-screen items-center justify-center">
      <Text className="text-xl text-gray-900 font-bold mb-2">
        Iniciar sessão
      </Text>
      <Text className="text-sm text-gray-600 font-light mb-8">
        Por favor insira o seu PIN de 4 dígitos
      </Text>

      <View className="w-4/5 max-w-xs mb-8">
        <Input
          placeholder="PIN"
          value={pin} // Set the value prop to the input value state
          onChangeText={handleInputChange} // Handle input changes
          secureTextEntry
          leftIcon={
            <View className="pl-4">
              <Lock size={20} color="#0052A3" weight="fill" />
            </View>
          }
        />
      </View>

      <View className="w-4/5 max-w-xs">
        <MyButton
          title="Entrar"
          onPress={() => loginWithPin(pin)}
          loading={loading}
        />
      </View>

      <View className="absolute bottom-8">
        {/* <TouchableOpacity onPress={handlePinRecover}>
          <Text className="text-base text-primary-400 font-normal uppercase">
            Esqueceu pin ?
          </Text>
        </TouchableOpacity> */}
      </View>

      <CustomModal opened={showModal} onClose={() => setShowModal(false)}>
        <View className="items-center">
          <BubblesBG />
          <Text className="text-center text-xl text-primary-400 font-bold">
            Contacte o admin
          </Text>
        </View>
      </CustomModal>
    </View>
  );
}
