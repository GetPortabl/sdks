import { IPortablApiClientOpts } from './portabl-api-client-opts.interface';

export interface IPortablOpts extends IPortablApiClientOpts {
  readonly dataProfileId?: string;
  readonly debug?: boolean;
}
