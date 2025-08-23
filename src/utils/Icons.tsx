import React from "react";
import { SvgProps } from "react-native-svg";
import { View, Text } from "react-native";

// Import SVG components directly
import Logo from "../assets/logo.svg";
import Hair from "../assets/services/hair.svg";
import Beard from "../assets/services/beard.svg";
import Extra from "../assets/services/extra.svg";
import Combo from "../assets/services/combo.svg";
import Bubbles from "../assets/services/Check + Bubles.svg";
import MenuIcon from "../assets/menu.svg";

// Debug: Log what we're importing
console.log("SVG Imports:", {
  Logo: typeof Logo,
  Hair: typeof Hair,
  Beard: typeof Beard,
  Extra: typeof Extra,
  Combo: typeof Combo,
  Bubbles: typeof Bubbles,
  MenuIcon: typeof MenuIcon,
});

// Fallback component for when SVG fails to load
const FallbackIcon = ({
  width = 100,
  height = 100,
  color = "#000",
}: SvgProps) => (
  <View
    style={{
      width: Number(width),
      height: Number(height),
      backgroundColor: color,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
      SVG
    </Text>
  </View>
);

export const MainLogo = ({ width = 100, height = 100, color }: SvgProps) => {
  try {
    return <Logo width={width} height={height} color={color} />;
  } catch (error) {
    console.warn("MainLogo SVG failed:", error);
    return <FallbackIcon width={width} height={height} color={color} />;
  }
};

export const HairLogo = ({ width = 100, height = 100, color }: SvgProps) => {
  try {
    return <Hair width={width} height={height} color={color} />;
  } catch (error) {
    console.warn("HairLogo SVG failed:", error);
    return <FallbackIcon width={width} height={height} color={color} />;
  }
};

export const BeardLogo = ({ width = 100, height = 100, color }: SvgProps) => {
  try {
    return <Beard width={width} height={height} color={color} />;
  } catch (error) {
    console.warn("BeardLogo SVG failed:", error);
    return <FallbackIcon width={width} height={height} color={color} />;
  }
};

export const ExtraLogo = ({ width = 100, height = 100, color }: SvgProps) => {
  try {
    return <Extra width={width} height={height} color={color} />;
  } catch (error) {
    console.warn("ExtraLogo SVG failed:", error);
    return <FallbackIcon width={width} height={height} color={color} />;
  }
};

export const ComboLogo = ({ width = 100, height = 100, color }: SvgProps) => {
  try {
    return <Combo width={width} height={height} color={color} />;
  } catch (error) {
    console.warn("ComboLogo SVG failed:", error);
    return <FallbackIcon width={width} height={height} color={color} />;
  }
};

export const BubblesBG = ({ width = 340, height = 100, color }: SvgProps) => {
  try {
    return <Bubbles width={width} height={height} color={color} />;
  } catch (error) {
    console.warn("BubblesBG SVG failed:", error);
    return <FallbackIcon width={width} height={height} color={color} />;
  }
};

export const MenuSvg = ({ width = 340, height = 100, color }: SvgProps) => {
  try {
    return <MenuIcon width={width} height={height} color={color} />;
  } catch (error) {
    console.warn("MenuSvg SVG failed:", error);
    return <FallbackIcon width={width} height={height} color={color} />;
  }
};
