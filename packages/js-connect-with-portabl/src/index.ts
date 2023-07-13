import jwtDecode from 'jwt-decode';
import { verify as verifyJWT } from 'jsonwebtoken';

import { Transaction, TransactionManager } from './lib/transaction-manager';
import { SessionStorage } from './lib/storage';
import { createRandomString } from './lib/random-string';
import {
  ERROR_PREFIX,
  CONSOLE_LOG_PREFIX,
  ID_TOKEN_LOCAL_STORAGE_KEY,
} from './lib/constants';

export interface IConnectClientOptions {
  readonly accountId: string;
  readonly connectDomain: string;
  readonly walletDomain: string;
}

export interface ITokenEndpointResponse {
  readonly access_token: string;
}

interface IChallengeOptions {
  readonly challenge: string;
  readonly domain: string;
}

interface ILdProof extends IChallengeOptions {}

type LdProofType = ILdProof | Array<ILdProof>;

interface IVpToken {
  readonly proof: LdProofType;
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
  readonly vp_token: IVpToken;
}

interface ICreateTransactionResponse {
  readonly authRequestUri: string;
  readonly transactionId: string;
  readonly nonce: string;
  readonly state: string;
}

enum UserStatusEnum {
  Registered = 'Registered', // Q: shall we consider changing it to "Active"?
  Suspended = 'Suspended',
  InReview = 'InReview',
  Declined = 'Declined',
}

interface IGetUserResponse {
  readonly user: {
    readonly userStatus: UserStatusEnum;
  };
}

interface ILifeCycleEventOptions {
  readonly onError?: (args: { readonly errorMessage: string }) => void;
}

interface IOptions extends ILifeCycleEventOptions {
  readonly throwsError?: boolean;
}

interface IOnErrorEventArgs {
  readonly errorMessage: string;
}

