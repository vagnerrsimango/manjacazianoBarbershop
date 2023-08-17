import React from "react";
import { Box, HStack, VStack, Text, Spacer, Image } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ClientList({ item }) {
  return (
    <Box borderWidth={1} borderColor="black" borderRadius={8} p={3} mb={4}>
      <HStack space={[2, 3]} justifyContent="space-between" w={"80%"} mt={2}>
        <Icon name="user-circle" size={48} color="black" />
        <VStack ml={"10"}>
          <Text color="black" bold fontSize="md">
            {item.name}
          </Text>
          <Text fontSize="md" color="black" alignSelf="flex-start">
            {item.phone}
          </Text>
        </VStack>
        <Spacer />
        <Text color={"red.500"} fontSize="md">
          {item.balance}
        </Text>
      </HStack>
    </Box>
  );
}
