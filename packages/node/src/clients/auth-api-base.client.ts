import axios, { AxiosResponse } from 'axios';

import { EnvType } from '../types';
import {
  PortablApiAuthGrantType,
  PortablApiAuthScopes,
} from '../constants/auth.constants';
import {
  IGetTokenArgs,
  IGetClientTokenRequestBodtDto,
} from '../dto/get-token-request.dto';
import { authUrlFrom } from '../utils/auth-url-from.util';
import { getErrMsg } from '../utils/get-error-messag.util';
import { buildApiHeaders } from '../utils/build-api-headers.util';
import { audienceFromEnv } from '../utils/audience-from-env.util';
import { ErrorMsgTemplateEnum } from '../enums/error-message-type.enum';
import { ErrorMsgSubjectEntityEnum } from '../enums/error-message-entity.enum';
import { IPortablAuthApiClientOpts } from '../interfaces/portabl-auth-api-client-opts';

export class AuthApiBaseClient {
  readonly env: EnvType;

  readonly clientId: string;

  readonly clientSecret: string;

  readonly audience: string;

  readonly scope: string;

  readonly authUrl: string;

  constructor(args: IPortablAuthApiClientOpts) {
    const { env, clientId, clientSecret, scope = [] } = args;

    this.env = env;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.audience = audienceFromEnv(env);
    this.scope = [...new Set([...scope, ...PortablApiAuthScopes])].join(' ');

    this.authUrl = authUrlFrom(this.audience);
  }

  async post<T>(args?: {
    readonly relativeUrl?: string;
    readonly data?: IGetClientTokenRequestBodtDto;
    readonly headers?: Record<string, any>;
  }): Promise<T> {
    const { relativeUrl = '', data, headers = {} } = args || {};

    const requestBody: Partial<IGetTokenArgs> = {
      grantType: PortablApiAuthGrantType,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      audience: this.audience,
      scope: this.scope,
      ...data,
    };

    let response: AxiosResponse<T>;
    try {
      const url: string = `${this.authUrl}${relativeUrl}`;

      response = await axios.post<T>(url, requestBody, {
        headers: buildApiHeaders({ headers }),
      });
    } catch (error) {
      const httpErrMsg = getErrMsg({
        template: ErrorMsgTemplateEnum.HttpError,
        entity: ErrorMsgSubjectEntityEnum.AUTH,
      });
      console.error(httpErrMsg, error);
      throw new Error(httpErrMsg);
    }

    return response?.data;
  }
}
