import React from "react";
import { Box, Text, Modal, Icon, Flex } from "native-base";
import Input from "../components/Input";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AdminScreen() {
  return (
    <Box bg="primary.100" flex={1}>
      <Flex
        direction="row"
        justifyContent="space-between"
        p={4}
        position="absolute"
        top={0}
        left={0}
        right={0}
      >
        <Box>
          <Text fontSize="lg" color="primary.300" fontWeight="thin">
            Manjacaziano
          </Text>
        </Box>
        <Flex direction="row" alignItems="center">
          <Input width={200} placeholder="Pesquisar" />
          <MaterialCommunityIcons
            name="magnify"
            size={24}
            color="primary.300"
          />
        </Flex>
      </Flex>
    </Box>
  );
}
