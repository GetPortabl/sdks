import { ICredential, ICredentialStatus as ICredentialStatusBase } from '@sphereon/ssi-types';

interface IRegistrationAddressDetailsModel {
  readonly country?: string;
  readonly postalCode?: string;
  readonly region?: string;
  readonly locality?: string;
  readonly streetAddress?: string;
}

interface IVKYCCredentialSubject {
  readonly emailAddress?: string;
  readonly phoneNumber?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly middleName?: string;
  readonly honorificPrefix?: string;
  readonly honorificSuffix?: string;
  readonly birthDate?: string;
  readonly birthPlace?: string;
  readonly nationality?: string;
  readonly passportNumber?: string;
  readonly driverLicenseId?: string;
  readonly socialSecurityNumber?: string;
  readonly registrationAddressDetails?: IRegistrationAddressDetailsModel;
}

export interface ICredentialStatus extends ICredentialStatusBase {
  readonly id: string;
  readonly type: string;
  readonly statusListIndex?: number;
  readonly statusListCredential?: string;
}

export interface IEvidence {
  readonly id: string;
  readonly type: string | Array<string>;
  readonly evidencedClaim?: string | Array<string>;
}

interface IJsonLdCredential extends ICredential {
  readonly credentialStatus?: ICredentialStatus;
  readonly evidence?: IEvidence | Array<IEvidence>;
}

export interface IVerifiableDocumentMetaModel {
  readonly correlationId?: string;
  readonly credentialManifestId?: string;
}

export interface IVerifiableDocumentModel {
  readonly id: string;
  readonly data: IJsonLdCredential;
  readonly meta?: IVerifiableDocumentMetaModel;
}

export interface ILoadBackupDataRequestDto {
  readonly nativeUserId: string;
  readonly claims: IVKYCCredentialSubject;
  readonly evidences?: Array<IEvidence>;
}

export interface ILoadBackupDataResponseDto {
  readonly verifiableDocument: IVerifiableDocumentModel;
}
