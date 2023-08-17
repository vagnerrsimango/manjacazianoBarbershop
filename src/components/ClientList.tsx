import React from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Spacer,
  Image,
  useTheme,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";

export default function ClientList({ item, callModal }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={callModal}>
      <Box
        borderBottomWidth={1}
        borderColor="primary.300"
        borderRadius={8}
        p={3}
        mb={4}
      >
        <HStack space={[2, 3]} justifyContent="space-between" w={"80%"} mt={2}>
          <Icon name="user-circle" size={48} color={colors.primary[500]} />
          <VStack ml={"10"}>
            <Text color="black" bold fontSize="md">
              {item.name}
            </Text>
            <Text fontSize="md" color="primary.500" alignSelf="flex-start">
              contacto - {item.phone}
            </Text>
          </VStack>
          <Spacer />
          <Text color={"red.500"} fontSize="md" fontWeight={"bold"}>
            {item.balance}
          </Text>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
}
