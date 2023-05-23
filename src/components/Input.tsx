import { Input as NativeInput, IInputProps } from "native-base";
import React from "react";

export default function Input({ ...rest }: IInputProps) {
  return (
    <NativeInput
      {...rest}
      height={12}
      width={300}
      mt={8}
      bgColor={"primary.200"}
      borderWidth={0}
      borderRadius={0}
      rounded={2}
      keyboardAppearance={"dark"}
      px={6}
      _focus={{
        bg: "gray.800",
        borderColor: "gray.600",
        borderWidth: "0.2",
        borderTopColor: "blue.500",
      }}
      fontSize={"md"}
      placeholderTextColor={"primary.300"}
    />
  );
}
