import { v4 as uuid4 } from 'uuid';
import jwtDecode from 'jwt-decode';

import {
  KYC_VOCAB_URL,
  URN_UUID_PREFIX,
  VKYC_VOCAB_TERM,
  CORRELATION_ID_CUSTOM_CLAIM,
  DATA_PROFILE_ID_CUSTOM_CLAIM,
} from './constants';
import { DIDCommGoalEnum, ErrorMsgSubjectScenarioEnum } from './enums';
import {
  IPortablOpts,
  ICredential,
  IEvidence,
  IVerifiableCredential,
  ICredentialManifest,
  IKYCClaims,
  IKYCClaimsInput,
} from './interfaces';
import {
  IAuthResponse,
  ICredentialManifestModel,
  ICredentialDocumentModel,
} from './dto';
import { credentialFrom, filterClaims, getErrMsg } from './utils';
import { PortablApiClient } from './clients/portabl-api.client';
import { transformClaimsWithTypes } from './utils/transform-claims-with-types.util';

class Portabl {
  readonly portabl: PortablApiClient;

  readonly debug: boolean;

  readonly goal: DIDCommGoalEnum;

  readonly dataProfileId: string | undefined;

  constructor(opts: IPortablOpts) {
    const {
      env = 'production',
      debug = false,
      clientId,
      clientSecret,
      scope,
      dataProfileId,
    } = opts;

    this.portabl = new PortablApiClient({
      env,
      clientId,
      clientSecret,
      scope,
    });

    this.debug = debug;
    this.goal = DIDCommGoalEnum.Backup;
    this.dataProfileId = dataProfileId;
  }

  async getAccessToken(opts?: {
    correlationId?: string;
    dataProfileId?: string;
  }): Promise<IAuthResponse> {
    const { correlationId = `${URN_UUID_PREFIX}${uuid4()}`, dataProfileId } =
      opts || {};

    const dataProfileModel: ICredentialManifestModel = await this.getDataProfile(
      {
        goal: this.goal,
        dataProfileId: dataProfileId || this.dataProfileId,
      },
    );
    const { data: dataProfile } = dataProfileModel;

    const authResponse: IAuthResponse = await this.portabl.auth.getToken({
      correlationId,
      dataProfileId: dataProfile.id,
    });

    if (this.debug) {
      console.debug('(2) authenticated', JSON.stringify(authResponse, null, 2));
    }

    return authResponse;
  }

  async createCredential(args: {
    accessToken: string;
    claims: IKYCClaimsInput;
    evidences?: Array<IEvidence>;
  }): Promise<ICredential> {
    const { accessToken, claims, evidences } = args;

    const { dataProfileId, correlationIdEncrypted } = this.parseAccessToken(
      accessToken,
    );

    const dataProfileModel: ICredentialManifestModel = await this.getDataProfile(
      { goal: this.goal, dataProfileId },
    );
    const { data: dataProfile } = dataProfileModel;

    const credential: IVerifiableCredential = this.buildCredential({
      claims,
      evidences,
      dataProfile,
    });

    return this.storeCredential({
      correlationIdEncrypted,
      dataProfile,
      credential,
    });
  }

  private validateAccessToken(accessToken: string): void {
    if (!accessToken) {
      const missingAccessTokenErrMsg: string = getErrMsg({
        scenario: ErrorMsgSubjectScenarioEnum.MissingAccessToken,
      });
      console.error(missingAccessTokenErrMsg);
      throw new Error(missingAccessTokenErrMsg);
    }
  }

  private validateCorrelationId(correlationIdEncrypted: string): void {
    if (!correlationIdEncrypted) {
      const missingCorrelationIdErrMsg: string = getErrMsg({
        scenario: ErrorMsgSubjectScenarioEnum.MissingCorrelationId,
      });
      console.error(missingCorrelationIdErrMsg);
      throw new Error(missingCorrelationIdErrMsg);
    }
  }

  private validateDataProfileId(dataProfileId: string): void {
    if (!dataProfileId) {
      const missingDataProfileIdErrMsg: string = getErrMsg({
        scenario: ErrorMsgSubjectScenarioEnum.MissingDataProfileId,
      });
      console.error(missingDataProfileIdErrMsg);
      throw new Error(missingDataProfileIdErrMsg);
    }
  }

  private validateClaims(claims: IKYCClaims): void {
    if (!claims || Array.isArray(claims)) {
      const invalidClaimsErrMsg: string = getErrMsg({
        scenario: ErrorMsgSubjectScenarioEnum.InvalidEvidence,
      });
      console.error(invalidClaimsErrMsg, { claims });
      throw new Error(invalidClaimsErrMsg);
    }

    if (this.debug) {
      console.debug('(4) claims', JSON.stringify(claims, null, 2));
    }
  }

