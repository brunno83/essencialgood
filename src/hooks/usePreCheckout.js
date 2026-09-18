import { useContext } from 'react';
import { PreCheckoutContext } from '../context/PreCheckoutContext';

export function usePreCheckout() {
  const context = useContext(PreCheckoutContext);
  if (!context) {
    throw new Error('usePreCheckout must be used within a PreCheckoutProvider');
  }
  return context;
}

export default usePreCheckout;
