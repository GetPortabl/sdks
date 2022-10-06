import { IIssuer } from '@sphereon/pex';

import { IDataDisplayDescriptor } from './data-display-descriptor.interface';
import { IEntityStyleDescriptor } from './entity-style-descriptor.interface';
import { IPresentationDefinition } from './presentation-definition.interface';
import { ClaimFormatObjectType } from './claim-format-object.type';

// https://identity.foundation/credential-manifest/#output-descriptor
export interface IOutputDescriptor {
  id?: string;
  name?: string;
  description?: string;
  style?: IEntityStyleDescriptor;
  display?: IDataDisplayDescriptor;
}

// https://identity.foundation/credential-manifest/#credential-manifest
export interface ICredentialManifest {
  id: string;
  issuer: IIssuer;
  output_descriptors: Array<IOutputDescriptor>;
  presentation_definition?: IPresentationDefinition;
  format?: ClaimFormatObjectType;
}
