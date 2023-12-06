import React, { useState } from "react";
import { Box, Modal, Icon, Center, Image } from "native-base";
import { theme } from "../utils/theme";
import Input from "../components/Input";
import MyButton from "../components/MyButton";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomModal from "../components/CustomModal";
import { Lock, User } from "phosphor-react-native";
import { BubblesBG } from "../utils/Icons";
import useUser from "../utils/hooks/UserHook";
import TextUpper from "../components/TextUpper";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [pin, setPin] = useState(""); // State to store the input value

  const { loginWithPin, loading } = useUser();

  const handleInputChange = (value) => {
    setPin(value); // Update the input value state
  };

  const handlePinRecover = () => {
    setShowModal(true);
  };

  return (
    <Box
      bg={"primary.100"}
      flex={1}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <TextUpper fontSize="xl" color="primary.300" fontWeight="bold">
        Iniciar sessão
      </TextUpper>

      <TextUpper fontSize="sm" color="primary.300" fontWeight={"thin"}>
        Insira o seu PIN de 4 dígitos
      </TextUpper>
      <Input
        placeholder="PIN"
        value={pin} // Set the value prop to the input value state
        onChangeText={handleInputChange} // Handle input changes
        width={"xs"}
        mt={"16"}
        maxLength={4}
        keyboardType="numeric"
        InputLeftElement={
          <Box pl={4}>
            <Lock size={20} color={theme.colors.primary["300"]} weight="fill" />
          </Box>
        }
      />
      <MyButton
        title="Entrar"
        onPress={() => loginWithPin(pin)}
        mt={"12"}
        width={"xs"}
        isLoading={loading}
      />

      <Box position={"absolute"} bottom={"1"}>
        <TouchableOpacity onPress={handlePinRecover}>
          <TextUpper
            fontSize="md"
            color="primary.400"
            fontWeight={"normal"}
            TextUpperTransform={"uppercase"}
          >
            Esqueceu pin ?
          </TextUpper>
        </TouchableOpacity>
      </Box>

      <CustomModal opened={showModal} onClose={() => setShowModal(false)}>
        <Box TextUpperAlign="center">
          <BubblesBG />
          <TextUpper
            TextUpperAlign={"center"}
            fontSize="xl"
            color="primary.400"
            fontWeight="bold"
          >
            Seja bem-vindo
          </TextUpper>
        </Box>
      </CustomModal>
    </Box>
  );
}
