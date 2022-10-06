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
  MissingDataProfile = 'MissingDataProfile',
  MissingDataProfileIssuerId = 'MissingDataProfileIssuerId',
  InvalidClaims = 'InvalidClaims',
  InvalidEvidence = 'InvalidEvidence',
  MissingClaims = 'MissingClaims',
  MissingCredential = 'MissingCredential',
  MissingAccessToken = 'MissingAccessToken',
  MissingCorrelationId = 'MissingCorrelationId',
  MissingDataProfileId = 'MissingDataProfileId',
  InvalidEnvType = 'InvalidEnvType',
}
