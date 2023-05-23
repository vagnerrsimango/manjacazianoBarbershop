import { Button as NButton, Text, IButtonProps } from "native-base";
interface ButtonProps extends IButtonProps {
  title: string;
  type?: "PRIMARY" | "SECONDARY";
}
export default function Button({
  title,
  type = "PRIMARY",
  ...rest
}: ButtonProps) {
  return (
    <NButton
      w="full"
      h={12}
      rounded="sm"
      textTransform="uppercase"
      bg={type == "SECONDARY" ? "red.500" : "secondary.500"}
      {...rest}
      _pressed={{
        bg: type == "SECONDARY" ? "red.600" : "yellow.600",
      }}
      _loading={{
        _spinner: { color: "black" },
      }}
    >
      <Text
        fontSize="xs"
        color={type == "SECONDARY" ? "white" : "white"}
        fontFamily="heading"
        textTransform={"uppercase"}
        fontWeight="bold"
      >
        {title}
      </Text>
    </NButton>
  );
}
