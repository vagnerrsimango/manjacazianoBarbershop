import { MaterialIcons } from "@expo/vector-icons";
import { Icon, Stack, Text } from "native-base";
import Input from "./Input";

export default function CustomerDataForm() {
  return (
    <Stack space={1} w="100%" alignItems="center">
      <Text fontWeight={"normal"} fontSize={"md"} color={"primary.300"} p={2}>
        Dados do cliente
      </Text>
      <Input
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
      <Input
        w={{
          base: "75%",
          md: "25%",
        }}
        fontWeight={"light"}
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="phone" />}
            size={5}
            ml="2"
            color="muted.400"
          />
        }
        placeholder="Contacto"
      />
    </Stack>
  );
}
