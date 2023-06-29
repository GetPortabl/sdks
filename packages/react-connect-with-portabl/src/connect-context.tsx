import { createContext } from 'react';
import { DEFAULT_AUTH_STATE, stub } from './constants';
import { IConnectContext } from './types';

export const ConnectContext = createContext<IConnectContext>({
  ...DEFAULT_AUTH_STATE,
  loginWithRedirect: stub,
  getAccessTokenSilently: stub,
  logout: stub,
});
