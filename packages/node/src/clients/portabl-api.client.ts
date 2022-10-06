import { IPortablApiClientOpts } from '../interfaces/portabl-api-client-opts.interface';
import { AuthApiClient } from './auth-api.client';
import { AgentApiClient } from './agent-api.client';

export class PortablApiClient {
  readonly auth: AuthApiClient;

  readonly agent: AgentApiClient;

  constructor(args: IPortablApiClientOpts) {
    const { env, clientId, clientSecret, scope } = args;

    this.auth = new AuthApiClient({ env, clientId, clientSecret, scope });
    this.agent = new AgentApiClient({ authApiClient: this.auth });
  }
}
