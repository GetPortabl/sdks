import jwtDecode from 'jwt-decode';

import Portabl from './Portabl';
import {
  CORRELATION_ID_CUSTOM_CLAIM,
  DATA_PROFILE_VERSION_CUSTOM_CLAIM,
} from './constants/api.constants';
import { IAuthResponse } from './dto/get-token-response.dto';
import { IKYCClaimsInput } from './interfaces/kyc-claims.interface';
import { IEvidence } from './interfaces';
import { ILoadBackupDataResponseDto } from './dto/load-backup-data.dto';
import { ICredentialDocumentModel } from './dto';

const CLIENT_ID = 'CLIENT_ID';
const CLIENT_SECRET = 'CLIENT_SECRET';

const MOCKED_NATIVE_USER_ID = '<MOCKED_NATIVE_USER_ID>';
const MOCKED_CLAIMS: IKYCClaimsInput = {
  emailAddress: 'liz.lemon@30rock.com',
  phoneNumber: '+1',
  firstName: 'Liz',
  lastName: 'Lemon',
  birthDate: '1970-11-27',
  birthPlace: 'PENNSYLVANIA, USA',
  nationality: 'UNITED STATES OF AMERICA',
  socialSecurityNumber: '123-45-6789',
  registrationAddressDetails: {
    country: 'USA',
    region: 'New York',
    postalCode: '10024',
    locality: 'New York',
    streetAddress: '168 Riverside Drive, APT 2F',
  },
};
const MOCKED_EVIDENCES: Array<IEvidence> = [
  {
    id:
      'https://yenkalov-api.ngrok.io/api/v1/agent/user-12978f1a-3d70-486a-9ee5-921e91375bed/evidence-documents/urn:uuid:7398539e-3079-4cab-85ac-ea7c762d1fc4',
    type: 'TraceableEvidence',
    'mime-type': 'image/png',
    evidencedClaim: [
      '$.credentialSubject.firstName',
      '$.credentialSubject.lastName',
      '$.credentialSubject.birthDate',
      '$.credentialSubject.nationality',
    ],
  },
];

describe('filterClaims', () => {
  it.skip('should create access token and backup credential', async () => {
    const portablClient = new Portabl({
      env: 'dev',
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      // debug: true,
    });

    const { accessToken }: IAuthResponse = await portablClient.getAccessToken();
    const accessTokenClaims: any = jwtDecode(accessToken);

    expect(accessTokenClaims[CORRELATION_ID_CUSTOM_CLAIM]).toBeDefined();
    expect(
      accessTokenClaims[DATA_PROFILE_VERSION_CUSTOM_CLAIM],
    ).not.toBeDefined();

    const credentialDocumentModel: ICredentialDocumentModel = await portablClient.createCredential(
      {
        accessToken,
        nativeUserId: MOCKED_NATIVE_USER_ID,
        claims: MOCKED_CLAIMS,
        evidences: MOCKED_EVIDENCES,
      },
    );
    expect(credentialDocumentModel).toBeDefined();

    const { data, meta } = credentialDocumentModel;
    expect(data).toBeDefined();
    expect(meta).toBeDefined();

    const { credentialSubject, evidence } = data;
    expect(credentialSubject).toBeDefined();
    expect(evidence).toBeDefined();

    expect(credentialSubject.emailAddress).toBe(MOCKED_CLAIMS.emailAddress);
    expect(credentialSubject.phoneNumber).toBe(MOCKED_CLAIMS.phoneNumber);
    expect(credentialSubject.firstName).toBe(MOCKED_CLAIMS.firstName);
    expect(credentialSubject.lastName).toBe(MOCKED_CLAIMS.lastName);
    expect(credentialSubject.birthDate).toBe(MOCKED_CLAIMS.birthDate);
    expect(credentialSubject.birthPlace).toBe(MOCKED_CLAIMS.birthPlace);
    expect(credentialSubject.nationality).toBe(MOCKED_CLAIMS.nationality);
    expect(credentialSubject.socialSecurityNumber).not.toBeDefined();

    expect(meta.correlationId).toBeDefined();
    expect(meta.credentialManifestId).toBeDefined();
  });

  it('should authenticate backup and load data', async () => {
    const portablClient = new Portabl({
      env: 'dev',
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      debug: true,
    });

    const correlationId = '007';
    const dataProfileVersion = '0.0.1';

    const {
      accessToken,
    }: IAuthResponse = await portablClient.portabl.provider.authorizeBackup({
      body: {
        env: 'dev',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        correlationId,
        dataProfileVersion,
      },
    });
    const accessTokenClaims: any = jwtDecode(accessToken);

    expect(accessTokenClaims[CORRELATION_ID_CUSTOM_CLAIM]).toBeDefined();
    expect(accessTokenClaims[CORRELATION_ID_CUSTOM_CLAIM]).not.toBe(
      correlationId,
    );
    expect(accessTokenClaims[DATA_PROFILE_VERSION_CUSTOM_CLAIM]).toBe(
      dataProfileVersion,
    );

    const responseBody: ILoadBackupDataResponseDto = await portablClient.portabl.provider.loadBackupData(
      {
        accessToken,
        body: {
          nativeUserId: MOCKED_NATIVE_USER_ID,
          claims: MOCKED_CLAIMS,
          evidences: MOCKED_EVIDENCES,
        },
      },
    );
    expect(responseBody).toBeDefined();

    const { verifiableDocument } = responseBody;
    expect(verifiableDocument).toBeDefined();

    const { data, meta } = verifiableDocument;
    expect(data).toBeDefined();
    expect(meta).toBeDefined();

    const { credentialSubject, evidence } = data;
    expect(credentialSubject).toBeDefined();
    expect(evidence).toBeDefined();

    expect(credentialSubject.emailAddress).toBe(MOCKED_CLAIMS.emailAddress);
    expect(credentialSubject.phoneNumber).toBe(MOCKED_CLAIMS.phoneNumber);
    expect(credentialSubject.firstName).toBe(MOCKED_CLAIMS.firstName);
    expect(credentialSubject.lastName).toBe(MOCKED_CLAIMS.lastName);
    expect(credentialSubject.birthDate).toBe(MOCKED_CLAIMS.birthDate);
    expect(credentialSubject.birthPlace).toBe(MOCKED_CLAIMS.birthPlace);
    expect(credentialSubject.nationality).toBe(MOCKED_CLAIMS.nationality);
    expect(credentialSubject.socialSecurityNumber).not.toBeDefined();

    // expect(meta.correlationId).toBe(correlationId);
    // expect(meta.credentialManifestId).toBeDefined();
  });
});
