import { Button, HStack, Text } from "native-base";
import { Plus } from "phosphor-react-native";
import { useState } from "react";

export default function ServiceSelector() {
  const [pressed, setPressed] = useState(false);
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

      <Button
        ml={"8"}
        backgroundColor={!pressed ? "primary.300" : "primary.400"}
        _pressed={{
          bg: "primary.400",
          opacity: 0.7,
        }}
        onPress={() => setPressed(!pressed)}
      >
        <Plus size={16} color="white" weight="bold" />
      </Button>
    </HStack>
  );
}
