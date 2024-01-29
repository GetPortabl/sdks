import { createContext } from 'react';
import { DEFAULT_AUTH_STATE, stub } from './constants';
import { IConnectContext } from './types';

export const ConnectContext = createContext<IConnectContext>({
  ...DEFAULT_AUTH_STATE,
  authorizeWithRedirect: stub,
  resetAuthorization: stub,
});
