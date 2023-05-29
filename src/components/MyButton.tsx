import { Button as NButton, Text, IButtonProps } from "native-base";
interface ButtonProps extends IButtonProps {
  title: string;
  type?: "PRIMARY" | "SECONDARY";
  weight?: string;
}

export default function MyButton({
  title,
  bg,
  weight = "normal",
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
      bg={bg || "primary.300"} // Use the passed bg prop or fallback to a default value
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
        fontWeight={weight}
      >
        {title}
      </Text>
    </NButton>
  );
}
