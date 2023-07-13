import { IConnectAuthState } from './types';

export const RESPONSE_CODE_REGEX = /[?&]response_code=[^&]+/;

export const DEFAULT_AUTH_STATE: IConnectAuthState = {
  isLoading: true,
  isAuthenticated: false,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const noop = (...args: any[]): any => {};

export const stub = (): never => {
  throw new Error('You forgot to wrap your component in <ConnectProvider>.');
};
