import { Fab } from "native-base";
import { InterfaceFabProps } from "native-base/lib/typescript/components/composites/Fab/types";
import { Icon, Power } from "phosphor-react-native";
import React from "react";

export default function MyFab({ onPress, ...rest }: InterfaceFabProps) {
  return (
    <Fab
      shadow={2}
      size="sm"
      icon={<Power size={32} color="#fff" />}
      bottom={"14%"}
      onPress={onPress}
    />
  );
}
