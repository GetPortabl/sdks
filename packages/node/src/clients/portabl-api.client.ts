import { IPortablApiClientOpts } from '../interfaces/portabl-api-client-opts.interface';
import { AuthApiClient } from './auth-api.client';
import { AgentApiClient } from './agent-api.client';
import { ProviderApiClient } from './provider-api.client';

export class PortablApiClient {
  readonly auth: AuthApiClient;

  readonly agent: AgentApiClient;

  readonly provider: ProviderApiClient;

  constructor(args: IPortablApiClientOpts) {
    const { env, clientId, clientSecret, scope } = args;

    this.auth = new AuthApiClient({ env, clientId, clientSecret, scope });
    this.agent = new AgentApiClient({ authApiClient: this.auth });
    this.provider = new ProviderApiClient({
      authApiClient: this.auth,
    });
  }
}
