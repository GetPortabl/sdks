import axios, { AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';

import { AuthApiClient } from './auth-api.client';
import { getErrMsg } from '../utils/get-error-messag.util';
import { buildApiHeaders } from '../utils/build-api-headers.util';
import { ErrorMsgTemplateEnum } from '../enums/error-message-type.enum';
import { ErrorMsgSubjectEntityEnum } from '../enums/error-message-entity.enum';
import {
  AGENT_ROUTE,
  API_VERSION_ROUTE,
  TENANT_ID_CUSTOM_CLAIM,
} from '../constants';

export class AgentApiBaseClient {
  readonly authApiClient: AuthApiClient;

  readonly agentUrlFromAccessToken: (accessToken: string) => string;

  accessToken: string | null = null;

  accessTokenExpiryDate: number = NaN;

  constructor(args: { readonly authApiClient: AuthApiClient }) {
    const { authApiClient } = args;
    const { audience } = authApiClient;

    this.authApiClient = authApiClient;
    this.agentUrlFromAccessToken = accessToken => {
      const accessTokenClaims: any = jwtDecode(accessToken);
      const tenantId = accessTokenClaims[TENANT_ID_CUSTOM_CLAIM];

      return `${audience}${API_VERSION_ROUTE}${AGENT_ROUTE}/${tenantId}`;
    };
  }

  private async getAccessToken(): Promise<string> {
    if (
      !this.accessToken ||
      this.accessTokenExpiryDate <= new Date().getTime()
    ) {
      const authResponse = await this.authApiClient.getToken();

      const expiryDate = new Date();
      expiryDate.setSeconds(expiryDate.getSeconds() + authResponse.expiresIn);
      this.accessTokenExpiryDate = expiryDate.getTime();

      this.accessToken = authResponse.accessToken;
    }

    return this.accessToken;
  }

  async post<T>(args: {
    relativeUrl?: string;
    data?: Record<string, any>;
    headers?: Record<string, any> | {};
  }): Promise<T> {
    let response: AxiosResponse<T>;

    try {
      const { relativeUrl = '', data = {}, headers = {} } = args || {};

      const accessToken: string = await this.getAccessToken();

      const agentUrl = this.agentUrlFromAccessToken(accessToken);

      const url: string = `${agentUrl}${relativeUrl}`;

      response = await axios.post(url, data, {
        headers: buildApiHeaders({ headers, accessToken }),
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

  async put<T>(args: {
    relativeUrl?: string;
    data?: Record<string, any>;
    headers?: Record<string, any> | {};
  }): Promise<T> {
    let response: AxiosResponse<T>;

    try {
      const { relativeUrl = '', data = {}, headers = {} } = args || {};

      const accessToken: string = await this.getAccessToken();

      const agentUrl = this.agentUrlFromAccessToken(accessToken);

      const url: string = `${agentUrl}${relativeUrl}`;

      response = await axios.put(url, data, {
        headers: buildApiHeaders({ headers, accessToken }),
      });
    } catch (error) {
      const httpErrMsg: string = getErrMsg({
        template: ErrorMsgTemplateEnum.HttpError,
        entity: ErrorMsgSubjectEntityEnum.PUT,
      });
      console.error(httpErrMsg, error);
      throw new Error(httpErrMsg);
    }

    return response?.data;
  }

  async get<T>(args: {
    relativeUrl: string;
    headers?: Record<string, any> | {};
    throwIfError?: boolean;
  }): Promise<T | null> {
    let response: AxiosResponse<T>;

    const { throwIfError = true } = args || {};

    try {
      const { relativeUrl = '', headers = {} } = args || {};

      const accessToken: string = await this.getAccessToken();

      const agentUrl = this.agentUrlFromAccessToken(accessToken);

      const url: string = `${agentUrl}${relativeUrl}`;

      response = await axios.get(url, {
        headers: buildApiHeaders({ headers, accessToken }),
      });
    } catch (error) {
      if (throwIfError) {
        const httpErrMsg: string = getErrMsg({
          template: ErrorMsgTemplateEnum.HttpError,
          entity: ErrorMsgSubjectEntityEnum.GET,
        });
        console.error(httpErrMsg, error);
        throw new Error(httpErrMsg);
      }
      return null;
    }

    return response?.data;
  }
}
