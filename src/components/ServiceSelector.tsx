import { Button, HStack, Text } from "native-base";
import { Plus } from "phosphor-react-native";

export default function ServiceSelector() {
  return (
    <HStack
      justifyContent={"space-between"}
      bg={"gray.100"}
      px={"1"}
      py={1}
      alignItems={"center"}
      rounded={2}
      my={1}
    >
      <Text
        color={"primary.300"}
        fontWeight={"extrabold"}
        fontSize={"sm"}
        px={4}
      >
        Cortar
      </Text>

      <Button ml={"8"} backgroundColor={"primary.300"}>
        <Plus size={16} color="white" weight="bold" />
      </Button>
    </HStack>
  );
}
