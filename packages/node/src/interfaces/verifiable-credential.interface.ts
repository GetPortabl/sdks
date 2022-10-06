import { ICredentialStatus } from './credential-status.interface';
import { ICredential } from './credential.interface';
import { IEvidence } from './evidence.interface';
import { IRefreshService } from './refresh-service.interface';

export interface IVerifiableCredential extends ICredential {
  credentialStatus?: ICredentialStatus; // Note: PEX library doesn't support having an array for credential status objects within a credential yet
  evidence?: IEvidence | Array<IEvidence>; // Extension: PEX library doesn't define "evidence" property yet
  refreshService?: IRefreshService | Array<IRefreshService>; // Extension: PEX library doesn't define "refreshService" property yet
}
