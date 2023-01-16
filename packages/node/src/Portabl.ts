import { v4 as uuid4 } from 'uuid';
import jwtDecode from 'jwt-decode';

import {
  KYC_VOCAB_URL,
  URN_UUID_PREFIX,
  VKYC_CREDENTIAL_VOCAB_TERM,
  CORRELATION_ID_CUSTOM_CLAIM,
  DATA_PROFILE_VERSION_CUSTOM_CLAIM,
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
  IVerifiableDocumentModel,
} from './dto';
import { credentialFrom, filterClaims, getErrMsg } from './utils';
import { PortablApiClient } from './clients/portabl-api.client';
import { setJsonldTypesForCredentialSubject } from './utils/transform-claims-with-types.util';

class Portabl {
  readonly portabl: PortablApiClient;

  readonly debug: boolean;

  readonly goal: DIDCommGoalEnum;

  readonly dataProfileVersion: string | undefined;

  constructor(opts: IPortablOpts) {
    const {
      env = 'production',
      debug = false,
      clientId,
      clientSecret,
      scope,
      dataProfileVersion,
    } = opts;

    this.portabl = new PortablApiClient({
      env,
      clientId,
      clientSecret,
      scope,
    });

    this.debug = debug;
    this.goal = DIDCommGoalEnum.Backup;
    this.dataProfileVersion = dataProfileVersion;
  }

  async getAccessToken(opts?: {
    correlationId?: string;
    dataProfileVersion?: string;
  }): Promise<IAuthResponse> {
    const { correlationId = `${URN_UUID_PREFIX}${uuid4()}`, dataProfileVersion } =
      opts || {};

    const authResponse: IAuthResponse = await this.portabl.auth.getToken({
      correlationId,
      dataProfileVersion,
    });

    if (this.debug) {
      console.debug('(2) authenticated', JSON.stringify(authResponse, null, 2));
    }

    return authResponse;
  }

  async createCredential(args: {
    accessToken: string;
    nativeUserId: string;
    claims: IKYCClaimsInput;
    evidences?: Array<IEvidence>;
  }): Promise<ICredentialDocumentModel> {
    const { accessToken, nativeUserId, claims, evidences } = args;

    const { correlationIdEncrypted, dataProfileVersion } = this.parseAccessToken(
      accessToken,
    );

    const credentialManifestModel: ICredentialManifestModel = await this.getCredentialManifest(
      { goal: this.goal, dataProfileVersion },
    );
    const { data: credentialManifest } = credentialManifestModel;

    await this.createNativeUserIdMapping(nativeUserId, accessToken);

    const credential: IVerifiableCredential = this.buildCredential({
      claims,
      evidences,
      credentialManifest,
    });

    return this.storeCredential({
      correlationIdEncrypted,
      credentialManifest,
      credential,
    });
  }

