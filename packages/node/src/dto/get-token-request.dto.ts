export interface IGetTokenArgs {
  readonly grantType?: string;
  readonly clientId?: string;
  readonly clientSecret?: string;
  readonly audience?: string;
  readonly scope?: string;
}

export interface ICustomClaims {
  readonly correlationId: string;
  readonly dataProfileId?: string;
}

export interface IGetClientTokenRequestBodtDto
  extends IGetTokenArgs,
    ICustomClaims {}
