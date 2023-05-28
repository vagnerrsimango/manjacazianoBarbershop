import React from "react";
import { VStack, Flex } from "native-base";
import Input from "./Input";

// Component for the Skeleton content
const Content3 = () => (
  <Flex flex={1} justifyContent="center" alignItems="center" mt={4}>
    <VStack space={4} alignItems="center">
      <Input placeholder="Nome" width={"50%"} mt={"16"} />
      <Input placeholder="Nome" width={"50%"} mt={"16"} />
      <Input placeholder="Nome" width={"50%"} mt={"16"} />
      <Input placeholder="Nome" width={"50%"} mt={"16"} />
    </VStack>
  </Flex>
);

export default Content3;
