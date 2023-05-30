import { createContext } from 'react';
import { IServiceSelectorProps } from '../components/ServiceSelector';

export interface ICartContextData {
  services: Array<IServiceSelectorProps>;
  setServices: any;
  removeService?: (service: IServiceSelectorProps) => void;
}
export const CartContext = createContext<ICartContextData>(
  {} as ICartContextData
);
