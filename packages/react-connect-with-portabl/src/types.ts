import { GetAccessTokenResponse } from '@portabl/js-connect-with-portabl';

export interface IConnectContext extends IConnectAuthState {
  loginWithRedirect: () => Promise<void>;
  getAccessTokenSilently: () => Promise<GetAccessTokenResponse>;
  logout: () => void;
}

export interface IConnectAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
}
