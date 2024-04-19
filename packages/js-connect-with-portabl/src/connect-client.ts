import jwtDecode from 'jwt-decode';
import { IProof } from '@sphereon/ssi-types';

import { Transaction, TransactionManager } from './lib/transaction-manager';
import { SessionStorage } from './lib/storage';
import { createRandomString } from './lib/random-string';
import { LOG_PREFIX } from './lib/constants';
import {
  IConnectClientOptions,
  ICreateTransactionResponse,
  IGetAuthResponseDto,
  IIdTokenClaims,
  IVerifiablePresentation,
} from './lib/types';

export class ConnectClient {
  private readonly options: IConnectClientOptions;

  private readonly transactionManager: TransactionManager;

  idTokenJwt?: string;

  idTokenClaims?: IIdTokenClaims;

  vpTokenJsonLd?: IVerifiablePresentation;

  constructor(options: IConnectClientOptions) {
    this.options = options;

    const transactionStorage = SessionStorage;

    this.transactionManager = new TransactionManager(
      transactionStorage,
      `${this.options.organizationId}:${this.options.projectId}`,
    );
  }

  private async _getAuthorizationResponse({
    responseCode,
    transactionId,
  }: {
    readonly responseCode: string;
    readonly transactionId: string;
  }): Promise<IGetAuthResponseDto> {
    const qs: string = `?response_code=${responseCode}&transaction_id=${transactionId}`;
    const url: URL = new URL(
      `${this.options.connectDomain}/api/v1/agent/${this.options.organizationId}/oauth2/response${qs}`,
    );

    const getAuthResponseResult: Response = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow',
    });

    this._followRedirect(getAuthResponseResult);

    return getAuthResponseResult.json();
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
    const idTokenPayload: IIdTokenClaims = jwtDecode<IIdTokenClaims>(
      idTokenJwt,
    );

    return Date.now() >= idTokenPayload.exp * 1000;
  }

  private async _isValidIdToken(
    idTokenJwt: string,
    tx: Transaction,
  ): Promise<boolean> {
    const idTokenPayload: IIdTokenClaims = jwtDecode<IIdTokenClaims>(
      idTokenJwt,
    );

    const isValidNonce: boolean = idTokenPayload.nonce === tx.nonce;
    const isSelfSignedJwt: boolean = idTokenPayload.sub === idTokenPayload.iss;

    return isValidNonce && isSelfSignedJwt;
  }

  private validateVpTokenProof(proof: IProof, nonce: string): boolean {
    return proof?.challenge === nonce;
  }

  private _isValidVpToken(
    vpTokenJsonLd: IVerifiablePresentation,
    tx: Transaction,
  ): boolean {
    const { proof } = vpTokenJsonLd;
    const { nonce } = tx;

    const proofSet: Array<IProof> = !proof
      ? []
      : Array.isArray(proof)
      ? proof
      : [proof];

    return proofSet.every(proof => this.validateVpTokenProof(proof, nonce));
  }

  async authorizeWithRedirect(): Promise<void> {
    const nonce: string = window.btoa(createRandomString());

    const url: URL = new URL(
      `${this.options.connectDomain}/api/v1/agent/${this.options.organizationId}/oauth2/transaction`,
    );

    const createTransactionResult: Response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nonce,
        projectId: this.options.projectId,
      }),
      redirect: 'follow',
    });
    if (!createTransactionResult.ok) {
      throw new Error('Unable to initiate transaction');
    }

    this._followRedirect(createTransactionResult);

    const {
      authRequestUri,
      transactionId,
      state,
    }: ICreateTransactionResponse = await createTransactionResult.json();

    const authRequestURL: URL = new URL(authRequestUri);

    const clientId: string | null = authRequestURL.searchParams.get(
      'client_id',
    );

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

    window.location.href = `${this.options.passportDomain}/authorize${authRequestUriQueryParams}`;
  }

  async handleRedirectCallback(
    url: string = window.location.href,
  ): Promise<void> {
    try {
      const tx: Transaction | undefined = this.transactionManager.get();

      if (!tx) {
        // Ignore handling redirect callback because it was not initiated by this client
        return;
      }

      const responseCode: string | null = new URL(url).searchParams.get(
        'response_code',
      );

      if (!responseCode) {
        throw new Error(
          `${LOG_PREFIX} No response_code found for this transaction`,
        );
      }

      const {
        id_token: idTokenJwt,
        vp_token: vpTokenJsonLd,
      }: IGetAuthResponseDto = await this._getAuthorizationResponse({
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

      if (vpTokenJsonLd) {
        const isValidVpToken: boolean = this._isValidVpToken(vpTokenJsonLd, tx);

        if (!isValidVpToken) {
          throw new Error(`${LOG_PREFIX} vp_token is invalid`);
        }
      }

      this.idTokenJwt = idTokenJwt;
      this.idTokenClaims = jwtDecode<IIdTokenClaims>(idTokenJwt);
      this.vpTokenJsonLd = vpTokenJsonLd;

      // Remove transaction from cache
      this.transactionManager.remove();

      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      // Remove transaction from cache (when failed)
      this.transactionManager.remove();

      throw error;
    }
  }

  getIsAuthorized(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    if (!this.idTokenJwt) {
      return false;
    }

    const isExpiredIdToken: boolean = this._isExpiredIdToken(this.idTokenJwt);

    if (isExpiredIdToken) {
      return false;
    }

    return true;
  }

  resetAuthorization(): void {
    this.idTokenJwt = undefined;
    this.idTokenClaims = undefined;
    this.vpTokenJsonLd = undefined;
  }
}
