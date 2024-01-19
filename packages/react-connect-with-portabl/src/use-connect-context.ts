import { useContext } from 'react';
import { ConnectContext } from './connect-context';
import { RESPONSE_CODE_REGEX } from './constants';

export const hasResponseCode = (
  searchParams = window.location.search,
): boolean => RESPONSE_CODE_REGEX.test(searchParams);

export const useConnect = () => {
  const context = useContext(ConnectContext);

  return context;
};
