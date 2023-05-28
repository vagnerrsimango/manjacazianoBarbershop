import React from "react";
import { VStack, Skeleton, Flex } from "native-base";

// Component for the Skeleton content
const Content1 = () => (
  <Flex flex={1} justifyContent="center" alignItems="center" mt={4}>
    <VStack space={4} alignItems="center">
      <Skeleton height={300} width={300} borderRadius={8} />
      <Skeleton height={10} width={300} borderRadius={8} />
      <Skeleton height={10} width={300} borderRadius={8} />
      <Skeleton height={10} width={300} borderRadius={8} />
    </VStack>
  </Flex>
);

export default Content1;
