import { IIssuer } from '@sphereon/pex';

import { IDataDisplayDescriptor } from './data-display-descriptor.interface';
import { IEntityStyleDescriptor } from './entity-style-descriptor.interface';
import { IPresentationDefinition } from './presentation-definition.interface';
import { ClaimFormatObjectType } from './claim-format-object.type';

// https://identity.foundation/credential-manifest/#output-descriptor
export interface IOutputDescriptor {
  readonly id?: string;
  readonly name?: string;
  readonly description?: string;
  readonly style?: IEntityStyleDescriptor;
  readonly display?: IDataDisplayDescriptor;
}

// https://identity.foundation/credential-manifest/#credential-manifest
export interface ICredentialManifest {
  readonly id: string;
  readonly issuer: IIssuer;
  readonly output_descriptors: Array<IOutputDescriptor>;
  readonly presentation_definition?: IPresentationDefinition;
  readonly format?: ClaimFormatObjectType;
}
