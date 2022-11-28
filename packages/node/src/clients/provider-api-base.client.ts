import axios, { AxiosResponse } from 'axios';

import { AuthApiClient } from './auth-api.client';
import { ErrorMsgTemplateEnum, ErrorMsgSubjectEntityEnum } from '../enums';
import { buildApiHeaders, getErrMsg, providerUrlFrom } from '../utils';

export class ProviderApiBaseClient {
  readonly providerUrl: string;

  accessToken: string | null = null;

  constructor(args: { readonly authApiClient: AuthApiClient }) {
    const { authApiClient } = args;
    const { audience } = authApiClient;

    this.providerUrl = providerUrlFrom(audience);
  }

  async post<RequestBody, Response>(args: {
    relativePath: string;
    body?: RequestBody;
    headers?: Record<string, any> | {};
  }): Promise<Response> {
    let response: AxiosResponse<Response>;

    try {
      const { relativePath = '', body = {}, headers = {} } = args || {};
      const url: string = `${this.providerUrl}${relativePath}`;

      response = await axios.post(url, body, {
        headers: buildApiHeaders({ ...headers }),
      });
    } catch (error) {
      const httpErrMsg: string = getErrMsg({
        template: ErrorMsgTemplateEnum.HttpError,
        entity: ErrorMsgSubjectEntityEnum.POST,
      });
      console.error(httpErrMsg, error);
      throw new Error(httpErrMsg);
    }

    return response?.data;
  }
}
