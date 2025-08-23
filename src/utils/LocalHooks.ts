import { useContext } from 'react';
import { CartContext } from './AppContext';

export function useCart() {
  return useContext(CartContext);
}
