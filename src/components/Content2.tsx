import React from "react";
import { VStack, Flex } from "native-base";
import CutSelection from "./CutSelection";

// Component for the Skeleton content
const Content2 = () => (
  <Flex direction="row">
    <CutSelection mr={10} my={1} />
    <CutSelection my={1} />
  </Flex>
);

export default Content2;
