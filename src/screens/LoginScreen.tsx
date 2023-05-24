import React, { useState } from "react";
import { Box, Text, Modal, Icon, Center } from "native-base";
import { theme } from "../utils/theme";
import Input from "../components/Input";
import MyButton from "../components/MyButton";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomModal from "../components/CustomModal";
import { User } from "phosphor-react-native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  const handleEnter = () => {
    navigation.navigate("Home");
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
        Por favor insira o seu PIN de 6 dígitos
      </Text>
      <Input placeholder="PIN" width={"50%"} mt={"16"} />
      <MyButton title="Entrar" onPress={handleEnter} mt={"16"} width={"xs"} />

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
