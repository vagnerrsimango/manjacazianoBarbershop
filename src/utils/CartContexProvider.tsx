import React, { useState } from "react";
import { IServiceSelectorProps } from "../components/ServiceSelector";
import { CartContext, ICartContextData } from "./AppContext";

interface ICartProvider {
  children: React.ReactNode;
}

export default function CartContextProvider({ children }: ICartProvider) {
  const [services, setServices] = useState<IServiceSelectorProps[]>([]);

  const addService = (service: IServiceSelectorProps) => {
    setServices((prev) => [...prev, service]);
  };

  const removeService = (service: IServiceSelectorProps) => {
    setServices((prev) => prev.filter((s) => s.id !== service.id));
  };

  return (
    <CartContext.Provider
      value={{
        services,
        setServices,
        removeService,
        addService,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
