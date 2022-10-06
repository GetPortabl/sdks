import { ICredential, IVerifiableCredential } from '../interfaces';

export interface IStoreCredentialRequestBodyDto {
  readonly document: ICredential | IVerifiableCredential;
  readonly meta: Record<string, any>;
}
