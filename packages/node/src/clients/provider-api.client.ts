import { PROVIDER_NATIVE_USER_ID_ROUTE } from '../constants';
import { ICreateNativeUserIdMappingRequestDto } from '../dto';
import { ProviderApiBaseClient } from './provider-api-base.client';

export class ProviderApiClient extends ProviderApiBaseClient {
  async createNativeUserIdMapping(
    data: ICreateNativeUserIdMappingRequestDto,
  ): Promise<void> {
    const { nativeUserId, accessToken } = data;

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
