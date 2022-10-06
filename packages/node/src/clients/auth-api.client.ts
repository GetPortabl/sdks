import { TOKEN_ROUTE } from '../constants/routes.constants';
import { IGetClientTokenRequestBodtDto } from '../dto/get-token-request.dto';
import { IGetAuthTokenResponseBodyDto } from '../dto/get-token-response.dto';
import { AuthApiBaseClient } from './auth-api-base.client';

export class AuthApiClient extends AuthApiBaseClient {
  async getToken(
    data?: IGetClientTokenRequestBodtDto,
  ): Promise<IGetAuthTokenResponseBodyDto> {
    const relativeUrl: string = TOKEN_ROUTE;
    const responseBody = await this.post<IGetAuthTokenResponseBodyDto>({
      relativeUrl,
      data,
    });
    return responseBody;
  }
}