  private async createNativeUserIdMapping(
    nativeUserId: string,
    accessToken: string,
  ): Promise<void> {
    return this.portabl.provider.createNativeUserIdMapping({
      nativeUserId,
      accessToken,
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

  private validateDataProfileVersion(dataProfileVersion: string): void {
    if (!dataProfileVersion) {
      const missingDataProfileVersionErrMsg: string = getErrMsg({
        scenario: ErrorMsgSubjectScenarioEnum.MissingDataProfileVersion,
      });
      console.error(missingDataProfileVersionErrMsg);
      throw new Error(missingDataProfileVersionErrMsg);
    }
  }

  private validateCredentialSubject(claims: IKYCClaims): void {
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
    if (typeof evidences === undefined) {
      return;
    }

    if (!Array.isArray(evidences) || evidences.length === 0) {
      const invalidEvidenceErrMsg: string = getErrMsg({
        scenario: ErrorMsgSubjectScenarioEnum.InvalidEvidence,
      });
      console.error(invalidEvidenceErrMsg, { evidences });
      throw new Error(invalidEvidenceErrMsg);
    }

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

  private validateCredentialManifest(credentialManifest: ICredentialManifest): void {
    if (!credentialManifest) {
      const missingCredentialManifestErrMsg: string = getErrMsg({
        scenario: ErrorMsgSubjectScenarioEnum.MissingCredentialManifest,
      });
      console.error(missingCredentialManifestErrMsg);
      throw new Error(missingCredentialManifestErrMsg);
    }
  }

  private validateCredentialManifestIssuerId(credentialManifest: ICredentialManifest): void {
    if (!credentialManifest?.issuer?.id) {
      const missingCredentialManifestIssuerIdErrMsg: string = getErrMsg({
        scenario: ErrorMsgSubjectScenarioEnum.MissingCredentialManifestIssuerId,
      });
      console.error(missingCredentialManifestIssuerIdErrMsg);
      throw new Error(missingCredentialManifestIssuerIdErrMsg);
    }
  }

  private parseAccessToken(
    accessToken: string,
  ): {
    correlationIdEncrypted: string;
    dataProfileVersion: string;
  } {
    this.validateAccessToken(accessToken);

    const accessTokenClaims: any = jwtDecode(accessToken);

    const correlationIdEncrypted: string =
      accessTokenClaims[CORRELATION_ID_CUSTOM_CLAIM];

    this.validateCorrelationId(correlationIdEncrypted);

    const dataProfileVersion: string =
      accessTokenClaims[DATA_PROFILE_VERSION_CUSTOM_CLAIM];

    // this.validateDataProfileVersion(dataProfileVersion);

    if (this.debug) {
      console.debug(
        '(2) parsed access token claims',
        JSON.stringify({ correlationIdEncrypted, dataProfileVersion }, null, 2),
      );
    }

    return { correlationIdEncrypted, dataProfileVersion };
  }

  private async getCredentialManifest({
    goal,
    dataProfileVersion,
  }: {
    goal: DIDCommGoalEnum;
    dataProfileVersion: string;
  }): Promise<ICredentialManifestModel> {
    const credentialManifestModel: ICredentialManifestModel =
      await this.portabl.agent.getCredentialManifestByQuery({
        query: {
          goal,
          ...(dataProfileVersion ? { version: dataProfileVersion } : { latestVersion: true }),
        },
      });

    if (this.debug) {
      console.debug('(1) get credential manifest model', JSON.stringify(credentialManifestModel, null, 2));
    }

    return credentialManifestModel;
  }

  private buildCredential(opts: {
    claims: IKYCClaimsInput;
    evidences: Array<IEvidence> | undefined;
    credentialManifest: ICredentialManifest;
  }): IVerifiableCredential {
    const { claims, evidences, credentialManifest } = opts;
    const filteredClaims: IKYCClaimsInput = filterClaims({
      claims,
      outputDescriptors: credentialManifest.output_descriptors,
    });

    const credentialSubjectWithTypes: IKYCClaims = setJsonldTypesForCredentialSubject(filteredClaims);

    this.validateCredentialSubject(credentialSubjectWithTypes);
    this.validateEvidences(evidences);
    this.validateCredentialManifest(credentialManifest);
    this.validateCredentialManifestIssuerId(credentialManifest);

    const credential: IVerifiableCredential = credentialFrom({
      '@context': [KYC_VOCAB_URL],
      type: [VKYC_CREDENTIAL_VOCAB_TERM],
      issuer: {
        id: credentialManifest.issuer.id,
      },
      credentialSubject: credentialSubjectWithTypes,
      evidence: evidences,
    });

    if (this.debug) {
      console.debug(
        '(6) built credential',
        JSON.stringify(credential, null, 2),
      );
    }

    return credential;
  }

  private async storeCredential(args: {
    correlationIdEncrypted: string;
    credentialManifest: ICredentialManifest;
    credential: IVerifiableCredential;
  }): Promise<ICredentialDocumentModel> {
    const { correlationIdEncrypted, credentialManifest, credential } = args;

    this.validateCorrelationId(correlationIdEncrypted);
    this.validateCredentialManifest(credentialManifest);
    this.validateCredential(credential);

    const credentialDocumentModel: ICredentialDocumentModel = await this.portabl.agent.storeCredential(
      {
        document: credential,
        meta: {
          correlationId: correlationIdEncrypted,
          credentialManifestId: credentialManifest.id,
        },
      },
    );

    if (this.debug) {
      console.debug(
        '(7) stored credential document model',
        JSON.stringify(credentialDocumentModel, null, 2),
      );
    }

    return credentialDocumentModel;
  }
}

export default Portabl;
