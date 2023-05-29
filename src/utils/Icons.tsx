import Logo from "../assets/logo.svg";
import Hair from "../assets/services/hair.svg";
import Beard from "../assets/services/beard.svg";

interface SVGProps {
  width?: string | number;
  height?: string | number;
  color?: string;
}

export const MainLogo = ({ width = 100, height = 100, color }: SVGProps) => {
  return <Logo width={width} height={height} color={color} />;
};
export const HairLogo = ({ width = 100, height = 100, color }: SVGProps) => {
  return <Hair width={width} height={height} color={color} />;
};
export const BeardLogo = ({ width = 100, height = 100, color }: SVGProps) => {
  return <Beard width={width} height={height} color={color} />;
};
