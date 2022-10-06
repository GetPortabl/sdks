import { PortablApiScopeEnum } from '../enums/api-scope.enum';

export const PortablApiAuthGrantType: string = 'client_credentials';

export const PortablApiAuthScopes: Array<PortablApiScopeEnum> = [
  PortablApiScopeEnum.ReadCredentialManifests,
  PortablApiScopeEnum.CreateDIDCommMessages,
  PortablApiScopeEnum.UpdateDIDCommThreads,
  PortablApiScopeEnum.StoreCredential,
  PortablApiScopeEnum.InitDIDComm,
];
