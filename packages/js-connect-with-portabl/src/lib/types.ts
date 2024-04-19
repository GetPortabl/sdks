import { IVerifiablePresentation as ISphereonVerifiablePresentation } from '@sphereon/ssi-types';

export interface IConnectClientOptions {
  readonly organizationId: string;
  readonly connectDomain: string;
  readonly passportDomain: string;
  readonly projectId: string;
}

export interface ITokenEndpointResponse {
  readonly access_token: string;
}

export interface IIdTokenClaims {
  readonly iat: number;
  readonly exp: number;
  readonly iss: string;
  readonly sub: string;
  readonly aud: string;
  readonly nonce: string;
}
export interface IVerifiablePresentation
  extends ISphereonVerifiablePresentation {}

export interface IGetAuthResponseDto {
  readonly id_token: string;
  readonly vp_token?: IVerifiablePresentation;
}

export interface ICreateTransactionResponse {
  readonly authRequestUri: string;
  readonly transactionId: string;
  readonly nonce: string;
  readonly state: string;
}

export interface IVPToken {
  proof: {
    challenge: string;
  };
}

export type GetResponseDataResponse = {
  id_token: string;
  vp_token?: IVPToken;
};

export type GetAccessTokenResponse = {
  access_token: string;
};

export type CreateTransactionResponse = {
  authRequestUri: string;
  transactionId: string;
  nonce: string;
  state: string;
};
