export enum ErrorMsgSubjectEntityEnum {
  Audience = 'Audience',
  Date = 'Date',
  AUTH = 'AUTH',
  POST = 'POST',
  PUT = 'PUT',
  GET = 'GET',
  CredentialManifest = 'CredentialManifest',
  DIDCommThread = 'DIDCommThread',
  DIDCommMessage = 'DIDCommMessage',
  Credential = 'Credential',
}

export enum ErrorMsgSubjectScenarioEnum {
  MissingCredentialManifest = 'MissingCredentialManifest',
  MissingCredentialManifestIssuerId = 'MissingCredentialManifestIssuerId',
  InvalidClaims = 'InvalidClaims',
  InvalidEvidence = 'InvalidEvidence',
  MissingClaims = 'MissingClaims',
  MissingCredential = 'MissingCredential',
  MissingAccessToken = 'MissingAccessToken',
  MissingCorrelationId = 'MissingCorrelationId',
  MissingDataProfileVersion = 'MissingDataProfileVersion',
  InvalidEnvType = 'InvalidEnvType',
}
