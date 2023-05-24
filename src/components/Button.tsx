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
      mt={2}
      w={100}
      h={12}
      borderWidth={0}
      borderRadius={0}
      textTransform="uppercase"
      bg={"primary.300"}
      {...rest}
      _pressed={{
        bg: type == "SECONDARY" ? "red.600" : "primary.400",
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
        fontWeight="normal"
      >
        {title}
      </Text>
    </NButton>
  );
}
