import React, { useState } from 'react';
import { IServiceSelectorProps } from '../components/ServiceSelector';
import { CartContext, ICartContextData } from './AppContext';

interface ICartProvider {
  children: React.ReactNode;
}

export default function CartContextProvider({ children }: ICartProvider) {
  const [services, setServices] = useState<ICartContextData>();

  const removeService = (service: IServiceSelectorProps) => {};

  return (
    <CartContext.Provider
      value={{
        services: [
          { category: 'Barba', name: 'Lázaro Tobias', price: 1000, id: 1 },
        ],
        setServices,
        removeService,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
