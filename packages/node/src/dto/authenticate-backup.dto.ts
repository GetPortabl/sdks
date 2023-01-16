import { EnvType } from "../types/env.type";
import { IAuthResponse } from "./get-token-response.dto";

export interface IAuthenticateBackupSessionRequestDto {
  readonly env: EnvType;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly correlationId: string;
  readonly dataProfileVersion?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAuthenticateBackupSessionResponseDto extends IAuthResponse {}
