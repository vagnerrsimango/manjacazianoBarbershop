import React, { useState } from "react";
import { IServiceSelectorProps } from "../components/ServiceSelector";
import { CartContext, ICartContextData } from "./AppContext";

interface ICartProvider {
  children: React.ReactNode;
}

export default function CartContextProvider({ children }: ICartProvider) {
  const [services, setServices] = useState<IServiceSelectorProps[]>([]);

  const removeService = (service: IServiceSelectorProps) => {};

  return (
    <CartContext.Provider
      value={{
        services,
        setServices,
        removeService,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
