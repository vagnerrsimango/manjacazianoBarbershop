import { useState } from "react";
import { IServiceSelectorProps } from "../components/ServiceSelector";
import { CartContext, ICartContextData } from "./AppContext";

export default function CartContextProvider({ children }) {
  const [cartItem, setCartItem] = useState<IServiceSelectorProps>(
    {} as IServiceSelectorProps
  );
  const [cart, setCart] = useState<ICartContextData>();

  const addService = (service: IServiceSelectorProps) => {};

  const removeService = (service: IServiceSelectorProps) => {};

  return (
    <CartContext.Provider value={{ services: cart, addService, removeService }}>
      {children}
    </CartContext.Provider>
  );
}
