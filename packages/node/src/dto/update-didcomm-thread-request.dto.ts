export interface IDIDCommThreadMetadata {
  readonly credentialManifestId: string;
}

export interface IUpdateDIDCommThreadRequestBodyDto {
  readonly data: IDIDCommThreadMetadata;
}
