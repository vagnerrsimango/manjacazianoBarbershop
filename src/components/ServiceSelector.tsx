import { Button, HStack, Text } from "native-base";
import { Plus } from "phosphor-react-native";
import { useState } from "react";

export interface IServiceSelectorProps {
  id?: string | number;
  name?: string;
  price?: number;
  category?: "Cabelo" | "Barba" | "Cabelo e Barba";
}

export interface IServiceSelectorComponentProps extends IServiceSelectorProps {
  service: IServiceSelectorProps;
  handlePressed: (service: IServiceSelectorProps) => void;
}
export default function ServiceSelector({
  service,
  handlePressed,
}: IServiceSelectorComponentProps) {
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
      ml={4}
    >
      <Text
        color={"primary.300"}
        fontWeight={"extrabold"}
        fontSize={"sm"}
        px={4}
      >
        {service?.name}
      </Text>

      <Button
        ml={"8"}
        backgroundColor={!pressed ? "primary.300" : "primary.400"}
        _pressed={{
          bg: "primary.400",
          opacity: 0.7,
        }}
        onPress={() => {
          setPressed(!pressed);
          handlePressed(service);
        }}
      >
        <Plus size={16} color="white" weight="bold" />
      </Button>
    </HStack>
  );
}
