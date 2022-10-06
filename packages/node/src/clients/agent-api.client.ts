import {
  CREDENTIAL_MANIFESTS_ROUTE,
  DIDCOMM_ROUTE,
  THREADS_ROUTE,
  MESSAGES_ROUTE,
  INVITATION_ROUTE,
  CREDENTIALS_ROUTE,
} from '../constants/routes.constants';
import { getErrMsg } from '../utils/get-error-messag.util';
import { DIDCommGoalEnum } from '../enums/did-comm-goal.enum';
import { ErrorMsgTemplateEnum } from '../enums/error-message-type.enum';
import { ErrorMsgSubjectEntityEnum } from '../enums/error-message-entity.enum';
import {
  ICredentialManifestModel,
  IGetCredentialManifestResponseBodyDto,
  IGetCredentialManifestsResponseBodyDto,
} from '../dto/get-credential-manifests-response.dto';
import { ICreateDIDCommMessageRequestBodyDto } from '../dto/create-did-comm-jwm-request.dto';
import { ICreateDIDCommInvitationUrlResponseBodyDto } from '../dto/create-did-comm-jwm-response.dto';
import { IUpdateDIDCommThreadRequestBodyDto } from '../dto/update-didcomm-thread-request.dto';
import {
  IDIDCommThreadModel,
  IUpdateDIDCommThreadResponseBodyDto,
} from '../dto/update-didcomm-thread-response.dto';
import { IStoreCredentialRequestBodyDto } from '../dto/store-credential-request.dto';
import {
  ICredentialDocumentModel,
  IStoreCredentialResponseBodyDto,
} from '../dto/store-credential-response.dto';
import { AuthApiClient } from './auth-api.client';
import { AgentApiBaseClient } from './agent-api-base.client';
import { IPortablAgentApiClientOpts } from '../interfaces/portabl-agent-api-client-opts';

export class AgentApiClient extends AgentApiBaseClient {
  readonly authApiClient: AuthApiClient;

  readonly audience: string;

  constructor(args: IPortablAgentApiClientOpts) {
    super(args);

    const { authApiClient } = args;
    const { audience } = authApiClient;

    this.audience = audience;
    this.authApiClient = authApiClient;
  }

  async getCredentialManifestById(
    id: string,
  ): Promise<ICredentialManifestModel> {
    const responseBody = await this.get<IGetCredentialManifestResponseBodyDto>({
      relativeUrl: `${CREDENTIAL_MANIFESTS_ROUTE}/${id}`,
    });

    if (!responseBody?.credentialManifest) {
      const dtoErrMsg = getErrMsg({
        template: ErrorMsgTemplateEnum.DtoError,
        entity: ErrorMsgSubjectEntityEnum.CredentialManifest,
      });
      console.error(dtoErrMsg);
      throw new Error(dtoErrMsg);
    }

    return responseBody.credentialManifest;
  }

  async getCredentialManifestByGoal(
    goal: DIDCommGoalEnum,
  ): Promise<ICredentialManifestModel> {
    const responseBody = await this.get<IGetCredentialManifestsResponseBodyDto>(
      {
        relativeUrl: `${CREDENTIAL_MANIFESTS_ROUTE}?goal=${goal}&limit=${1}`,
      },
    );

    if (!responseBody?.credentialManifests) {
      const dtoErrMsg = getErrMsg({
        template: ErrorMsgTemplateEnum.DtoError,
        entity: ErrorMsgSubjectEntityEnum.CredentialManifest,
      });
      console.error(dtoErrMsg);
      throw new Error(dtoErrMsg);
    }

    if (responseBody?.credentialManifests.length === 0) {
      const notFoundErrMsg = getErrMsg({
        template: ErrorMsgTemplateEnum.DtoError,
        entity: ErrorMsgSubjectEntityEnum.CredentialManifest,
      });
      console.error(notFoundErrMsg, { goal });
      throw new Error(notFoundErrMsg);
    }

    return responseBody?.credentialManifests?.[0];
  }

  async createDIDCommInvitationUrl(
    data: ICreateDIDCommMessageRequestBodyDto,
  ): Promise<string> {
    const responseBody =
      await this.post<ICreateDIDCommInvitationUrlResponseBodyDto>({
        relativeUrl: `${DIDCOMM_ROUTE}${MESSAGES_ROUTE}${INVITATION_ROUTE}`,
        data,
      });

    if (!responseBody?.invitationUrl) {
      const dtoErrMsg = getErrMsg({
        template: ErrorMsgTemplateEnum.DtoError,
        entity: ErrorMsgSubjectEntityEnum.DIDCommMessage,
      });
      console.error(dtoErrMsg);
      throw new Error(dtoErrMsg);
    }

    return responseBody?.invitationUrl;
  }

  async updateDIDCommThread(
    threadId: string,
    data: IUpdateDIDCommThreadRequestBodyDto,
  ): Promise<IDIDCommThreadModel> {
    const responseBody = await this.put<IUpdateDIDCommThreadResponseBodyDto>({
      relativeUrl: `${DIDCOMM_ROUTE}${THREADS_ROUTE}/${threadId}`,
      data,
    });

    if (!responseBody?.thread) {
      const dtoErrMsg = getErrMsg({
        template: ErrorMsgTemplateEnum.DtoError,
        entity: ErrorMsgSubjectEntityEnum.DIDCommThread,
      });
      console.error(dtoErrMsg);
      throw new Error(dtoErrMsg);
    }

    return responseBody.thread;
  }

  async storeCredential(
    data: IStoreCredentialRequestBodyDto,
  ): Promise<ICredentialDocumentModel> {
    const responseBody = await this.post<IStoreCredentialResponseBodyDto>({
      relativeUrl: CREDENTIALS_ROUTE,
      data,
    });

    if (!responseBody?.verifiableDocument) {
      const dtoErrMsg = getErrMsg({
        template: ErrorMsgTemplateEnum.DtoError,
        entity: ErrorMsgSubjectEntityEnum.CredentialManifest,
      });
      console.error(dtoErrMsg);
      throw new Error(dtoErrMsg);
    }

    return responseBody?.verifiableDocument;
  }
}
