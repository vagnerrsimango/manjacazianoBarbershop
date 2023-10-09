import React, { useEffect, useState } from "react";
import {
  FlatList,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
  useTheme,
} from "native-base";
import AutocompleteInput from "react-native-autocomplete-input";
import { StyleSheet } from "react-native";
import CustomInput from "./Input";
import { MaterialIcons } from "@expo/vector-icons";
import api from "../utils/network/api";
import { UserCircle } from "phosphor-react-native";

export default function AutoCompleteInputComp({
  handleSelectedAutoCustomer,
  input,
  setInput,
}) {
  // const [input, setInput] = useState<string>();

  useEffect(() => {}, [input]);
  const [data, setData] = useState([]);

  const { colors } = useTheme();

  const handleInputChange = async (text: string) => {
    setInput(text);

    console.log(input);

    try {
      const { data } = await api.get(`/client/search/${text}`);
      setData(data.clients);
    } catch (error) {
      console.log(
        "🚀 ~ file: AutoCompletInput.tsx:39 ~ handleInputChange ~ error:",
        error
      );
    }
  };

  // const handleSelectedAutoCustomer = (customer) => {
  //   console.log(customer);
  // };

  return (
    <VStack
      w={"100%"}
      maxHeight={"40%"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <CustomInput
        onChangeText={(value) => handleInputChange(value)}
        value={input}
        w={{
          base: "75%",
          md: "25%",
        }}
        fontWeight={"light"}
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="person" />}
            size={5}
            ml="2"
            color="muted.400"
          />
        }
        placeholder="Nome"
      />

      {data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <>
              <Pressable
                onPress={() => {
                  handleSelectedAutoCustomer(item);
                  // setData([]);
                }}
              >
                <HStack
                  borderBottomColor={"gray.100"}
                  borderBottomWidth={"2"}
                  p={1}
                  justifyContent={"center"}
                  alignItems={"center"}
                  width={"100%"}
                >
                  <UserCircle color={colors.gray[500]} />
                  <Text color={"primary.300"} ml={"0.5"} fontSize={"md"}>
                    {item.name} - {item.phone} ({item.balance} MT)
                  </Text>
                </HStack>
              </Pressable>
            </>
          )}
        />
      ) : null}
    </VStack>
  );
}
