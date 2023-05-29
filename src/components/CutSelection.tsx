import React from "react";
import { Box, Icon, Button, VStack, Flex } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ServiceSelector from "./ServiceSelector";

interface IcutSession {
  children: React.ReactNode;
}

const CutSelection = ({ children, ...rest }: IcutSession) => {
  return (
    <Box mt={10} {...rest}>
      <Flex direction="row" alignItems="center" mt={4}>
        {children}
        <VStack ml={4} alignItems="center">
          <ServiceSelector />
          <ServiceSelector />
          <ServiceSelector />
        </VStack>
      </Flex>
    </Box>
  );
};

export default CutSelection;
