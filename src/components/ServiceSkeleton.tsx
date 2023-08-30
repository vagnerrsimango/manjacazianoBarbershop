import React from "react";
import { Center, VStack, Skeleton } from "native-base";

const ServiceSkeleton = () => {
  return (
    <Center>
      <VStack w="40" maxW="400" rounded="md">
        <Skeleton.Text px="1/6" />
      </VStack>
    </Center>
  );
};

export default ServiceSkeleton;