const transformErrorToOnErrorEventArgs = (error: any): IOnErrorEventArgs => {
  if (error instanceof Error) {
    return { errorMessage: error.message };
  }
  return { errorMessage: `SDK Exception: ${error}` };
};

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

  private async _initiateTransaction(): Promise<void> {
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
      // Note: handles error cases via redirect (302) in compliance with https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2.2.1
      redirect: 'follow',
    });

    const { authRequestUri, transactionId, state }: ICreateTransactionResponse =
      await createTransactionResult.json();

    const authRequestURL: URL = new URL(authRequestUri);

    const clientId: string | null =
      authRequestURL.searchParams.get('client_id');

    if (
      typeof transactionId !== 'string' ||
      !transactionId.length ||
      typeof state !== 'string' ||
      !state ||
      typeof clientId !== 'string' ||
      !clientId.length
    ) {
      throw new Error(`${ERROR_PREFIX} invalid transaction params`);
    }

    this.transactionManager.create({
      transactionId,
      nonce,
      state,
      clientId,
    });

    const authRequestUriQueryParams: string = authRequestURL.search;

    // Note: handles both success and error cases via redirect (302) in compliance with https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2.2.1
    window.location.href = `${this.options.walletDomain}/authorize${authRequestUriQueryParams}`;
  }

  private async _getAuthResponse(args: {
    readonly responseCode: string;
    readonly transactionId: string;
  }): Promise<IGetAuthResponseDto> {
    const { responseCode, transactionId } = args;

    const qs: string = `?response_code=${responseCode}&transaction_id=${transactionId}`;
    const url: URL = new URL(
      `${this.options.connectDomain}/api/v1/agent/${this.options.accountId}/oauth2/response${qs}`,
    );

    const getAuthResponseResult: Response = await fetch(url.toString(), {
      method: 'GET',
      // Note: handles error cases via redirect (302) in compliance with https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2.2.1
      redirect: 'follow',
    });

    return getAuthResponseResult.json();
  }

  private async _callTokenEndpoint(args: {
    idTokenJwt: string;
  }): Promise<ITokenEndpointResponse> {
    const { idTokenJwt } = args;

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
      // Note: handles error cases via redirect (302) in compliance with https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2.2.1
      redirect: 'follow',
    });

    return tokenEndpointResult.json();
  }

  private _isValidVpTokenChallengeOptions(
    challengeOptions: IChallengeOptions,
    tx: Transaction,
  ): boolean {
    return (
      challengeOptions.challenge === tx.nonce &&
      challengeOptions.domain === tx.clientId
    );
  }

  private _isValidateVpToken(vpTokenJwt: IVpToken, tx: Transaction): boolean {
    const { proof: vpProof }: IVpToken = vpTokenJwt;

    return Array.isArray(vpProof)
      ? !vpProof.some(
          (vpProofItem: ILdProof) =>
            !this._isValidVpTokenChallengeOptions(vpProofItem, tx),
        )
      : this._isValidVpTokenChallengeOptions(vpProof, tx);
  }

  private _isExpiredIdToken(idTokenJwt: string): boolean {
    const idTokenPayload: IIdTokenPayload =
      jwtDecode<IIdTokenPayload>(idTokenJwt);

    return Date.now() >= idTokenPayload.exp * 1000;
  }

  private async _isUserAccountActive(userDID: string): Promise<boolean> {
    // Q: shall we create a separate endpoint which would return user status only i.e. that has no pii inside a response?
    const url: URL = new URL(
      `${this.options.connectDomain}/api/v1/agent/${this.options.accountId}/provider/users/${userDID}`,
    );

    const getUserResult: Response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const getUserResponse: IGetUserResponse = await getUserResult.json();

    return getUserResponse.user.userStatus === UserStatusEnum.Registered;
  }

  private async _isValidIdToken(
    idTokenJwt: string,
    tx: Transaction,
  ): Promise<boolean> {
    // Q: shall we consider abstracting the logic of a given function by implementing a dedicated api endpoint?

    // Note: "jws", "iat", "exp" and "nonce" being validated through "verifyJWT"
    const idTokenPayload: IIdTokenPayload = verifyJWT(idTokenJwt, '', {
      nonce: tx.nonce,
    }) as IIdTokenPayload;

    const isSelfSignedJwt: boolean = idTokenPayload.sub === idTokenPayload.iss;

    const isUserAccountActive: boolean = await this._isUserAccountActive(
      idTokenPayload.sub,
    );

    return isSelfSignedJwt && isUserAccountActive;
  }

  private async _handleRedirectCallback(url: string): Promise<void> {
    try {
      const responseCode: string | null = new URL(url).searchParams.get(
        'response_code',
      );

      if (!responseCode) {
        console.warn(
          `${CONSOLE_LOG_PREFIX} fetching auth response is not possible as response code is not found`,
        );
        return;
      }

      const tx: Transaction | undefined = this.transactionManager.get();

      if (!tx) {
        throw new Error(
          `${ERROR_PREFIX} fetching auth response is not possible as transaction is not found`,
        );
      }

      const {
        vp_token: vpTokenJwt,
        id_token: idTokenJwt,
      }: IGetAuthResponseDto = await this._getAuthResponse({
        responseCode,
        transactionId: tx.transactionId,
      });

      const isValidIdToken: boolean = await this._isValidIdToken(
        idTokenJwt,
        tx,
      );

      if (!isValidIdToken) {
        throw new Error(`${ERROR_PREFIX} id_token is invalid`);
      }

      const isValidVpToken: boolean = this._isValidateVpToken(vpTokenJwt, tx);

      if (!isValidVpToken) {
        throw new Error(`${ERROR_PREFIX} vp_token is invalid`);
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

  // Note: a successful execution flags that a user is authenticated
  // e.g. within React Connect SDK we set the following state: { isAuthenticated: true }
  async handleRedirectCallback(
    url: string = window.location.href,
    opts?: IOptions,
  ): Promise<void> {
    try {
      return this._handleRedirectCallback(url);
    } catch (error) {
      const { onError, throwsError } = opts || {};

      console.error(
        `${CONSOLE_LOG_PREFIX} error on handling of a redirect callback`,
        error,
      );

      if (typeof onError === 'function') {
        onError(transformErrorToOnErrorEventArgs(error));
      } else {
        console.warn(
          `${CONSOLE_LOG_PREFIX} 'onError' callback was not configured.`,
        );
      }

      if (throwsError) {
        throw error;
      }
    }
  }

  async _getAccessToken(): Promise<ITokenEndpointResponse> {
    const idTokenJwt: string | null = localStorage.getItem(
      ID_TOKEN_LOCAL_STORAGE_KEY,
    );

    if (!idTokenJwt) {
      throw new Error(
        `${ERROR_PREFIX} token exchange is not possible as id_token is not found`,
      );
    }

    const isExpiredIdToken: boolean = this._isExpiredIdToken(idTokenJwt);

    if (isExpiredIdToken) {
      throw new Error(
        `${ERROR_PREFIX} token exchange is not possible as id_token is expired`,
      );
    }

    const tokenResponse: ITokenEndpointResponse = await this._callTokenEndpoint(
      {
        idTokenJwt,
      },
    );

    return tokenResponse;
  }

  async getAccessToken(
    opts?: IOptions,
  ): Promise<ITokenEndpointResponse | null> {
    try {
      return this._getAccessToken();
    } catch (error) {
      const { onError, throwsError } = opts || {};

      console.error(
        `${CONSOLE_LOG_PREFIX} error on getting an access token`,
        error,
      );

      if (typeof onError === 'function') {
        onError(transformErrorToOnErrorEventArgs(error));
      } else {
        console.warn(
          `${CONSOLE_LOG_PREFIX} 'onError' callback was not configured.`,
        );
      }

      if (throwsError) {
        throw error;
      }
    }

    return null;
  }

  _getIsAuthenticated(): boolean {
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

  getIsAuthenticated(opts: IOptions): boolean {
    try {
      return this._getIsAuthenticated();
    } catch (error) {
      const { onError, throwsError } = opts || {};

      console.error(
        `${CONSOLE_LOG_PREFIX} error on checking authentication state`,
        error,
      );

      if (typeof onError === 'function') {
        onError(transformErrorToOnErrorEventArgs(error));
      } else {
        console.warn(
          `${CONSOLE_LOG_PREFIX} 'onError' callback was not configured.`,
        );
      }

      if (throwsError) {
        throw error;
      }
    }

    return false;
  }

  async loginWithRedirect(opts?: IOptions): Promise<void> {
    try {
      // should fire redirect on response
      await this._initiateTransaction();
    } catch (error) {
      const { onError, throwsError } = opts || {};

      console.error(
        `${CONSOLE_LOG_PREFIX} error on initiation of a transaction`,
        error,
      );

      if (typeof onError === 'function') {
        onError(transformErrorToOnErrorEventArgs(error));
      } else {
        console.warn(
          `${CONSOLE_LOG_PREFIX} 'onError' callback was not configured.`,
        );
      }

      if (throwsError) {
        throw error;
      }
    }
  }

  logout(): void {
    localStorage.removeItem(ID_TOKEN_LOCAL_STORAGE_KEY);
  }
}
