import { ICredential, IVerifiableCredential } from '../interfaces';

export interface IStoreCredentialRequestBodyDto {
  readonly document: ICredential | IVerifiableCredential;
  readonly meta: {
    readonly correlationId: string;
    readonly credentialManifestId: string;
  }
}
