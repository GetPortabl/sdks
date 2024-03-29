import { IConnectAuthState } from './types';

export const RESPONSE_CODE_SEARCH_PARAM = 'response_code';

export const DEFAULT_AUTH_STATE: IConnectAuthState = {
  isLoading: false,
  isAuthorized: false,
  isInitiating: false,
  isHandlingResponse: false,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const noop = (...args: any[]): any => {};

export const stub = (): never => {
  throw new Error('You forgot to wrap your component in <ConnectProvider>.');
};
