import React from "react";
import { Center, VStack, Skeleton } from "native-base";

const ClientSkeleton = () => {
  return (
    <Center>
      <VStack w="100%" maxW="800" rounded="md" space={2}>
        <Skeleton flex="1" h="150" rounded="md" startColor="indingo.300" />
        <Skeleton size="100" rounded="full" />
        <Skeleton h="100" flex="1" rounded="full" />
        <Skeleton h="3" flex="1" rounded="full" startColor="indigo.300" />
      </VStack>
    </Center>
  );
};

export default ClientSkeleton;