  private validateEvidences(evidences: Array<IEvidence> | undefined): void {
    // if (!Array.isArray(evidences) || evidences.length === 0) {
    //   const invalidEvidenceErrMsg: string = getErrMsg({
    //     scenario: ErrorMsgSubjectScenarioEnum.InvalidEvidence,
    //   });
    //   console.error(invalidEvidenceErrMsg, { evidences });
    //   throw new Error(invalidEvidenceErrMsg);
    // }

    if (this.debug) {
      console.debug('(5) evidences', JSON.stringify(evidences || [], null, 2));
    }
  }

  private validateCredential(credential: ICredential): void {
    if (!credential) {
      const missingCredentialErrMsg: string = getErrMsg({
        scenario: ErrorMsgSubjectScenarioEnum.MissingCredential,
      });
      console.error(missingCredentialErrMsg);
      throw new Error(missingCredentialErrMsg);
    }
  }

  private validateDataProfile(dataProfile: ICredentialManifest): void {
    if (!dataProfile) {
      const missingDataProfileErrMsg: string = getErrMsg({
        scenario: ErrorMsgSubjectScenarioEnum.MissingDataProfile,
      });
      console.error(missingDataProfileErrMsg);
      throw new Error(missingDataProfileErrMsg);
    }
  }

  private validateDataProfileIssuerId(dataProfile: ICredentialManifest): void {
    if (!dataProfile?.issuer?.id) {
      const missingDataProfileIssuerIdErrMsg: string = getErrMsg({
        scenario: ErrorMsgSubjectScenarioEnum.MissingDataProfileIssuerId,
      });
      console.error(missingDataProfileIssuerIdErrMsg);
      throw new Error(missingDataProfileIssuerIdErrMsg);
    }
  }

  private parseAccessToken(
    accessToken: string,
  ): {
    correlationIdEncrypted: string;
    dataProfileId: string;
  } {
    this.validateAccessToken(accessToken);

    const accessTokenClaims: any = jwtDecode(accessToken);

    const correlationIdEncrypted: string =
      accessTokenClaims[CORRELATION_ID_CUSTOM_CLAIM];

    this.validateCorrelationId(correlationIdEncrypted);

    const dataProfileId: string =
      accessTokenClaims[DATA_PROFILE_ID_CUSTOM_CLAIM];

    this.validateDataProfileId(dataProfileId);

    if (this.debug) {
      console.debug(
        '(2) parsed access token claims',
        JSON.stringify({ correlationIdEncrypted, dataProfileId }, null, 2),
      );
    }

    return { correlationIdEncrypted, dataProfileId };
  }

  private async getDataProfile({
    goal,
    dataProfileId,
  }: {
    goal: DIDCommGoalEnum;
    dataProfileId?: string;
  }): Promise<ICredentialManifestModel> {
    const dataProfileModel: ICredentialManifestModel = dataProfileId
      ? await this.portabl.agent.getCredentialManifestById(dataProfileId)
      : await this.portabl.agent.getCredentialManifestByGoal(goal);

    if (this.debug) {
      console.debug(
        '(1) get data profile',
        JSON.stringify(dataProfileModel, null, 2),
      );
    }

    return dataProfileModel;
  }

  private buildCredential(opts: {
    claims: IKYCClaimsInput;
    evidences: Array<IEvidence> | undefined;
    dataProfile: ICredentialManifest;
  }): IVerifiableCredential {
    const { claims, evidences, dataProfile } = opts;
    const filteredClaims = filterClaims({
      claims,
      outputDescriptors: dataProfile.output_descriptors,
    });

    const claimsWithTypes = transformClaimsWithTypes(filteredClaims);

    this.validateClaims(claimsWithTypes);
    this.validateEvidences(evidences);
    this.validateDataProfile(dataProfile);
    this.validateDataProfileIssuerId(dataProfile);

    const credential: IVerifiableCredential = credentialFrom({
      '@context': [KYC_VOCAB_URL],
      type: [VKYC_VOCAB_TERM],
      issuer: {
        id: dataProfile.issuer.id,
      },
      credentialSubject: claimsWithTypes,
    });

    if (Array.isArray(evidences) && evidences.length) {
      credential.evidence = evidences;
    }

    if (this.debug) {
      console.debug(
        '(6) built credential',
        JSON.stringify(credential, null, 2),
      );
    }

    return credential;
  }

  private async storeCredential(opts: {
    correlationIdEncrypted: string;
    dataProfile: ICredentialManifest;
    credential: IVerifiableCredential;
  }): Promise<ICredential> {
    const { correlationIdEncrypted, dataProfile, credential } = opts;

    this.validateCorrelationId(correlationIdEncrypted);
    this.validateDataProfile(dataProfile);
    this.validateCredential(credential);

    const credentialModel: ICredentialDocumentModel = await this.portabl.agent.storeCredential(
      {
        document: credential,
        meta: {
          correlationId: correlationIdEncrypted,
          credentialManifestId: dataProfile.id,
        },
      },
    );
    const { document } = credentialModel;

    if (this.debug) {
      console.debug(
        '(7) stored credential document',
        JSON.stringify(document, null, 2),
      );
    }

    return document;
  }
}

export default Portabl;
