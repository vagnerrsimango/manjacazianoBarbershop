import React, { useState } from "react";
import { Box, Text, Modal, Icon, Center } from "native-base";
import { theme } from "../utils/theme";
import Input from "../components/Input";
import MyButton from "../components/MyButton";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomModal from "../components/CustomModal";
import { Lock, User } from "phosphor-react-native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [pin, setPin] = useState(""); // State to store the input value

  const [loading, setLoading] = useState(false); // State to indicate if button is loading or not

  const handleEnter = () => {
    setLoading(!loading);
    if (pin === "0000") {
      navigation.navigate("Home");
    } else if (pin === "1111") {
      navigation.navigate("Admin");
    } else {
      console.log("Invalid input");
    }
  };

  const handleInputChange = (value) => {
    setPin(value); // Update the input value state
  };

  const hanlePinRecover = () => {
    setShowModal(true);
  };

  return (
    <Box
      bg={"primary.100"}
      flex={1}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Text fontSize="xl" color="primary.300" fontWeight="bold">
        Iniciar sessão
      </Text>
      <Text fontSize="sm" color="primary.300" fontWeight={"thin"}>
        Por favor insira o seu PIN de 4 dígitos
      </Text>
      <Input
        placeholder="PIN"
        value={pin} // Set the value prop to the input value state
        onChangeText={handleInputChange} // Handle input changes
        width={"40%"}
        mt={"16"}
        InputLeftElement={
          <Box pl={4}>
            <Lock size={20} color={theme.colors.primary["300"]} weight="fill" />
          </Box>
        }
      />
      <MyButton
        title="Entrar"
        onPress={handleEnter}
        mt={"12"}
        width={"xs"}
        isLoading={loading}
      />

      <Box position={"absolute"} bottom={"1"}>
        <TouchableOpacity onPress={hanlePinRecover}>
          <Text
            fontSize="md"
            color="primary.400"
            fontWeight={"normal"}
            textTransform={"uppercase"}
          >
            Esqueceu pin ?
          </Text>
        </TouchableOpacity>
      </Box>

      <CustomModal opened={showModal} onClose={() => setShowModal(false)}>
        <Box>
          <Text
            textTransform={"uppercase"}
            size={"lg"}
            fontWeight={"bold"}
            color={"primary.400"}
          >
            Tens novo pin{" "}
          </Text>
        </Box>
      </CustomModal>
    </Box>
  );
}
