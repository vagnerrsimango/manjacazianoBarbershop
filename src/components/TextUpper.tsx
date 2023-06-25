import React from "react";
import { Text } from "native-base";

// import { Container } from './styles';

const TextUpper = ({ children, ...rest }) => {
  return (
    <Text style={{ textTransform: "uppercase" }} {...rest}>
      {children}
    </Text>
  );
};

export default TextUpper;
