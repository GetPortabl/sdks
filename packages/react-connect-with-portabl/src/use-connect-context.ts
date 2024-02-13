import { useContext } from 'react';
import { ConnectContext } from './connect-context';

export const useConnect = () => {
  const context = useContext(ConnectContext);

  return context;
};
