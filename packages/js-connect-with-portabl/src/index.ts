import jwtDecode from 'jwt-decode';

import { Transaction, TransactionManager } from './lib/transaction-manager';
import { SessionStorage } from './lib/storage';
import { createRandomString } from './lib/random-string';
import {
  CONSOLE_LOG_PREFIX,
  ID_TOKEN_LOCAL_STORAGE_KEY,
} from './lib/constants';

export interface IConnectClientOptions {
  accountId: string;
  connectDomain: string;
  walletDomain: string;
}

export type GetAccessTokenResponse = {
  access_token: string;
};

type SingleProofType = { challenge: string; domain: string };

type ProofType = SingleProofType | Array<SingleProofType>;

interface IVPToken {
  proof: ProofType;
}

interface IDecodedIdToken {
  exp: number;
  nonce: string;
}

type GetResponseDataResponse = {
  id_token: string;
  vp_token: IVPToken;
};

type CreateTransactionResponse = {
  authRequestUri: string;
  transactionId: string;
  nonce: string;
  state: string;
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

  async _initiateTransaction(): Promise<void> {
    const nonce = window.btoa(createRandomString());

    const transactionData = await fetch(
      `${this.options.connectDomain}/api/v1/agent/${this.options.accountId}/oauth2/transaction`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nonce,
        }),
      },
    );

    const { authRequestUri, ...restTransaction } =
      (await transactionData.json()) as CreateTransactionResponse;
    const transformedAuthRequestUri = new URL(authRequestUri);
    const clientId = transformedAuthRequestUri.searchParams.get('client_id');

    if (typeof clientId !== 'string') {
      throw new Error('Invalid clientId on authRequestUri');
    }

    this.transactionManager.create({ ...restTransaction, nonce, clientId });
    const transformedAuthRequestUriParams = transformedAuthRequestUri.search;

    window.location.href = `${this.options.walletDomain}/authorize${transformedAuthRequestUriParams}`;
  }

  private async _getResponse(
    responseCode: string,
  ): Promise<GetResponseDataResponse> {
    const transaction = this.transactionManager.get();
    if (!transaction) {
      throw new Error('No Transaction found');
    }

    const response = await fetch(
      `${this.options.connectDomain}/api/v1/agent/${this.options.accountId}/oauth2/response?response_code=${responseCode}&transaction_id=${transaction?.transactionId}`,
      {
        method: 'GET',
      },
    );

    return response.json();
  }

  private async _getAccessTokenFromIdToken({
    idToken,
  }: {
    idToken: string;
  }): Promise<GetAccessTokenResponse> {
    const response = await fetch(
      `${this.options.connectDomain}/api/v1/agent/${this.options.accountId}/oauth2/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_token: idToken,
          grant_type: 'id_token',
          scope: 'openid',
        }),
      },
    );

    return response.json();
  }

  private _validateSingleProof(
    proof: SingleProofType,
    transaction: Transaction,
  ): boolean {
    return (
      proof.challenge === transaction?.nonce &&
      proof.domain === transaction.clientId
    );
  }

  private _validateVpToken(
    vpToken: IVPToken,
    transaction: Transaction,
  ): boolean {
    const { proof } = vpToken;
    let isValid = true;

    if (Array.isArray(proof)) {
      for (let i = 0; i < proof.length; i += 1) {
        const singleProof = proof[i];

        isValid = this._validateSingleProof(singleProof, transaction);

        if (!isValid) {
          break;
        }
      }
    } else {
      isValid = this._validateSingleProof(proof, transaction);
    }

    return isValid;
  }

  private _validateIdToken(idToken: string, transaction: Transaction): boolean {
    const { nonce } = jwtDecode<IDecodedIdToken>(idToken);

    return nonce === transaction?.nonce;
  }

  private _checkIfIdTokenIsExpired(decodedIdToken: IDecodedIdToken): boolean {
    const { exp } = decodedIdToken;

    return Date.now() >= exp * 1000;
  }

  async handleRedirectCallback(
    url: string = window.location.href,
  ): Promise<void> {
    const [, queryString] = url.split('?');

    const searchParams = new URLSearchParams(queryString);
    const responseCode = searchParams.get('response_code');
    if (!responseCode) {
      console.warn(`${CONSOLE_LOG_PREFIX} unable to find response code.`);
      return;
    }

    const transaction = this.transactionManager.get();

    if (!transaction) {
      throw new Error('Missing transaction');
    }

    const { vp_token: vpToken, id_token: idToken } = await this._getResponse(
      responseCode,
    );

    const isIdTokenValid = this._validateIdToken(idToken, transaction);

    if (!isIdTokenValid) {
      throw new Error('Invalid ID Token');
    }

    const isVpTokenValid = this._validateVpToken(vpToken, transaction);

    if (!isVpTokenValid) {
      throw new Error('Invalid VP Token');
    }

    localStorage.setItem(ID_TOKEN_LOCAL_STORAGE_KEY, idToken);

    // Remove transaction from cache
    this.transactionManager.remove();

    window.history.replaceState({}, document.title, window.location.pathname);
  }

  async getAccessToken() {
    const idToken = localStorage.getItem(ID_TOKEN_LOCAL_STORAGE_KEY);
    if (!idToken) {
      throw new Error(
        'No id_token is available, can not exchange for access_token',
      );
    }

    const decodedIdToken = jwtDecode<IDecodedIdToken>(idToken);
    const isExpired = this._checkIfIdTokenIsExpired(decodedIdToken);

    if (isExpired) {
      throw new Error('id_token is expired, can not exchange for access_token');
    }

    const tokenResponse = await this._getAccessTokenFromIdToken({
      idToken,
    });

    return tokenResponse;
  }

  getIsAuthenticated() {
    if (typeof window !== 'undefined') {
      const idToken = localStorage.getItem(ID_TOKEN_LOCAL_STORAGE_KEY);

      if (!idToken) {
        return false;
      }

      const decodedIdToken = jwtDecode<IDecodedIdToken>(idToken);
      const isExpired = this._checkIfIdTokenIsExpired(decodedIdToken);

      if (!isExpired) {
        return true;
      }

      localStorage.removeItem(ID_TOKEN_LOCAL_STORAGE_KEY);
    }

    return false;
  }

  async loginWithRedirect() {
    // should fire redirect on response
    await this._initiateTransaction();
  }

  logout() {
    localStorage.removeItem(ID_TOKEN_LOCAL_STORAGE_KEY);
  }
}
