import jwtDecode from 'jwt-decode';

import { Transaction, TransactionManager } from './lib/transaction-manager';
import { SessionStorage } from './lib/storage';
import { createRandomString } from './lib/random-string';
import { LOG_PREFIX, ID_TOKEN_LOCAL_STORAGE_KEY } from './lib/constants';

export interface IConnectClientOptions {
  readonly accountId: string;
  readonly connectDomain: string;
  readonly walletDomain: string;
}

export interface ITokenEndpointResponse {
  readonly access_token: string;
}

interface IIdTokenPayload {
  readonly iat: number;
  readonly exp: number;
  readonly iss: string;
  readonly sub: string;
  readonly aud: string;
  readonly nonce: string;
}

interface IGetAuthResponseDto {
  readonly id_token: string;
}

interface ICreateTransactionResponse {
  readonly authRequestUri: string;
  readonly transactionId: string;
  readonly nonce: string;
  readonly state: string;
}

export class ConnectClient {
  private readonly options: IConnectClientOptions;

  private readonly transactionManager: TransactionManager;

  constructor(options: IConnectClientOptions) {
    this.options = options;

    const transactionStorage = SessionStorage;

    this.transactionManager = new TransactionManager(
      transactionStorage,
      this.options.accountId,
    );
  }

  async loginWithRedirect(): Promise<void> {
    const nonce: string = window.btoa(createRandomString());

    const url: URL = new URL(
      `${this.options.connectDomain}/api/v1/agent/${this.options.accountId}/oauth2/transaction`,
    );

    const createTransactionResult: Response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nonce,
      }),
      redirect: 'follow',
    });

    this._followRedirect(createTransactionResult);

    const { authRequestUri, transactionId, state }: ICreateTransactionResponse =
      await createTransactionResult.json();

    const authRequestURL: URL = new URL(authRequestUri);

    const clientId: string | null =
      authRequestURL.searchParams.get('client_id');

    if (
      typeof transactionId !== 'string' ||
      !transactionId ||
      typeof state !== 'string' ||
      !state ||
      typeof clientId !== 'string' ||
      !clientId
    ) {
      throw new Error(
        `${LOG_PREFIX} invalid transaction params: ${Object.entries({
          transactionId,
          state,
          clientId,
        })
          .map(([k, v]) => `${k}=${v}`)
          .join(' ')}`,
      );
    }

    this.transactionManager.create({
      transactionId,
      nonce,
      state,
      clientId,
    });

    const authRequestUriQueryParams: string = authRequestURL.search;

    window.location.href = `${this.options.walletDomain}/authorize${authRequestUriQueryParams}`;
  }

  private async _getAuthResponse({
    responseCode,
    transactionId,
  }: {
    readonly responseCode: string;
    readonly transactionId: string;
  }): Promise<IGetAuthResponseDto> {
    const qs: string = `?response_code=${responseCode}&transaction_id=${transactionId}`;
    const url: URL = new URL(
      `${this.options.connectDomain}/api/v1/agent/${this.options.accountId}/oauth2/response${qs}`,
    );

    const getAuthResponseResult: Response = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow',
    });

    this._followRedirect(getAuthResponseResult);

    return getAuthResponseResult.json();
  }

  private async _callTokenEndpoint({
    idTokenJwt,
  }: {
    idTokenJwt: string;
  }): Promise<ITokenEndpointResponse> {
    const url: URL = new URL(
      `${this.options.connectDomain}/api/v1/agent/${this.options.accountId}/oauth2/token`,
    );

    const tokenEndpointResult: Response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_token: idTokenJwt,
        grant_type: 'id_token',
        scope: 'openid',
      }),
      redirect: 'follow',
    });

    this._followRedirect(tokenEndpointResult);

    return tokenEndpointResult.json();
  }

  private _followRedirect(fetchResult: Response): void {
    if (
      fetchResult.ok &&
      fetchResult.type === 'cors' &&
      fetchResult.redirected
    ) {
      window.location.href = fetchResult.url;
    }
  }

  private _isExpiredIdToken(idTokenJwt: string): boolean {
    const idTokenPayload: IIdTokenPayload =
      jwtDecode<IIdTokenPayload>(idTokenJwt);

    return Date.now() >= idTokenPayload.exp * 1000;
  }

  private async _isValidIdToken(
    idTokenJwt: string,
    tx: Transaction,
  ): Promise<boolean> {
    const idTokenPayload: IIdTokenPayload =
      jwtDecode<IIdTokenPayload>(idTokenJwt);

    const isValidNonce: boolean = idTokenPayload.nonce === tx.nonce;
    const isSelfSignedJwt: boolean = idTokenPayload.sub === idTokenPayload.iss;

    return isValidNonce && isSelfSignedJwt;
  }

  async handleRedirectCallback(
    url: string = window.location.href,
  ): Promise<void> {
    try {
      const responseCode: string | null = new URL(url).searchParams.get(
        'response_code',
      );

      if (!responseCode) {
        console.warn(
          `${LOG_PREFIX} fetching auth response is not possible as response code is not found`,
        );
        return;
      }

      const tx: Transaction | undefined = this.transactionManager.get();

      if (!tx) {
        throw new Error(
          `${LOG_PREFIX} fetching auth response is not possible as transaction is not found`,
        );
      }

      const { id_token: idTokenJwt }: IGetAuthResponseDto =
        await this._getAuthResponse({
          responseCode,
          transactionId: tx.transactionId,
        });

      const isValidIdToken: boolean = await this._isValidIdToken(
        idTokenJwt,
        tx,
      );

      if (!isValidIdToken) {
        throw new Error(`${LOG_PREFIX} id_token is invalid`);
      }

      localStorage.setItem(ID_TOKEN_LOCAL_STORAGE_KEY, idTokenJwt);

      // Remove transaction from cache
      this.transactionManager.remove();

      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      // Remove transaction from cache (when failed)
      this.transactionManager.remove();

      throw error;
    }
  }

  async getAccessToken(): Promise<ITokenEndpointResponse> {
    const idTokenJwt: string | null = localStorage.getItem(
      ID_TOKEN_LOCAL_STORAGE_KEY,
    );

    if (!idTokenJwt) {
      throw new Error(
        `${LOG_PREFIX} token exchange is not possible as id_token is not found`,
      );
    }

    const isExpiredIdToken: boolean = this._isExpiredIdToken(idTokenJwt);

    if (isExpiredIdToken) {
      throw new Error(
        `${LOG_PREFIX} token exchange is not possible as id_token is expired`,
      );
    }

    const tokenResponse: ITokenEndpointResponse = await this._callTokenEndpoint(
      {
        idTokenJwt,
      },
    );

    return tokenResponse;
  }

  getIsAuthenticated(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const idTokenJwt: string | null = localStorage.getItem(
      ID_TOKEN_LOCAL_STORAGE_KEY,
    );

    if (!idTokenJwt) {
      return false;
    }

    const isExpiredIdToken: boolean = this._isExpiredIdToken(idTokenJwt);

    if (isExpiredIdToken) {
      localStorage.removeItem(ID_TOKEN_LOCAL_STORAGE_KEY);
      return false;
    }

    return true;
  }

  logout(): void {
    localStorage.removeItem(ID_TOKEN_LOCAL_STORAGE_KEY);
  }
}
