import { Scissors } from "phosphor-react-native";
import MyButton from "./MyButton";
import { useTheme } from "native-base";
import React from "react";
interface ITag {
  title: string;
}
export default function Tag({ title }: ITag) {
  const { colors } = useTheme();
  return (
    <MyButton
      title={title}
      bg="muted.400"
      p={"2"}
      w={"40"}
      mx={"2"}
      weight="700"
      height={10}
      leftIcon={<Scissors color={colors.white} size={16} />}
    />
  );
}
