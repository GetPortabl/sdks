import {
  ConstraintsV1,
  ConstraintsV2,
  InputDescriptorV1,
  InputDescriptorV2,
  SubmissionRequirement,
  FilterV1,
  FilterV2,
  FieldV1,
  FieldV2,
  Optionality,
} from '@sphereon/pex-models';

import { ClaimFormatObjectType } from './claim-format-object.type';

export interface IFilterV1 extends FilterV1 {}

export interface IFilterV2 extends FilterV2 {
  readonly const?: string;
}

export type IFilter = IFilterV1 | IFilterV2;

export interface IFieldV1 extends FieldV1 {}

export interface IFieldV2 extends FieldV2 {
  readonly filter?: IFilterV2; // Override: "filter" property misses "const" property
  readonly evidence?: Optionality; // Extension: this property has to be proposed within DIF
}

export type IField = IFieldV1 | IFieldV2;

export interface IConstraintsV1 extends ConstraintsV1 {
  fields?: Array<IFieldV1>;
}

export interface IConstraintsV2 extends ConstraintsV2 {
  fields?: Array<IFieldV2>;
}

export type IConstraints = IConstraintsV1 | IConstraintsV2;

export interface IInputDescriptorV1 extends InputDescriptorV1 {
  constraints?: IConstraintsV1;
}

export interface IInputDescriptorV2 extends InputDescriptorV2 {
  constraints?: IConstraintsV2;
}

export type IInputDescriptor = IInputDescriptorV1 | IInputDescriptorV2;

export interface ISubmissionRequirement extends SubmissionRequirement {}

export interface IPresentationDefinitionV1 {
  id: string;
  name?: string;
  purpose?: string;
  format?: ClaimFormatObjectType;
  submission_requirements?: Array<ISubmissionRequirement>;
  input_descriptors: Array<IInputDescriptorV1>;
}

// Note: it's being described here since:
// - "input_descriptors.constraints.fields.*.filter" requires extension with "const" property
export interface IPresentationDefinitionV2 {
  id: string;
  name?: string;
  purpose?: string;
  format?: ClaimFormatObjectType;
  submission_requirements?: Array<ISubmissionRequirement>;
  input_descriptors: Array<IInputDescriptorV2>;
  frame?: object;
}

export type IPresentationDefinition =
  | IPresentationDefinitionV1
  | IPresentationDefinitionV2;
