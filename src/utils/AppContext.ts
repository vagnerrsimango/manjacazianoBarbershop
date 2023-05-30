import { createContext } from "react";
import { IServiceSelectorProps } from "../components/ServiceSelector";

export interface ICartContextData {
  services: Array<IServiceSelectorProps>;
  addService: (service: IServiceSelectorProps) => void;
  removeService: (service: IServiceSelectorProps) => void;
}
export const CartContext = createContext<ICartContextData>(
  {} as ICartContextData
);
