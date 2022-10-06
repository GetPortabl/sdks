export interface IAuthResponse {
  readonly tokenType: 'Bearer';
  readonly scope: string;
  readonly accessToken: string;
  readonly expiresIn: number;
  readonly refreshToken?: string;
  readonly idToken?: string;
}

export interface IGetAuthTokenResponseBodyDto extends IAuthResponse {}
