import {
  ErrorMsgSubjectEntityEnum,
  ErrorMsgSubjectScenarioEnum,
} from '../enums/error-message-entity.enum';
import { ErrorMsgTemplateEnum } from '../enums/error-message-type.enum';

export const ERROR_MSG_DEFAULT = 'Error';

export const ERROR_MSG_SUBJECT_ENTITY_PLACEHOLDER = '<error-subject>';

export const ERROR_MSG_TEMPLATE_MAP: Map<ErrorMsgTemplateEnum, string> =
  new Map([
    [
      ErrorMsgTemplateEnum.HttpError,
      'Failed to execute <error-subject> request.',
    ],
    [
      ErrorMsgTemplateEnum.DtoError,
      'Failed to parse <error-subject> from the response dto.',
    ],
    [ErrorMsgTemplateEnum.NotFoundError, '<error-subject> is not found.'],
    [ErrorMsgTemplateEnum.ArgError, 'Invalid <error-subject>.'],
  ]);

export const ERROR_MSG_SUBJECT_ENTITY_LABEL_MAP: Map<
  ErrorMsgSubjectEntityEnum,
  string
> = new Map([
  [ErrorMsgSubjectEntityEnum.CredentialManifest, 'Credential manifest'],
  [ErrorMsgSubjectEntityEnum.DIDCommThread, 'DIDComm thread'],
  [ErrorMsgSubjectEntityEnum.DIDCommMessage, 'DIDComm message'],
  [ErrorMsgSubjectEntityEnum.Credential, 'Credential'],
  [ErrorMsgSubjectEntityEnum.POST, 'create'],
  [ErrorMsgSubjectEntityEnum.PUT, 'update'],
  [ErrorMsgSubjectEntityEnum.GET, 'get'],
  [ErrorMsgSubjectEntityEnum.AUTH, 'auth'],
  [ErrorMsgSubjectEntityEnum.Audience, 'API audience'],
]);

export const ERROR_MSG_MAP: Map<ErrorMsgSubjectScenarioEnum, string> = new Map([
  [
    ErrorMsgSubjectScenarioEnum.MissingDataProfile,
    'Data profile has to be identified either based on supplied goal or ID.',
  ],
  [
    ErrorMsgSubjectScenarioEnum.MissingDataProfileIssuerId,
    'Data profile has to include issuer ID.',
  ],
  [ErrorMsgSubjectScenarioEnum.MissingClaims, 'Claims have to be set.'],
  [
    ErrorMsgSubjectScenarioEnum.MissingCredential,
    'Credential has to be provided.',
  ],
  [
    ErrorMsgSubjectScenarioEnum.MissingAccessToken,
    'Access token has to be provided.',
  ],
  [
    ErrorMsgSubjectScenarioEnum.MissingCorrelationId,
    'Correlation ID has to be included inside of the provided access token.',
  ],
  [
    ErrorMsgSubjectScenarioEnum.MissingDataProfileId,
    'Data Profile ID has to be included inside of the provided access token.',
  ],
  [
    ErrorMsgSubjectScenarioEnum.InvalidClaims,
    'An invaid claims object is provided on attempt to set claims for a verifiable credential.',
  ],
  [
    ErrorMsgSubjectScenarioEnum.InvalidEvidence,
    'An invaid evidences array is provided on attempt to set evidences for a verifiable credential.',
  ],
  [
    ErrorMsgSubjectScenarioEnum.InvalidEnvType,
    'An invaid environment type is provided on attempt to instantiate auth client.',
  ],
]);
