import { EnvType } from '../types';

export interface IPortablAuthApiClientOpts {
  readonly env: EnvType;
  readonly clientId: string;
  readonly clientSecret: string;
  readonly scope?: Array<string>;
}
