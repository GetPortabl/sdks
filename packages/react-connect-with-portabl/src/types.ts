import {
  IIdTokenClaims,
  IVerifiablePresentation,
} from '@portabl/js-connect-with-portabl';

export interface IConnectContext extends IConnectAuthState {
  authorizeWithRedirect: () => Promise<void>;
  resetAuthorization: () => void;
}

export interface IConnectAuthState {
  isLoading: boolean;
  isHandlingResponse: boolean;
  isInitiating: boolean;
  isAuthorized: boolean;
  user?: IIdTokenClaims;
  idTokenJwt?: string;
  vpToken?: IVerifiablePresentation;
}
