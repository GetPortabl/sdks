import { IIssuer } from '@sphereon/pex';

import { ICredentialStatus } from './credential-status.interface';
import { IEvidence } from './evidence.interface';
import { IKYCClaims } from './kyc-claims.interface';
import { IRefreshService } from './refresh-service.interface';

export declare type ICredentialContextType = ICredentialContext | string;
export interface ICredentialContext {
  name?: string;
  did?: string;
  [x: string]: unknown;
}

export declare type ICredentialSchemaType = ICredentialSchema | string;
export interface ICredentialSchema {
  id: string;
  type?: string;
}

export interface ICredential {
  '@context': Array<ICredentialContextType> | ICredentialContext | string;
  type: Array<string>;
  id: string;
  issuer: string | IIssuer;
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: IKYCClaims;
  credentialStatus?: ICredentialStatus | Array<ICredentialStatus>;
  credentialSchema?:
    | undefined
    | ICredentialSchemaType
    | Array<ICredentialSchemaType>;
  evidence?: IEvidence | Array<IEvidence>;
  refreshService?: IRefreshService | Array<IRefreshService>;
  name?: string;
  description?: string;
  [x: string]: unknown;
}
