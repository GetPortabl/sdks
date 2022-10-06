import {
  DisplayMappingObjectType,
  LabeledDisplayMappingObjectType,
} from './display-mapping-object.interface';

// https://identity.foundation/wallet-rendering/#display-mapping-object
export interface IDataDisplayDescriptor {
  readonly title?: DisplayMappingObjectType;
  readonly subtitle?: DisplayMappingObjectType;
  readonly description?: DisplayMappingObjectType;
  readonly properties?: Array<LabeledDisplayMappingObjectType>;
}
