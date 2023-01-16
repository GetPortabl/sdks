import {
  BACKUP_SESSIONS_ROUTE,
  AUTHENTICATE_ROUTE,
  PROVIDER_NATIVE_USER_ID_ROUTE,
  LOAD_DATA_ROUTE,
} from '../constants';
import {
  IAuthenticateBackupSessionRequestDto,
  IAuthenticateBackupSessionResponseDto,
  ICreateNativeUserIdMappingRequestDto,
  ILoadBackupDataRequestDto,
  ILoadBackupDataResponseDto,
} from '../dto';
import { ProviderApiBaseClient } from './provider-api-base.client';

export class ProviderApiClient extends ProviderApiBaseClient {
  async authorizeBackup(args: {
    readonly body: IAuthenticateBackupSessionRequestDto;
  }): Promise<IAuthenticateBackupSessionResponseDto> {
    const { body } = args;

    return this.post({
      relativePath: `${BACKUP_SESSIONS_ROUTE}${AUTHENTICATE_ROUTE}`,
      body,
    });
  }

  async loadBackupData(args: {
    readonly accessToken: string;
    readonly body: ILoadBackupDataRequestDto;
  }): Promise<ILoadBackupDataResponseDto> {
    const { accessToken, body } = args;

    return this.post({
      relativePath: `${BACKUP_SESSIONS_ROUTE}${LOAD_DATA_ROUTE}`,
      body,
      headers: {
        accessToken,
      },
    });
  }

  async createNativeUserIdMapping(
    args: ICreateNativeUserIdMappingRequestDto,
  ): Promise<void> {
    const { accessToken, nativeUserId } = args;

    return this.post({
      relativePath: PROVIDER_NATIVE_USER_ID_ROUTE,
      body: {
        nativeUserId,
      },
      headers: {
        accessToken,
      },
    });
  }
}
