import { Input as NativeInput, IInputProps } from "native-base";
import React from "react";

interface MyInputProps extends IInputProps {
  width?: string | number;
  height?: string | number;
  fontSize?: string | number;
  rounded?: number;
}

export default function Input({
  width = "8",
  height = "12",
  fontSize = "md",
  rounded = 4,
  ...rest
}: IInputProps) {
  return (
    <NativeInput
      {...rest}
      height={height}
      width={width}
      mt={8}
      color={"#000"}
      bgColor={"primary.200"}
      borderWidth={0}
      borderRadius={0}
      rounded={rounded}
      keyboardAppearance={"dark"}
      px={4}
      _focus={{
        bg: "gray.100",
        borderColor: "primary.400",
        borderWidth: "0.5",
        color: "primary.400",
      }}
      fontSize={fontSize}
      placeholderTextColor={"primary.300"}
    />
  );
}
