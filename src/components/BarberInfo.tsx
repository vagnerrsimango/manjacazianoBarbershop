import React from "react";
import { Box, Text } from "native-base";
import { BeardLogo, ComboLogo, HairLogo } from "../utils/Icons";
import useUser from "../utils/hooks/UserHook";

interface IBarInfo {
  bonus: number;
  stats: Array<{ name: string; qty: string }>;
}

const BarberInfo = ({ bonus, stats }: IBarInfo) => {
  const { user } = useUser();
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
        {user.name}
      </Text>

      <Box flexDirection="row" alignItems="center" mb={2}>
        {stats.length === 3 ? (
          <>
            <Box flexDirection="row" alignItems="center">
              <HairLogo />
              <Text ml={2} color="primary.300">
                {stats[1].qty}
              </Text>
            </Box>
            <Box flexDirection="row" alignItems="center" ml={4}>
              <BeardLogo />
              <Text ml={2} color="primary.300">
                {stats[0].qty}
              </Text>
            </Box>
            <Box flexDirection="row" alignItems="center" ml={4}>
              <ComboLogo />
              <Text ml={2} color="primary.300">
                {stats[2].qty}
              </Text>
            </Box>
          </>
        ) : null}
      </Box>
      <Text fontSize="xs" mb={0.5} color="primary.300">
        Bónus Acumulado este mês
      </Text>
      <Text fontSize="md" mb={2} color="primary.400">
        {bonus} MT
      </Text>
    </Box>
  );
};

export default BarberInfo;
