import { ICredential, IVerifiableCredential } from '../interfaces';

export interface ICredentialDocumentModel {
  readonly document: ICredential | IVerifiableCredential;
  readonly meta: Record<string, any>;
}

export interface IStoreCredentialResponseBodyDto {
  readonly verifiableDocument: ICredentialDocumentModel;
}
