import { Input as NativeInput, IInputProps } from "native-base";
import React from "react";
interface myInputProps extends IInputProps {
  place: string;
}
export default function Vagner({ place, ...rest }: myInputProps) {
  return (
    <NativeInput
      {...rest}
      height={12}
      mt={8}
      placeholder={place}
      bgColor={"primary.200"}
      rounded={4}
      keyboardAppearance={"dark"}
      px={6}
      _focus={{
        bg: "gray.800",
        borderColor: "gray.600",
        borderWidth: "4",
        borderTopColor: "blue.500",
      }}
      fontSize={"md"}
    />
  );
}
