import { CredentialStatusType } from './credential-status.type';
import { Int } from './int.type';

// Note: it's described here since PEX library does not include optional fields pertaining specific Credential Status methods
export interface ICredentialStatus {
  readonly id: string;
  readonly type: CredentialStatusType | string;
  readonly statusListIndex?: Int;
  readonly statusListCredential?: string;
}
