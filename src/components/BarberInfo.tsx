import React from "react";
import { Box, Text } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { BeardLogo, ComboLogo, HairLogo } from "../utils/Icons";

const BarberInfo = () => {
  return (
    <Box
      mx={10}
      bg="primary.200"
      p={4}
      mt={4}
      borderRadius={8}
      alignItems="center"
    >
      <Text fontSize="xs" mb={0.5} color="primary.300">
        Agente
      </Text>
      <Text fontSize="md" fontWeight="bold" mb={2} color="primary.300">
        Elton Jorge
      </Text>
      <Box flexDirection="row" alignItems="center" mb={2}>
        <Box flexDirection="row" alignItems="center">
          <HairLogo />
          <Text ml={2} color="primary.300">
            10
          </Text>
        </Box>
        <Box flexDirection="row" alignItems="center" ml={4}>
          <BeardLogo />
          <Text ml={2} color="primary.300">
            5
          </Text>
        </Box>
        <Box flexDirection="row" alignItems="center" ml={4}>
          <ComboLogo />
          <Text ml={2} color="primary.300">
            3
          </Text>
        </Box>
      </Box>
      <Text fontSize="xs" mb={0.5} color="primary.300">
        Bónus Acumulado
      </Text>
      <Text fontSize="md" mb={2} color="primary.400">
        $XXXX
      </Text>
    </Box>
  );
};

export default BarberInfo;
