import { IIssuer } from '@sphereon/pex';

import { ICredentialStatus } from './credential-status.interface';
import { IEvidence } from './evidence.interface';
import { IKYCClaims } from './kyc-claims.interface';
import { IRefreshService } from './refresh-service.interface';

export declare type ICredentialContextType = ICredentialContext | string;
export interface ICredentialContext {
  readonly name?: string;
  readonly did?: string;
  readonly [x: string]: unknown;
}

export declare type ICredentialSchemaType = ICredentialSchema | string;
export interface ICredentialSchema {
  readonly id: string;
  readonly type?: string;
}

export interface ICredential {
  readonly '@context': Array<ICredentialContextType> | ICredentialContext | string;
  readonly type: Array<string>;
  readonly id: string;
  readonly issuer: string | IIssuer;
  readonly issuanceDate: string;
  readonly expirationDate?: string;
  readonly credentialSubject: IKYCClaims;
  readonly credentialStatus?: ICredentialStatus | Array<ICredentialStatus>;
  readonly credentialSchema?:
    | undefined
    | ICredentialSchemaType
    | Array<ICredentialSchemaType>;
  readonly evidence?: IEvidence | Array<IEvidence>;
  readonly refreshService?: IRefreshService | Array<IRefreshService>;
  readonly name?: string;
  readonly description?: string;
  readonly [x: string]: unknown;
}
