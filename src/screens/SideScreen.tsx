import React, { useEffect, useState } from "react";
import { Box, Text, Modal, Icon, Center, Image } from "native-base";
import { theme } from "../utils/theme";
import Input from "../components/Input";
import MyButton from "../components/MyButton";
import { useNavigation } from "@react-navigation/native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import CustomModal from "../components/CustomModal";
import { Lock, User } from "phosphor-react-native";
import { BubblesBG } from "../utils/Icons";
import useUser from "../utils/hooks/UserHook";
import api from "../utils/network/api";

export default function SideScreen() {
  const navigation = useNavigation();
  const [cut, setCut] = useState();
  const [input, setInput] = useState("");

  // function pra puxar os dados
  useEffect(() => {
    async function getCategories() {
      // setting endpoint
      const response = await api.get("/category");

      console.log(response.data);
      const dataList = response.data;
      setCut(dataList.data);
    }
    getCategories();
  }, [cut, input]);

  const { loginWithPin } = useUser();

  const [loading, setLoading] = useState(false); // State to indicate if button is loading or not

  const handleEnter = async () => {
    const response = await api.post("/category", {
      name: input,
    });
    setInput("");
    if (response.data.success == true) {
      alert("sucesso");
    }
  };

  return (
    <Box
      bg={"primary.100"}
      flex={1}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Text fontSize="xl" color="primary.300" fontWeight="bold">
        SideScreeneeee
      </Text>
      <Input
        placeholder="PIN"
        width={"40%"}
        mt={"16"}
        value={input}
        // getting element by id
        onChangeText={(text) => setInput(text)}
        InputLeftElement={
          <Box pl={4}>
            <Lock size={20} color={theme.colors.primary["300"]} weight="fill" />
          </Box>
        }
      />
      <MyButton title="Entrar" onPress={handleEnter} mt={"12"} width={"xs"} />

      <FlatList
        data={cut}
        renderItem={(element) => (
          <Text fontSize="xl" color="primary.300" fontWeight="bold">
            {element.item.name}
          </Text>
        )}
      />
    </Box>
  );
}
