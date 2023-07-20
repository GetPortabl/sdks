import { ITokenEndpointResponse } from '@portabl/js-connect-with-portabl';

export interface IConnectContext extends IConnectAuthState {
  loginWithRedirect: () => Promise<void>;
  getAccessTokenSilently: () => Promise<ITokenEndpointResponse>;
  logout: () => void;
}

export interface IConnectAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
}
