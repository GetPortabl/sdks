import { IPortablApiClientOpts } from './portabl-api-client-opts.interface';

export interface IPortablOpts extends IPortablApiClientOpts {
  readonly dataProfileVersion?: string;
  readonly debug?: boolean;
}
