import { DIDCommGoalEnum } from '../enums';
import { ICredentialManifest } from '../interfaces';

export interface ICredentialManifestModel {
  readonly goal: DIDCommGoalEnum;
  readonly data: ICredentialManifest;
}

export interface IGetCredentialManifestResponseBodyDto {
  readonly credentialManifest: ICredentialManifestModel;
}

export interface IGetCredentialManifestsResponseBodyDto {
  readonly credentialManifests: Array<ICredentialManifestModel>;
}
