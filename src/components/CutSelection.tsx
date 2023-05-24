import React from "react";
import { Box, Icon, Button, VStack, Flex } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CutSelection = ({ ...rest }) => {
  return (
    <Box {...rest} mt={10}>
      <Flex direction="row" alignItems="center" mt={4}>
        <Icon
          as={MaterialCommunityIcons}
          name="scissors-cutting"
          size={100}
          color="primary.300"
        />
        <VStack ml={4} alignItems="center">
          <Button
            size="sm"
            colorScheme="primary"
            endIcon={
              <Icon
                as={MaterialCommunityIcons}
                name="plus"
                size={4}
                color="white"
              />
            }
            bg="primary.400"
            width={100}
            _pressed={{ bg: "primary.500" }}
            {...rest}
          >
            Cortar
          </Button>
          <Button
            size="sm"
            colorScheme="primary"
            endIcon={
              <Icon
                as={MaterialCommunityIcons}
                name="plus"
                size={4}
                color="white"
              />
            }
            bg="primary.400"
            width={100}
            _pressed={{ bg: "primary.500" }}
            {...rest}
          >
            Alinhar
          </Button>
          <Button
            size="sm"
            colorScheme="primary"
            endIcon={
              <Icon
                as={MaterialCommunityIcons}
                name="plus"
                size={4}
                color="white"
              />
            }
            bg="primary.400"
            width={100}
            _pressed={{ bg: "primary.500" }}
            {...rest}
          >
            Lavar
          </Button>
        </VStack>
      </Flex>
    </Box>
  );
};

export default CutSelection;
